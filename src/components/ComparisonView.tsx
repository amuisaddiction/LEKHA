import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info,
} from 'lucide-react';
import type { SkinScanRecord } from '../types/skin';
import { compareSkinScans } from '../utils/comparisonEngine';

interface ComparisonViewProps {
  records: SkinScanRecord[];
  onBackToPassport: () => void;
  onOpenRecord: (record: SkinScanRecord) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  records,
  onBackToPassport,
  onOpenRecord,
}) => {
  const [baselineId, setBaselineId] = useState<string>(
    records.length > 1 ? records[records.length - 1].id : records[0]?.id || ''
  );
  const [currentId, setCurrentId] = useState<string>(
    records[0]?.id || ''
  );

  const baselineRecord = useMemo(
    () => records.find((r) => r.id === baselineId),
    [records, baselineId]
  );
  const currentRecord = useMemo(
    () => records.find((r) => r.id === currentId),
    [records, currentId]
  );

  const comparisonResult = useMemo(() => {
    if (!baselineRecord || !currentRecord || baselineRecord.id === currentRecord.id) {
      return null;
    }
    return compareSkinScans(baselineRecord, currentRecord);
  }, [baselineRecord, currentRecord]);

  return (
    <main className="workspace">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#eadbd7]">
        <button
          onClick={onBackToPassport}
          className="inline-flex items-center gap-1.5 text-xs text-[#806b70] hover:text-[#3a1f2e] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Skin Passport</span>
        </button>

        <span className="text-xs uppercase tracking-wider text-[#9a7479] font-mono">
          Honest Progress Evaluation
        </span>
      </div>

      <p className="eyebrow">SKIN EVOLUTION TRACKER</p>
      <h1>
        Skin <i>Comparison.</i>
      </h1>
      <p className="sub">
        Observe how your skin's diagnostic parameters evolve across time. Contrast two dated
        readings alongside an honest evaluation of camera and lighting consistency.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="bg-[#fffaf7] p-4 border border-[#eadbd7] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a7479]">
              01 / BASELINE SCAN (EARLIER)
            </span>
            {baselineRecord && (
              <span className="text-[11px] text-[#806b70]">{baselineRecord.dateFormatted}</span>
            )}
          </div>

          <select
            value={baselineId}
            onChange={(e) => setBaselineId(e.target.value)}
            className="w-full bg-[#fbf2ef] border border-[#d9b8b6] p-2.5 text-xs text-[#3a1f2e] font-medium outline-none focus:border-[#8e3b5a]"
          >
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.dateFormatted} — {r.name}
              </option>
            ))}
          </select>

          {baselineRecord && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 bg-[#f1e4e0] shrink-0 overflow-hidden border border-[#eadbd7]">
                  <img
                    src={baselineRecord.thumbnailUrl}
                    alt="Baseline"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-serif text-sm font-semibold text-[#3a1f2e]">
                    {baselineRecord.name}
                  </p>
                  <p className="text-[10px] text-[#9a7479]">
                    {baselineRecord.metrics.length} metrics recorded
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenRecord(baselineRecord)}
                className="text-[11px] text-[#8e3b5a] underline hover:text-[#3a1f2e]"
              >
                View Full
              </button>
            </div>
          )}
        </div>

        <div className="bg-[#fffaf7] p-4 border border-[#eadbd7] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a7479]">
              02 / COMPARISON SCAN (RECENT)
            </span>
            {currentRecord && (
              <span className="text-[11px] text-[#806b70]">{currentRecord.dateFormatted}</span>
            )}
          </div>

          <select
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            className="w-full bg-[#fbf2ef] border border-[#d9b8b6] p-2.5 text-xs text-[#3a1f2e] font-medium outline-none focus:border-[#8e3b5a]"
          >
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.dateFormatted} — {r.name}
              </option>
            ))}
          </select>

          {currentRecord && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 bg-[#f1e4e0] shrink-0 overflow-hidden border border-[#eadbd7]">
                  <img
                    src={currentRecord.thumbnailUrl}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-serif text-sm font-semibold text-[#3a1f2e]">
                    {currentRecord.name}
                  </p>
                  <p className="text-[10px] text-[#9a7479]">
                    {currentRecord.metrics.length} metrics recorded
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenRecord(currentRecord)}
                className="text-[11px] text-[#8e3b5a] underline hover:text-[#3a1f2e]"
              >
                View Full
              </button>
            </div>
          )}
        </div>
      </div>

      {baselineId === currentId ? (
        <div className="p-8 text-center bg-[#fdf8f5] border border-[#eadbd7] text-xs text-[#806b70]">
          Please select two different scans above to evaluate changes between them.
        </div>
      ) : !comparisonResult ? (
        <div className="p-8 text-center bg-[#fdf8f5] border border-[#eadbd7] text-xs text-[#806b70]">
          Unable to compare the selected records.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-[#fcf5f3] p-5 border border-[#eadbd7] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#8e3b5a]" />
                <h3 className="font-serif text-base text-[#3a1f2e]">
                  Comparison Confidence Assessment
                </h3>
              </div>

              <div
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 flex items-center gap-1.5 ${
                  comparisonResult.confidence.overallConfidence === 'high'
                    ? 'bg-[#e2ede0] text-[#34582f]'
                    : comparisonResult.confidence.overallConfidence === 'moderate'
                    ? 'bg-[#fff0db] text-[#8c5d1d]'
                    : 'bg-[#fbe4e2] text-[#8e3b5a]'
                }`}
              >
                {comparisonResult.confidence.overallConfidence === 'high' && (
                  <CheckCircle2 size={13} />
                )}
                {comparisonResult.confidence.overallConfidence === 'moderate' && (
                  <AlertTriangle size={13} />
                )}
                {comparisonResult.confidence.overallConfidence === 'cautious' && (
                  <AlertTriangle size={13} />
                )}
                <span>
                  {comparisonResult.confidence.overallConfidence === 'high'
                    ? 'High Comparison Confidence'
                    : comparisonResult.confidence.overallConfidence === 'moderate'
                    ? 'Moderate Consistency'
                    : 'Cautious Interpretation Advised'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 border border-[#f0ddda]">
                <span className="text-[10px] uppercase text-[#9a7479] block">
                  Lighting Match
                </span>
                <b
                  className={`block mt-1 ${
                    comparisonResult.confidence.factors.lightingMatch === 'consistent'
                      ? 'text-[#34582f]'
                      : 'text-[#8e3b5a]'
                  }`}
                >
                  {comparisonResult.confidence.factors.lightingMatch === 'consistent'
                    ? 'Even Exposure Match'
                    : 'Divergent Exposure'}
                </b>
              </div>

              <div className="bg-white p-3 border border-[#f0ddda]">
                <span className="text-[10px] uppercase text-[#9a7479] block">
                  Resolution Match
                </span>
                <b
                  className={`block mt-1 ${
                    comparisonResult.confidence.factors.resolutionMatch === 'consistent'
                      ? 'text-[#34582f]'
                      : 'text-[#8e3b5a]'
                  }`}
                >
                  {comparisonResult.confidence.factors.resolutionMatch === 'consistent'
                    ? 'Consistent Scale'
                    : 'Resolution Variance'}
                </b>
              </div>

              <div className="bg-white p-3 border border-[#f0ddda]">
                <span className="text-[10px] uppercase text-[#9a7479] block">
                  Time Elapsed
                </span>
                <b className="block mt-1 text-[#3a1f2e]">
                  {comparisonResult.confidence.factors.timeGapDays === 0
                    ? 'Same day capture'
                    : `${comparisonResult.confidence.factors.timeGapDays} days apart`}
                </b>
              </div>
            </div>

            {comparisonResult.confidence.caveats.length > 0 && (
              <div className="pt-2 border-t border-[#f0ddda] space-y-1.5 text-xs text-[#705c60]">
                {comparisonResult.confidence.caveats.map((caveat, idx) => (
                  <p key={idx} className="flex items-start gap-2 leading-relaxed">
                    <Info size={13} className="text-[#c98f94] shrink-0 mt-0.5" />
                    <span>{caveat}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#fffaf7] border border-[#eadbd7] overflow-x-auto">
            <div className="p-4 border-b border-[#eadbd7] flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#3a1f2e]">
                Diagnostic Metric Variations
              </h3>
              <span className="text-[11px] text-[#9a7479]">
                Baseline: {comparisonResult.baselineDate} → Current: {comparisonResult.currentDate}
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8ede9] border-b border-[#eadbd7] text-[10px] font-mono uppercase tracking-wider text-[#9a7479]">
                  <th className="py-3 px-4">Metric Dimension</th>
                  <th className="py-3 px-4 text-center">Baseline UI</th>
                  <th className="py-3 px-4 text-center">Current UI</th>
                  <th className="py-3 px-4 text-center">UI Shift</th>
                  <th className="py-3 px-4 text-center">Raw Shift</th>
                  <th className="py-3 px-4">Context &amp; Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eadbd7]">
                {comparisonResult.deltas.map((d) => (
                  <tr key={d.type} className="hover:bg-[#fbf2ef]/60 transition-colors">
                    <td className="py-3.5 px-4 font-serif text-sm text-[#3a1f2e] font-medium">
                      {d.label}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-xs text-[#806b70]">
                      {d.baselineUiScore}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold text-[#3a1f2e]">
                      {d.currentUiScore}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          d.trend === 'improved'
                            ? 'bg-[#e2ede0] text-[#34582f]'
                            : d.trend === 'declined'
                            ? 'bg-[#fbe4e2] text-[#8e3b5a]'
                            : 'bg-[#f2e7e4] text-[#856f72]'
                        }`}
                      >
                        {d.trend === 'improved' && <TrendingUp size={12} />}
                        {d.trend === 'declined' && <TrendingDown size={12} />}
                        {d.trend === 'unchanged' && <Minus size={12} />}
                        <span>{d.uiDelta > 0 ? `+${d.uiDelta}` : d.uiDelta}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[#786165]">
                      {d.rawDelta > 0 ? `+${d.rawDelta}` : d.rawDelta}
                    </td>

                    <td className="py-3.5 px-4 text-[#705c60] text-[11px] leading-relaxed max-w-xs">
                      {d.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
};
