# LEKHA — Skin Intelligence

**Tagline:** Your skin, documented. Your progress, understood.  
**Built for:** Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon  
**License:** MIT

LEKHA is an intelligent, honest personal skin record built around authentic YouCam AI Skin analysis. Unlike conventional applications that output arbitrary scores and encourage chasing unrealistic perfection, LEKHA focuses on documented progress, contextual understanding, and respectful data privacy.

---

## Core Features (P0 & P1)

1. **Genuine YouCam Skin AI Integration (V2.1 with V2.0 fallback)**
   - Complete multi-stage Server-to-Server (S2S) workflow: File API registration (`/s2s/v2.0/file`), binary PUT to pre-signed S3 storage, asynchronous task initiation (`/s2s/v2.1/task/skin-analysis`), and polling until completion.
   - 16 officially supported diagnostic dimensions: *Skin Texture, Pore Refinement, Wrinkles & Fine Lines, Blemish Clarity, Spots & Pigmentation, Sebum Balance, Hydration Retention, Calmness & Redness, Radiance, Skin Firmness, Under-Eye Tone, Eye Contour Smoothness, Upper Eyelid Lift, Lower Eyelid Tone, Tear Trough, and Skin Type Classification*.

2. **Honest Score Transparency (UI Score vs Raw Score)**
   - Distinguishes customer-calibrated UI Scores (0–100) from continuous scientific Raw Model Outputs.
   - Clear disclosure explaining that UI scores are calibrated for human interpretation, while raw scores offer scientific precision for tracking subtle biological shifts.

3. **Pre-Scan Skin Truth Check**
   - Client-side canvas analysis measuring lighting luminance, focus/sharpness, and sensor resolution before upload.
   - Prevents rejected scans and ensures reliable diagnostic inputs.

4. **Persistent Skin Passport**
   - Local browser storage (`localStorage`) preserving dated scan records, metrics, timestamps, and thumbnail previews across sessions.
   - View historical scan breakdowns and delete individual records on demand.

5. **Skin Comparison & Comparison Confidence**
   - Compare any two dated scans side-by-side with metric delta tracking (+/- UI & raw points).
   - **Comparison Confidence Indicator**: Evaluates whether lighting shifts or camera resolution variations make numerical differences less reliable.
   - Never fabricates biological progress.

6. **Metric-Derived Skincare Guidance**
   - Non-medical AM & PM routine suggestions linked directly to specific scan scores.
   - Transparent rationale for each recommended active ingredient.

7. **Privacy & Data Sovereignty**
   - Zero persistent cloud storage of face photos.
   - Ephemeral serverless memory processing.
   - 1-click complete local data wipe.

---

## Technical Stack

- **Frontend:** React 18, Vite 6, TypeScript 5.6 (strict mode), Tailwind CSS 3.4, Lucide React
- **Backend:** Node.js Serverless Function (`api/scan.ts`) with `@vercel/node`
- **Typography:** Fraunces (Editorial display serif) & DM Sans (UI body) via Google Fonts
- **Deployment Target:** Vercel (with safe SPA regex rewrites excluding `/api/*`)

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Perfect Corp YouCam API credentials:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
YOUCAM_API_KEY=your_actual_youcam_api_key_here
YOUCAM_API_BASE_URL=https://yce-api-01.makeupar.com
```

### 3. Run Development Server
```bash
npm run dev
```
The local Vite server includes a built-in proxy middleware for `/api/scan` that loads `.env.local` automatically.

### 4. Build for Production
```bash
npm run build
```

---

## Deployment (Vercel)

1. Connect your repository to Vercel.
2. In Project Settings $\rightarrow$ Environment Variables, add:
   - `YOUCAM_API_KEY`: Your YouCam API Key
   - `YOUCAM_API_BASE_URL`: `https://yce-api-01.makeupar.com`
3. Deploy! Vercel will automatically build the Vite static assets and serve `/api/scan.ts` as a serverless edge endpoint.
