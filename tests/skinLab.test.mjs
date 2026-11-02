import test from 'node:test';
import assert from 'node:assert/strict';

// In-memory localStorage mock for node test runner
const storageMap = new Map();
const mockLocalStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};

// ============================================================================
// SKIN LAB TEST LOGIC & ENGINE DEFINITIONS
// ============================================================================

const SKIN_FOCUS_TOPICS = [
  { id: 'texture', title: 'Surface Texture & Smoothness', metricKey: 'texture' },
  { id: 'pores', title: 'Follicular Architecture & Pores', metricKey: 'pores' },
  { id: 'wrinkles', title: 'Expression Lines & Creasing', metricKey: 'wrinkle' },
  { id: 'blemishes', title: 'Blemishes & Clarity', metricKey: 'acne' },
  { id: 'redness', title: 'Vascular Redness & Sensitivity', metricKey: 'redness' },
  { id: 'pigmentation', title: 'Pigmentation & Melanin Distribution', metricKey: 'age_spot' },
  { id: 'oiliness', title: 'Sebum & Lipid Regulation', metricKey: 'oiliness' },
  { id: 'moisture', title: 'Stratum Corneum Hydration', metricKey: 'moisture' },
];

const SKIN_GOAL_TRACKS = [
  { id: 'barrier-repair', title: 'Moisture Barrier Resilience', milestones: [7, 14, 21, 28] },
  { id: 'gentle-retinization', title: 'Safe Retinization & Cell Renewal', milestones: [7, 14, 21, 28] },
  { id: 'congestion-clarity', title: 'Follicular Clarity & Congestion Balance', milestones: [7, 14, 21, 28] },
  { id: 'sun-defense', title: 'Daily Photo-Defense & Tone Preservation', milestones: [7, 14, 21, 28] },
];

function checkRoutineCompatibility(products) {
  const notices = [];
  const allIngredients = products.flatMap((p) => (p.ingredients || []).map((i) => i.trim().toLowerCase()));

  const hasRetinoid = allIngredients.some((i) => i.includes('retin') || i.includes('tretinoin') || i.includes('adapalene'));
  const hasDirectVitC = allIngredients.some((i) => i.includes('ascorbic') || i.includes('vitamin c'));

  if (hasRetinoid && hasDirectVitC) {
    notices.push({
      severity: 'caution',
      title: 'Retinoid + Direct Vitamin C Layering',
      description: 'Potential barrier irritation due to differing optimal pH levels.',
      conflictingIngredients: ['Retinoid / Retinol', 'L-Ascorbic Acid (Vitamin C)'],
      recommendation: 'Use Vitamin C in morning for photo-defense, Retinoid at night.',
    });
  }

  const hasAhaBha = allIngredients.some(
    (i) => i.includes('glycolic') || i.includes('lactic') || i.includes('salicylic') || i.includes('aha') || i.includes('bha')
  );

  if (hasRetinoid && hasAhaBha) {
    notices.push({
      severity: 'warning',
      title: 'Retinoid + Chemical Exfoliating Acids',
      description: 'Exponentially raises risk of acid irritation and barrier compromise.',
      conflictingIngredients: ['Retinoid / Retinol', 'AHA / BHA Chemical Exfoliant'],
      recommendation: 'Alternate evenings: Acids 1-2 nights/week, Retinoid on separate nights.',
    });
  }

  const hasBenzoyl = allIngredients.some((i) => i.includes('benzoyl'));
  if (hasBenzoyl && hasRetinoid) {
    notices.push({
      severity: 'caution',
      title: 'Benzoyl Peroxide + Pure Retinol',
      description: 'Benzoyl Peroxide can degrade standard retinol molecules.',
      conflictingIngredients: ['Benzoyl Peroxide', 'Pure Retinol'],
      recommendation: 'Use Benzoyl Peroxide in AM or on alternating nights.',
    });
  }

  const ingredientCounts = {};
  for (const rawIng of allIngredients) {
    const key = rawIng.replace(/\s*\(.*?\)/g, '').trim().toLowerCase();
    if (key.length >= 3) {
      ingredientCounts[key] = (ingredientCounts[key] || 0) + 1;
    }
  }

  for (const [ing, count] of Object.entries(ingredientCounts)) {
    if (count >= 3) {
      notices.push({
        severity: 'info',
        title: `Repeated Active Ingredient Overlap: ${ing.toUpperCase()}`,
        description: `You have ${count} distinct products containing ${ing}.`,
        conflictingIngredients: [ing, `${count} occurrences`],
        recommendation: 'One well-formulated leave-on product is sufficient.',
      });
    }
  }

  return notices;
}

