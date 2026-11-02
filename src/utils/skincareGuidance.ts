import type { YouCamMetric, RoutineSuggestion } from '../types/skin';

/**
 * Derives general, non-medical AM/PM skincare routine considerations
 * directly linked to the verified YouCam metric readings.
 */
export function generateRoutineGuidance(metrics: YouCamMetric[]): RoutineSuggestion[] {
  const suggestions: RoutineSuggestion[] = [];
  const metricMap = new Map(metrics.map((m) => [m.type, m]));

  suggestions.push({
    timeOfDay: 'AM',
    step: 'Daytime Defense',
    category: 'Protection',
    suggestion: 'Broad-Spectrum Mineral or Fluid Sunscreen (SPF 30+ / PA++++).',
    reason:
      'UV exposure is the primary external driver of collagen breakdown, hyperpigmentation, and surface dehydration.',
    triggeredByMetric: 'Universal foundational skin health protocol.',
  });

  const oiliness = metricMap.get('oiliness');
  if (oiliness && oiliness.ui_score < 65) {
    suggestions.push({
      timeOfDay: 'BOTH',
      step: 'Sebum Clarification',
      category: 'Clarification',
      suggestion: 'Gentle low-pH Gel Cleanser + Niacinamide (2–5%) serum.',
      reason:
        'Higher surface shine detected. Niacinamide supports natural lipid barrier regulation without stripping surface moisture.',
      triggeredByMetric: `Sebum Balance (UI Score: ${oiliness.ui_score})`,
    });
  }

  const moisture = metricMap.get('moisture');
  if (moisture && moisture.ui_score < 70) {
    suggestions.push({
      timeOfDay: 'BOTH',
      step: 'Hydration Replenishment',
      category: 'Hydration',
      suggestion: 'Multi-molecular Hyaluronic Acid or Glycerin Essence + Ceramide Emulsion.',
      reason:
        'Low stratum corneum hydration detected. Humectants draw water into surface layers, while ceramides seal the lipid mantle.',
      triggeredByMetric: `Hydration Retention (UI Score: ${moisture.ui_score})`,
    });
  }

  const texture = metricMap.get('texture');
  const pore = metricMap.get('pore');
  if ((texture && texture.ui_score < 68) || (pore && pore.ui_score < 68)) {
    const trigger = texture && texture.ui_score < 68 ? `Skin Texture (${texture.ui_score})` : `Pores (${pore?.ui_score})`;
    suggestions.push({
      timeOfDay: 'PM',
      step: 'Micro-Exfoliation & Smoothing',
      category: 'Renewal',
      suggestion: 'Gentle PHA (Polyhydroxy Acid) or 1–2% Salicylic Acid liquid 2 nights a week.',
      reason:
        'Surface irregularities or follicular prominence observed. Gentle chemical exfoliation helps clear cellular debris.',
      triggeredByMetric: trigger,
    });
  }

  const redness = metricMap.get('redness');
  if (redness && redness.ui_score < 70) {
    suggestions.push({
      timeOfDay: 'BOTH',
      step: 'Barrier Soothing',
      category: 'Soothe',
      suggestion: 'Centella Asiatica (Cica), Panthenol (Pro-Vitamin B5), or Beta-Glucan serum.',
      reason:
        'Elevated vascular flushing or surface sensitivity noted. Calming botanicals reinforce capillary resilience and reduce irritation.',
      triggeredByMetric: `Calmness & Vascular Clarity (UI Score: ${redness.ui_score})`,
    });
  }

  const spots = metricMap.get('age_spot');
  if (spots && spots.ui_score < 70) {
    suggestions.push({
      timeOfDay: 'AM',
      step: 'Antioxidant Brightening',
      category: 'Brighten',
      suggestion: 'Stabilized Vitamin C (Ascorbic Acid or Ascorbyl Glucoside) or Azelaic Acid.',
      reason:
        'Localized pigmentary unevenness detected. Antioxidants neutralize oxidative free radicals and support even melanin distribution.',
      triggeredByMetric: `Spots & Pigmentation (UI Score: ${spots.ui_score})`,
    });
  }

  const wrinkle = metricMap.get('wrinkle');
  const firmness = metricMap.get('firmness');
  if ((wrinkle && wrinkle.ui_score < 70) || (firmness && firmness.ui_score < 70)) {
    const trigger = wrinkle && wrinkle.ui_score < 70 ? `Wrinkles (${wrinkle.ui_score})` : `Firmness (${firmness?.ui_score})`;
    suggestions.push({
      timeOfDay: 'PM',
      step: 'Cellular Restoration',
      category: 'Preserve',
      suggestion: 'Copper Peptide complex or Encapsulated Retinol / Retinaldehyde (started gradually).',
      reason:
        'Surface lines or elasticity changes identified. Peptides and retinoids support collagen synthesis and cellular renewal while sleeping.',
      triggeredByMetric: trigger,
    });
  }

  const darkCircle = metricMap.get('dark_circle_v2');
  const eyeBag = metricMap.get('eye_bag');
  if ((darkCircle && darkCircle.ui_score < 70) || (eyeBag && eyeBag.ui_score < 70)) {
    suggestions.push({
      timeOfDay: 'AM',
      step: 'Peri-Orbital Refresh',
      category: 'Eye Care',
      suggestion: 'Caffeine (5%) + EGCG Cold-Pressed Eye Fluid with gentle lymphatic tap motions.',
      reason:
        'Under-eye vascular pooling or fluid fullness detected. Topical caffeine promotes micro-circulation and decongests delicate tissue.',
      triggeredByMetric: `Under-Eye Contour (UI Score: ${darkCircle?.ui_score ?? eyeBag?.ui_score})`,
    });
  }

  return suggestions;
}
