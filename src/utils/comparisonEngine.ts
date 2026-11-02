import type {
  SkinScanRecord,
  ComparisonDelta,
  ComparisonConfidence,
} from '../types/skin';
import { getMetricDefinition } from './metricDefinitions';

export function compareSkinScans(
  baseline: SkinScanRecord,
  current: SkinScanRecord
): {
  deltas: ComparisonDelta[];
  confidence: ComparisonConfidence;
  baselineDate: string;
  currentDate: string;
} {
  const deltas: ComparisonDelta[] = [];
  const currentMetricMap = new Map(current.metrics.map((m) => [m.type, m]));

  for (const bMetric of baseline.metrics) {
    const cMetric = currentMetricMap.get(bMetric.type);
    if (!cMetric) continue;

    const def = getMetricDefinition(bMetric.type);
    const uiDelta = cMetric.ui_score - bMetric.ui_score;
    const rawDelta = Number((cMetric.raw_score - bMetric.raw_score).toFixed(2));

    let trend: 'improved' | 'unchanged' | 'declined' = 'unchanged';
    if (Math.abs(uiDelta) <= 2 && Math.abs(rawDelta) <= 1.2) {
      trend = 'unchanged';
    } else if (uiDelta > 2) {
      trend = 'improved';
    } else {
      trend = 'declined';
    }

    let explanation = '';
    if (trend === 'unchanged') {
      explanation = 'Consistent reading. Stable within natural measurement tolerance.';
    } else if (trend === 'improved') {
      explanation = `Higher score detected (+${uiDelta} UI points). Reflects fewer detected surface concerns.`;
    } else {
      explanation = `Score decreased by ${Math.abs(uiDelta)} UI points. May reflect temporary environmental factors.`;
    }

    deltas.push({
      type: bMetric.type,
      label: def.label,
      baselineUiScore: bMetric.ui_score,
      currentUiScore: cMetric.ui_score,
      uiDelta,
      baselineRawScore: bMetric.raw_score,
      currentRawScore: cMetric.raw_score,
      rawDelta,
      trend,
      explanation,
    });
  }

  const caveats: string[] = [];
  let lightingMatch: 'consistent' | 'divergent' = 'consistent';
  let resolutionMatch: 'consistent' | 'divergent' = 'consistent';

  if (baseline.qualityCheck && current.qualityCheck) {
    const lightDiff = Math.abs(baseline.qualityCheck.brightness - current.qualityCheck.brightness);
    if (lightDiff > 20) {
      lightingMatch = 'divergent';
      caveats.push(
        `Exposure levels vary by ${lightDiff}% between photos. Shifts in surface texture or redness can be influenced by lighting differences rather than biological skin changes.`
      );
    }

    const minResBase = Math.min(baseline.qualityCheck.width, baseline.qualityCheck.height);
    const minResCurr = Math.min(current.qualityCheck.width, current.qualityCheck.height);
    if (Math.abs(minResBase - minResCurr) > 500) {
      resolutionMatch = 'divergent';
      caveats.push(
        'The two images were captured at noticeably different camera resolutions. Higher resolution sensors reveal finer micro-pores and subtle details.'
      );
    }
  } else {
    caveats.push(
      'Detailed capture lighting metadata was not available for one of these scans. Comparison should be interpreted as general guidance.'
    );
  }

  const timeDiffMs = Math.abs(
    new Date(current.timestamp).getTime() - new Date(baseline.timestamp).getTime()
  );
  const timeGapDays = Math.round(timeDiffMs / (1000 * 60 * 60 * 24));

  if (timeGapDays < 3) {
    caveats.push(
      `These scans were recorded ${timeGapDays === 0 ? 'on the same day' : `${timeGapDays} days apart`}. True biological skin renewal cycles typically take 28–45 days; short-term variations often reflect hydration, salt intake, or sleep.`
    );
  }

  let overallConfidence: 'high' | 'moderate' | 'cautious' = 'high';
  if (lightingMatch === 'divergent' && resolutionMatch === 'divergent') {
    overallConfidence = 'cautious';
  } else if (lightingMatch === 'divergent' || resolutionMatch === 'divergent' || caveats.length >= 2) {
    overallConfidence = 'moderate';
  }

  return {
    deltas,
    confidence: {
      overallConfidence,
      factors: {
        lightingMatch,
        resolutionMatch,
        timeGapDays,
      },
      caveats,
    },
    baselineDate: baseline.dateFormatted || new Date(baseline.timestamp).toLocaleDateString(),
    currentDate: current.dateFormatted || new Date(current.timestamp).toLocaleDateString(),
  };
}
