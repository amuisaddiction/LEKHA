import type { VercelRequest, VercelResponse } from '@vercel/node';

// Official YouCam S2S API Endpoints & Actions
const DEFAULT_BASE_URL = 'https://yce-api-01.makeupar.com';

// Official 16 SD Diagnostic Actions (Supported across all tiers & camera resolutions)
export const SUPPORTED_ACTIONS = [
  'acne',
  'dark_circle_v2',
  'droopy_lower_eyelid',
  'droopy_upper_eyelid',
  'eye_bag',
  'firmness',
  'moisture',
  'oiliness',
  'pore',
  'radiance',
  'redness',
  'age_spot',
  'texture',
  'wrinkle',
  'skin_type',
  'tear_trough',
] as const;

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
}

/**
 * Executes the complete YouCam S2S Skin Analysis flow:
 * 1. File API registration (/s2s/v2.0/file)
 * 2. Binary PUT of image buffer to pre-signed S3 upload URL
 * 3. Skin AI Task Creation (/s2s/v2.1/task/skin-analysis with v2.0 fallback)
 * 4. Polling until completion or timeout (/s2s/v2.1/task/skin-analysis/{task_id})
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
      'YOUCAM_API_KEY is not configured on the server. Please add your YouCam API key to your server environment.'
    );
    error.code = 'YOUCAM_NOT_CONFIGURED';
    error.status = 503;
    throw error;
  }

  const authHeader = `Bearer ${apiKey}`;

  // STEP 1: Register file with YouCam File API (v2.0 is the standard file staging gateway)
  const fileInitUrl = `${baseUrl}/s2s/v2.0/file`;
  const fileInitRes = await fetch(fileInitUrl, {
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

  if (!fileInitRes.ok) {
    const errText = await fileInitRes.text();
    let errJson: any;
    try {
      errJson = JSON.parse(errText);
    } catch {
      errJson = { message: errText };
    }
    const error: any = new Error(
      errJson.error || errJson.message || `YouCam File API initialization failed (${fileInitRes.status})`
    );
    error.code = errJson.error_code || 'FILE_INIT_FAILED';
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
    const error: any = new Error('YouCam File API response did not contain upload instructions or file_id');
    error.code = 'INVALID_FILE_RESPONSE';
    error.status = 502;
    throw error;
  }

  // STEP 2: Binary PUT directly to pre-signed S3 URL
  const uploadRes = await fetch(uploadUrl, {
    method: uploadMethod,
    headers: {
      'Content-Type': mimeType,
    },
    body: imageBuffer,
  });

  if (!uploadRes.ok) {
    const uploadErrText = await uploadRes.text();
    const error: any = new Error(`Image storage upload failed: ${uploadRes.status} ${uploadErrText}`);
    error.code = 'IMAGE_UPLOAD_FAILED';
    error.status = 502;
    throw error;
  }

  // STEP 3: Create Skin Analysis Task (try V2.1 first, fallback to V2.0 if not supported by account)
  const taskPayload = {
    src_file_id: fileId,
    dst_actions: [...SUPPORTED_ACTIONS],
    miniserver_args: {
      enable_mask_overlay: true,
    },
    format: 'json',
  };

  let chosenVersion = 'v2.1';
  let createTaskUrl = `${baseUrl}/s2s/v2.1/task/skin-analysis`;

  let createTaskRes = await fetch(createTaskUrl, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskPayload),
  });

  // If V2.1 endpoint returns 404 Not Found, seamlessly try V2.0 endpoint
  if (createTaskRes.status === 404) {
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
    const error: any = new Error(
      taskErrJson.error || taskErrJson.message || `YouCam Skin Task creation failed (${createTaskRes.status})`
    );
    error.code = taskErrJson.error_code || 'TASK_CREATION_FAILED';
    error.status = createTaskRes.status === 400 ? 400 : createTaskRes.status === 429 ? 429 : 502;
    error.details = taskErrJson;
    throw error;
  }

  const createTaskData: any = await createTaskRes.json();
  const taskId = createTaskData?.data?.task_id;

  if (!taskId) {
    const error: any = new Error('YouCam did not return a valid task_id for skin analysis');
    error.code = 'MISSING_TASK_ID';
    error.status = 502;
    throw error;
  }

  // STEP 4: Poll task status until complete or timeout
  const pollUrl = `${baseUrl}/s2s/${chosenVersion}/task/skin-analysis/${taskId}`;
  const startTime = Date.now();
  const MAX_POLL_MS = 35000; // 35 seconds max
  const POLL_INTERVAL_MS = 1500;

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
        pollErrJson.error || pollErrJson.message || `Error polling YouCam task (${pollRes.status})`
      );
      error.code = pollErrJson.error_code || 'POLL_FAILED';
      error.status = 502;
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
        raw_score: Number(item.raw_score ?? item.ui_score ?? 0),
        mask_urls: Array.isArray(item.mask_urls) ? item.mask_urls : [],
        subcategories: item.subcategories || undefined,
        extra: item.extra || undefined,
      }));

      // Extract high-level metadata if present (such as skin_type, skin_age)
      const skinTypeMetric = metrics.find((m) => m.type === 'skin_type');
      let overallSkinType: string | undefined;
      if (skinTypeMetric?.extra && typeof (skinTypeMetric.extra as any).skin_type === 'string') {
        overallSkinType = (skinTypeMetric.extra as any).skin_type;
      }

      return {
        success: true,
        apiVersion: chosenVersion,
        timestamp: new Date().toISOString(),
        metrics,
        overall: {
          skin_type: overallSkinType,
        },
      };
    }

    if (taskStatus === 'error') {
      const errObj = pollData?.data?.error || {};
      const error: any = new Error(
        errObj.message || errObj.error || 'YouCam Skin AI was unable to analyze this image.'
      );
      error.code = errObj.error_code || errObj.code || 'TASK_EXECUTION_ERROR';
      error.status = 422;
      error.details = errObj;
      throw error;
    }

    // Still 'queued' or 'processing' -> continue loop
  }

  const timeoutError: any = new Error('YouCam Skin AI analysis timed out. Please try again.');
  timeoutError.code = 'TASK_TIMEOUT';
  timeoutError.status = 504;
  throw timeoutError;
}

/**
 * Vercel Serverless Handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & method guard
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

  // Pre-flight check on environment variables
  if (!process.env.YOUCAM_API_KEY) {
    return res.status(503).json({
      success: false,
      error: 'YouCam API credentials are not configured on the server. Please configure YOUCAM_API_KEY in your environment.',
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

    // Parse Data URL: data:[<mediatype>][;base64],<data>
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

    // 10 MB payload limit check
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
    } satisfies AnalysisErrorResponse);
  }
}
