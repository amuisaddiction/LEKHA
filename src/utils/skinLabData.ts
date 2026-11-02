import type {
  SkinFocusTopic,
  SkinGoalTrack,
  CustomRoutineProduct,
  UserRoutine,
  CompatibilityNotice,
  FaceConsistencyCheck,
} from '../types/skinLab';
import type { SkinScanRecord } from '../types/skin';

// ============================================================================
// 1. SKIN FOCUS EXPLORER: 8 CORE DIMENSIONS
// ============================================================================
export const SKIN_FOCUS_TOPICS: SkinFocusTopic[] = [
  {
    id: 'texture',
    title: 'Surface Texture & Smoothness',
    metricKey: 'texture',
    categoryBadge: 'SURFACE EPIDERMIS',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    simpleExplanation:
      'Texture describes the micro-topography of your stratum corneum. When skin sheds dead cells evenly and retains water, light bounces off smoothly. Inconsistent cellular shedding leads to micro-roughness and dullness.',
    selfObservationCues: [
      'Gently sweep clean fingertips across your cheek after washing. Does it feel smooth like silk or sandpapery?',
      'Check if foundation or tinted cream catches or clings around dry patches.',
      'Notice if light reflects as a diffuse soft sheen or scatters across bumpy zones.',
    ],
    dailyTrackingSuggestion:
      'Evaluate your skin 10 minutes post-cleanse before applying serums. Morning light highlights textural roughness best.',
    ingredientsToLookFor: ['Lactic Acid', 'Polyhydroxy Acids (PHA)', 'Urea (2-5%)', 'Glycerin', 'Ceramide NP'],
    scientificContext:
      'YouCam detects shadow variance across cellular micro-relief. Clinically, cellular turnover averages 28 to 40 days in adults.',
  },
  {
    id: 'pores',
    title: 'Follicular Architecture & Pores',
    metricKey: 'pores',
    categoryBadge: 'PILOSEBACEOUS OPENINGS',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    simpleExplanation:
      'Pores are natural openings for hair follicles and oil glands. They do not have muscles and cannot physically "open" or "close," but sebum buildup and collagen slackening can make them appear enlarged or darker.',
    selfObservationCues: [
      'Observe your medial cheeks and nose in diffuse daylight from arm’s length.',
      'Check if pores look darker in the afternoon (oxidized sebum) versus morning.',
      'Feel if the area around the nose feels raised or congested to the touch.',
    ],
    dailyTrackingSuggestion:
      'Track pore appearance in the evening prior to double cleansing to gauge daily oil and sunscreen accumulation.',
    ingredientsToLookFor: ['Salicylic Acid (BHA 1-2%)', 'Niacinamide (2-5%)', 'Zinc PCA', 'Green Tea Extract (EGCG)'],
    scientificContext:
      'Optical algorithms measure circumference and contrast. Sebum clearing restores apparent pore refinement.',
  },
  {
    id: 'wrinkles',
    title: 'Expression Lines & Creasing',
    metricKey: 'wrinkle',
    categoryBadge: 'DERMAL ELASTICITY',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    simpleExplanation:
      'Fine lines start as temporary dehydration creases and dynamic expression folds. Over time, UV exposure and natural collagen loss turn temporary movement lines into permanent resting creases.',
    selfObservationCues: [
      'Look at your forehead or smile lines in resting neutral expression versus after smiling.',
      'Press gently upward on your cheek: do you see fine horizontal micro-creases (often dehydrated skin)?',
      'Notice whether lines soften 20 minutes after applying a hydrating cream.',
    ],
    dailyTrackingSuggestion:
      'Inspect expression zones midday. If lines deepen noticeably as the day progresses, your skin barrier is losing water (TEWL).',
    ingredientsToLookFor: ['Retinaldehyde / Retinol', 'Matrixyl 3000 / Peptides', 'Hyaluronic Acid Multi-Weight', 'Adenosine'],
    scientificContext:
      'Engine measures depth gradients and shadow line frequencies across the peri-orbital and forehead regions.',
  },
  {
    id: 'blemishes',
    title: 'Blemishes & Clarity',
    metricKey: 'acne',
    categoryBadge: 'FOLLICULAR CLARITY',
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9e07f2b?auto=format&fit=crop&w=800&q=80',
    simpleExplanation:
      'Breakouts occur when sebum mixes with dead corneocytes inside a follicle, creating a micro-plug where Cutibacterium acnes can proliferate, triggering local immune inflammation and redness.',
    selfObservationCues: [
      'Feel for subterranean tenderness before a visible head emerges.',
      'Track if breakouts cluster along the jawline (often hormonal), cheeks (pillow/phone friction), or T-zone (excess sebum).',
      'Distinguish between active swollen papules and flat pink post-inflammatory marks (PIE).',
    ],
    dailyTrackingSuggestion:
      'Perform a nightly count of active tender spots versus calming, healing flat marks to document clear direction.',
    ingredientsToLookFor: ['Azelaic Acid (10-15%)', 'Salicylic Acid', 'Colloidal Sulfur', 'Centella Asiatica (Madecassoside)'],
    scientificContext:
      'Computer vision identifies circular erythema boundaries and raised hyper-reflective papule points.',
  },
  {
    id: 'redness',
    title: 'Vascular Redness & Sensitivity',
    metricKey: 'redness',
    categoryBadge: 'MICRO-VASCULAR RESPONSE',
    imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    simpleExplanation:
      'Facial redness is caused by dilated micro-capillaries near the surface. A compromised lipid barrier lets irritants penetrate deeper, triggering vascular dilation, transient flushing, or persistent erythema.',
    selfObservationCues: [
      'Notice if your skin flushes after warm showers, hot coffee, spicy foods, or temperature changes.',
      'Check for a persistent butterfly pattern across nose and cheeks versus scattered blotchiness.',
      'Pay attention to stinging sensations when applying basic, non-active moisturizers.',
    ],
    dailyTrackingSuggestion:
      'Log redness immediately upon waking. Morning redness without external triggers indicates impaired overnight barrier repair.',
    ingredientsToLookFor: ['Centella Asiatica', 'Panthenol (Vitamin B5)', 'Allantoin', 'Ectoin', 'Bisabolol'],
    scientificContext:
      'Detects hemoglobin absorption signatures in the green/red optical spectrum to quantify erythema density.',
  },
  {
    id: 'pigmentation',
    title: 'Pigmentation & Melanin Distribution',
    metricKey: 'age_spot',
    categoryBadge: 'MELANIN UNIFORMITY',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    simpleExplanation:
      'Melanocytes produce pigment to shield cell nuclei from ultraviolet radiation. Sun exposure, hormonal shifts (melasma), and past inflammation (PIH) lead to localized clusters of excess melanin.',
    selfObservationCues: [
      'Look for discrete freckle-like spots with sharp borders (solar lentigines).',
      'Check for symmetrical, soft-bordered map-like patches on upper cheeks or forehead (melasma patterns).',
      'Notice if past blemish marks turn brownish rather than pink over weeks.',
    ],
    dailyTrackingSuggestion:
      'Compare spot darkness on Monday morning versus Friday evening. Spots darken rapidly under incidental sun exposure.',
    ingredientsToLookFor: ['Tranexamic Acid (2-5%)', 'Ascorbic Acid (Vitamin C)', 'Alpha Arbutin', 'Licorice Root Extract'],
    scientificContext:
      'Analyzes localized luminance shifts and melanin contrast clusters against baseline surrounding skin tone.',
  },
  {
    id: 'oiliness',
    title: 'Sebum & Lipid Regulation',
    metricKey: 'oiliness',
    categoryBadge: 'SEBACEOUS HOMEOSTASIS',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    simpleExplanation:
      'Sebum is an essential protective mixture of squalene, wax esters, and triglycerides that keeps your skin waterproof. When overproduced, it can feel greasy and promote pore congestion.',
    selfObservationCues: [
      'Dab a clean blotting paper or tissue on your forehead 2 hours after washing. Does it show transparent spots?',
      'Notice if your T-zone shines while your cheeks feel dry or tight (classic combination skin).',
      'Feel whether morning skin has a protective film or feels parched.',
    ],
    dailyTrackingSuggestion:
      'Check the 2:00 PM shine test. Mid-afternoon is when sebaceous production naturally peaks during circadian rhythm.',
    ingredientsToLookFor: ['Niacinamide', 'Zinc PCA', 'Green Tea Extract', 'Jojoba Seed Oil (biomimetic ester)'],
    scientificContext:
      'Quantifies specular highlights and specular reflection index across the T-zone and forehead.',
  },
  {
    id: 'moisture',
    title: 'Stratum Corneum Hydration',
    metricKey: 'moisture',
    categoryBadge: 'WATER RETENTION & TEWL',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    simpleExplanation:
      'Skin moisture is the water content bound within your stratum corneum by natural moisturizing factors (NMF). Hydration is water; oil is lipid. Dehydrated skin can simultaneously be oily on the surface.',
    selfObservationCues: [
      'Smile wide right after drying your face. Do you feel tightness or pulling around your mouth?',
      'Look close: do you see crinkly crepe-like texture when pushing skin gently upward?',
      'Check if your moisturizer absorbs within 15 seconds, leaving skin thirsty again.',
    ],
    dailyTrackingSuggestion:
      'Evaluate your cheek plumpness 1 hour after waking up. Overnight trans-epidermal water loss (TEWL) is highest during sleep.',
    ingredientsToLookFor: ['Glycerin', 'Polyglutamic Acid', 'Hyaluronic Acid', 'Sodium PCA', 'Beta-Glucan'],
    scientificContext:
      'Assesses skin translucency, pliancy, and subtle light scatter associated with water-bound corneocyte volume.',
  },
];

