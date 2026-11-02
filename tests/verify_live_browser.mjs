import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const executablePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
console.log('Using browser binary:', executablePath);

const SCREENSHOT_DIR = path.resolve('docs/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runOfficialVerification() {
  const audit = {
    productionUrl: 'https://lekha-xi.vercel.app',
    verifiedCommit: '822d91b',
    browserEngine: 'Google Chrome Headless (CDP)',
    timestamp: new Date().toISOString(),
    sections: {},
    screenshots: []
  };

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1440,1200'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('1. Loading live deployment: https://lekha-xi.vercel.app (hard reload)...');
    await page.goto('https://lekha-xi.vercel.app', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.reload({ waitUntil: 'networkidle2' });

    // -------------------------------------------------------------
    // Section 1: Landing Hero
    // -------------------------------------------------------------
    const heroH1 = await page.$eval('h1', el => el.innerText.trim()).catch(() => '');
    const heroButtons = await page.evaluate(() => {
      const hero = document.querySelector('section.hero');
      return hero ? Array.from(hero.querySelectorAll('button')).map(b => b.innerText.trim()) : [];
    });

    audit.sections['Landing Hero'] = {
      status: heroH1.toLowerCase().includes('skin') ? 'PASS' : 'FAIL',
      headline: heroH1.replace(/\n/g, ' '),
      ctaButtons: heroButtons,
      customIllustrationPresent: await page.$eval('section.hero svg', el => !!el).catch(() => false)
    };

    const shot1 = path.join(SCREENSHOT_DIR, 'live_01_hero_desktop.png');
    await page.screenshot({ path: shot1 });
    audit.screenshots.push({ file: 'live_01_hero_desktop.png', size: fs.statSync(shot1).size });

    // -------------------------------------------------------------
    // Section 2: Eight Skin Concern Cards & Interactive Drawer
    // -------------------------------------------------------------
    console.log('2. Inspecting Eight Skin Concern Cards...');
    await page.evaluate(() => {
      const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.innerText.includes('observed in detail'));
      if (h2) h2.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    const concernCards = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('section:nth-of-type(3) .cursor-pointer'));
      return cards.map(c => {
        const titleEl = c.querySelector('h3');
        const badgeEl = c.querySelector('.font-mono');
        const descEl = c.querySelector('p');
        const imgEl = c.querySelector('img');
        return {
          title: titleEl ? titleEl.innerText.trim() : '',
          category: badgeEl ? badgeEl.innerText.trim() : '',
          description: descEl ? descEl.innerText.trim() : '',
          hasImage: !!imgEl && !!imgEl.src
        };
      });
    });

    // Test clicking the 1st concern card to open drawer
    let drawerData = null;
    const firstCard = (await page.$$('section:nth-of-type(3) .cursor-pointer'))[0];
    if (firstCard) {
      await firstCard.click();
      await new Promise(r => setTimeout(r, 500));
      drawerData = await page.evaluate(() => {
        const drawer = document.querySelector('section:nth-of-type(3) .border-\\[\\#8e3b5a\\]');
        if (!drawer) return null;
        const h4 = drawer.querySelector('h4');
        const p = drawer.querySelector('p');
        return {
          title: h4 ? h4.innerText.trim() : '',
          detail: p ? p.innerText.trim() : ''
        };
      });
    }

    audit.sections['Eight Skin Concern Cards'] = {
      status: concernCards.length === 8 && !!drawerData ? 'PASS' : 'FAIL',
      count: concernCards.length,
      cards: concernCards.map(c => ({ title: c.title, category: c.category })),
      drawerInteractive: !!drawerData,
      activeDrawerTitle: drawerData ? drawerData.title : null
    };

    const shot2 = path.join(SCREENSHOT_DIR, 'live_02_skin_concerns.png');
    await page.screenshot({ path: shot2 });
    audit.screenshots.push({ file: 'live_02_skin_concerns.png', size: fs.statSync(shot2).size });

    // -------------------------------------------------------------
    // Section 3: Plum Editorial Campaign Section
    // -------------------------------------------------------------
    console.log('3. Inspecting Plum Editorial Campaign Section...');
    await page.evaluate(() => {
      const plum = document.querySelector('section.bg-\\[\\#3a1f2e\\]');
      if (plum) plum.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    const plumDetails = await page.evaluate(() => {
      const plum = document.querySelector('section.bg-\\[\\#3a1f2e\\]');
      if (!plum) return null;
      const h2 = plum.querySelector('h2');
      const img = plum.querySelector('img');
      const pillars = Array.from(plum.querySelectorAll('.border-t b')).map(b => b.innerText.trim());
      return {
        headline: h2 ? h2.innerText.trim().replace(/\n/g, ' ') : '',
        portraitSrc: img ? img.src : null,
        pillars
      };
    });

    audit.sections['Plum Editorial Campaign'] = {
      status: plumDetails && plumDetails.portraitSrc && plumDetails.pillars.length === 3 ? 'PASS' : 'FAIL',
      headline: plumDetails ? plumDetails.headline : null,
      pillars: plumDetails ? plumDetails.pillars : [],
      editorialPortraitVerified: !!plumDetails?.portraitSrc
    };

    const shot3 = path.join(SCREENSHOT_DIR, 'live_03_plum_campaign.png');
    await page.screenshot({ path: shot3 });
    audit.screenshots.push({ file: 'live_03_plum_campaign.png', size: fs.statSync(shot3).size });

    // -------------------------------------------------------------
    // Section 4: AM & PM Skincare Rituals & Tab Toggle
    // -------------------------------------------------------------
    console.log('4. Inspecting AM & PM Skincare Rituals...');
    await page.evaluate(() => {
      const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.innerText.includes('informed by data'));
      if (h2) h2.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    const amProducts = await page.evaluate(() => {
      const ritualSection = document.querySelector('section.bg-\\[\\#faf1ee\\]');
      if (!ritualSection) return [];
      return Array.from(ritualSection.querySelectorAll('h3')).map(h => h.innerText.trim());
    });

    const shot4Am = path.join(SCREENSHOT_DIR, 'live_04_skincare_rituals_am.png');
    await page.screenshot({ path: shot4Am });
    audit.screenshots.push({ file: 'live_04_skincare_rituals_am.png', size: fs.statSync(shot4Am).size });

    // Click PM Toggle
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.innerText.toLowerCase().includes('pm ritual'));
      if (target) target.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const pmProducts = await page.evaluate(() => {
      const ritualSection = document.querySelector('section.bg-\\[\\#faf1ee\\]');
      if (!ritualSection) return [];
      return Array.from(ritualSection.querySelectorAll('h3')).map(h => h.innerText.trim());
    });

    const hasNightCream = pmProducts.some(p => p.toLowerCase().includes('night cream'));
    audit.sections['Skincare Rituals AM/PM'] = {
      status: amProducts.length === 4 && pmProducts.length === 4 && hasNightCream ? 'PASS' : 'FAIL',
      amProducts,
      pmProducts,
      interactiveToggleWorking: hasNightCream && pmProducts.some(p => p.includes('Night Cream')),
      nightCreamPresent: hasNightCream
    };

    const shot5Pm = path.join(SCREENSHOT_DIR, 'live_05_skincare_rituals_pm.png');
    await page.screenshot({ path: shot5Pm });
    audit.screenshots.push({ file: 'live_05_skincare_rituals_pm.png', size: fs.statSync(shot5Pm).size });

    // -------------------------------------------------------------
    // Section 5: Skin Passport Navigation & Timeline Ledger
    // -------------------------------------------------------------
    console.log('5. Navigating to Skin Passport via Header...');
    await page.evaluate(() => {
      const passBtn = Array.from(document.querySelectorAll('nav button, header button')).find(b => b.innerText.includes('Passport'));
      if (passBtn) passBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const passportReport = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const demoBanner = document.querySelector('.bg-\\[\\#fdf2ef\\]');
      const dates = Array.from(document.querySelectorAll('.space-y-8 .font-mono'))
        .map(el => el.innerText.trim())
        .filter(t => t.includes('2026') || t.includes('OCT') || t.includes('NOV'));
      const cards = document.querySelectorAll('.space-y-8 .bg-\\[\\#fffaf7\\]').length;
      const chips = document.querySelectorAll('.bg-\\[\\#faf1ee\\]').length;
      return {
        h1: h1 ? h1.innerText.trim() : '',
        hasDemoNotice: !!demoBanner && demoBanner.innerText.includes('Sample Progress Walkthrough'),
        cardsCount: cards,
        dates,
        chipsCount: chips
      };
    });

    audit.sections['Skin Passport'] = {
      status: passportReport.h1.includes('Skin Passport') && passportReport.hasDemoNotice && passportReport.cardsCount === 2 ? 'PASS' : 'FAIL',
      title: passportReport.h1,
      demoWalkthroughNoticeVisible: passportReport.hasDemoNotice,
      timelineCardsRendered: passportReport.cardsCount,
      timelineDates: passportReport.dates,
      metricChipsCount: passportReport.chipsCount
    };

    const shot6Passport = path.join(SCREENSHOT_DIR, 'live_06_passport_timeline.png');
    await page.screenshot({ path: shot6Passport });
    audit.screenshots.push({ file: 'live_06_passport_timeline.png', size: fs.statSync(shot6Passport).size });

    // -------------------------------------------------------------
    // Section 6: Compare Studio Navigation & Dual Portraits
    // -------------------------------------------------------------
    console.log('6. Navigating to Compare Studio via Header...');
    await page.evaluate(() => {
      const compBtn = Array.from(document.querySelectorAll('nav button, header button')).find(b => b.innerText.includes('Compare'));
      if (compBtn) compBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const compareReport = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const demoBanner = document.querySelector('.bg-\\[\\#fdf2ef\\]');
      const portraits = Array.from(document.querySelectorAll('.aspect-\\[3\\/4\\] img')).map(img => img.src);
      const confidenceCard = document.querySelector('.bg-\\[\\#fdf8f6\\]');
      const parameterCards = Array.from(document.querySelectorAll('.bg-\\[\\#fffaf7\\] h4')).map(h => h.innerText.trim());
      return {
        h1: h1 ? h1.innerText.trim() : '',
        hasDemoNotice: !!demoBanner && demoBanner.innerText.includes('Sample Comparison Walkthrough'),
        portraitsCount: portraits.length,
        confidenceCardPresent: !!confidenceCard,
        confidenceCardSnippet: confidenceCard ? confidenceCard.innerText.slice(0, 100).replace(/\n/g, ' ') : null,
        parameterShiftsCount: parameterCards.length
      };
    });

    audit.sections['Compare Studio'] = {
      status: compareReport.h1.includes('Skin Comparison') && compareReport.hasDemoNotice && compareReport.portraitsCount === 2 && compareReport.confidenceCardPresent ? 'PASS' : 'FAIL',
      title: compareReport.h1,
      demoWalkthroughNoticeVisible: compareReport.hasDemoNotice,
      dualPortraitsVerified: compareReport.portraitsCount === 2,
      confidenceCardPresent: compareReport.confidenceCardPresent,
      confidenceCardSnippet: compareReport.confidenceCardSnippet,
      parameterShiftsCount: compareReport.parameterShiftsCount
    };

    const shot7Compare = path.join(SCREENSHOT_DIR, 'live_07_compare_studio.png');
    await page.screenshot({ path: shot7Compare });
    audit.screenshots.push({ file: 'live_07_compare_studio.png', size: fs.statSync(shot7Compare).size });

    // -------------------------------------------------------------
    // Section 7: Mobile Viewport Verification (390px)
    // -------------------------------------------------------------
    console.log('7. Testing Mobile Viewport at 390px...');
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => {
      const logo = Array.from(document.querySelectorAll('header span, header button')).find(b => b.innerText.includes('LEKHA'));
      if (logo) logo.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const mobileHeroOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    const shot8MobileHero = path.join(SCREENSHOT_DIR, 'live_08_mobile_390px_landing.png');
    await page.screenshot({ path: shot8MobileHero });
    audit.screenshots.push({ file: 'live_08_mobile_390px_landing.png', size: fs.statSync(shot8MobileHero).size });

    await page.evaluate(() => window.scrollBy(0, 1100));
    await new Promise(r => setTimeout(r, 600));

    const mobileConcernsOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    const shot9MobileConcerns = path.join(SCREENSHOT_DIR, 'live_09_mobile_390px_concerns.png');
    await page.screenshot({ path: shot9MobileConcerns });
    audit.screenshots.push({ file: 'live_09_mobile_390px_concerns.png', size: fs.statSync(shot9MobileConcerns).size });

    audit.sections['Mobile Responsiveness (390px)'] = {
      status: !mobileHeroOverflow && !mobileConcernsOverflow ? 'PASS' : 'FAIL',
      viewportWidth: 390,
      viewportHeight: 844,
      horizontalOverflowDetected: mobileHeroOverflow || mobileConcernsOverflow
    };

  } finally {
    await browser.close();
  }

  return audit;
}

runOfficialVerification().then(res => {
  console.log('\n================ COMPLETE VERIFICATION RESULTS ================');
  console.log(JSON.stringify(res, null, 2));
  fs.writeFileSync('tests/browser_verification_result.json', JSON.stringify(res, null, 2));
}).catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
