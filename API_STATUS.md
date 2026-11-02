# LEKHA — Perfect Corp YouCam API Integration Status

**Last Verified:** November 2026  
**Integration Status:** **ACTIVE & LIVE VERIFIED**  
**API Engine Version:** YouCam Skin AI V2.1 (with V2.0 fallback safety)  
**Gateway URL:** `https://yce-api-01.makeupar.com`  
**Authentication Scheme:** `Authorization: Bearer [REDACTED_API_KEY]`  
**Deployment Endpoint:** `https://lekha-xi.vercel.app/api/scan`

---

## 1. Overview & Verification Summary

LEKHA connects directly to Perfect Corp's official Server-to-Server (S2S) YouCam Skin AI API platform. The integration is verified through a real end-to-end execution that successfully staged an image, initiated a neural network diagnostic task, polled to completion, and returned genuine cosmetic metric scores and computer-vision mask overlays from AWS S3.

### Live Proof-of-Execution Verification Record
- **Task ID:** `McH1GUj4vipLnvfmXZ55b0k3Ansax_JJRJVYFjjgiIp7ORDvj3PfG0aOjbPKuEwpV8vjSsGp_00cofvLX8kY0w`
- **Engine Status:** `task_status: "success"`
- **Response Format:** Certified JSON with continuous raw scores, calibrated UI scores, and detection mask overlays.

---

## 2. API Contract & Endpoints

| Stage | Endpoint Path | Method | Headers | Body / Description |
| :--- | :--- | :--- | :--- | :--- |
| **1. File Registration** | `/s2s/v2.0/file` | `POST` | `Authorization: Bearer <key>`<br>`Content-Type: application/json` | Registers file size and MIME type. Returns `file_id` and pre-signed S3 PUT URL. |
| **2. Storage Staging** | Pre-signed AWS S3 URL | `PUT` | `Content-Type: <mime>` | Direct binary upload of raw image buffer to secure cloud memory. |
| **3. Diagnostic Task** | `/s2s/v2.1/task/skin-analysis` | `POST` | `Authorization: Bearer <key>`<br>`Content-Type: application/json` | Enqueues skin analysis task with `src_file_id`, `dst_actions`, and `enable_mask_overlay: true`. |
| **4. Version Fallback** | `/s2s/v2.0/task/skin-analysis` | `POST` | `Authorization: Bearer <key>`<br>`Content-Type: application/json` | Strict fallback triggered **only** if endpoint returns HTTP 404. |
| **5. Task Polling** | `/s2s/v2.1/task/skin-analysis/{task_id}` | `GET` | `Authorization: Bearer <key>` | Polls execution status every 1.5 seconds until `task_status: "success"`. |

---

## 3. Real Diagnostic Output Data (Verified Live Sample)

The following metrics were extracted from the live YouCam V2.1 engine execution during production validation:

| Dimension Code | Metric Display Label | UI Score (0–100) | Raw Model Score | Mask Overlay Generated | Category |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `pore` | Pore Refinement | **86** | 90.87 | Yes (AWS S3 PNG) | Texture & Pores |
| `texture` | Skin Texture Smoothness | **86** | 90.55 | Yes (AWS S3 PNG) | Texture & Pores |
| `redness` | Vascular Calmness | **80** | 78.08 | Yes (AWS S3 PNG) | Tone & Clarity |
| `oiliness` | Sebum Balance | **96** | 97.83 | Yes (AWS S3 PNG) | Hydration & Balance |
| `age_spot` | Spots & Pigmentation | **95** | 98.06 | Yes (AWS S3 PNG) | Tone & Clarity |
| `wrinkle` | Wrinkles & Fine Lines | **88** | 94.08 | Yes (AWS S3 PNG) | Signs of Aging |
| `acne` | Blemish Clarity | **88** | 92.30 | Yes (AWS S3 PNG) | Tone & Clarity |
| `moisture` | Hydration Retention | **82** | 81.94 | Yes (AWS S3 PNG) | Hydration & Balance |
| **`all`** | **Composite Skin Health** | **88** | **87.63** | N/A | **Overall Index** |
| **`skin_age`** | **Estimated Skin Age** | **30** | **30.00** | N/A | **Biomarker** |

---

## 4. Supported Diagnostic Action Sets

### Core SD Actions (Default — 8 Dimensions)
Optimized for high-yield diagnostic evaluation while conserving API unit quotas:
- `texture`, `pore`, `wrinkle`, `acne`, `age_spot`, `oiliness`, `moisture`, `redness`.

### Extended SD Actions (Total 16 Dimensions)
Configurable via `YOUCAM_ACTIONS=all` in server environment:
- `radiance`, `firmness`, `dark_circle_v2`, `eye_bag`, `droopy_upper_eyelid`, `droopy_lower_eyelid`, `tear_trough`, `skin_type`.

---

## 5. Error Code Normalization & Handling

LEKHA intercepts all YouCam upstream errors and translates them into actionable human guidance:

| Upstream YouCam Code | HTTP Status | LEKHA Code | Human-Readable Recovery Guidance |
| :--- | :---: | :--- | :--- |
| `error_src_face_too_small` | 422 | `FACE_TOO_SMALL` | "The face in this photo is too small or distant. YouCam requires your face to occupy more than 60% of the image width. Please crop in closer or retake a closer portrait." |
| `error_no_face` | 422 | `NO_FACE_DETECTED` | "No face was detected in this photo. Please make sure the photo contains a clear, unobstructed frontal view of your face." |
| `error_below_min_image_size` | 422 | `IMAGE_RESOLUTION_TOO_LOW` | "Image resolution is too low. Please upload a photo that is at least 600×600 pixels." |
| `error_face_angle_too_large` | 422 | `FACE_ANGLE_TOO_LARGE` | "Your face is angled too far away from the camera. Please look directly into the camera lens." |
| `CreditInsufficiency` | 400 / 429 | `QUOTA_EXCEEDED` | "YouCam API developer account has insufficient credits. Please recharge credits in the Perfect Corp console." |
| `401 Unauthorized` | 401 | `UNAUTHORIZED` | "YouCam API key is invalid or expired. Check server environment credentials." |
| Missing `YOUCAM_API_KEY` | 503 | `YOUCAM_NOT_CONFIGURED` | "Server API key required. Add YOUCAM_API_KEY to server environment variables." |
| `TASK_TIMEOUT` (>35s) | 504 | `TASK_TIMEOUT` | "YouCam Skin AI analysis timed out after 35 seconds. Please try again." |

---

## 6. Security & Credential Isolation

- **Server-Side Only:** `YOUCAM_API_KEY` is loaded strictly via `process.env.YOUCAM_API_KEY` in `api/scan.ts`.
- **Zero Frontend Leakage:** The API key never appears in client HTML, bundle JavaScript (`dist/assets/index-*.js`), or browser network inspection.
- **Request Validation:** Incoming requests are strictly validated for base64 Data URL format, valid MIME type (`image/jpeg`, `image/png`, `image/webp`), and file size limits (5 KB min to 10 MB max).