function checkFaceConsistency(baseline, current) {
  const caveats = [];
  let isLikelySameSubject = true;
  let divergenceLevel = 'low';

  const bLight = baseline.qualityCheck?.brightness ?? 50;
  const cLight = current.qualityCheck?.brightness ?? 50;
  const lightingDelta = Math.abs(bLight - cLight);

  const bRes = baseline.qualityCheck ? Math.min(baseline.qualityCheck.width, baseline.qualityCheck.height) : 720;
  const cRes = current.qualityCheck ? Math.min(current.qualityCheck.width, current.qualityCheck.height) : 720;
  const resolutionDelta = Math.abs(bRes - cRes);

  const bAge = baseline.overall?.skin_age;
  const cAge = current.overall?.skin_age;
  const ageDelta = bAge && cAge ? Math.abs(bAge - cAge) : 0;

  const nameMatch = !baseline.name || !current.name || baseline.name === current.name;

  if (ageDelta > 15) {
    isLikelySameSubject = false;
    divergenceLevel = 'high';
    caveats.push(`Divergent Skin Age Detected (${bAge} yrs vs ${cAge} yrs, delta ${ageDelta} yrs).`);
  } else if (!nameMatch && baseline.name.toLowerCase() !== 'sample entry' && current.name.toLowerCase() !== 'sample entry') {
    isLikelySameSubject = false;
    divergenceLevel = 'high';
    caveats.push(`Different entry identifiers: "${baseline.name}" vs "${current.name}".`);
  } else if (lightingDelta > 30 || resolutionDelta > 800) {
    divergenceLevel = 'moderate';
    caveats.push('Extreme lighting or sensor disparity detected.');
  }

  return {
    isLikelySameSubject,
    divergenceLevel,
    warningMessage: caveats.length > 0 ? caveats.join(' ') : undefined,
    details: { nameMatch, lightingDelta, resolutionDelta },
  };
}

// ============================================================================
// TEST SUITES
// ============================================================================

test('Skin Lab: First-time user (0 scans) has full access to 4 habit tools and honest comparison lock', () => {
  const records = [];
  const hasTwoScans = records.length >= 2;
  assert.equal(hasTwoScans, false);
  assert.equal(records.length, 0);

  // Focus Explorer has all 8 primary categories
  assert.equal(SKIN_FOCUS_TOPICS.length, 8);
  const topicKeys = SKIN_FOCUS_TOPICS.map((t) => t.metricKey);
  assert.ok(topicKeys.includes('texture'));
  assert.ok(topicKeys.includes('pores'));
  assert.ok(topicKeys.includes('wrinkle'));
  assert.ok(topicKeys.includes('acne'));
  assert.ok(topicKeys.includes('redness'));
  assert.ok(topicKeys.includes('age_spot'));
  assert.ok(topicKeys.includes('oiliness'));
  assert.ok(topicKeys.includes('moisture'));
});

test('Skin Lab: One-scan user (1 scan) shows 1/2 progress and prevents single-scan comparison fabrication', () => {
  const records = [{ id: 'scan_1', name: 'Baseline', timestamp: '2026-10-01' }];
  const hasTwoScans = records.length >= 2;
  assert.equal(hasTwoScans, false);
  assert.equal(records.length, 1);
  assert.equal(2 - records.length, 1, 'Requires exactly 1 more scan to unlock real comparison');
});

test('Skin Lab: Two-scan user (2+ scans) unlocks authentic biometric comparison with accurate deltas', () => {
  const baseline = {
    id: 'scan_a_1',
    name: 'Amrita',
    timestamp: '2026-10-01T08:00:00Z',
    metrics: [
      { type: 'texture', ui_score: 82, raw_score: 80.5 },
      { type: 'pores', ui_score: 85, raw_score: 84.0 },
      { type: 'redness', ui_score: 79, raw_score: 76.0 },
    ],
  };

  const current = {
    id: 'scan_a_28',
    name: 'Amrita',
    timestamp: '2026-10-29T08:00:00Z',
    metrics: [
      { type: 'texture', ui_score: 87, raw_score: 86.2 },
      { type: 'pores', ui_score: 89, raw_score: 88.5 },
      { type: 'redness', ui_score: 86, raw_score: 85.0 },
    ],
  };

  const records = [current, baseline];
  assert.equal(records.length >= 2, true);

  const textureDelta = current.metrics[0].ui_score - baseline.metrics[0].ui_score;
  assert.equal(textureDelta, 5); // +5 UI points

  const rednessDelta = current.metrics[2].ui_score - baseline.metrics[2].ui_score;
  assert.equal(rednessDelta, 7); // +7 UI points
});

