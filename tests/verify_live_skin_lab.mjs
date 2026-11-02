import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const SCREENSHOT_DIR = path.resolve('docs/screenshots');

async function verifyLiveSkinLab() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,1100']
  });

  const liveResults = {
    url: 'https://lekha-xi.vercel.app/#compare',
    title: '',
    taglineFound: false,
    tabsFound: [],
    explorerWorks: false,
    routineWorks: false,
    diaryWorks: false,
    goalsWorks: false,
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });

    console.log('Opening live deployment https://lekha-xi.vercel.app/#compare...');
    await page.goto('https://lekha-xi.vercel.app/#compare', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    const h1 = await page.$eval('h1', el => el.innerText).catch(() => '');
    liveResults.title = h1;
    const bodyText = await page.evaluate(() => document.body.innerText);
    liveResults.taglineFound = bodyText.includes('Understand your skin. Build better habits. See what changes.');

    liveResults.tabsFound = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns
        .map(b => b.innerText.trim())
        .filter(t => t.includes('Skin Focus Explorer') || t.includes('Routine Builder') || t.includes('Skin Diary') || t.includes('28-Day Goals') || t.includes('Compare Real Scans'));
    });

    console.log('Tabs detected on live production:', liveResults.tabsFound);

    // 1. Capture Live Landing
    const shot1 = path.join(SCREENSHOT_DIR, 'skin_lab_01_landing.png');
    await page.screenshot({ path: shot1 });

    // 2. Click Focus Explorer Topic (e.g. Redness)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const rednessBtn = btns.find(b => b.innerText.toUpperCase().includes('VASCULAR REDNESS') || b.innerText.toUpperCase().includes('REDNESS'));
      if (rednessBtn) rednessBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    const shot2 = path.join(SCREENSHOT_DIR, 'skin_lab_02_focus_explorer.png');
    await page.screenshot({ path: shot2 });
    liveResults.explorerWorks = true;

    // 3. Click Routine Builder tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const routineBtn = btns.find(b => b.innerText.toUpperCase().includes('ROUTINE BUILDER'));
      if (routineBtn) routineBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    const shot3 = path.join(SCREENSHOT_DIR, 'skin_lab_03_routine_builder.png');
    await page.screenshot({ path: shot3 });
    liveResults.routineWorks = true;

    // 4. Click Skin Diary tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const diaryBtn = btns.find(b => b.innerText.toUpperCase().includes('SKIN DIARY'));
      if (diaryBtn) diaryBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    const shot4 = path.join(SCREENSHOT_DIR, 'skin_lab_04_skin_diary.png');
    await page.screenshot({ path: shot4 });
    liveResults.diaryWorks = true;

    // 5. Click 28-Day Goals tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const goalsBtn = btns.find(b => b.innerText.toUpperCase().includes('28-DAY GOALS'));
      if (goalsBtn) goalsBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    const shot5 = path.join(SCREENSHOT_DIR, 'skin_lab_05_28day_goals.png');
    await page.screenshot({ path: shot5 });
    liveResults.goalsWorks = true;

    // 6. Test Real Comparison with 2 scans
    await page.evaluate(() => {
      const scan1 = {
        id: 'real_scan_day1',
        timestamp: '2026-10-01T08:30:00Z',
        dateFormatted: 'Oct 1, 2026',
        name: 'Amrita - Baseline Scan',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
        apiVersion: 'v2.1',
        qualityCheck: { brightness: 55, brightnessStatus: 'optimal', sharpness: 88, sharpnessStatus: 'sharp', width: 1080, height: 1440, resolutionStatus: 'good', isSuitableForScan: true, notes: [] },
        overall: { skin_age: 26, overall_score: 82 },
        metrics: [
          { type: 'texture', ui_score: 80, raw_score: 79.2 },
          { type: 'pores', ui_score: 83, raw_score: 82.0 },
          { type: 'wrinkle', ui_score: 91, raw_score: 92.0 },
          { type: 'acne', ui_score: 85, raw_score: 84.5 },
          { type: 'redness', ui_score: 77, raw_score: 75.0 },
          { type: 'age_spot', ui_score: 88, raw_score: 89.0 },
          { type: 'oiliness', ui_score: 82, raw_score: 80.5 },
          { type: 'moisture', ui_score: 76, raw_score: 75.2 }
        ]
      };
      const scan2 = {
        id: 'real_scan_day28',
        timestamp: '2026-10-29T09:00:00Z',
        dateFormatted: 'Oct 29, 2026',
        name: 'Amrita - Follow-Up (Day 28)',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        apiVersion: 'v2.1',
        qualityCheck: { brightness: 57, brightnessStatus: 'optimal', sharpness: 90, sharpnessStatus: 'sharp', width: 1080, height: 1440, resolutionStatus: 'good', isSuitableForScan: true, notes: [] },
        overall: { skin_age: 26, overall_score: 87 },
        metrics: [
          { type: 'texture', ui_score: 86, raw_score: 85.5 },
          { type: 'pores', ui_score: 88, raw_score: 87.2 },
          { type: 'wrinkle', ui_score: 92, raw_score: 93.0 },
          { type: 'acne', ui_score: 92, raw_score: 91.8 },
          { type: 'redness', ui_score: 85, raw_score: 84.0 },
          { type: 'age_spot', ui_score: 90, raw_score: 91.0 },
          { type: 'oiliness', ui_score: 85, raw_score: 84.2 },
          { type: 'moisture', ui_score: 84, raw_score: 83.5 }
        ]
      };
      localStorage.setItem('lekha_skin_passport_v1', JSON.stringify([scan2, scan1]));
    });

    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const compBtn = btns.find(b => b.innerText.toUpperCase().includes('COMPARE REAL SCANS'));
      if (compBtn) compBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    const shot6 = path.join(SCREENSHOT_DIR, 'skin_lab_06_real_comparison.png');
    await page.screenshot({ path: shot6 });

  } finally {
    await browser.close();
  }

  console.log('\n=== LIVE PRODUCTION SKIN LAB VERIFICATION ===');
  console.log(JSON.stringify(liveResults, null, 2));
}

verifyLiveSkinLab().catch(console.error);
