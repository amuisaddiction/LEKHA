# LEKHA — Skin Intelligence

**Tagline:** *Your skin, documented. Your progress, understood.*  
**Hackathon Submission:** Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon (Devpost)  
**Live Application:** [https://lekha-xi.vercel.app](https://lekha-xi.vercel.app)  
**Public Repository:** [https://github.com/amuisaddiction/LEKHA](https://github.com/amuisaddiction/LEKHA)  
**License:** MIT

---

## 1. Executive Summary & Problem Statement

Most modern skincare applications provide an instant face scan, output arbitrary numbers, and leave the user wondering what those metrics actually mean. Users are nudged to chase artificial scores or purchase products without context. Furthermore, skin appearance shifts naturally with lighting, camera optics, hydration, circadian rest, and ambient climate. A single scan never tells the whole story, and treating every numerical difference as biological progress is misleading.

**LEKHA** is an editorial, privacy-first personal skin journal designed around authentic **Perfect Corp YouCam Skin AI** diagnostics. Rather than presenting a synthetic beauty score, LEKHA introduces **honest skin progress tracking**:
- Pre-flight image quality validation (**Skin Truth Check**) before analysis.
- Certified YouCam computer-vision metrics evaluated on an objective scale.
- Clear distinction between consumer-calibrated **UI Scores** and continuous **Raw Model Outputs**.
- Interactive **Personal Skin Profile** connecting your skin type, behaviors, and sensitivities to all recommendations.
- A persistent, browser-local **Skin Passport** that documents your skin timeline.
- **LEKHA Skin Lab:** An interactive dermatological workbench featuring Skin Focus Explorer, Routine Builder with ingredient compatibility cautions, a 5-parameter daily Skin Diary, 28-Day habit goals, and authentic biometric scan comparison.
- Side-by-side historical comparison evaluated by a **Comparison Confidence** engine that accounts for lighting, camera differences, and subject consistency.
- Responsible, metric-derived **Interactive AM/PM Skincare Protocol** with daily progress tracking.
- Zero cloud storage of user face images with 1-click complete local data purge.

---

## 2. Target Users & Consumer / eCommerce Value

### Target Users
- **Skincare Enthusiasts & Consumers:** Individuals seeking to objectively understand their skin concerns (texture, redness, pores, fine lines) and track whether changes over weeks are real or lighting artifacts.
- **Dermatology & Aesthetic Clients:** Users preparing for cosmetic or dermatology visits who want an authentic, dated timeline of their skin characteristics.
- **Privacy-Conscious Individuals:** Users who refuse to upload their private biometric selfies to third-party cloud databases or ad-targeting servers.

### Consumer & eCommerce Value
- **Higher Conversion & Lower Returns:** When skincare e-commerce platforms connect recommendations to verified computer-vision analysis rather than generic quizzes, consumer purchase confidence increases.
- **Combatting "Routine Fatigue":** Most consumers abandon active skincare routines before the 28–45 day epidermal renewal cycle completes. LEKHA's documented progress tracking visualizes subtle improvements, reinforcing product compliance and brand loyalty.
- **Brand Trust:** By openly disclosing image lighting limitations and distinguishing consumer UI scores from raw algorithm measurements, brands build genuine long-term credibility instead of short-term gimmicks.

---

## 3. Product Features & User Journey

```
[ Upload / Capture ] ──> [ Skin Truth Check ] ──> [ Secure S2S Pipeline ] ──> [ YouCam Skin AI ]
                                                                                      │
                                                                                      ▼
[ Privacy Controls ] <── [ Skin Passport ] <── [ Scan Comparison ] <── [ Certified Results ]
        │
        └──> [ Personal Skin Profile ] ──> [ Interactive AM/PM Protocol Tracker ]
```

1. **Capture & Pre-Flight Skin Truth Check:** Client-side canvas analysis measures ambient luminance, edge contrast (focus/sharpness), and pixel resolution before upload, ensuring the photo is suitable for AI processing.
2. **Server-Side YouCam S2S Integration:** High-resolution image buffer is securely staged with YouCam's File API, binary uploaded to pre-signed S3 storage, and analyzed via the asynchronous Task API.
3. **Certified Results Experience:** Displays verified metrics with clear categorization (Texture & Pores, Tone & Clarity, Hydration & Balance, Signs of Aging). Supports toggling visual detection mask overlays directly on the portrait.
4. **Interactive Personal Skin Profile:** Guided intake capturing user skin type (Oily, Dry, Combination, Normal, Sensitive, Unsure), daily behaviors, primary concerns, and known ingredient sensitivities (alcohol, retinoids, fragrance).
5. **Persistent Skin Passport:** Saves dated scan records, scores, timestamps, and thumbnails locally within the user's browser.
6. **LEKHA Skin Lab & Honest Comparison:** Interactive habit workbench featuring Skin Focus Explorer (8 macro concerns & mirror observation cues), Routine Builder (with ingredient overlap & compatibility warnings), Skin Diary (5-parameter daily self-checkins with CSV/JSON export), 28-Day Habit Goals (activity-based cycle tracking), and honest Scan Comparison unlocking when 2+ genuine scans are recorded (with face consistency safeguards).
7. **Interactive AM/PM Skincare Protocol Tracker:** Checkable morning and evening steps with live daily completion progress bar, key active ingredient spotlights, and explicit links to triggering metrics and user profile traits.
8. **Privacy & Data Sovereignty:** Zero persistent cloud database storage of face images; 1-click complete local data purge.

---

## 4. Exact YouCam API Integration & Technical Architecture

LEKHA connects to the official Perfect Corp YouCam API platform via a secure server-to-server (S2S) architecture:

### Endpoints Implemented

| Stage | Endpoint | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **1. File Staging** | `/s2s/v2.0/file` | `POST` | Registers file metadata (`content_type`, `file_name`, `file_size`) and retrieves a pre-signed S3 upload URL and `file_id`. |
| **2. Storage Upload** | S3 pre-signed URL | `PUT` | Uploads raw binary image buffer with matching MIME type. |
| **3. Task Creation** | `/s2s/v2.1/task/skin-analysis` | `POST` | Submits `src_file_id`, requested diagnostic actions (`dst_actions`), and `miniserver_args.enable_mask_overlay: true`. |
| **4. Fallback Support** | `/s2s/v2.0/task/skin-analysis` | `POST` | Strict fallback triggered **only** if the target environment returns HTTP 404 for V2.1. |
| **5. Task Polling** | `/s2s/v2.1/task/skin-analysis/{task_id}` | `GET` | Polls task completion status (`queued` $\rightarrow$ `processing` $\rightarrow$ `success`/`error`) every 1.5 seconds. |

### Diagnostic Actions Implemented
To optimize unit consumption and response speed, LEKHA defaults to **8 Core SD Actions**:
- `texture`: Surface micro-relief smoothness
- `pore`: Follicular dilation and visibility
- `wrinkle`: Fine lines and expression creases
- `acne`: Blemish and comedone clarity
- `age_spot`: Localized hyper-pigmentation and sun spots
- `oiliness`: T-zone and U-zone sebum emission
- `moisture`: Stratum corneum hydration plumpness
- `redness`: Surface flushing and vascular reactivity

*Note: 8 additional extended actions (`radiance`, `firmness`, `dark_circle_v2`, `eye_bag`, `droopy_upper_eyelid`, `droopy_lower_eyelid`, `tear_trough`, `skin_type`) are supported and configurable via `YOUCAM_ACTIONS=all`.*

---

## 5. Technology Stack

- **Frontend Framework:** React 18.3 & TypeScript 5.6 (strict mode)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3.4 & Custom Editorial CSS (Rose Ivory / Soft Blush / Deep Plum palette)
- **Typography:** Fraunces (Editorial display serif) & DM Sans (Modern UI sans)
- **Icons:** Lucide React
- **Serverless API:** Node.js Serverless Function (`api/scan.ts`) with `@vercel/node`
- **Testing:** Node.js Native Test Runner (`node --test`)
- **Deployment Platform:** Vercel

---

## 6. Installation & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v20)
- npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/amuisaddiction/LEKHA.git
cd LEKHA
npm install
```

### 2. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your server-only YouCam credentials:
```env
# Server-only credentials. Never use VITE_ prefix.
YOUCAM_API_KEY=your_actual_youcam_api_key_here
YOUCAM_API_BASE_URL=https://yce-api-01.makeupar.com
YOUCAM_ACTIONS=core
YOUCAM_API_VERSION=v2.1
```

### 3. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173`. The Vite development server includes a built-in proxy middleware for `/api/scan` that loads `.env.local` automatically.

### 4. Run Automated Tests
```bash
npm test
```
Executes the native test suite verifying metric mappings, comparison deltas, confidence algorithms, and date formatting.

### 5. Build for Production
```bash
npm run build
```

---

## 7. Audit & Verification Documentation

Comprehensive engineering reports have been prepared in the repository:
- [`AUDIT_REPORT.md`](AUDIT_REPORT.md): Complete architecture and security audit, initial issues, root causes, and verification matrix.
- [`API_STATUS.md`](API_STATUS.md): YouCam API endpoint status, live execution logs, real sample score outputs, and error normalization tables.
- [`FEATURE_TEST_CHECKLIST.md`](FEATURE_TEST_CHECKLIST.md): 20-point feature acceptance test matrix with pass/fail statuses.
- [`IMAGE_AUDIT.md`](IMAGE_AUDIT.md): Inventory of all 15 imagery assets with Unsplash photographer credits and licensing verification.
- [`RULE_COMPLIANCE_REPORT.md`](RULE_COMPLIANCE_REPORT.md): 12-point Devpost & Perfect Corp hackathon rule compliance matrix.
- [`CREDITS.md`](CREDITS.md): Full typography, icon, and photography attributions.

---

## 8. Deployment Instructions (Vercel)

LEKHA is architected as a static Vite frontend with a serverless API boundary (`api/scan.ts`):

1. **Import Repository:** Log into [Vercel](https://vercel.com/) and import the public GitHub repository.
2. **Configure Environment Variables:** In **Project Settings $\rightarrow$ Environment Variables**, configure:
   - `YOUCAM_API_KEY`: Your Perfect Corp developer key
   - `YOUCAM_API_BASE_URL`: `https://yce-api-01.makeupar.com`
   - `YOUCAM_ACTIONS`: `core`
3. **Deploy:** Vercel automatically runs `npm run build` and provisions `/api/scan` as a serverless function.
4. **Routing Guard:** `vercel.json` contains a regex rewrite rule (`/((?!api/).*)`) that protects `/api/scan` from SPA catch-all interception.

---

## 9. Privacy, Security & Disclaimers

- **Zero Cloud Photo Retention:** User portrait photos are held transiently in serverless memory for the duration of the API call and immediately discarded.
- **Local Browser Storage:** All saved Skin Passport records reside strictly inside the user's browser `localStorage`.
- **Secret Isolation:** `YOUCAM_API_KEY` is kept strictly on the server and is never exposed to client-side bundles.
- **Non-Medical Disclaimer:** LEKHA is a cosmetic documentation and personal awareness journal. It does not diagnose, treat, cure, or prevent any dermatological medical condition.

---

## 10. License

Released under the [MIT License](LICENSE). Copyright © 2026 LEKHA contributors.
