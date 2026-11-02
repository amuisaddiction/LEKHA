import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { SkinScanRecord } from '../types/skin';
import { compareSkinScans } from '../utils/comparisonEngine';

interface ComparisonViewProps {
  records: SkinScanRecord[];
  onBackToPassport: () => void;
  onOpenRecord: (record: SkinScanRecord) => void;
}

// Sample comparison records for demonstration when user has < 2 scans
const SAMPLE_BASELINE: SkinScanRecord = {
  id: 'sample_baseline',
  timestamp: '2026-10-01T10:00:00Z',
  dateFormatted: 'Oct 1, 2026 · Baseline (Day 1)',
  name: 'Baseline Capture (Sample)',
  thumbnailUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=80',
  apiVersion: 'v2.1',
  overall: {
    skin_age: 30,
    overall_score: 84,
  },
  qualityCheck: {
    brightness: 55,
    brightnessStatus: 'optimal',
    sharpness: 80,
    sharpnessStatus: 'sharp',
    width: 1080,
    height: 1440,
    resolutionStatus: 'high',
    isSuitableForScan: true,
    notes: ['Direct diffuse daylight', 'Sharp camera focus'],
  },
  metrics: [
    { type: 'texture', ui_score: 82, raw_score: 83.5 },
    { type: 'pore', ui_score: 81, raw_score: 82.0 },
    { type: 'moisture', ui_score: 76, raw_score: 75.3 },
    { type: 'redness', ui_score: 78, raw_score: 76.9 },
    { type: 'oiliness', ui_score: 92, raw_score: 93.1 },
    { type: 'wrinkle', ui_score: 86, raw_score: 90.2 },
    { type: 'age_spot', ui_score: 92, raw_score: 94.0 },
    { type: 'acne', ui_score: 86, raw_score: 87.5 },
  ],
};

