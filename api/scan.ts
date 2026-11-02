import type { VercelRequest, VercelResponse } from '@vercel/node';

// Official YouCam S2S API Default Base URL
const DEFAULT_BASE_URL = 'https://yce-api-01.makeupar.com';

/**
 * 8 Core SD Diagnostic Actions
 * Starting with 8 core concerns controls API unit/token consumption
 * while delivering high diagnostic value across skin health categories.
 */
export const CORE_SD_ACTIONS = [
  'texture',
  'pore',
  'wrinkle',
  'acne',
  'age_spot',
  'oiliness',
  'moisture',
  'redness',
] as const;

/**
 * Extended SD Actions (Total 16 dimensions)
 * Can be activated by setting YOUCAM_ACTIONS=all in server environment
 */
export const ALL_SD_ACTIONS = [
  ...CORE_SD_ACTIONS,
  'radiance',
  'firmness',
  'dark_circle_v2',
  'eye_bag',
  'droopy_upper_eyelid',
  'droopy_lower_eyelid',
  'tear_trough',
  'skin_type',
] as const;

/**
 * Resolves the active list of SD actions to request.
 * Configurable via YOUCAM_ACTIONS environment variable:
 * - 'core' or unset: 8 core actions (default)
 * - 'all': all 16 actions
 * - or comma-separated list of action names
 */
export function getActiveActions(): string[] {
  const envVal = process.env.YOUCAM_ACTIONS?.trim().toLowerCase();
  if (!envVal || envVal === 'core' || envVal === '8') {
    return [...CORE_SD_ACTIONS];
  }
  if (envVal === 'all' || envVal === '16') {
    return [...ALL_SD_ACTIONS];
  }
  const custom = envVal.split(',').map((s) => s.trim()).filter(Boolean);
  return custom.length > 0 ? custom : [...CORE_SD_ACTIONS];
}

export interface YouCamMetricResult {
  type: string;
  ui_score: number;
  raw_score: number;
  mask_urls?: string[];
  subcategories?: Record<string, unknown>;
  extra?: Record<string, unknown>;
}

export interface AnalysisSuccessResponse {
  success: true;
  apiVersion: string;
  timestamp: string;
  requestedActions: string[];
  metrics: YouCamMetricResult[];
  overall?: {
    skin_type?: string;
    skin_age?: number;
  };
  warnings?: string[];
}

export interface AnalysisErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: unknown;
  httpStatus?: number;
}

/**
 * Executes the complete YouCam S2S Skin Analysis flow:
 * 1. File API registration (/s2s/v2.0/file)
 * 2. Binary PUT of image buffer to pre-signed S3 upload URL
 * 3. Skin AI Task Creation (/s2s/v2.1/task/skin-analysis with verified fallback)
 * 4. Polling until completion or timeout (/s2s/{version}/task/skin-analysis/{task_id})
 */
