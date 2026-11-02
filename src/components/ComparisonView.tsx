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
  ExternalLink,
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

      <p className="eyebrow">DIAGNOSTIC TIME GAP / SIDE-BY-SIDE INVENTORY</p>
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3a1f2e] m-0 mb-3">
        Skin <i>Comparison.</i>
      </h1>
      <p className="sub max-w-2xl mb-8">
        Observe how your skin's diagnostic parameters evolve across time. Contrast two dated
        photographs alongside an honest evaluation of camera, resolution, and lighting consistency.
      </p>

      {/* Prominent Side-by-Side Dual Portrait Studio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        {/* Left Column: Baseline Capture */}
        <div className="bg-[#fffaf7] p-5 border border-[#eadbd7] shadow-xs flex flex-col justify-between">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between border-b border-[#f0dedb] pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e3b5a] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8e3b5a]"></span>
                01 / BASELINE CAPTURE (EARLIER)
              </span>
              {baselineRecord && (
                <span className="text-[11px] font-mono text-[#806b70]">
                  {baselineRecord.dateFormatted}
                </span>
              )}
            </div>

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
          </div>

          {baselineRecord && (
            <div className="space-y-4">
              {/* Prominent High-Resolution Portrait Display */}
              <div className="aspect-[3/4] max-h-[380px] w-full bg-[#f1e4e0] overflow-hidden border border-[#d9b8b6] relative shadow-inner">
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
                  <span className="text-[10px] text-[#9a7479] font-mono">
                    Engine {baselineRecord.apiVersion.toUpperCase()} · {baselineRecord.metrics.length} metrics
                  </span>
                </div>

                <button
                  onClick={() => onOpenRecord(baselineRecord)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8e3b5a] underline hover:text-[#3a1f2e]"
                >
                  <span>Inspect Scan</span>
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Comparison Capture */}
        <div className="bg-[#fffaf7] p-5 border border-[#eadbd7] shadow-xs flex flex-col justify-between">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between border-b border-[#f0dedb] pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e3b5a] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8e3b5a]"></span>
                02 / COMPARISON CAPTURE (RECENT)
              </span>
              {currentRecord && (
                <span className="text-[11px] font-mono text-[#806b70]">
                  {currentRecord.dateFormatted}
                </span>
              )}
            </div>

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
          </div>

          {currentRecord && (
            <div className="space-y-4">
              {/* Prominent High-Resolution Portrait Display */}
              <div className="aspect-[3/4] max-h-[380px] w-full bg-[#f1e4e0] overflow-hidden border border-[#d9b8b6] relative shadow-inner">
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
                <div className="absolute bottom-2 left-2 bg-[#3a1f2e]/85 text-white font-mono text-[9px] uppercase px-2 py-1">
                  Current · {currentRecord.dateFormatted}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-serif text-base text-[#3a1f2e] m-0">
                    {currentRecord.name}
                  </h4>
                  <span className="text-[10px] text-[#9a7479] font-mono">
                    Engine {currentRecord.apiVersion.toUpperCase()} · {currentRecord.metrics.length} metrics
                  </span>
                </div>

                <button
                  onClick={() => onOpenRecord(currentRecord)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8e3b5a] underline hover:text-[#3a1f2e]"
                >
                  <span>Inspect Scan</span>
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {baselineId === currentId ? (
        <div className="p-10 text-center bg-[#fdf8f5] border border-[#eadbd7] text-xs text-[#806b70] space-y-2">
          <p className="font-serif text-lg text-[#3a1f2e] m-0">Same scan selected</p>
          <p className="m-0">Please select two different scans above to evaluate changes over time.</p>
        </div>
      ) : !comparisonResult ? (
        <div className="p-10 text-center bg-[#fdf8f5] border border-[#eadbd7] text-xs text-[#806b70]">
          Unable to compare the selected records. Ensure both scans contain valid metric arrays.
        </div>
      ) : (
        <div className="space-y-8 mt-6">
          {/* Comparison Confidence Card */}
          <div className="bg-[#fcf5f3] p-6 border border-[#eadbd7] space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0dedb] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#8e3b5a]" />
                <h3 className="font-serif text-lg text-[#3a1f2e] m-0">
                  Comparison Confidence Assessment
                </h3>
              </div>

              <div
                className={`text-[11px] font-mono uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5 border ${
                  comparisonResult.confidence.overallConfidence === 'high'
                    ? 'bg-[#e2ede0] text-[#34582f] border-[#c2ddbf]'
                    : comparisonResult.confidence.overallConfidence === 'moderate'
                    ? 'bg-[#fff0db] text-[#8c5d1d] border-[#f2d8b1]'
                    : 'bg-[#fbe4e2] text-[#8e3b5a] border-[#e8c0bd]'
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 border border-[#f0ddda]">
                <span className="text-[10px] font-mono uppercase text-[#9a7479] block">
                  Lighting Match
                </span>
                <b
                  className={`block mt-1 text-sm font-serif ${
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

              <div className="bg-white p-3.5 border border-[#f0ddda]">
                <span className="text-[10px] font-mono uppercase text-[#9a7479] block">
                  Resolution Match
                </span>
                <b
                  className={`block mt-1 text-sm font-serif ${
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

              <div className="bg-white p-3.5 border border-[#f0ddda]">
                <span className="text-[10px] font-mono uppercase text-[#9a7479] block">
                  Time Elapsed
                </span>
                <b className="block mt-1 text-sm font-serif text-[#3a1f2e]">
                  {comparisonResult.confidence.factors.timeGapDays === 0
                    ? 'Same day capture'
                    : `${comparisonResult.confidence.factors.timeGapDays} days apart`}
                </b>
              </div>
            </div>

            {comparisonResult.confidence.caveats.length > 0 && (
              <div className="pt-3 border-t border-[#f0ddda] space-y-1.5 text-xs text-[#705c60]">
                {comparisonResult.confidence.caveats.map((caveat, idx) => (
                  <p key={idx} className="flex items-start gap-2 leading-relaxed m-0">
                    <Info size={13} className="text-[#c98f94] shrink-0 mt-0.5" />
                    <span>{caveat}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Diagnostic Metric Variations Table */}
          <div className="bg-[#fffaf7] border border-[#eadbd7] overflow-x-auto shadow-xs">
            <div className="p-5 border-b border-[#eadbd7] flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-serif text-xl text-[#3a1f2e] m-0">
                Diagnostic Metric Variations
              </h3>
              <span className="text-[11px] font-mono text-[#9a7479]">
                BASELINE: {comparisonResult.baselineDate} → CURRENT: {comparisonResult.currentDate}
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
                  <th className="py-3 px-4">Context &amp; Scientific Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eadbd7]">
                {comparisonResult.deltas.map((d) => (
                  <tr key={d.type} className="hover:bg-[#fbf2ef]/70 transition-colors">
                    <td className="py-4 px-4 font-serif text-sm text-[#3a1f2e] font-medium">
                      {d.label}
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-xs text-[#806b70]">
                      {d.baselineUiScore}
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-xs font-semibold text-[#3a1f2e]">
                      {d.currentUiScore}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-0.5 border ${
                          d.trend === 'improved'
                            ? 'bg-[#e2ede0] text-[#34582f] border-[#c2ddbf]'
                            : d.trend === 'declined'
                            ? 'bg-[#fbe4e2] text-[#8e3b5a] border-[#e8c0bd]'
                            : 'bg-[#f2e7e4] text-[#856f72] border-[#e2d0cd]'
                        }`}
                      >
                        {d.trend === 'improved' && <TrendingUp size={12} />}
                        {d.trend === 'declined' && <TrendingDown size={12} />}
                        {d.trend === 'unchanged' && <Minus size={12} />}
                        <span>{d.uiDelta > 0 ? `+${d.uiDelta}` : d.uiDelta}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-[11px] text-[#786165]">
                      {d.rawDelta > 0 ? `+${d.rawDelta}` : d.rawDelta}
                    </td>

                    <td className="py-4 px-4 text-[#705c60] text-[11px] leading-relaxed max-w-sm">
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
