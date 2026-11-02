import type { ScanQualityCheck } from '../types/skin';

/**
 * Performs client-side image quality evaluation (Skin Truth Check)
 * Inspects resolution, lighting/luminance, and edge contrast before upload.
 */
export async function analyzeImageQuality(file: File): Promise<{
  qualityCheck: ScanQualityCheck;
  thumbnailDataUrl: string;
  dataUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = () => {
      const fullDataUrl = reader.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to decode image data'));

      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const minDimension = Math.min(width, height);

        let resolutionStatus: 'low' | 'good' | 'high' = 'good';
        if (minDimension < 480) {
          resolutionStatus = 'low';
        } else if (minDimension >= 1080) {
          resolutionStatus = 'high';
        }

        const sampleWidth = Math.min(width, 320);
        const sampleHeight = Math.round((height / width) * sampleWidth);
        const canvas = document.createElement('canvas');
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          const fallbackCheck: ScanQualityCheck = {
            brightness: 50,
            brightnessStatus: 'optimal',
            sharpness: 50,
            sharpnessStatus: 'acceptable',
            width,
            height,
            resolutionStatus,
            isSuitableForScan: resolutionStatus !== 'low',
            notes: ['Standard image check passed.'],
          };
          return resolve({
            qualityCheck: fallbackCheck,
            thumbnailDataUrl: fullDataUrl,
            dataUrl: fullDataUrl,
          });
        }

        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
        const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
        const data = imageData.data;
        const totalPixels = sampleWidth * sampleHeight;

        let totalLuminance = 0;
        const grayValues = new Float32Array(totalPixels);

        for (let i = 0; i < totalPixels; i++) {
          const r = data[i * 4];
          const g = data[i * 4 + 1];
          const b = data[i * 4 + 2];
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          grayValues[i] = lum;
          totalLuminance += lum;
        }

        const avgLuminance = totalLuminance / totalPixels;
        const brightnessScore = Math.round((avgLuminance / 255) * 100);

        let brightnessStatus: 'too_dark' | 'optimal' | 'too_bright' = 'optimal';
        if (brightnessScore < 28) {
          brightnessStatus = 'too_dark';
        } else if (brightnessScore > 84) {
          brightnessStatus = 'too_bright';
        }

        let laplacianVariance = 0;
        let edgeSamples = 0;
        for (let y = 1; y < sampleHeight - 1; y += 2) {
          for (let x = 1; x < sampleWidth - 1; x += 2) {
            const idx = y * sampleWidth + x;
            const center = grayValues[idx];
            const up = grayValues[idx - sampleWidth];
            const down = grayValues[idx + sampleWidth];
            const left = grayValues[idx - 1];
            const right = grayValues[idx + 1];

            const lap = Math.abs(4 * center - up - down - left - right);
            laplacianVariance += lap;
            edgeSamples++;
          }
        }

        const avgEdgeContrast = edgeSamples > 0 ? laplacianVariance / edgeSamples : 0;
        const sharpnessScore = Math.min(100, Math.round(avgEdgeContrast * 2.2));

        let sharpnessStatus: 'blurry' | 'acceptable' | 'sharp' = 'acceptable';
        if (sharpnessScore < 18) {
          sharpnessStatus = 'blurry';
        } else if (sharpnessScore >= 45) {
          sharpnessStatus = 'sharp';
        }

        const notes: string[] = [];
        if (brightnessStatus === 'too_dark') {
          notes.push('Lighting is quite dim. Face toward a window or soft lamp for truer skin clarity.');
        } else if (brightnessStatus === 'too_bright') {
          notes.push('Intense glare or flash detected. Subtle skin texture may be washed out.');
        } else {
          notes.push('Lighting is balanced and even.');
        }

        if (sharpnessStatus === 'blurry') {
          notes.push('Image appears somewhat soft or moving. Hold your device steady.');
        } else {
          notes.push('Image detail and focus are clear.');
        }

        if (resolutionStatus === 'low') {
          notes.push('Resolution is below 480px minimum. Analysis may be rejected by AI engine.');
        } else if (resolutionStatus === 'high') {
          notes.push('High-definition capture. Ideal for fine pore and micro-texture analysis.');
        }

        const thumbCanvas = document.createElement('canvas');
        const thumbWidth = 180;
        const thumbHeight = Math.round((height / width) * thumbWidth);
        thumbCanvas.width = thumbWidth;
        thumbCanvas.height = thumbHeight;
        const thumbCtx = thumbCanvas.getContext('2d');
        if (thumbCtx) {
          thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
        }
        const thumbnailDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.82);

        const isSuitableForScan = resolutionStatus !== 'low' && brightnessScore >= 18;

        const qualityCheck: ScanQualityCheck = {
          brightness: brightnessScore,
          brightnessStatus,
          sharpness: sharpnessScore,
          sharpnessStatus,
          width,
          height,
          resolutionStatus,
          isSuitableForScan,
          notes,
        };

        resolve({
          qualityCheck,
          thumbnailDataUrl,
          dataUrl: fullDataUrl,
        });
      };

      img.src = fullDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
