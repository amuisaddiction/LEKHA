import type { MetricDefinition } from '../types/skin';

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  texture: {
    id: 'texture',
    label: 'Skin Texture',
    category: 'texture',
    description: 'Evaluates microscopic surface smoothness and cellular uniformity across the face.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores reflect smoother, more even epidermal texture with minimal micro-roughness.',
    skincareRelevance:
      'Helps track the efficacy of gentle chemical exfoliants (AHAs/PHAs) and cellular barrier hydrators over time.',
  },
  pore: {
    id: 'pore',
    label: 'Pore Refinement',
    category: 'texture',
    description: 'Measures visible follicular dilation and surface congestion across cheeks, nose, and forehead.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores indicate tighter, less visible pore structures and clearer follicular pores.',
    skincareRelevance:
      'Niacinamide, salicylic acid (BHA), and clay purification routines can be monitored against this metric.',
  },
  wrinkle: {
    id: 'wrinkle',
    label: 'Wrinkles & Lines',
    category: 'aging',
    description: 'Detects depth and prominence of expression creases, fine lines, and structural folds.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores indicate firmer, smoother skin with fewer fine lines or shallower crease depth.',
    skincareRelevance:
      'Tracks how peptide complexes, retinoids, and consistent daily sun protection preserve dermal collagen.',
  },
  acne: {
    id: 'acne',
    label: 'Blemish Clarity',
    category: 'tone',
    description: 'Identifies active inflammatory bumps, comedones, and superficial skin breakouts.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores represent clearer skin with minimal active breakout clusters.',
    skincareRelevance:
      'Validates calming ingredients (azelaic acid, zinc PCA, centella asiatica) and clarifying treatments.',
  },
  age_spot: {
    id: 'age_spot',
    label: 'Spots & Pigmentation',
    category: 'tone',
    description: 'Detects localized hyper-pigmentation, sun spots, and post-inflammatory erythema marks.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores indicate more uniform melanin dispersion with fewer distinct dark spots.',
    skincareRelevance:
      'Indicates response to tyrosinase inhibitors like Vitamin C, tranexamic acid, and strict broad-spectrum UV defense.',
  },
  oiliness: {
    id: 'oiliness',
    label: 'Sebum Balance',
    category: 'hydration',
    description: 'Calculates dermal sebum emission levels across the forehead, nose (T-zone), and cheeks (U-zone).',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores indicate balanced, matte-healthy sebum production rather than excess shine or heavy grease.',
    skincareRelevance:
      'Guides choices between lightweight gel-emulsions versus lipid-rich balms.',
  },
  moisture: {
    id: 'moisture',
    label: 'Hydration Retention',
    category: 'hydration',
    description: 'Estimates moisture plumpness and epidermal water content within the stratum corneum.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores reflect plump, well-hydrated skin with healthy water-binding capacity.',
    skincareRelevance:
      'Highlights the necessity for humectants (glycerin, hyaluronic acid) and barrier occlusives (ceramides).',
  },
  redness: {
    id: 'redness',
    label: 'Calmness & Vascular Clarity',
    category: 'tone',
    description: 'Maps diffuse redness, flushing, and micro-capillary reactivity across sensitive zones.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores indicate calm, resilient skin with minimal visible irritation or vascular flushing.',
    skincareRelevance:
      'Identifies barrier sensitivity triggers and confirms soothing agents (panthenol, bisabolol, madecassoside).',
  },
  radiance: {
    id: 'radiance',
    label: 'Luminosity',
    category: 'tone',
    description: 'Evaluates how evenly natural light diffuses and reflects across high facial contours.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores denote natural radiance, vital light diffusion, and healthy cellular turnover.',
    skincareRelevance:
      'Directly reflects skin hydration and dead cell shedding supported by antioxidant serums and adequate sleep.',
  },
  firmness: {
    id: 'firmness',
    label: 'Skin Firmness',
    category: 'aging',
    description: 'Analyzes structural bounce, dermal tension, and resistance to gravitational laxity.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores correlate with supple, elastic skin showing resilient structural tone.',
    skincareRelevance:
      'Informed by lifestyle factors (hydration, sun exposure) and firming peptide or growth-factor formulations.',
  },
  dark_circle_v2: {
    id: 'dark_circle_v2',
    label: 'Under-Eye Tone',
    category: 'eyes',
    description: 'Measures pigmentary and vascular pooling in the delicate peri-orbital skin beneath the eyes.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores indicate brighter, clearer infraorbital zones with less shadowing.',
    skincareRelevance:
      'Caffeine, Vitamin K analogs, and sufficient circadian rest directly correlate with improvements here.',
  },
  eye_bag: {
    id: 'eye_bag',
    label: 'Eye Contour Smoothness',
    category: 'eyes',
    description: 'Evaluates lower eyelid fullness, fluid retention puffiness, and tissue displacement.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores signify smoother, flatter lower eye contours without fluid accumulation.',
    skincareRelevance:
      'Reflects lymphatic drainage, sodium intake, sleep position, and topical cooling roll-on treatments.',
  },
  droopy_upper_eyelid: {
    id: 'droopy_upper_eyelid',
    label: 'Upper Eyelid Lift',
    category: 'eyes',
    description: 'Evaluates upper lid crease elevation and structural hooding above the lash line.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores indicate an open, lifted upper orbital crease with minimal cutaneous hooding.',
    skincareRelevance:
      'Tracks general orbital elasticity and moisture retention around the delicate eyelid tissue.',
  },
  droopy_lower_eyelid: {
    id: 'droopy_lower_eyelid',
    label: 'Lower Eyelid Tone',
    category: 'eyes',
    description: 'Evaluates firmness and tension along the lower lid margin.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores reflect taut, resilient lower lid margins without slackness.',
    skincareRelevance:
      'Encourages gentle patting application of eye creams rather than harsh rubbing or tugging.',
  },
  tear_trough: {
    id: 'tear_trough',
    label: 'Tear Trough Contour',
    category: 'eyes',
    description: 'Analyzes the hollow depression extending from the inner corner of the eye down across the upper cheek.',
    goodDirection: 'higher',
    whatItMeans:
      'Higher scores indicate smoother volume continuity between the lower eye and mid-cheek.',
    skincareRelevance:
      'Highlights deep hydration and collagen support for the delicate infraorbital transition zone.',
  },
  skin_type: {
    id: 'skin_type',
    label: 'Skin Type Classification',
    category: 'hydration',
    description: 'Algorithmic categorization of skin behavior based on differential zonal sebum distribution.',
    goodDirection: 'higher',
    whatItMeans:
      'Categorizes whether your skin profile is Balanced/Normal, Combination, Dry, or Oily.',
    skincareRelevance:
      'Forms the foundation of your core routine formulation (emulsion, cream, gel, or balm).',
  },
};

export function getMetricDefinition(type: string): MetricDefinition {
  return (
    METRIC_DEFINITIONS[type] || {
      id: type,
      label: type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      category: 'texture',
      description: `YouCam analysis for ${type}.`,
      goodDirection: 'higher',
      whatItMeans: 'Measured by YouCam AI Skin Diagnostic Engine.',
      skincareRelevance: 'Helps document specific skin characteristics over time.',
    }
  );
}