// ============================================================================
// 2. 28-DAY SKIN GOALS TRACKS
// ============================================================================
export const SKIN_GOAL_TRACKS: SkinGoalTrack[] = [
  {
    id: 'barrier-repair',
    title: 'Moisture Barrier Resilience',
    tagline: 'Soothe sensitivity, eliminate tightness, and restore lipid integrity.',
    description:
      'Designed for irritated, stinging, over-exfoliated, or chronically dry skin. Pauses harsh actives to let the lipid matrix replenish.',
    targetFocus: 'Moisture & Redness',
    dailyHabits: [
      {
        id: 'gentle-cleanse',
        label: 'Gentle non-foaming wash (warm, not hot water)',
        timeOfDay: 'am',
        whyItMatters: 'Hot water strips natural ceramides and dissolves defensive lipid bilayers.',
      },
      {
        id: 'ceramide-barrier',
        label: 'Apply ceramide & panthenol moisturizer on damp skin',
        timeOfDay: 'any',
        whyItMatters: 'Applying to damp skin locks in ambient moisture before trans-epidermal loss occurs.',
      },
      {
        id: 'daily-spf',
        label: 'Mineral or soothing daily sunscreen protection',
        timeOfDay: 'am',
        whyItMatters: 'UV rays induce inflammatory cytokines that break down barrier repair proteins.',
      },
      {
        id: 'zero-harsh-actives',
        label: 'Zero direct acids or physical scrubs today',
        timeOfDay: 'pm',
        whyItMatters: 'Skin requires uninterrupted quiet time to rebuild intercellular lipid mortar.',
      },
    ],
    cycleLength: 28,
    milestones: [
      {
        day: 7,
        title: 'Calming Phase (Reduced Stinging)',
        dermatologicalInsight:
          'Superficial stratum corneum hydration recovers first. Stinging upon basic cream application diminishes significantly.',
      },
      {
        day: 14,
        title: 'Lipid Mortar Reformation',
        dermatologicalInsight:
          'Lamellar lipid bilayers begin reorganization. Trans-epidermal water loss (TEWL) stabilizes noticeably.',
      },
      {
        day: 21,
        title: 'Corneocyte Consolidation',
        dermatologicalInsight:
          'New epidermal cells created during barrier recovery reach the surface with healthy intact envelope proteins.',
      },
      {
        day: 28,
        title: 'Full Turnover & Resilient Homeostasis',
        dermatologicalInsight:
          'A full biological cellular cycle has completed under protected conditions. Skin demonstrates resilient bounce and reduced reactive flushing.',
      },
    ],
  },
  {
    id: 'gentle-retinization',
    title: 'Safe Retinization & Cell Renewal',
    tagline: 'Build tolerance to retinoids without peeling, redness, or barrier collapse.',
    description:
      'For users starting or stepping up retinol or retinal. Focuses on the "sandwich method" and strict frequency pacing.',
    targetFocus: 'Texture & Fine Lines',
    dailyHabits: [
      {
        id: 'buffer-sandwich',
        label: 'Buffer retinoid: Moisturizer first or sandwich layer',
        timeOfDay: 'pm',
        whyItMatters: 'Buffering slows receptor saturation without inhibiting retinoic gene signaling.',
      },
      {
        id: 'pea-sized-amount',
        label: 'Strictly 1 pea-sized drop for the whole face',
        timeOfDay: 'pm',
        whyItMatters: 'Excess volume spills into delicate orbital folds and worsens irritation without increasing efficacy.',
      },
      {
        id: 'morning-spf30',
        label: 'Broad spectrum SPF 30+ every single morning',
        timeOfDay: 'am',
        whyItMatters: 'Accelerated cell turnover leaves freshly migrated corneocytes vulnerable to solar DNA damage.',
      },
      {
        id: 'barrier-rest-day',
        label: 'Respect scheduled rest night if not an active retinoid night',
        timeOfDay: 'pm',
        whyItMatters: 'Cellular tolerance builds during recovery intervals, not continuous aggressive stress.',
      },
    ],
    cycleLength: 28,
    milestones: [
      {
        day: 7,
        title: 'Initial Receptor Awakening',
        dermatologicalInsight:
          'Cell receptors begin up-regulating. Minor flaking is normal; consistent buffering prevents irritation dermatitis.',
      },
      {
        day: 14,
        title: 'Micro-Turnover Horizon',
        dermatologicalInsight:
          'Early dull surface cells begin shedding faster. Skin begins feeling smoother beneath gentle cleansing.',
      },
      {
        day: 21,
        title: 'Tolerance Consolidation',
        dermatologicalInsight:
          'Retinoid dermatitis risk drops sharply as tolerance is established across cellular layers.',
      },
      {
        day: 28,
        title: 'First Turnover Cycle Complete',
        dermatologicalInsight:
          'Initial retinized epidermal cycle finishes. Fine dehydration lines look softer and texture is noticeably more uniform.',
      },
    ],
  },
  {
    id: 'congestion-clarity',
    title: 'Follicular Clarity & Congestion Balance',
    tagline: 'Balance oil production, gently clarify pores, and support clear skin.',
    description:
      'For oily, combination, or blemish-prone skin. Prioritizes thorough nightly cleansing, non-comedogenic hydration, and pore hygiene.',
    targetFocus: 'Pores & Blemishes',
    dailyHabits: [
      {
        id: 'evening-double-cleanse',
        label: 'Evening 60-second gentle double cleanse',
        timeOfDay: 'pm',
        whyItMatters: '60 full seconds allows oil cleansers to break down water-resistant sunscreen and oxidized sebum.',
      },
      {
        id: 'targeted-salicylic-bha',
        label: 'Gentle BHA or Azelaic treatment (2-3x weekly)',
        timeOfDay: 'pm',
        whyItMatters: 'Lipophilic salicylic acid penetrates inside oil-filled pores to dissolve sticky plugs.',
      },
      {
        id: 'lightweight-hydration',
        label: 'Lightweight gel-cream (do not skip moisturizer)',
        timeOfDay: 'any',
        whyItMatters: 'Depriving oily skin of hydration causes compensatory sebum spikes.',
      },
      {
        id: 'touch-discipline',
        label: 'Zero face picking or mirror magnification inspection',
        timeOfDay: 'any',
        whyItMatters: 'Physical manipulation introduces staphylococcus bacteria and creates deep post-inflammatory erythema.',
      },
    ],
    cycleLength: 28,
    milestones: [
      {
        day: 7,
        title: 'Sebum Normalization',
        dermatologicalInsight:
          'Daily double cleansing reduces surface lipid buildup and cuts down afternoon shine.',
      },
      {
        day: 14,
        title: 'Follicular Unplugging',
        dermatologicalInsight:
          'Micro-comedones beneath the surface begin clearing outward rather than inflaming into swollen papules.',
      },
      {
        day: 21,
        title: 'Inflammatory Quenching',
        dermatologicalInsight:
          'New breakout frequency drops. Existing marks transition into calm, flat healing tissue.',
      },
      {
        day: 28,
        title: 'Clear Skin Rhythm Established',
        dermatologicalInsight:
          'Full 28-day cycle of pore clearing achieved. Skin tone is clearer with refined pore appearance and reduced congestion.',
      },
    ],
  },
  {
    id: 'sun-defense',
    title: 'Daily Photo-Defense & Tone Preservation',
    tagline: 'Defend against UV photoaging, brighten post-inflammatory marks, and prevent spots.',
    description:
      'Consistent daily sun protection is the single most verified anti-aging intervention in clinical dermatology.',
    targetFocus: 'Pigmentation & Tone Uniformity',
    dailyHabits: [
      {
        id: 'two-finger-spf',
        label: 'Apply full 2-finger lengths of SPF 30+ to face and neck',
        timeOfDay: 'am',
        whyItMatters: 'Most people apply only 25-50% of the required 2mg/cm² dose needed to reach the labeled protection factor.',
      },
      {
        id: 'antioxidant-shield',
        label: 'Layer antioxidant serum (Vitamin C, Niacinamide or EGCG)',
        timeOfDay: 'am',
        whyItMatters: 'Antioxidants neutralize free radicals generated by UVA and visible blue light that bypass filters.',
      },
      {
        id: 'midday-touchup',
        label: 'Midday sun reapplication or protective sunglasses/hat',
        timeOfDay: 'any',
        whyItMatters: 'Sunscreen films break down from sweat, sebum, and natural facial movement over 3-4 hours.',
      },
      {
        id: 'night-soothing-recovery',
        label: 'Evening antioxidant or barrier replenishing moisturizer',
        timeOfDay: 'pm',
        whyItMatters: 'Cellular DNA repair enzymes work most actively during nighttime sleep.',
      },
    ],
    cycleLength: 28,
    milestones: [
      {
        day: 7,
        title: 'Erythema Prevention',
        dermatologicalInsight:
          'Sub-clinical UV redness is completely blocked. Skin maintains calm baseline tone even after outdoor commutes.',
      },
      {
        day: 14,
        title: 'Melanocyte Calmness',
        dermatologicalInsight:
          'Melanin synthesis enzymes (tyrosinase) down-regulate in the absence of chronic UV triggers.',
      },
      {
        day: 21,
        title: 'Pigment Fading Window',
        dermatologicalInsight:
          'Darkened corneocytes naturally slough away without being continuously replaced by fresh sun-stimulated pigment.',
      },
      {
        day: 28,
        title: 'Tone Clarity & Photo-Resilience',
        dermatologicalInsight:
          'A full turnover cycle completed under steady UV protection. Overall skin tone appears visibly brighter and more uniform.',
      },
    ],
  },
];