export async function executeYouCamSkinAnalysis(
  imageBuffer: Buffer,
  mimeType: string,
  filename: string = 'scan.jpg'
): Promise<AnalysisSuccessResponse> {
  const apiKey = process.env.YOUCAM_API_KEY?.trim();
  const rawBaseUrl = process.env.YOUCAM_API_BASE_URL?.trim() || DEFAULT_BASE_URL;
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

  if (!apiKey) {
    const error: any = new Error(
      'YOUCAM_API_KEY is not configured on the server. Please add your YouCam API key to your server environment (.env.local or host variables).'
    );
    error.code = 'YOUCAM_NOT_CONFIGURED';
    error.status = 503;
    throw error;
  }

  const authHeader = `Bearer ${apiKey}`;
  const actionsToRequest = getActiveActions();

  // STEP 1: Register file with YouCam File API (/s2s/v2.0/file)
  const fileInitUrl = `${baseUrl}/s2s/v2.0/file`;
  let fileInitRes: Response;
  try {
    fileInitRes = await fetch(fileInitUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: [
          {
            content_type: mimeType,
            file_name: filename,
            file_size: imageBuffer.length,
          },
        ],
      }),
    });
  } catch (netErr: any) {
    const error: any = new Error(`Network failure contacting YouCam File API: ${netErr.message}`);
    error.code = 'NETWORK_ERROR';
    error.status = 502;
    throw error;
  }

  if (!fileInitRes.ok) {
    const errText = await fileInitRes.text();
    let errJson: any;
    try {
      errJson = JSON.parse(errText);
    } catch {
      errJson = { message: errText };
    }

    const error: any = new Error(
      errJson.error || errJson.message || `YouCam File API initialization failed (HTTP ${fileInitRes.status})`
    );
    error.code = errJson.error_code || (fileInitRes.status === 401 ? 'UNAUTHORIZED' : fileInitRes.status === 429 ? 'QUOTA_EXCEEDED' : 'FILE_INIT_FAILED');
    error.status = fileInitRes.status === 401 ? 401 : fileInitRes.status === 429 ? 429 : 502;
    error.details = errJson;
    throw error;
  }

  const fileInitData: any = await fileInitRes.json();
  const fileRecord = fileInitData?.data?.files?.[0];
  const fileId = fileRecord?.file_id;
  const uploadUrl = fileRecord?.requests?.[0]?.url;
  const uploadMethod = fileRecord?.requests?.[0]?.method || 'PUT';

  if (!fileId || !uploadUrl) {
    const error: any = new Error('YouCam File API response did not contain upload instructions or file_id.');
    error.code = 'INVALID_FILE_RESPONSE';
    error.status = 502;
    error.details = fileInitData;
    throw error;
  }

  // STEP 2: Binary PUT directly to pre-signed S3 storage URL
  let uploadRes: Response;
  try {
    uploadRes = await fetch(uploadUrl, {
      method: uploadMethod,
      headers: {
        'Content-Type': mimeType,
      },
      body: imageBuffer,
    });
  } catch (putErr: any) {
    const error: any = new Error(`Network failure uploading image to pre-signed storage: ${putErr.message}`);
    error.code = 'STORAGE_NETWORK_ERROR';
    error.status = 502;
    throw error;
  }

  if (!uploadRes.ok) {
    const uploadErrText = await uploadRes.text();
    const error: any = new Error(`Image storage upload failed (HTTP ${uploadRes.status}): ${uploadErrText}`);
    error.code = 'IMAGE_UPLOAD_FAILED';
    error.status = 502;
    throw error;
  }

  // STEP 3: Create Skin Analysis Task
  // Configured default version: v2.1 unless explicitly pinned to v2.0
  const preferredVersion = process.env.YOUCAM_API_VERSION?.trim().toLowerCase() === 'v2.0' ? 'v2.0' : 'v2.1';
  let chosenVersion = preferredVersion;

  const taskPayload = {
    src_file_id: fileId,
    dst_actions: actionsToRequest,
    miniserver_args: {
      enable_mask_overlay: true,
    },
    format: 'json',
  };

  let createTaskUrl = `${baseUrl}/s2s/${chosenVersion}/task/skin-analysis`;
  let createTaskRes = await fetch(createTaskUrl, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskPayload),
  });

  // Strict Fallback Condition:
  // ONLY attempt V2.0 fallback if V2.1 returned 404 (Endpoint Not Found), indicating V2.1 route
  // is not available on this endpoint. Never hide 401 (Auth), 429 (Quota), or 400 (Invalid Params).
  if (chosenVersion === 'v2.1' && createTaskRes.status === 404) {
    console.warn('[YouCam API] V2.1 task endpoint returned 404. Attempting V2.0 task endpoint fallback...');
    chosenVersion = 'v2.0';
    createTaskUrl = `${baseUrl}/s2s/v2.0/task/skin-analysis`;
    createTaskRes = await fetch(createTaskUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskPayload),
    });
  }

  if (!createTaskRes.ok) {
    const taskErrText = await createTaskRes.text();
    let taskErrJson: any;
    try {
      taskErrJson = JSON.parse(taskErrText);
    } catch {
      taskErrJson = { message: taskErrText };
    }

    const errorMsg =
      taskErrJson.error ||
      taskErrJson.message ||
      `YouCam Skin Task creation failed (HTTP ${createTaskRes.status})`;

    const error: any = new Error(errorMsg);
    error.code = taskErrJson.error_code || (createTaskRes.status === 401 ? 'UNAUTHORIZED' : createTaskRes.status === 429 ? 'QUOTA_EXCEEDED' : 'TASK_CREATION_FAILED');
    error.status = createTaskRes.status === 401 ? 401 : createTaskRes.status === 429 ? 429 : createTaskRes.status === 400 ? 400 : 502;
    error.details = taskErrJson;
    throw error;
  }

  const createTaskData: any = await createTaskRes.json();
  const taskId = createTaskData?.data?.task_id;

  if (!taskId) {
    const error: any = new Error('YouCam did not return a valid task_id for skin analysis.');
    error.code = 'MISSING_TASK_ID';
    error.status = 502;
    error.details = createTaskData;
    throw error;
  }

  // STEP 4: Poll task status until complete or timeout
  const pollUrl = `${baseUrl}/s2s/${chosenVersion}/task/skin-analysis/${taskId}`;
  const startTime = Date.now();
  const MAX_POLL_MS = 35000; // 35 seconds ceiling
  const POLL_INTERVAL_MS = 1500; // 1.5 second intervals

  while (Date.now() - startTime < MAX_POLL_MS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const pollRes = await fetch(pollUrl, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    if (!pollRes.ok) {
      const pollErrText = await pollRes.text();
      let pollErrJson: any;
      try {
        pollErrJson = JSON.parse(pollErrText);
      } catch {
        pollErrJson = { message: pollErrText };
      }
      const error: any = new Error(
        pollErrJson.error || pollErrJson.message || `Error polling YouCam task (HTTP ${pollRes.status})`
      );
      error.code = pollErrJson.error_code || 'POLL_FAILED';
      error.status = pollRes.status === 401 ? 401 : pollRes.status === 429 ? 429 : 502;
      error.details = pollErrJson;
      throw error;
    }

    const pollData: any = await pollRes.json();
    const taskStatus = pollData?.data?.task_status;

    if (taskStatus === 'success') {
      const rawOutputs = pollData?.data?.results?.output || [];
      const metrics: YouCamMetricResult[] = rawOutputs.map((item: any) => ({
        type: String(item.type || ''),
        ui_score: Number(item.ui_score ?? item.score ?? 0),
        raw_score: Number(item.raw_score ?? item.ui_score ?? item.score ?? 0),
        mask_urls: Array.isArray(item.mask_urls) ? item.mask_urls.filter((u: any) => typeof u === 'string' && u.length > 0) : [],
        subcategories: item.subcategories || undefined,
        extra: item.extra || undefined,
      }));

      // Extract high-level metadata if present
      const skinTypeMetric = metrics.find((m) => m.type === 'skin_type');
      let overallSkinType: string | undefined;
      if (skinTypeMetric?.extra && typeof (skinTypeMetric.extra as any).skin_type === 'string') {
        overallSkinType = (skinTypeMetric.extra as any).skin_type;
      }

      return {
        success: true,
        apiVersion: chosenVersion,
        timestamp: new Date().toISOString(),
        requestedActions: actionsToRequest,
        metrics,
        overall: {
          skin_type: overallSkinType,
        },
      };
    }

    if (taskStatus === 'error') {
      const errObj = pollData?.data?.error || {};
      const errorMsg =
        typeof errObj === 'string'
          ? errObj
          : errObj.message || errObj.error || 'YouCam Skin AI was unable to analyze this image.';
      const error: any = new Error(errorMsg);
      error.code = errObj.error_code || errObj.code || 'TASK_EXECUTION_ERROR';
      error.status = 422;
      error.details = errObj;
      throw error;
    }

    // Status 'queued' or 'processing': continue loop
  }

  const timeoutError: any = new Error('YouCam Skin AI analysis timed out after 35 seconds. Please try again.');
  timeoutError.code = 'TASK_TIMEOUT';
  timeoutError.status = 504;
  throw timeoutError;
}

