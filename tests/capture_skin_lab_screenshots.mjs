import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const SCREENSHOT_DIR = path.resolve('docs/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('1. Starting local Vite preview server on port 4173...');
  const previewProcess = spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
    shell: true,
    stdio: 'ignore'
  });

  // Give server 3 seconds to spin up
  await new Promise(r => setTimeout(r, 3000));

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,1100']
  });

  const captured = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });

    console.log('2. Navigating to Skin Lab (first-time user, 0 scans)...');
    await page.goto('http://127.0.0.1:4173/#compare', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // A. Screenshot 1: Skin Lab Landing (First-time user view)
    const shot1 = path.join(SCREENSHOT_DIR, 'skin_lab_01_landing.png');
    await page.screenshot({ path: shot1 });
    captured.push({ name: 'skin_lab_01_landing.png', size: fs.statSync(shot1).size });
    console.log('Saved:', shot1);

    // B. Screenshot 2: Skin Focus Explorer (Selected Pores / Architecture)
    console.log('3. Interacting with Skin Focus Explorer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const poresBtn = buttons.find(b => b.innerText.includes('FOLLICULAR') || b.innerText.includes('PORES'));
      if (poresBtn) poresBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const shot2 = path.join(SCREENSHOT_DIR, 'skin_lab_02_focus_explorer.png');
    await page.screenshot({ path: shot2 });
    captured.push({ name: 'skin_lab_02_focus_explorer.png', size: fs.statSync(shot2).size });
    console.log('Saved:', shot2);

    // C. Screenshot 3: Routine Builder
    console.log('4. Navigating to Routine Builder...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const routineTab = tabs.find(b => b.innerText.includes('ROUTINE BUILDER'));
      if (routineTab) routineTab.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Switch to PM Routine tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pmBtn = buttons.find(b => b.innerText.includes('PM ROUTINE'));
      if (pmBtn) pmBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const shot3 = path.join(SCREENSHOT_DIR, 'skin_lab_03_routine_builder.png');
    await page.screenshot({ path: shot3 });
    captured.push({ name: 'skin_lab_03_routine_builder.png', size: fs.statSync(shot3).size });
    console.log('Saved:', shot3);

    // D. Screenshot 4: Skin Diary
    console.log('5. Navigating to Skin Diary & Submitting an Entry...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const diaryTab = tabs.find(b => b.innerText.includes('SKIN DIARY'));
      if (diaryTab) diaryTab.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Submit a check-in entry
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('SAVE DAILY ENTRY'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const shot4 = path.join(SCREENSHOT_DIR, 'skin_lab_04_skin_diary.png');
    await page.screenshot({ path: shot4 });
    captured.push({ name: 'skin_lab_04_skin_diary.png', size: fs.statSync(shot4).size });
    console.log('Saved:', shot4);

    // E. Screenshot 5: 28-Day Skin Goals
    console.log('6. Navigating to 28-Day Skin Goals...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const goalsTab = tabs.find(b => b.innerText.includes('28-DAY GOALS'));
      if (goalsTab) goalsTab.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Check off 2 habits for today
    await page.evaluate(() => {
      const habitItems = Array.from(document.querySelectorAll('.cursor-pointer'));
      if (habitItems[4]) habitItems[4].click();
      if (habitItems[5]) habitItems[5].click();
    });
    await new Promise(r => setTimeout(r, 600));

    const shot5 = path.join(SCREENSHOT_DIR, 'skin_lab_05_28day_goals.png');
    await page.screenshot({ path: shot5 });
    captured.push({ name: 'skin_lab_05_28day_goals.png', size: fs.statSync(shot5).size });
    console.log('Saved:', shot5);

    // F. Screenshot 6: Real Scan Comparison (with 2 genuine scans injected into localStorage)
    console.log('7. Injecting 2 genuine scans into localStorage to test unlocked Real Comparison...');
    await page.evaluate(() => {
      const scan1 = {
        id: 'real_scan_day1',
        timestamp: '2026-10-01T08:30:00Z',
        dateFormatted: 'Oct 1, 2026',
        name: 'Amrita - Baseline Scan',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
        apiVersion: 'v2.1',
        qualityCheck: {
          brightness: 55,
          brightnessStatus: 'optimal',
          sharpness: 88,
          sharpnessStatus: 'sharp',
          width: 1080,
          height: 1440,
          resolutionStatus: 'good',
          isSuitableForScan: true,
          notes: []
        },
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
        qualityCheck: {
          brightness: 57,
          brightnessStatus: 'optimal',
          sharpness: 90,
          sharpnessStatus: 'sharp',
          width: 1080,
          height: 1440,
          resolutionStatus: 'good',
          isSuitableForScan: true,
          notes: []
        },
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

    // Reload page to pick up the 2 scans from localStorage
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Click "Compare Real Scans" tab
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const compareTab = tabs.find(b => b.innerText.includes('COMPARE REAL SCANS'));
      if (compareTab) compareTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    const shot6 = path.join(SCREENSHOT_DIR, 'skin_lab_06_real_comparison.png');
    await page.screenshot({ path: shot6 });
    captured.push({ name: 'skin_lab_06_real_comparison.png', size: fs.statSync(shot6).size });
    console.log('Saved:', shot6);

  } finally {
    await browser.close();
    previewProcess.kill();
    try {
      process.kill(previewProcess.pid);
    } catch (e) {}
  }

  console.log('\n=== CAPTURED SCREENSHOTS ===');
  console.log(JSON.stringify(captured, null, 2));
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
