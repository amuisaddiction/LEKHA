export interface YouCamMetric {
  type: string;
  ui_score: number;
  raw_score: number;
  mask_urls?: string[];
  subcategories?: Record<string, unknown>;
  extra?: Record<string, unknown>;
}

export interface MetricDefinition {
  id: string;
  label: string;
  category: 'texture' | 'tone' | 'hydration' | 'aging' | 'eyes';
  description: string;
  goodDirection: 'higher' | 'lower'; // higher score usually means healthier skin (fewer concerns)
  whatItMeans: string;
  skincareRelevance: string;
}

export interface ScanQualityCheck {
  brightness: number; // 0 to 100
  brightnessStatus: 'too_dark' | 'optimal' | 'too_bright';
  sharpness: number; // arbitrary sharpness score
  sharpnessStatus: 'blurry' | 'acceptable' | 'sharp';
  width: number;
  height: number;
  resolutionStatus: 'low' | 'good' | 'high';
  isSuitableForScan: boolean;
  notes: string[];
}

export interface SkinScanRecord {
  id: string;
  timestamp: string; // ISO string
  dateFormatted: string;
  name: string;
  thumbnailUrl: string; // Data URL for persistent thumbnail
  apiVersion: string;
  metrics: YouCamMetric[];
  qualityCheck?: ScanQualityCheck;
  overall?: {
    skin_type?: string;
    skin_age?: number;
    overall_score?: number;
  };
  userNotes?: string;
}

export interface ComparisonDelta {
  type: string;
  label: string;
  baselineUiScore: number;
  currentUiScore: number;
  uiDelta: number;
  baselineRawScore: number;
  currentRawScore: number;
  rawDelta: number;
  trend: 'improved' | 'unchanged' | 'declined';
  explanation: string;
}

export interface ComparisonConfidence {
  overallConfidence: 'high' | 'moderate' | 'cautious';
  factors: {
    lightingMatch: 'consistent' | 'divergent';
    resolutionMatch: 'consistent' | 'divergent';
    timeGapDays: number;
  };
  caveats: string[];
}

export interface RoutineSuggestion {
  id: string;
  stepNumber: number;
  timeOfDay: 'AM' | 'PM' | 'BOTH';
  step: string;
  category: string;
  suggestion: string;
  ingredientSpotlight: string;
  reason: string;
  howToApply: string;
  triggeredByMetric: string;
  isCustomizedForProfile?: boolean;
}

export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive' | 'unsure';

export interface UserSkinProfile {
  skinType: SkinType;
  skinBehavior: string[];
  primaryConcerns: string[];
  currentRoutineSteps: string[];
  sensitivities: string[];
  notes?: string;
  lastUpdated: string;
}

export interface DailyRoutineTrackerState {
  date: string; // YYYY-MM-DD
  completedStepIds: string[];
}