/**
 * Vercel Serverless Handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & OPTIONS pre-flight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
      code: 'METHOD_NOT_ALLOWED',
    } satisfies AnalysisErrorResponse);
  }

  // Guard against missing credentials
  if (!process.env.YOUCAM_API_KEY) {
    return res.status(503).json({
      success: false,
      error: 'YouCam API credentials are not configured on the server. Please configure YOUCAM_API_KEY in your server environment.',
      code: 'YOUCAM_NOT_CONFIGURED',
    } satisfies AnalysisErrorResponse);
  }

  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body. Expected JSON with base64 image data.',
        code: 'INVALID_REQUEST_BODY',
      } satisfies AnalysisErrorResponse);
    }

    const { image, filename } = body as { image?: string; filename?: string };

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'No image provided. Please provide an image as a base64 Data URL.',
        code: 'MISSING_IMAGE',
      } satisfies AnalysisErrorResponse);
    }

    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image format. Expected a base64 Data URL (e.g. data:image/jpeg;base64,...).',
        code: 'INVALID_IMAGE_DATA_URL',
      } satisfies AnalysisErrorResponse);
    }

    const mimeType = match[1].toLowerCase();
    const base64Data = match[2];

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported image format (${mimeType}). Please upload a JPG, PNG, or WebP image.`,
        code: 'UNSUPPORTED_FORMAT',
      } satisfies AnalysisErrorResponse);
    }

    const imageBuffer = Buffer.from(base64Data, 'base64');

    if (imageBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Image file size exceeds the 10 MB limit.',
        code: 'IMAGE_TOO_LARGE',
      } satisfies AnalysisErrorResponse);
    }

    if (imageBuffer.length < 5000) {
      return res.status(400).json({
        success: false,
        error: 'Image file is too small or corrupted to contain a discernible face.',
        code: 'IMAGE_TOO_SMALL',
      } satisfies AnalysisErrorResponse);
    }

    const result = await executeYouCamSkinAnalysis(
      imageBuffer,
      mimeType,
      filename || 'scan.jpg'
    );

    return res.status(200).json(result);
  } catch (err: any) {
    const statusCode = typeof err.status === 'number' ? err.status : 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'An unexpected error occurred during skin analysis.',
      code: err.code || 'INTERNAL_ANALYSIS_ERROR',
      details: err.details || undefined,
      httpStatus: statusCode,
    } satisfies AnalysisErrorResponse);
  }
}
