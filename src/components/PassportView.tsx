import React from 'react';
import {
  ArrowRight,
  Trash2,
  GitCompare,
  Calendar,
  ExternalLink,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import type { SkinScanRecord } from '../types/skin';
import { getMetricDefinition } from '../utils/metricDefinitions';

interface PassportViewProps {
  records: SkinScanRecord[];
  onOpenRecord: (record: SkinScanRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNavigateToScan: () => void;
  onNavigateToCompare: () => void;
  onOpenPrivacy: () => void;
}

export const PassportView: React.FC<PassportViewProps> = ({
  records,
  onOpenRecord,
  onDeleteRecord,
  onNavigateToScan,
  onNavigateToCompare,
  onOpenPrivacy,
}) => {
  return (
    <main className="workspace">
      {/* Header Eyebrow & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-3">
        <div>
          <p className="eyebrow">CHRONOLOGICAL LEDGER / LOCAL BROWSER VAULT</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3a1f2e] m-0">
            Skin <i>Passport.</i>
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start md:self-end">
          <button
            onClick={onOpenPrivacy}
            className="inline-flex items-center gap-1.5 text-xs text-[#8e3b5a] hover:text-[#3a1f2e] transition-colors border border-[#d9b8b6] px-3.5 py-2 bg-white"
          >
            <Shield size={12} />
            <span>Zero Cloud Storage</span>
          </button>

          {records.length >= 2 && (
            <button
              onClick={onNavigateToCompare}
              className="inline-flex items-center gap-1.5 border border-[#3a1f2e] bg-[#3a1f2e] text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#8e3b5a] transition-colors"
            >
              <GitCompare size={13} />
              <span>Compare Scans</span>
            </button>
          )}

          <button onClick={onNavigateToScan} className="dark py-2 px-4 text-xs uppercase tracking-wider">
            <span>Add Scan</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <p className="sub max-w-2xl mb-8">
        Your private diagnostic timeline. Every record below documents an authentic, dated YouCam AI
        observation stored strictly within this device’s local browser memory.
      </p>

      {/* Sub-bar showing count & summary */}
      <div className="bg-[#f5e8e4] border border-[#eadbd7] px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono text-[#7a6467]">
          <span className="w-2 h-2 rounded-full bg-[#8e3b5a]"></span>
          <span>
            {records.length} {records.length === 1 ? 'AUTHENTIC LOCAL RECORD' : 'AUTHENTIC LOCAL RECORDS'}
          </span>
        </div>
        <span className="text-[11px] text-[#9a7479] font-mono">
          STORAGE: BROWSER LOCALSTORAGE · ZERO EXPOSURE
        </span>
      </div>

      {records.length === 0 ? (
        /* Empty State with Luxury Editorial Aesthetics */
        <div className="mt-8 bg-[#fffaf7] border border-[#eadbd7] p-10 md:p-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-[#c98f94] flex items-center justify-center mx-auto text-[#8e3b5a] font-serif text-2xl bg-[#fdf5f3]">
            L.
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl text-[#3a1f2e] m-0">
              Your skin timeline <i>begins with one entry.</i>
            </h2>
            <p className="text-xs md:text-sm text-[#7e696c] leading-relaxed">
              Your Skin Passport is currently empty. Capture your first genuine YouCam scan to document
              your baseline parameters and monitor authentic changes over weeks and months.
            </p>
          </div>

          <div className="pt-2">
            <button onClick={onNavigateToScan} className="dark py-3 px-6 text-xs uppercase tracking-wider">
              <span>Create Your First Baseline Entry</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ) : (
        /* Visual Timeline Ledger with Actual Thumbnails */
        <div className="mt-10 relative">
          {/* Vertical Timeline Spine Line */}
          <div className="hidden md:block absolute left-8 top-6 bottom-6 w-px bg-[#d9b8b6]"></div>

          <div className="space-y-8">
            {records.map((record, index) => {
              const previewMetrics = record.metrics.slice(0, 5);

              return (
                <div
                  key={record.id}
                  className="relative md:pl-20 group"
                >
                  {/* Timeline Date Stamp Node on Left */}
                  <div className="hidden md:flex absolute left-5 top-7 w-6 h-6 rounded-full bg-[#fffaf7] border-2 border-[#8e3b5a] items-center justify-center text-[10px] font-mono text-[#8e3b5a] z-10 shadow-xs">
                    {index + 1}
                  </div>

                  {/* Card Container */}
                  <div className="bg-[#fffaf7] border border-[#eadbd7] hover:border-[#c98f94] p-6 shadow-xs transition-all duration-300">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Left: Thumbnail & Meta Info */}
                      <div className="flex items-start sm:items-center gap-5 min-w-[280px]">
                        <div className="w-20 h-24 sm:w-24 sm:h-30 bg-[#f1e4e0] shrink-0 overflow-hidden border border-[#d9b8b6] shadow-xs relative">
                          {record.thumbnailUrl ? (
                            <img
                              src={record.thumbnailUrl}
                              alt={record.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#8e3b5a] font-serif text-xl">
                              L.
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 bg-[#3a1f2e]/80 text-white font-mono text-[8px] px-1">
                            {record.apiVersion.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#8e3b5a] font-mono">
                            <Calendar size={12} />
                            <span>{record.dateFormatted}</span>
                          </div>

                          <h3 className="font-serif text-xl text-[#3a1f2e] m-0">
                            {record.name || 'Untitled Scan'}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[10px] font-mono uppercase bg-[#f5e8e4] px-2 py-0.5 border border-[#eadbd7] text-[#7a6467]">
                              {record.metrics.length} YouCam Metrics
                            </span>
                            {record.qualityCheck && (
                              <span className="text-[10px] font-mono uppercase text-[#386641] flex items-center gap-1">
                                <CheckCircle2 size={10} />
                                <span>Truth Checked</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Real Metrics Snapshot Grid */}
                      <div className="flex flex-wrap gap-2.5 flex-1 lg:justify-center w-full lg:w-auto">
                        {previewMetrics.map((m) => {
                          const def = getMetricDefinition(m.type);
                          return (
                            <div
                              key={m.type}
                              className="bg-[#fbf4f2] border border-[#ecdcd9] px-3 py-2 text-center min-w-[76px] hover:border-[#c98f94] transition-colors"
                            >
                              <span className="text-[9px] text-[#8a7074] block uppercase font-mono tracking-wider">
                                {def.label}
                              </span>
                              <b className="font-serif text-base text-[#3a1f2e]">{m.ui_score}</b>
                              <span className="text-[8px] text-[#a48e92] block font-mono">
                                RAW: {m.raw_score.toFixed(1)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3 shrink-0 self-end lg:self-center w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#f2e2de]">
                        <button
                          onClick={() => onOpenRecord(record)}
                          className="inline-flex items-center gap-1.5 border border-[#3a1f2e] text-[#3a1f2e] hover:bg-[#3a1f2e] hover:text-white px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors"
                        >
                          <span>Inspect</span>
                          <ExternalLink size={12} />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete scan "${record.name}" from local storage?`)) {
                              onDeleteRecord(record.id);
                            }
                          }}
                          className="p-2 text-[#9a7479] hover:text-[#ba181b] border border-transparent hover:border-[#f0dedb] transition-colors"
                          title="Delete record"
                          aria-label="Delete record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
};