// ============================================================================
// 3. INGREDIENT COMPATIBILITY & OVERLAP ENGINE
// ============================================================================
export function checkRoutineCompatibility(products: CustomRoutineProduct[]): CompatibilityNotice[] {
  const notices: CompatibilityNotice[] = [];
  const allIngredients = products.flatMap((p) => p.ingredients.map((i) => i.trim().toLowerCase()));

  // 1. Direct Retinoids + Direct Vitamin C (L-Ascorbic Acid) in same routine
  const hasRetinoid = allIngredients.some((i) => i.includes('retin') || i.includes('tretinoin') || i.includes('adapalene'));
  const hasDirectVitC = allIngredients.some((i) => i.includes('ascorbic') || i.includes('vitamin c'));

  if (hasRetinoid && hasDirectVitC) {
    notices.push({
      severity: 'caution',
      title: 'Retinoid + Direct Vitamin C Layering',
      description:
        'Combining high-strength L-Ascorbic Acid with a Retinoid in the exact same routine can overwhelm the skin barrier and cause erythema or peeling due to differing optimal pH levels.',
      conflictingIngredients: ['Retinoid / Retinol', 'L-Ascorbic Acid (Vitamin C)'],
      recommendation: 'Best practice: Use Vitamin C in the morning for antioxidant photo-defense, and your Retinoid at night for cellular renewal.',
    });
  }

  // 2. Retinoid + Strong Exfoliating Acids (AHA / BHA) in same routine
  const hasAhaBha = allIngredients.some(
    (i) => i.includes('glycolic') || i.includes('lactic') || i.includes('salicylic') || i.includes('aha') || i.includes('bha')
  );

  if (hasRetinoid && hasAhaBha) {
    notices.push({
      severity: 'warning',
      title: 'Retinoid + Chemical Exfoliating Acids',
      description:
        'Layering exfoliating acids (Glycolic, Lactic, Salicylic) alongside Retinoids in the same application exponentially raises the risk of acid burn, micro-tears, and lipid barrier breakdown.',
      conflictingIngredients: ['Retinoid / Retinol', 'AHA / BHA Chemical Exfoliant'],
      recommendation: 'Alternate evenings: Use Exfoliating Acids 1–2 nights per week, and your Retinoid on separate nights.',
    });
  }

  // 3. Benzoyl Peroxide + Retinol
  const hasBenzoyl = allIngredients.some((i) => i.includes('benzoyl'));
  if (hasBenzoyl && hasRetinoid) {
    notices.push({
      severity: 'caution',
      title: 'Benzoyl Peroxide + Pure Retinol',
      description:
        'Benzoyl Peroxide is an oxidizer that can degrade standard retinol molecules, reducing efficacy while causing pronounced flaking.',
      conflictingIngredients: ['Benzoyl Peroxide', 'Pure Retinol'],
      recommendation: 'Use Benzoyl Peroxide in the morning or spot-treated on alternating nights from your retinoid.',
    });
  }

  // 4. Multiple Strong Exfoliating Acids
  const acidCount = allIngredients.filter(
    (i) => i.includes('glycolic') || i.includes('salicylic') || i.includes('lactic') || i.includes('mandelic')
  ).length;

  if (acidCount >= 2) {
    notices.push({
      severity: 'warning',
      title: 'Multiple Direct Exfoliating Acids Layered',
      description:
        'You have included 2 or more distinct chemical exfoliating acids. Multi-layering exfoliants is a leading cause of barrier irritation and reactive breakouts.',
      conflictingIngredients: ['Exfoliating Acid 1', 'Exfoliating Acid 2'],
      recommendation: 'Choose 1 targeted acid per routine or opt for a single balanced multi-acid blend formulated by cosmetic chemists.',
    });
  }

  // 5. Active Ingredient Overlap (e.g. Niacinamide in 3+ products)
  const ingredientCounts: Record<string, number> = {};
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
        description: `You have ${count} distinct products containing ${ing}. More is not always better; high cumulative percentages can provoke unexpected sensitivity.`,
        conflictingIngredients: [ing, `${count} occurrences`],
        recommendation: 'One well-formulated leave-on product is sufficient to achieve optimal therapeutic concentration.',
      });
    }
  }

  return notices;
}

