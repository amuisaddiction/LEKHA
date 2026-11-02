import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  BookmarkCheck,
  Bookmark,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import type { SkinScanRecord, YouCamMetric } from '../types/skin';
import { getMetricDefinition } from '../utils/metricDefinitions';

interface ResultsViewProps {
  record: SkinScanRecord;
  isSavedInPassport: boolean;
  onSaveToPassport: () => void;
  onOpenRoutineGuidance: () => void;
  onNewScan: () => void;
}

type CategoryFilter = 'all' | 'texture' | 'tone' | 'hydration' | 'aging' | 'eyes';

export const ResultsView: React.FC<ResultsViewProps> = ({
  record,
  isSavedInPassport,
  onSaveToPassport,
  onOpenRoutineGuidance,
  onNewScan,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedMaskMetric, setSelectedMaskMetric] = useState<YouCamMetric | null>(null);
  const [maskLoadError, setMaskLoadError] = useState(false);

  // Group metrics and only show filter tabs for categories present in response
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: record.metrics.length,
      texture: 0,
      tone: 0,
      hydration: 0,
      aging: 0,
      eyes: 0,
    };
    for (const m of record.metrics) {
      const def = getMetricDefinition(m.type);
      if (counts[def.category] !== undefined) {
        counts[def.category]++;
      }
    }
    return counts;
  }, [record.metrics]);

  const availableTabs = useMemo(() => {
    const allTabOptions: { id: CategoryFilter; label: string }[] = [
      { id: 'all', label: `All Metrics (${record.metrics.length})` },
      { id: 'texture', label: `Texture & Pores (${categoryCounts.texture})` },
      { id: 'tone', label: `Tone & Clarity (${categoryCounts.tone})` },
      { id: 'hydration', label: `Hydration & Balance (${categoryCounts.hydration})` },
      { id: 'aging', label: `Signs of Aging (${categoryCounts.aging})` },
      { id: 'eyes', label: `Eye Contours (${categoryCounts.eyes})` },
    ];
    return allTabOptions.filter((t) => t.id === 'all' || (categoryCounts[t.id] && categoryCounts[t.id] > 0));
  }, [record.metrics.length, categoryCounts]);

  const filteredMetrics = record.metrics.filter((m) => {
    if (activeCategory === 'all') return true;
    const def = getMetricDefinition(m.type);
    return def.category === activeCategory;
  });

  const getScoreColor = (uiScore: number) => {
    if (uiScore >= 78) return 'text-[#3e6837]';
    if (uiScore >= 60) return 'text-[#856f72]';
    return 'text-[#8e3b5a]';
  };

  const getScoreBg = (uiScore: number) => {
    if (uiScore >= 78) return 'bg-[#416938]';
    if (uiScore >= 60) return 'bg-[#a3797f]';
    return 'bg-[#8e3b5a]';
  };

  const handleSelectMask = (metric: YouCamMetric | null) => {
    setMaskLoadError(false);
    setSelectedMaskMetric(metric);
  };

  return (
    <main className="workspace">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#eadbd7]">
        <button
          onClick={onNewScan}
          className="inline-flex items-center gap-1.5 text-xs text-[#806b70] hover:text-[#3a1f2e] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>New Analysis</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRoutineGuidance}
            className="inline-flex items-center gap-2 border border-[#d9b8b6] bg-white px-4 py-2.5 text-xs uppercase tracking-wider text-[#3a1f2e] hover:bg-[#f3ddda] transition-colors"
          >
            <Sparkles size={13} className="text-[#8e3b5a]" />
            <span>Skincare Routine</span>
          </button>

          <button
            onClick={onSaveToPassport}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all ${
              isSavedInPassport
                ? 'bg-[#e2ede0] text-[#34582f] border border-[#bcd6b8]'
                : 'dark'
            }`}
          >
            {isSavedInPassport ? (
              <>
                <BookmarkCheck size={14} />
                <span>Saved in Passport</span>
              </>
            ) : (
              <>
                <Bookmark size={14} />
                <span>Save to Passport</span>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="eyebrow">
        AUTHENTIC YOUCAM SKIN AI INTELLIGENCE · ENGINE {record.apiVersion.toUpperCase()}
      </p>
      <h1>
        Your skin, <i>documented.</i>
      </h1>
      <p className="sub">
        Recorded on {record.dateFormatted}. Below are the genuine diagnostic measurements
        returned directly by the YouCam AI engine for this scan.
      </p>

      {/* Honest Score Calibration Disclosure */}
      <div className="mb-8 p-4 bg-[#f8ede9] border border-[#eadbd7] flex items-start gap-3 text-xs leading-relaxed text-[#684c55]">
        <Info size={16} className="text-[#8e3b5a] shrink-0 mt-0.5" />
        <div>
          <b className="text-[#3a1f2e] block mb-0.5">Honest Score Transparency</b>
          Each metric card provides two distinct readings:
          <span className="font-semibold text-[#3a1f2e]"> UI Score (0–100)</span> calibrated for
          consumer readability, and the continuous
          <span className="font-semibold text-[#3a1f2e]"> Raw Score</span> calculated directly by
          the diagnostic computer vision model. For tracking subtle biological skin shifts over
          weeks, raw scores offer deeper precision.
        </div>
      </div>

      {/* Main Grid: Face & Overlays on Left, Concerns on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image with Mask Layering (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#fffaf7] p-5 border border-[#eadbd7] space-y-4 sticky top-24">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#9a7479]">
            <span>Captured Portrait</span>
            <span>{record.name}</span>
          </div>

          <div className="relative aspect-[3/4] bg-[#f1e4e0] overflow-hidden flex items-center justify-center">
            <img
              src={record.thumbnailUrl}
              alt="Scan capture"
              className="w-full h-full object-cover"
            />

            {/* Visual Detection Mask Overlay (if active and valid) */}
            {selectedMaskMetric?.mask_urls && selectedMaskMetric.mask_urls.length > 0 && !maskLoadError && (
              <img
                src={selectedMaskMetric.mask_urls[0]}
                alt={`${selectedMaskMetric.type} mask overlay`}
                onError={() => setMaskLoadError(true)}
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-85 transition-opacity"
              />
            )}

            {selectedMaskMetric && !maskLoadError && (
              <div className="absolute top-2 left-2 bg-[#3a1f2e]/90 text-white text-[10px] px-2 py-1 rounded">
                Overlay: {getMetricDefinition(selectedMaskMetric.type).label}
              </div>
            )}

            {maskLoadError && selectedMaskMetric && (
              <div className="absolute top-2 left-2 right-2 bg-[#8e3b5a]/90 text-white text-[10px] p-1.5 rounded flex items-center gap-1">
                <AlertCircle size={12} />
                <span>Mask asset unavailable or expired.</span>
              </div>
            )}
          </div>

          {/* Mask Controls */}
          {record.metrics.some((m) => m.mask_urls && m.mask_urls.length > 0) && (
            <div className="space-y-1.5 pt-2 border-t border-[#eadbd7]">
              <div className="flex items-center justify-between text-xs text-[#806b70]">
                <span className="flex items-center gap-1">
                  <Layers size={13} />
                  <span>Detection Overlays</span>
                </span>
                {selectedMaskMetric && (
                  <button
                    onClick={() => handleSelectMask(null)}
                    className="text-[11px] text-[#8e3b5a] hover:underline"
                  >
                    Clear Overlay
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {record.metrics
                  .filter((m) => m.mask_urls && m.mask_urls.length > 0)
                  .map((m) => {
                    const def = getMetricDefinition(m.type);
                    const isSelected = selectedMaskMetric?.type === m.type;
                    return (
                      <button
                        key={m.type}
                        onClick={() => handleSelectMask(isSelected ? null : m)}
                        className={`text-[10px] px-2 py-1 transition-all ${
                          isSelected
                            ? 'bg-[#3a1f2e] text-white font-medium'
                            : 'bg-[#f5e8e4] text-[#6d4b55] hover:bg-[#eadbd7]'
                        }`}
                      >
                        {def.label}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Quality Conditions Recorded */}
          {record.qualityCheck && (
            <div className="pt-3 border-t border-[#eadbd7] text-[11px] text-[#887477] space-y-1">
              <span className="block font-medium text-[#3a1f2e]">Capture Condition Meta:</span>
              <p>• Ambient Luminance: {record.qualityCheck.brightness}%</p>
              <p>• Focus Metric: {record.qualityCheck.sharpness}/100</p>
              <p>
                • Resolution: {record.qualityCheck.width} × {record.qualityCheck.height} px
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Concerns Breakdown (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Filter Pills (Dynamically shown based on available data) */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-[#eadbd7]">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`text-xs px-3.5 py-2 transition-all ${
                  activeCategory === tab.id
                    ? 'bg-[#3a1f2e] text-[#fff8f5] font-semibold'
                    : 'bg-[#f8ede9] text-[#7a6467] hover:bg-[#ebdcd8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Metric Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMetrics.map((metric) => {
              const def = getMetricDefinition(metric.type);
              const hasMask = metric.mask_urls && metric.mask_urls.length > 0;
              const isMaskActive = selectedMaskMetric?.type === metric.type;

              return (
                <div
                  key={metric.type}
                  className="bg-[#fffaf7] p-4 border border-[#eadbd7] flex flex-col justify-between hover:border-[#c98f94] transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#9a7479] font-semibold">
                          {def.category}
                        </span>
                        <h3 className="font-serif text-lg font-normal text-[#3a1f2e]">
                          {def.label}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-serif text-2xl font-normal leading-none ${getScoreColor(
                            metric.ui_score
                          )}`}
                        >
                          {metric.ui_score}
                        </span>
                        <span className="text-[10px] text-[#9a7479] block">/ 100</span>
                      </div>
                    </div>

                    <div className="w-full bg-[#f0ddda] h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${getScoreBg(metric.ui_score)} transition-all duration-700`}
                        style={{ width: `${Math.min(100, Math.max(5, metric.ui_score))}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#856f72] pt-1">
                      <span>Scientific Model Output:</span>
                      <span className="font-mono bg-[#f4e4e1] px-1.5 py-0.5 text-[10px] text-[#553a42] font-semibold">
                        Raw: {metric.raw_score.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-[#705c60] leading-relaxed pt-1">
                      {def.whatItMeans}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f0ddda] text-[11px] text-[#8e6e74] flex items-center justify-between">
                    <span className="italic truncate pr-2">{def.skincareRelevance}</span>
                    {hasMask && (
                      <button
                        onClick={() =>
                          handleSelectMask(isMaskActive ? null : metric)
                        }
                        className={`text-[10px] shrink-0 uppercase tracking-wider font-semibold px-2 py-0.5 border ${
                          isMaskActive
                            ? 'bg-[#8e3b5a] text-white border-[#8e3b5a]'
                            : 'border-[#c98f94] text-[#8e3b5a] hover:bg-[#f3ddda]'
                        }`}
                      >
                        {isMaskActive ? 'Active Mask' : 'View Mask'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skincare Routine Callout */}
          <div className="p-6 bg-[#f5e8e4] border border-[#eadbd7] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <b className="font-serif text-lg font-normal text-[#3a1f2e] block">
                Derived Routine Considerations
              </b>
              <p className="text-xs text-[#705c60] mt-1 max-w-xl">
                Explore tailored AM &amp; PM skincare steps formulated directly from your verified
                scores, with transparent explanations of why each ingredient is suggested.
              </p>
            </div>
            <button
              onClick={onOpenRoutineGuidance}
              className="dark shrink-0 py-3 px-5 text-xs tracking-wider uppercase font-medium"
            >
              <span>View Guidance</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