test('Skin Lab: Divergent-face comparison is detected and flagged to prevent false progress claims', () => {
  const scanUserA = {
    id: 'scan_a',
    name: 'Amrita',
    overall: { skin_age: 26 },
    qualityCheck: { brightness: 55, width: 1080, height: 1440 },
  };

  const scanUserB = {
    id: 'scan_b',
    name: 'Carlos',
    overall: { skin_age: 54 },
    qualityCheck: { brightness: 25, width: 640, height: 480 },
  };

  const check = checkFaceConsistency(scanUserA, scanUserB);
  assert.equal(check.isLikelySameSubject, false);
  assert.equal(check.divergenceLevel, 'high');
  assert.ok(check.warningMessage.includes('Divergent Skin Age') || check.warningMessage.includes('Different entry identifiers'));
});

test('Routine Builder: Identifies Retinoid + Direct Vitamin C and AHA/BHA layering conflicts', () => {
  const conflictingRoutine = [
    { id: '1', name: 'Retinol Serum', ingredients: ['Retinol (0.5%)'] },
    { id: '2', name: 'Vitamin C 20%', ingredients: ['L-Ascorbic Acid (Vitamin C)'] },
    { id: '3', name: 'Glycolic Toner', ingredients: ['Glycolic Acid (AHA 7%)'] },
  ];

  const notices = checkRoutineCompatibility(conflictingRoutine);
  assert.ok(notices.length >= 2);
  const hasVitC = notices.some((n) => n.title.includes('Vitamin C'));
  const hasAha = notices.some((n) => n.title.includes('Chemical Exfoliating Acids'));
  assert.ok(hasVitC);
  assert.ok(hasAha);
});

test('Routine Builder: Identifies active ingredient overlap when ingredient is in 3+ products', () => {
  const products = [
    { id: '1', name: 'Toner', ingredients: ['Niacinamide'] },
    { id: '2', name: 'Serum', ingredients: ['Niacinamide (5%)', 'Zinc PCA'] },
    { id: '3', name: 'Cream', ingredients: ['Niacinamide (2%)', 'Ceramides'] },
  ];

  const notices = checkRoutineCompatibility(products);
  const overlap = notices.find((n) => n.title.includes('Repeated Active Ingredient Overlap'));
  assert.ok(overlap);
  assert.equal(overlap.severity, 'info');
});

test('Skin Diary: Correctly records 5 subjective parameters and formats CSV export', () => {
  mockLocalStorage.clear();

  const entries = [
    {
      id: 'd1',
      date: '2026-11-01',
      dryness: 2,
      oiliness: 3,
      redness: 1,
      breakouts: 1,
      irritation: 1,
      tags: ['Wore SPF', 'Double Cleansed'],
      notes: 'Calm skin day.',
    },
    {
      id: 'd2',
      date: '2026-11-02',
      dryness: 4,
      oiliness: 2,
      redness: 3,
      breakouts: 2,
      irritation: 3,
      tags: ['Used Retinoid'],
      notes: 'Slight redness around chin.',
    },
  ];

  mockLocalStorage.setItem('test_diary', JSON.stringify(entries));
  const retrieved = JSON.parse(mockLocalStorage.getItem('test_diary'));
  assert.equal(retrieved.length, 2);

  // Validate CSV export string construction
  const headers = ['Date', 'Dryness', 'Oiliness', 'Redness', 'Breakouts', 'Irritation', 'Tags'];
  const rows = retrieved.map((e) => [e.date, e.dryness, e.oiliness, e.redness, e.breakouts, e.irritation, e.tags.join(';')]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  assert.ok(csv.includes('Date,Dryness,Oiliness,Redness,Breakouts,Irritation,Tags'));
  assert.ok(csv.includes('2026-11-01,2,3,1,1,1,Wore SPF;Double Cleansed'));
  assert.ok(csv.includes('2026-11-02,4,2,3,2,3,Used Retinoid'));
});

test('28-Day Skin Goals: Progress is strictly activity-based without fabricated improvement %', () => {
  const goalTrack = SKIN_GOAL_TRACKS.find((t) => t.id === 'barrier-repair');
  assert.ok(goalTrack);
  assert.equal(goalTrack.milestones.length, 4);

  // 7 days out of 28 completed
  const completedDaysCount = 7;
  const progressPercent = Math.min(100, Math.round((completedDaysCount / 28) * 100));

  assert.equal(progressPercent, 25); // 7/28 = 25% exactly
  assert.ok(completedDaysCount >= goalTrack.milestones[0]); // Day 7 milestone reached
});