// ============================================================================
// 4. FACE CONSISTENCY VALIDATOR (HONEST COMPARISON INTEGRITY)
// ============================================================================
export function checkFaceConsistency(
  baseline: SkinScanRecord,
  current: SkinScanRecord
): FaceConsistencyCheck {
  const caveats: string[] = [];
  let isLikelySameSubject = true;
  let divergenceLevel: 'low' | 'moderate' | 'high' = 'low';

  // 1. Lighting Delta
  const bLight = baseline.qualityCheck?.brightness ?? 50;
  const cLight = current.qualityCheck?.brightness ?? 50;
  const lightingDelta = Math.abs(bLight - cLight);

  // 2. Resolution Delta
  const bRes = baseline.qualityCheck ? Math.min(baseline.qualityCheck.width, baseline.qualityCheck.height) : 720;
  const cRes = current.qualityCheck ? Math.min(current.qualityCheck.width, current.qualityCheck.height) : 720;
  const resolutionDelta = Math.abs(bRes - cRes);

  // 3. Time Gap
  const timeDiffMs = Math.abs(new Date(current.timestamp).getTime() - new Date(baseline.timestamp).getTime());
  const timeGapDays = Math.round(timeDiffMs / (1000 * 60 * 60 * 24));

  // 4. Skin Age divergence (if present)
  const bAge = baseline.overall?.skin_age;
  const cAge = current.overall?.skin_age;
  const ageDelta = bAge && cAge ? Math.abs(bAge - cAge) : 0;

  // 5. User Name Match
  const nameMatch = !baseline.name || !current.name || baseline.name === current.name;

  if (ageDelta > 15) {
    isLikelySameSubject = false;
    divergenceLevel = 'high';
    caveats.push(`Divergent Skin Age Detected (${bAge} yrs vs ${cAge} yrs, delta of ${ageDelta} yrs). These appear to be scans of different individuals.`);
  } else if (!nameMatch && baseline.name.toLowerCase() !== 'sample entry' && current.name.toLowerCase() !== 'sample entry') {
    isLikelySameSubject = false;
    divergenceLevel = 'high';
    caveats.push(`Different entry identifiers: "${baseline.name}" vs "${current.name}". Comparing different people will fabricate invalid progress deltas.`);
  } else if (lightingDelta > 30 || resolutionDelta > 800) {
    divergenceLevel = 'moderate';
    caveats.push('Extreme lighting or sensor disparity detected. Environmental differences exceed reliable comparison tolerance.');
  }

  return {
    isLikelySameSubject,
    divergenceLevel,
    warningMessage: caveats.length > 0 ? caveats.join(' ') : undefined,
    details: {
      nameMatch,
      lightingDelta,
      resolutionDelta,
      timeGapDays,
    },
  };
}

