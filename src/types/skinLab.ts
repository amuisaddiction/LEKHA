export type SkinLabTab = 'explorer' | 'routine' | 'diary' | 'goals' | 'compare';

export interface SkinFocusTopic {
  id: string;
  title: string;
  metricKey: string;
  categoryBadge: string;
  imageUrl: string;
  simpleExplanation: string;
  selfObservationCues: string[];
  dailyTrackingSuggestion: string;
  ingredientsToLookFor: string[];
  scientificContext: string;
}

export type ProductStepType =
  | 'cleanser'
  | 'toner'
  | 'essence'
  | 'serum'
  | 'treatment'
  | 'moisturizer'
  | 'sunscreen'
  | 'night_cream'
  | 'oil';

export interface CustomRoutineProduct {
  id: string;
  name: string;
  stepType: ProductStepType;
  ingredients: string[]; // Active ingredients e.g., ["Niacinamide", "Retinol"]
  notes?: string;
}

export interface UserRoutine {
  amProducts: CustomRoutineProduct[];
  pmProducts: CustomRoutineProduct[];
  lastUpdated: string;
}

export interface CompatibilityNotice {
  severity: 'warning' | 'caution' | 'info';
  title: string;
  description: string;
  conflictingIngredients: [string, string];
  recommendation: string;
}

export interface SkinDiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  dryness: 1 | 2 | 3 | 4 | 5; // 1 = supple, 5 = severe tightness/flaking
  oiliness: 1 | 2 | 3 | 4 | 5; // 1 = balanced/matte, 5 = excessive shine
  redness: 1 | 2 | 3 | 4 | 5; // 1 = calm/uniform, 5 = visible irritation/flushing
  breakouts: 1 | 2 | 3 | 4 | 5; // 1 = clear, 5 = multiple active blemishes
  irritation: 1 | 2 | 3 | 4 | 5; // 1 = comfortable, 5 = stinging/burning
  tags: string[]; // e.g., ["Wore SPF", "Used Retinoid", "Late Sleep", "Air Travel", "High Stress"]
  notes: string;
}

export interface SkinGoalTrack {
  id: string;
  title: string;
  tagline: string;
  description: string;
  targetFocus: string;
  dailyHabits: {
    id: string;
    label: string;
    timeOfDay: 'am' | 'pm' | 'any';
    whyItMatters: string;
  }[];
  cycleLength: 28;
  milestones: {
    day: number;
    title: string;
    dermatologicalInsight: string;
  }[];
}

export interface UserGoalProgress {
  goalId: string;
  startDate: string; // YYYY-MM-DD
  completedDates: string[]; // dates where habits were completed
  dailyHabitCompletions: Record<string, string[]>; // date -> completed habit IDs
}

export interface FaceConsistencyCheck {
  isLikelySameSubject: boolean;
  divergenceLevel: 'low' | 'moderate' | 'high';
  warningMessage?: string;
  details: {
    nameMatch: boolean;
    lightingDelta: number;
    resolutionDelta: number;
    timeGapDays: number;
  };
}
