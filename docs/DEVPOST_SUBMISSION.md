# DEVPOST HACKATHON SUBMISSION — LEKHA

---

### Project Title
**LEKHA — Skin Intelligence**

### Short Tagline (140 characters max)
**Your skin, documented. Your progress, understood. Honest skin progress tracking powered by the Perfect Corp YouCam Skin AI API.**

---

### Inspiration & Problem
Most modern skincare applications provide an instant face scan, output arbitrary numbers, and leave the user wondering what those metrics actually mean. Users are nudged to chase artificial scores or purchase products without context. Furthermore, skin appearance shifts naturally with lighting, camera optics, hydration, circadian rest, and ambient climate. A single scan never tells the whole story, and treating every numerical difference as biological progress is misleading.

We created **LEKHA** (from the Sanskrit root for *a record, account, or documentation*) to pioneer **honest skin progress tracking**. We set out to build a calm, editorial personal skin journal that pairs certified Perfect Corp YouCam Skin AI computer vision with contextual awareness, transparent score explanations, and respectful data privacy.

---

### What It Does
LEKHA helps users understand their skin through verified AI diagnostics and maintain an authentic personal record over time:

1. **Pre-Scan Skin Truth Check:** Evaluates lighting exposure, camera focus/sharpness, and sensor resolution on the client side before upload, ensuring photos are suitable for AI diagnostics.
2. **Certified YouCam Skin AI Integration:** Secure server-to-server (S2S) processing through Perfect Corp's official API, evaluating 8–16 core diagnostic dimensions including Texture, Pores, Wrinkles, Blemishes, Spots, Oiliness, Moisture, and Redness.
3. **Score Transparency (UI Score vs. Raw Score):** Clearly labels consumer-calibrated UI Scores (0–100) alongside continuous scientific Raw Model Outputs, educating users that raw scores offer deeper precision for tracking subtle biological shifts over weeks.
4. **Visual Mask Overlays:** Allows toggling authentic detection mask overlays directly onto the user's portrait image.
5. **Persistent Skin Passport:** A private, browser-local historical record documenting dated scans, scores, and thumbnail previews across sessions.
6. **Skin Comparison & Comparison Confidence:** Side-by-side historical evaluation calculating metric variations and evaluating capture differences (lighting variance, camera resolution, elapsed days) so users know whether a change is biological progress or a photography difference.
7. **Metric-Derived Skincare Guidance:** Non-medical AM/PM skincare considerations formulated directly from the user's actual scores, explaining *why* each ingredient is suggested and *which metric* informed it.
8. **Data Sovereignty & Privacy:** Zero persistent cloud database storage of user face images; 1-click complete local data wipe.

---

### How We Built It
- **Frontend:** React 18, Vite 6, TypeScript 5.6 (strict mode), Tailwind CSS 3.4, Lucide React icons.
- **Editorial Design System:** Custom typography pairing Fraunces (warm editorial display serif) with DM Sans (clean modern UI sans), styled with a Rose Ivory, Soft Blush, and Deep Plum aesthetic.
- **Backend & API Boundary:** Vercel serverless TypeScript function (`api/scan.ts`) with `@vercel/node`.
- **YouCam API S2S Pipeline:**
  - File API initialization (`POST /s2s/v2.0/file`) to register media metadata and obtain pre-signed storage URLs.
  - Direct binary `PUT` of raw image buffers to pre-signed S3 storage.
  - Asynchronous task initiation (`POST /s2s/v2.1/task/skin-analysis` with strict fallback to `v2.0`).
  - Polling loop (`GET /s2s/{version}/task/skin-analysis/{task_id}`) every 1.5s until completion.
  - Zero fabricated scores or simulated demo data.

---

### Challenges We Ran Into
- **SD vs. HD Action Isolation:** Learning that Perfect Corp strictly prohibits mixing SD and HD actions in a single payload (`InvalidParameters`). We focused on the 8 core SD actions to optimize unit consumption and ensure universal camera compatibility.
- **Score Representation:** Understanding that YouCam returns both calibrated `ui_score` and continuous `raw_score`. Instead of hiding this, we made it a core feature of LEKHA's honesty promise.
- **Environmental Variance in Comparison:** Skin metrics naturally shift when a photo is taken in a dim bedroom vs bright daylight. We built the Comparison Confidence engine to evaluate exposure and resolution variance rather than claiming artificial certainty.
- **Vercel Routing:** Ensuring single-page application (SPA) rewrite rules did not intercept the `/api/scan` serverless route.

---

### Accomplishments That We're Proud Of
- A genuinely functional, end-to-end integration with Perfect Corp's YouCam Skin AI API.
- The **Skin Truth Check** and **Comparison Confidence** features that bring genuine honesty to beauty-tech.
- A distinctive editorial design that feels like a calm beauty lab and modern publication rather than a generic SaaS template.
- 100% strict TypeScript compliance with zero warnings or errors.

---

### What We Learned
- The operational workflow of asynchronous computer-vision APIs (media staging $\rightarrow$ binary upload $\rightarrow$ task initiation $\rightarrow$ status polling).
- The nuances of dermal diagnostics and the importance of contextualizing scores for consumer well-being.
- Building privacy-first architectures where user portraits are never permanently stored in cloud databases.

---

### What's Next for LEKHA
- Multi-week routine compliance tracking to correlate specific skincare products with metric improvements.
- Advanced ambient light calibration using device light sensors.
- Optional eCommerce virtual try-on (VTO) integration for recommended tinted mineral sunscreens and lip care.

---

### Built With
- `react`
- `typescript`
- `vite`
- `tailwindcss`
- `youcam-skin-ai-api`
- `perfect-corp`
- `nodejs`
- `vercel`

---

### Submission Links & Assets Checklist
- [x] **Public GitHub Repository:** `https://github.com/amuisaddiction/LEKHA`
- [x] **Live Demo URL:** https://lekha-xi.vercel.app
- [ ] **Public Demo Video:** YouTube / Vimeo link
- [x] **Screenshots:** 9 comprehensive production application views generated in docs/screenshots/
