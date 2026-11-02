import type { YouCamMetric, RoutineSuggestion, UserSkinProfile } from '../types/skin';

/**
 * Derives personalized AM/PM skincare routine recommendations
 * grounded in authentic YouCam AI diagnostic measurements and
 * adjusted for user-reported skin profile traits and sensitivities.
 *
 * All guidance is purely cosmetic/lifestyle awareness and non-medical.
 */
export function generateRoutineGuidance(
  metrics: YouCamMetric[],
  userProfile?: UserSkinProfile | null
): RoutineSuggestion[] {
  const suggestions: RoutineSuggestion[] = [];
  const metricMap = new Map(metrics.map((m) => [m.type, m]));

  const sensitivities = userProfile?.sensitivities || [];
  const hasSensitivity = (item: string) =>
    sensitivities.some((s) => s.toLowerCase().includes(item.toLowerCase()));

  const userConcerns = userProfile?.primaryConcerns || [];
  const hasUserConcern = (item: string) =>
    userConcerns.some((c) => c.toLowerCase().includes(item.toLowerCase()));

  let stepCounter = 1;

  // 1. Cleansing Step (AM & PM)
  const oiliness = metricMap.get('oiliness');
  const isOilyBiomarker = (oiliness && oiliness.ui_score < 68) || userProfile?.skinType === 'oily';
  const isDryBiomarker = userProfile?.skinType === 'dry' || (oiliness && oiliness.ui_score > 90);

  if (isOilyBiomarker) {
    suggestions.push({
      id: 'step-cleanser-gel',
      stepNumber: stepCounter++,
      timeOfDay: 'BOTH',
      step: 'Step 1: Low-Foam Balancing Gel Cleanser',
      category: 'Cleanse',
      suggestion: 'Gentle amino acid or glucoside gel cleanser with balanced pH (5.0–5.5).',
      ingredientSpotlight: 'Coco-Glucoside & Zinc PCA',
      reason:
        'Higher surface shine or sebum output detected. Zinc PCA helps temper follicular shine while gentle surfactants cleanse without stripping the lipid mantle.',
      howToApply: 'Massage 1 pump onto damp skin for 45 seconds with lukewarm water. Pat dry with a clean cotton towel.',
      triggeredByMetric: oiliness
        ? `Sebum Balance Score: ${oiliness.ui_score}/100`
        : 'User Profile: Oily skin tendency',
      isCustomizedForProfile: Boolean(userProfile?.skinType === 'oily'),
    });
  } else if (isDryBiomarker) {
    suggestions.push({
      id: 'step-cleanser-cream',
      stepNumber: stepCounter++,
      timeOfDay: 'BOTH',
      step: 'Step 1: Barrier-Nourishing Milk Cleanser',
      category: 'Cleanse',
      suggestion: 'Non-foaming cream or lotion cleanser enriched with plant squalane and glycerin.',
      ingredientSpotlight: 'Oat Kernel Extract & Plant Squalane',
      reason:
        'Dry skin barrier detected. Non-foaming lipids dissolve daily grime and light makeup without disrupting moisture bilayers.',
      howToApply: 'Gently glide over dry or damp skin, emulsify with warm water, and gently rinse clean.',
      triggeredByMetric: 'User Profile: Dry skin type / low sebum production',
      isCustomizedForProfile: true,
    });
  } else {
    suggestions.push({
      id: 'step-cleanser-gentle',
      stepNumber: stepCounter++,
      timeOfDay: 'BOTH',
      step: 'Step 1: Gentle Balancing Cleanser',
      category: 'Cleanse',
      suggestion: 'Mild pH-neutral foaming jelly cleanser free of synthetic sulfates.',
      ingredientSpotlight: 'Panthenol & Glycerin',
      reason: 'Removes overnight sebum and daily atmospheric dust while keeping hydration intact.',
      howToApply: 'Lather between wet palms, massage in circular motions across face and neck, then rinse.',
      triggeredByMetric: 'Foundational baseline protocol',
    });
  }

  // 2. Daytime Brightening & Defense Serum (AM)
  const spots = metricMap.get('age_spot');
  const needsBrightening = (spots && spots.ui_score < 75) || hasUserConcern('pigmentation') || hasUserConcern('dark_spots');

  if (needsBrightening) {
    const isSensitive = hasSensitivity('strong_acids') || userProfile?.skinType === 'sensitive';
    suggestions.push({
      id: 'step-antioxidant-am',
      stepNumber: stepCounter++,
      timeOfDay: 'AM',
      step: 'Step 2: Antioxidant Photoprotection Serum',
      category: 'Brighten & Protect',
      suggestion: isSensitive
        ? 'Azelaic Acid (5–10%) or 3-O-Ethyl Ascorbic Acid fluid.'
        : 'Stabilized 10–15% L-Ascorbic Acid + Ferulic Acid serum.',
      ingredientSpotlight: isSensitive ? 'Azelaic Acid & Centella' : 'Pure Vitamin C (L-Ascorbic) & Ferulic Acid',
      reason:
        'Targeting localized pigment variations and tone unevenness. Antioxidants intercept UV-induced free radicals before they stimulate melanin synthesis.',
      howToApply: 'Press 3–4 drops across forehead, cheeks, and neck after cleansing. Allow 60 seconds to absorb.',
      triggeredByMetric: spots
        ? `Tone Uniformity / Age Spots Score: ${spots.ui_score}/100`
        : 'User Profile: Reported pigmentation concern',
      isCustomizedForProfile: isSensitive,
    });
  }

  // 3. Hydration & Calming Step (AM & PM)
  const moisture = metricMap.get('moisture');
  const redness = metricMap.get('redness');
  const isDehydrated = (moisture && moisture.ui_score < 75) || hasUserConcern('dryness');
  const isReactive = (redness && redness.ui_score < 75) || userProfile?.skinType === 'sensitive' || hasUserConcern('redness');

  if (isReactive) {
    suggestions.push({
      id: 'step-soothing-serum',
      stepNumber: stepCounter++,
      timeOfDay: 'BOTH',
      step: 'Step 3: Vascular Calming & Barrier Repair Fluid',
      category: 'Soothe & Calm',
      suggestion: 'Centella Asiatica (Madecassoside), Ectoin (1–2%), and Panthenol (Pro-Vitamin B5).',
      ingredientSpotlight: 'Madecassoside (Cica) + Ectoin',
      reason:
        'Elevated vascular erythema or skin reactivity observed. Ectoin stabilizes cellular membranes while Centella down-regulates inflammatory markers.',
      howToApply: 'Smooth 2 pumps evenly over sensitized zones (cheeks and nose). Never rub vigorously.',
      triggeredByMetric: redness
        ? `Calmness / Vascular Clarity Score: ${redness.ui_score}/100`
        : 'User Profile: Sensitive skin / redness concern',
      isCustomizedForProfile: Boolean(userProfile?.skinType === 'sensitive'),
    });
  } else if (isDehydrated) {
    suggestions.push({
      id: 'step-hydration-essence',
      stepNumber: stepCounter++,
      timeOfDay: 'BOTH',
      step: 'Step 3: Multi-Depth Hydration Infusion',
      category: 'Hydrate',
      suggestion: 'Low, medium, and high molecular weight Hyaluronic Acid + Polyglutamic Acid serum.',
      ingredientSpotlight: 'Tri-Molecular Hyaluronate & Snow Mushroom (Tremella)',
      reason:
        'Stratum corneum hydration deficit indicated. Multi-weight humectants draw moisture into surface epidermal layers and cushion skin bounce.',
      howToApply: 'Apply 3 drops onto slightly damp skin so humectants bind available water molecules.',
      triggeredByMetric: moisture
        ? `Hydration Retention Score: ${moisture.ui_score}/100`
        : 'User Profile: Dryness / dehydration concern',
    });
  }

  // 4. Evening Renewal / Active Treatment (PM)
  const texture = metricMap.get('texture');
  const pore = metricMap.get('pore');
  const wrinkle = metricMap.get('wrinkle');
  const acne = metricMap.get('acne');

  const needsSmoothing = (texture && texture.ui_score < 72) || (pore && pore.ui_score < 72) || hasUserConcern('pores') || hasUserConcern('texture');
  const needsRenewal = (wrinkle && wrinkle.ui_score < 75) || hasUserConcern('fine_lines');
  const needsClarifying = (acne && acne.ui_score < 75) || hasUserConcern('acne');

  if (needsClarifying) {
    suggestions.push({
      id: 'step-pm-clarify',
      stepNumber: stepCounter++,
      timeOfDay: 'PM',
      step: 'Step 4: Pore-Purifying & Follicular Decongestant',
      category: 'Clarify',
      suggestion: '2% Salicylic Acid (BHA) liquid or Zinc PCA + Niacinamide (4%) emulsion 3 nights weekly.',
      ingredientSpotlight: 'Lipophilic BHA (Salicylic Acid) & Niacinamide',
      reason:
        'Follicular blockage or active acne biomarkers recorded. BHA is oil-soluble and penetrates deep within pore linings to dissolve trapped cellular debris.',
      howToApply: 'Sweep across T-zone and congested areas on alternating evenings after cleansing.',
      triggeredByMetric: acne
        ? `Acne & Blemish Clarity Score: ${acne.ui_score}/100`
        : 'User Profile: Acne / blemish management',
    });
  } else if (needsRenewal) {
    const isSensitiveToRetinoids = hasSensitivity('retinoids');
    suggestions.push({
      id: 'step-pm-retinoid',
      stepNumber: stepCounter++,
      timeOfDay: 'PM',
      step: 'Step 4: Evening Cellular Regeneration',
      category: 'Renew & Preserve',
      suggestion: isSensitiveToRetinoids
        ? 'Bakuchiol (1%) phyto-retinol alternative or Palmitoyl Tripeptide-38 serum.'
        : 'Encapsulated Retinaldehyde (0.05%) or Micro-Dosed Retinol (0.2%).',
      ingredientSpotlight: isSensitiveToRetinoids ? 'Plant Bakuchiol & Copper Tripeptides' : 'Encapsulated Retinaldehyde',
      reason:
        'Addressing fine surface expressions and dermal collagen density. Nighttime cell turnover accelerates natural skin firming.',
      howToApply: 'Use a pea-sized amount over completely dry face 2–3 nights weekly, buffering with moisturizer if needed.',
      triggeredByMetric: wrinkle
        ? `Fine Line & Expression Score: ${wrinkle.ui_score}/100`
        : 'User Profile: Expression lines / collagen support',
      isCustomizedForProfile: isSensitiveToRetinoids,
    });
  } else if (needsSmoothing) {
    suggestions.push({
      id: 'step-pm-pha',
      stepNumber: stepCounter++,
      timeOfDay: 'PM',
      step: 'Step 4: Gentle Surface Micro-Exfoliation',
      category: 'Smooth',
      suggestion: 'Gluconolactone (PHA 4%) + Lactobionic Acid soothing resurfacing liquid.',
      ingredientSpotlight: 'Polyhydroxy Acids (PHA) & Licorice Root',
      reason:
        'Follicular prominence or tactile texture detected. PHAs have larger molecular size, exfoliating dead surface scales without burning or stinging.',
      howToApply: 'Dispense onto reusable pad or fingertips; smooth across skin 2 nights a week before moisturizing.',
      triggeredByMetric: texture
        ? `Surface Texture Score: ${texture.ui_score}/100`
        : 'User Profile: Texture / pore refinement',
    });
  }

  // 5. Barrier Moisturizer (AM & PM)
  suggestions.push({
    id: 'step-barrier-moisturizer',
    stepNumber: stepCounter++,
    timeOfDay: 'BOTH',
    step: 'Step 5: Physiological Lipid Barrier Moisturizer',
    category: 'Seal & Protect',
    suggestion: isOilyBiomarker
      ? 'Lightweight oil-free water-gel containing 3 essential ceramides and beta-glucan.'
      : 'Rich ceramide-dominant cream formulated with a 3:1:1 physiological ratio of ceramides, cholesterol, and fatty acids.',
    ingredientSpotlight: 'Ceramide NP, AP, EOP + Phytosphingosine',
    reason:
      'Crucial for reinforcing stratum corneum cohesion and sealing earlier actives into epidermal matrices.',
    howToApply: 'Warm a dime-sized dollop between fingers and press onto face and neck until absorbed.',
    triggeredByMetric: 'Universal foundational skin barrier protection',
    isCustomizedForProfile: isOilyBiomarker,
  });

  // 6. Daytime Sunscreen Protection (AM ONLY)
  suggestions.push({
    id: 'step-sunscreen-am',
    stepNumber: stepCounter++,
    timeOfDay: 'AM',
    step: 'Step 6: Broad-Spectrum Photoprotection (SPF 50+ / PA++++)',
    category: 'Shield',
    suggestion: hasSensitivity('alcohol') || userProfile?.skinType === 'sensitive'
      ? 'Non-nano Zinc Oxide (18–20%) mineral sunscreen with calming bisabolol, fragrance-free.'
      : 'Modern photostable fluid sunscreen with broad-spectrum UV filters (Tinosorb, Uvinul, or Mexoryl).',
    ingredientSpotlight: hasSensitivity('alcohol') ? 'Non-Nano Zinc Oxide & Bisabolol' : 'Broad-Spectrum Photostable UV Filters',
    reason:
      'UV radiation is the primary driver of dermal elastin degradation, DNA photolesions, and irregular melanogenesis. Essential every morning.',
    howToApply: 'Apply two full finger-lengths evenly across face, ears, and neck 15 minutes before daylight exposure.',
    triggeredByMetric: 'Universal clinical photoprotection standard',
    isCustomizedForProfile: Boolean(hasSensitivity('alcohol') || userProfile?.skinType === 'sensitive'),
  });

  return suggestions;
}