// ============================================================================
// 5. DEFAULT STARTER USER ROUTINE
// ============================================================================
export const DEFAULT_USER_ROUTINE: UserRoutine = {
  amProducts: [
    {
      id: 'am_1',
      name: 'Gentle Hydrating Cleanser',
      stepType: 'cleanser',
      ingredients: ['Glycerin', 'Ceramides'],
      notes: 'Water-based wash for morning refresh',
    },
    {
      id: 'am_2',
      name: 'Antioxidant Niacinamide Serum',
      stepType: 'serum',
      ingredients: ['Niacinamide (5%)', 'Zinc PCA', 'Hyaluronic Acid'],
      notes: 'Supports pore clarity & sebum balance',
    },
    {
      id: 'am_3',
      name: 'Ceramide Barrier Cream',
      stepType: 'moisturizer',
      ingredients: ['Ceramide NP', 'Cholesterol', 'Fatty Acids'],
      notes: 'Lightweight barrier seal',
    },
    {
      id: 'am_4',
      name: 'Mineral Broad Spectrum SPF 50+',
      stepType: 'sunscreen',
      ingredients: ['Zinc Oxide (18%)', 'Vitamin E'],
      notes: 'Non-negotiable daily photo-defense',
    },
  ],
  pmProducts: [
    {
      id: 'pm_1',
      name: 'Balm-to-Milk Cleansing Emulsion',
      stepType: 'cleanser',
      ingredients: ['Jojoba Oil', 'Caprylic Triglyceride'],
      notes: 'First cleanse: breaks down SPF and pollution',
    },
    {
      id: 'pm_2',
      name: 'Gentle Foaming Second Cleanse',
      stepType: 'cleanser',
      ingredients: ['Amino Acid Surfactants', 'Allantoin'],
      notes: 'Water-based cleanse for clean pores',
    },
    {
      id: 'pm_3',
      name: 'Encapsulated Retinal Renewal Serum',
      stepType: 'treatment',
      ingredients: ['Retinaldehyde (0.05%)', 'Bisabolol'],
      notes: 'Promotes cellular turnover & elasticity',
    },
    {
      id: 'pm_4',
      name: 'Rich Overnight Restorative Night Cream',
      stepType: 'night_cream',
      ingredients: ['Shea Butter', 'Panthenol (5%)', 'Squalane'],
      notes: 'Nourishing moisture seal for nighttime repair',
    },
  ],
  lastUpdated: new Date().toISOString(),
};
