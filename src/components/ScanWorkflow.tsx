import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  ImagePlus,
  X,
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  AlertCircle,
  RefreshCw,
  Sun,
  Maximize2,
  Focus,
} from 'lucide-react';
import { analyzeImageQuality } from '../utils/imageQuality';
import type { ScanQualityCheck, SkinScanRecord, YouCamMetric } from '../types/skin';

interface ScanWorkflowProps {
  onScanCompleted: (record: SkinScanRecord) => void;
  onNavigateToPassport?: () => void;
}

export const ScanWorkflow: React.FC<ScanWorkflowProps> = ({
  onScanCompleted,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [qualityCheck, setQualityCheck] = useState<ScanQualityCheck | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [apiStepMessage, setApiStepMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelected = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WebP).');
      setErrorCode('INVALID_FILE_TYPE');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size must be under 10 MB.');
      setErrorCode('FILE_TOO_LARGE');
      return;
    }

    setErrorMessage(null);
    setErrorCode(null);
    setSelectedFile(file);
    setIsAnalyzingImage(true);

    try {
      const { qualityCheck: qc, thumbnailDataUrl, dataUrl } = await analyzeImageQuality(file);
      setQualityCheck(qc);
      setThumbnailUrl(thumbnailDataUrl);
      setPreviewUrl(dataUrl);
    } catch (err: any) {
      console.error('Error checking image quality:', err);
      setPreviewUrl(URL.createObjectURL(file));
      setQualityCheck(null);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleClear = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setThumbnailUrl('');
    setQualityCheck(null);
    setErrorMessage(null);
    setErrorCode(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRunAnalysis = async () => {
    if (!previewUrl || !selectedFile) return;

    setIsCallingApi(true);
    setErrorMessage(null);
    setErrorCode(null);

    setApiStepMessage('Preparing secure image payload...');
    const t1 = setTimeout(() => setApiStepMessage('Staging image with YouCam S2S gateway...'), 1800);
    const t2 = setTimeout(() => setApiStepMessage('Executing AI Skin Diagnostics task...'), 4500);
    const t3 = setTimeout(() => setApiStepMessage('Evaluating 16 dermal dimensions...'), 8500);
    const t4 = setTimeout(() => setApiStepMessage('Retrieving certified output parameters...'), 14000);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: previewUrl,
          filename: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw {
          message: data.error || `Server responded with status ${response.status}`,
          code: data.code || 'API_ERROR',
          details: data.details,
        };
      }

      const record: SkinScanRecord = {
        id: 'scan_' + Date.now(),
        timestamp: data.timestamp || new Date().toISOString(),
        dateFormatted: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        name: selectedFile.name.replace(/\.[^/.]+$/, ''),
        thumbnailUrl: thumbnailUrl || previewUrl,
        apiVersion: data.apiVersion || 'v2.1',
        metrics: data.metrics as YouCamMetric[],
        qualityCheck: qualityCheck || undefined,
        overall: data.overall,
      };

      onScanCompleted(record);
    } catch (err: any) {
      console.error('Scan analysis error:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred while communicating with the skin analysis service.'
      );
      setErrorCode(err.code || 'COMMUNICATION_ERROR');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      setIsCallingApi(false);
      setApiStepMessage('');
    }
  };

  return (
    <main className="workspace">
      <p className="eyebrow">YOUR SKIN JOURNAL / NEW ENTRY</p>
      <h1>
        A moment to <i>check in.</i>
      </h1>
      <p className="sub">
        Choose a clear, recent face photo to begin. Your image undergoes an honest client-side
        Truth Check before being securely processed through YouCam AI.
      </p>

      <div className="columns">
        <section className="panel">
          <div className="meta">
            01 / CAPTURE &amp; INSPECTION <span>JPG · PNG · WEBP / MAX 10 MB</span>
          </div>

          {!previewUrl ? (
            <button
              type="button"
              className="drop cursor-pointer w-full text-left"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelected(e.dataTransfer.files[0]);
              }}
            >
              <ImagePlus size={32} className="text-[#c98f94]" />
              <b>Bring your image here</b>
              <span>Drop a portrait photo or browse your files</span>
              <em>
                <Upload size={14} /> Choose face image
              </em>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="preview relative rounded-none overflow-hidden border border-[#eadbd7]">
                <img
                  src={previewUrl}
                  alt="Selected face preview"
                  className="max-h-[380px] w-auto mx-auto object-contain"
                />
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Remove image"
                  disabled={isCallingApi}
                  className="absolute right-3 top-3 bg-white/90 hover:bg-white text-[#3a1f2e] p-2 rounded-full shadow-md transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-[#3a1f2e]/90 text-white text-xs px-3 py-2 flex items-center justify-between">
                  <span className="truncate max-w-[240px]">{selectedFile?.name}</span>
                  {qualityCheck && (
                    <span className="text-[11px] text-[#f3ddda]">
                      {qualityCheck.width} × {qualityCheck.height} px
                    </span>
                  )}
                </div>
              </div>

              {qualityCheck && (
                <div className="bg-[#fbf2ef] p-4 border border-[#eadbd7] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider">
                      <Focus size={14} className="text-[#8e3b5a]" />
                      <span>Skin Truth Check — Pre-Scan Verification</span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        qualityCheck.isSuitableForScan
                          ? 'bg-[#e2ede0] text-[#3e6837]'
                          : 'bg-[#f7dedc] text-[#8e3b5a]'
                      }`}
                    >
                      {qualityCheck.isSuitableForScan ? 'Ready for Analysis' : 'Attention Advised'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white/80 p-2 border border-[#f0ddda]">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-[#8a7074] uppercase">
                        <Sun size={12} />
                        <span>Lighting</span>
                      </div>
                      <b
                        className={`text-xs block mt-1 ${
                          qualityCheck.brightnessStatus === 'optimal'
                            ? 'text-[#416938]'
                            : 'text-[#8e3b5a]'
                        }`}
                      >
                        {qualityCheck.brightnessStatus === 'optimal'
                          ? 'Balanced'
                          : qualityCheck.brightnessStatus === 'too_dark'
                          ? 'Underexposed'
                          : 'High Glare'}
                      </b>
                      <span className="text-[10px] text-[#9c8587]">
                        {qualityCheck.brightness}% Lum
                      </span>
                    </div>

                    <div className="bg-white/80 p-2 border border-[#f0ddda]">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-[#8a7074] uppercase">
                        <Focus size={12} />
                        <span>Clarity</span>
                      </div>
                      <b
                        className={`text-xs block mt-1 ${
                          qualityCheck.sharpnessStatus === 'sharp' ||
                          qualityCheck.sharpnessStatus === 'acceptable'
                            ? 'text-[#416938]'
                            : 'text-[#8e3b5a]'
                        }`}
                      >
                        {qualityCheck.sharpnessStatus === 'sharp'
                          ? 'Crisp Detail'
                          : qualityCheck.sharpnessStatus === 'acceptable'
                          ? 'Acceptable'
                          : 'Soft / Motion'}
                      </b>
                      <span className="text-[10px] text-[#9c8587]">
                        Score: {qualityCheck.sharpness}
                      </span>
                    </div>

                    <div className="bg-white/80 p-2 border border-[#f0ddda]">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-[#8a7074] uppercase">
                        <Maximize2 size={12} />
                        <span>Resolution</span>
                      </div>
                      <b
                        className={`text-xs block mt-1 ${
                          qualityCheck.resolutionStatus === 'high'
                            ? 'text-[#416938]'
                            : qualityCheck.resolutionStatus === 'good'
                            ? 'text-[#504044]'
                            : 'text-[#8e3b5a]'
                        }`}
                      >
                        {qualityCheck.resolutionStatus === 'high'
                          ? 'HD Ready'
                          : qualityCheck.resolutionStatus === 'good'
                          ? 'SD Compatible'
                          : 'Below 480p'}
                      </b>
                      <span className="text-[10px] text-[#9c8587]">
                        Min {Math.min(qualityCheck.width, qualityCheck.height)}px
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#6d4b55] space-y-1 pt-1 border-t border-[#f0ddda]">
                    {qualityCheck.notes.map((note, idx) => (
                      <p key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-[#c98f94]">•</span>
                        <span>{note}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />

          {errorMessage && (
            <div className="mt-4 p-4 bg-[#fdf2f1] border-l-4 border-[#8e3b5a] text-[#5c2a3d] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <AlertCircle size={15} className="text-[#8e3b5a]" />
                <span>
                  {errorCode === 'YOUCAM_NOT_CONFIGURED'
                    ? 'Server API Key Required'
                    : 'Analysis Could Not Proceed'}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{errorMessage}</p>

              {errorCode === 'YOUCAM_NOT_CONFIGURED' && (
                <div className="mt-2 pt-2 border-t border-[#eed2cf] text-[11px] text-[#7a4253] space-y-1">
                  <p>
                    <b>To resolve:</b> Add your YouCam API key to your server environment:
                  </p>
                  <code className="block bg-white p-2 text-[10px] font-mono border border-[#e5c0bd]">
                    YOUCAM_API_KEY=your_key_here<br />
                    YOUCAM_API_BASE_URL=https://yce-api-01.makeupar.com
                  </code>
                  <p className="text-[10px]">
                    Create a <span className="font-mono">.env.local</span> file in the project root or configure Vercel Environment Variables.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="tips">
            <b>For a more consistent personal record</b>
            <p>
              • Face the camera in soft, even natural daylight without direct overhead shadows.<br />
              • Keep your expression relaxed and eyes open.<br />
              • Avoid beauty filters, makeup that masks natural texture, or heavy digital smoothing.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="dark wide py-4 flex items-center justify-center gap-2 cursor-pointer font-medium tracking-wider uppercase text-xs disabled:opacity-50"
              disabled={!previewUrl || isCallingApi || isAnalyzingImage}
              onClick={handleRunAnalysis}
            >
              {isCallingApi ? (
                <>
                  <RefreshCw size={15} className="animate-spin text-[#c98f94]" />
                  <span>{apiStepMessage || 'Analyzing with YouCam AI...'}</span>
                </>
              ) : isAnalyzingImage ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Verifying Image Quality...</span>
                </>
              ) : (
                <>
                  <span>Execute Genuine Skin Analysis</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </section>

        <aside>
          <p className="eyebrow">A NOTE ON TRUST</p>
          <h2>
            Real analysis.
            <br />
            <i>Never pretend.</i>
          </h2>
          <p>
            LEKHA connects directly to Perfect Corp's official YouCam Skin AI API (V2.1).
            We do not fabricate skin scores, generate fake beauty progress, or claim medical
            diagnostics.
          </p>
          <hr />
          <div className="space-y-4 text-xs">
            <p>
              <LockKeyhole className="inline text-[#8e3b5a] mr-1.5" size={14} />
              <b>Private by design</b>
              <br />
              Your image is evaluated in memory and discarded by our backend after diagnostic extraction.
              Records stay in your browser.
            </p>
            <p>
              <ShieldCheck className="inline text-[#8e3b5a] mr-1.5" size={14} />
              <b>Non-medical awareness</b>
              <br />
              LEKHA is an intelligent documentation journal for personal skincare awareness. It does
              not replace dermatology consultations.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};