const SAMPLE_CURRENT: SkinScanRecord = {
  id: 'sample_current',
  timestamp: '2026-10-28T10:00:00Z',
  dateFormatted: 'Oct 28, 2026 · Follow-Up (Day 28)',
  name: 'Follow-Up Capture (Sample)',
  thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
  apiVersion: 'v2.1',
  overall: {
    skin_age: 28,
    overall_score: 89,
  },
  qualityCheck: {
    brightness: 58,
    brightnessStatus: 'optimal',
    sharpness: 84,
    sharpnessStatus: 'sharp',
    width: 1080,
    height: 1440,
    resolutionStatus: 'high',
    isSuitableForScan: true,
    notes: ['Even ambient daylight', 'Consistent focal plane'],
  },
  metrics: [
    { type: 'texture', ui_score: 88, raw_score: 91.2 },
    { type: 'pore', ui_score: 87, raw_score: 89.8 },
    { type: 'moisture', ui_score: 84, raw_score: 85.1 },
    { type: 'redness', ui_score: 82, raw_score: 80.4 },
    { type: 'oiliness', ui_score: 95, raw_score: 96.5 },
    { type: 'wrinkle', ui_score: 89, raw_score: 93.0 },
    { type: 'age_spot', ui_score: 94, raw_score: 97.2 },
    { type: 'acne', ui_score: 90, raw_score: 92.8 },
  ],
};

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  records,
  onBackToPassport,
  onOpenRecord,
}) => {
  const isDemo = records.length < 2;

  const [baselineId, setBaselineId] = useState<string>(
    records.length >= 2 ? records[records.length - 1].id : SAMPLE_BASELINE.id
  );
  const [currentId, setCurrentId] = useState<string>(
    records.length >= 2 ? records[0].id : SAMPLE_CURRENT.id
  );

  const baselineRecord = useMemo(() => {
    if (isDemo) return SAMPLE_BASELINE;
    return records.find((r) => r.id === baselineId) || records[0];
  }, [records, baselineId, isDemo]);

  const currentRecord = useMemo(() => {
    if (isDemo) return SAMPLE_CURRENT;
    return records.find((r) => r.id === currentId) || records[0];
  }, [records, currentId, isDemo]);

  const comparisonResult = useMemo(() => {
    if (!baselineRecord || !currentRecord) return null;
    return compareSkinScans(baselineRecord, currentRecord);
  }, [baselineRecord, currentRecord]);

  return (
    <main className="workspace">
      {/* Top Breadcrumb & Badge */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#eadbd7]">
        <button
          onClick={onBackToPassport}
          className="inline-flex items-center gap-1.5 text-xs text-[#806b70] hover:text-[#3a1f2e] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Skin Passport</span>
        </button>

        <span className="text-xs uppercase tracking-wider text-[#9a7479] font-mono">
          Honest Temporal Evolution
        </span>
      </div>

      <p className="eyebrow">DIAGNOSTIC TIME GAP / SIDE-BY-SIDE STUDIO</p>
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3a1f2e] m-0 mb-3">
        Skin <i>Comparison.</i>
      </h1>
      <p className="sub max-w-2xl mb-6">
        Observe how your skin's diagnostic parameters evolve across time. Contrast two dated
        photographs alongside an honest evaluation of camera, resolution, and lighting consistency.
      </p>

      {/* Demonstration Banner when user has < 2 scans */}
      {isDemo && (
        <div className="mb-6 p-4 bg-[#fdf2ef] border-l-4 border-[#8e3b5a] text-[#5c2a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#8e3b5a] shrink-0" />
            <div>
              <b className="text-[#3a1f2e]">Sample Comparison Walkthrough:</b>
              <span className="ml-1 text-[#7a4253]">
                You have {records.length} saved scan{records.length === 1 ? '' : 's'}. Below is a curated sample comparing a Day 1 Baseline against Day 28 Follow-Up to demonstrate how LEKHA evaluates deltas and lighting confidence.
              </span>
            </div>
          </div>
          <button
            onClick={onBackToPassport}
            className="bg-[#8e3b5a] text-white px-3.5 py-1.5 text-[11px] uppercase tracking-wider whitespace-nowrap self-start sm:self-center"
          >
            Capture Real Scans
          </button>
        </div>
      )}

      {/* Prominent Side-by-Side Dual Portrait Studio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        {/* Left Column: Baseline Capture */}
        <div className="bg-[#fffaf7] p-6 border border-[#eadbd7] shadow-xs flex flex-col justify-between">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between border-b border-[#f0dedb] pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e3b5a] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8e3b5a]"></span>
                01 / BASELINE CAPTURE (EARLIER)
              </span>
              {baselineRecord && (
                <span className="text-[11px] font-mono text-[#806b70]">
                  {baselineRecord.dateFormatted}
                </span>
              )}
            </div>

            {!isDemo && (
              <select
                value={baselineId}
                onChange={(e) => setBaselineId(e.target.value)}
                className="w-full bg-[#fbf2ef] border border-[#d9b8b6] p-2.5 text-xs text-[#3a1f2e] font-medium outline-none focus:border-[#8e3b5a] font-mono"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.dateFormatted} — {r.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {baselineRecord && (
            <div className="space-y-4">
              {/* Prominent High-Resolution Portrait Display */}
              <div className="aspect-[3/4] max-h-[420px] w-full bg-[#f1e4e0] overflow-hidden border border-[#d9b8b6] relative shadow-inner">
                {baselineRecord.thumbnailUrl ? (
                  <img
                    src={baselineRecord.thumbnailUrl}
                    alt={baselineRecord.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8e3b5a] font-serif text-3xl">
                    L.
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-[#3a1f2e]/85 text-white font-mono text-[9px] uppercase px-2 py-1">
                  Baseline · {baselineRecord.dateFormatted}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-serif text-base text-[#3a1f2e] m-0">
                    {baselineRecord.name}
                  </h4>
                  {baselineRecord.qualityCheck && (
                    <span className="text-[11px] text-[#9a7479] font-mono block">
                      Ambient Lux: {baselineRecord.qualityCheck.brightness}% · Sharpness: {baselineRecord.qualityCheck.sharpness}/100
                    </span>
                  )}
                </div>
                {!isDemo && (
                  <button
                    onClick={() => onOpenRecord(baselineRecord)}
                    className="text-xs text-[#8e3b5a] hover:underline inline-flex items-center gap-1 font-mono uppercase"
                  >
                    <span>View Record</span>
                    <ExternalLink size={11} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Follow-Up / Current Capture */}
        <div className="bg-[#fffaf7] p-6 border border-[#eadbd7] shadow-xs flex flex-col justify-between">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between border-b border-[#f0dedb] pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#416938] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#416938]"></span>
                02 / COMPARISON CAPTURE (RECENT)
              </span>
              {currentRecord && (
                <span className="text-[11px] font-mono text-[#806b70]">
                  {currentRecord.dateFormatted}
                </span>
              )}
            </div>

            {!isDemo && (
              <select
                value={currentId}
                onChange={(e) => setCurrentId(e.target.value)}
                className="w-full bg-[#fbf2ef] border border-[#d9b8b6] p-2.5 text-xs text-[#3a1f2e] font-medium outline-none focus:border-[#8e3b5a] font-mono"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.dateFormatted} — {r.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {currentRecord && (
            <div className="space-y-4">
              {/* Prominent High-Resolution Portrait Display */}
              <div className="aspect-[3/4] max-h-[420px] w-full bg-[#f1e4e0] overflow-hidden border border-[#d9b8b6] relative shadow-inner">
                {currentRecord.thumbnailUrl ? (
                  <img
                    src={currentRecord.thumbnailUrl}
                    alt={currentRecord.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8e3b5a] font-serif text-3xl">
                    L.
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-[#416938]/85 text-white font-mono text-[9px] uppercase px-2 py-1">
                  Follow-up · {currentRecord.dateFormatted}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-serif text-base text-[#3a1f2e] m-0">
                    {currentRecord.name}
                  </h4>
                  {currentRecord.qualityCheck && (
                    <span className="text-[11px] text-[#9a7479] font-mono block">
                      Ambient Lux: {currentRecord.qualityCheck.brightness}% · Sharpness: {currentRecord.qualityCheck.sharpness}/100
                    </span>
                  )}
                </div>
                {!isDemo && (
                  <button
                    onClick={() => onOpenRecord(currentRecord)}
                    className="text-xs text-[#8e3b5a] hover:underline inline-flex items-center gap-1 font-mono uppercase"
                  >
                    <span>View Record</span>
                    <ExternalLink size={11} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Confidence Evaluation Card */}
      {comparisonResult && (
        <div className="my-8 bg-[#fdf8f6] border border-[#d9b8b6] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eedbd7] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#8e3b5a]" />
              <b className="font-serif text-lg text-[#3a1f2e]">
                Comparison Confidence Rating
              </b>
            </div>

            <span
              className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full ${
                comparisonResult.confidence.overallConfidence === 'high'
                  ? 'bg-[#e2ede0] text-[#34582f] border border-[#bcd6b8]'
                  : comparisonResult.confidence.overallConfidence === 'moderate'
                  ? 'bg-[#fdf3e2] text-[#825c1d] border border-[#ecd09d]'
                  : 'bg-[#f7dedc] text-[#8e3b5a] border border-[#e5a0aa]'
              }`}
            >
              {comparisonResult.confidence.overallConfidence === 'high'
                ? 'High Scientific Confidence'
                : comparisonResult.confidence.overallConfidence === 'moderate'
                ? 'Moderate Consistency'
                : 'Interpret with Caution'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/80 p-3 border border-[#eedbd7]">
              <span className="text-[10px] text-[#9a7479] uppercase block font-mono">
                Lighting Match
              </span>
              <b className="text-[#3a1f2e] capitalize block mt-0.5">
                {comparisonResult.confidence.factors.lightingMatch}
              </b>
            </div>
            <div className="bg-white/80 p-3 border border-[#eedbd7]">
              <span className="text-[10px] text-[#9a7479] uppercase block font-mono">
                Resolution Match
              </span>
              <b className="text-[#3a1f2e] capitalize block mt-0.5">
                {comparisonResult.confidence.factors.resolutionMatch}
              </b>
            </div>
            <div className="bg-white/80 p-3 border border-[#eedbd7]">
              <span className="text-[10px] text-[#9a7479] uppercase block font-mono">
                Time Interval
              </span>
              <b className="text-[#3a1f2e] block mt-0.5">
                {comparisonResult.confidence.factors.timeGapDays} Days Apart
              </b>
            </div>
          </div>

          {comparisonResult.confidence.caveats.length > 0 && (
            <div className="text-[11px] text-[#6d4b55] space-y-1.5 pt-2 border-t border-[#eedbd7]">
              {comparisonResult.confidence.caveats.map((c, i) => (
                <p key={i} className="flex items-start gap-1.5 leading-relaxed m-0">
                  <span className="text-[#8e3b5a] font-bold">•</span>
                  <span>{c}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Metric Deltas Table */}
      {comparisonResult && (
        <div className="space-y-4 my-8">
          <div className="flex items-center justify-between border-b border-[#eadbd7] pb-3">
            <div>
              <p className="eyebrow mb-1">METRIC-BY-METRIC VARIATION</p>
              <h3 className="font-serif text-2xl text-[#3a1f2e] m-0">
                Observed Parameter Shifts
              </h3>
            </div>
            <span className="text-xs text-[#806b70]">
              Baseline $\rightarrow$ Current
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonResult.deltas.map((d) => (
              <div
                key={d.type}
                className="bg-[#fffaf7] p-4 border border-[#eadbd7] space-y-2 hover:border-[#c98f94] transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#3a1f2e]">{d.label}</span>
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                      d.trend === 'improved'
                        ? 'bg-[#e2ede0] text-[#34582f]'
                        : d.trend === 'declined'
                        ? 'bg-[#f7dedc] text-[#8e3b5a]'
                        : 'bg-[#f0dfdc] text-[#705c60]'
                    }`}
                  >
                    {d.trend === 'improved' && <TrendingUp size={11} />}
                    {d.trend === 'declined' && <TrendingDown size={11} />}
                    {d.trend === 'unchanged' && <Minus size={11} />}
                    <span>{d.uiDelta > 0 ? `+${d.uiDelta}` : d.uiDelta}</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs text-[#705c60]">
                  <span>
                    Baseline: <b>{d.baselineUiScore}</b>
                  </span>
                  <span>$\rightarrow$</span>
                  <span>
                    Current: <b>{d.currentUiScore}</b>
                  </span>
                </div>

                <div className="text-[10px] text-[#9c8587] font-mono border-t border-[#f4e8e5] pt-1.5 flex items-center justify-between">
                  <span>Raw float shift:</span>
                  <b>{d.rawDelta > 0 ? `+${d.rawDelta}` : d.rawDelta}</b>
                </div>

                <p className="text-[11px] text-[#6d4b55] leading-snug pt-1 m-0">
                  {d.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
