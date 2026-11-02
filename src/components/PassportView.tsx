import React, { useState } from 'react';
import {
  ArrowRight,
  Trash2,
  GitCompare,
  Calendar,
  ExternalLink,
  Shield,
  Sparkles,
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

// Sample entries for demonstration when local storage is empty
const DEMO_RECORDS: SkinScanRecord[] = [
  {
    id: 'demo_scan_02',
    timestamp: '2026-10-28T09:15:00Z',
    dateFormatted: 'Oct 28, 2026 · 09:15 AM',
    name: 'Follow-Up Week 4 (Sample)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    apiVersion: 'v2.1',
    overall: {
      skin_age: 28,
      overall_score: 89,
      skin_type: 'Combination',
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
      notes: ['Balanced natural lighting', 'High detail resolution'],
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
  },
  {
    id: 'demo_scan_01',
    timestamp: '2026-10-01T10:30:00Z',
    dateFormatted: 'Oct 1, 2026 · 10:30 AM',
    name: 'Baseline Entry (Sample)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80',
    apiVersion: 'v2.1',
    overall: {
      skin_age: 30,
      overall_score: 84,
      skin_type: 'Combination',
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
      notes: ['Direct frontal daylight', 'Sharp camera capture'],
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
  },
];

export const PassportView: React.FC<PassportViewProps> = ({
  records,
  onOpenRecord,
  onDeleteRecord,
  onNavigateToScan,
  onNavigateToCompare,
  onOpenPrivacy,
}) => {
  const [showDemoWhenEmpty, setShowDemoWhenEmpty] = useState(true);

  const isDemo = records.length === 0 && showDemoWhenEmpty;
  const displayedRecords = isDemo ? DEMO_RECORDS : records;

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

        <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
          <button
            onClick={onOpenPrivacy}
            className="inline-flex items-center gap-1.5 text-xs text-[#8e3b5a] hover:text-[#3a1f2e] transition-colors border border-[#d9b8b6] px-3.5 py-2 bg-white"
          >
            <Shield size={12} />
            <span>Zero Cloud Storage</span>
          </button>

          <button
            onClick={onNavigateToCompare}
            className="inline-flex items-center gap-1.5 border border-[#3a1f2e] bg-[#3a1f2e] text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#8e3b5a] transition-colors"
          >
            <GitCompare size={13} />
            <span>{records.length >= 2 ? 'Compare Scans' : 'Compare Studio'}</span>
          </button>

          <button onClick={onNavigateToScan} className="dark py-2 px-4 text-xs uppercase tracking-wider">
            <span>Add Scan</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <p className="sub max-w-2xl mb-6">
        Your private diagnostic timeline. Every record below documents an authentic, dated YouCam AI
        observation stored strictly within this device’s local browser memory.
      </p>

      {/* Demonstration Banner when showing sample timeline */}
      {isDemo && (
        <div className="mb-6 p-4 bg-[#fdf2ef] border-l-4 border-[#8e3b5a] text-[#5c2a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#8e3b5a] shrink-0" />
            <div>
              <b className="text-[#3a1f2e]">Sample Progress Walkthrough:</b>
              <span className="ml-1 text-[#7a4253]">
                You haven't saved personal scans yet. Below is a sample timeline demonstrating how LEKHA tracks progress across a 28-day cycle.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowDemoWhenEmpty(false)}
              className="text-[11px] text-[#8e3b5a] underline hover:text-[#3a1f2e]"
            >
              Show Empty State
            </button>
            <button
              onClick={onNavigateToScan}
              className="bg-[#8e3b5a] text-white px-3 py-1.5 text-[11px] uppercase tracking-wider"
            >
              Start Real Scan
            </button>
          </div>
        </div>
      )}

      {/* Sub-bar showing count & summary */}
      <div className="bg-[#f5e8e4] border border-[#eadbd7] px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono text-[#7a6467]">
          <span className={`w-2 h-2 rounded-full ${isDemo ? 'bg-[#c98f94]' : 'bg-[#3e6837]'}`}></span>
          <span>
            {isDemo
              ? '2 DEMONSTRATION SAMPLES (NOT YOUR DATA)'
              : `${records.length} ${records.length === 1 ? 'AUTHENTIC LOCAL RECORD' : 'AUTHENTIC LOCAL RECORDS'}`}
          </span>
        </div>
        <span className="text-[11px] text-[#9a7479] font-mono">
          STORAGE: BROWSER LOCALSTORAGE · ZERO EXPOSURE
        </span>
      </div>

      {records.length === 0 && !showDemoWhenEmpty ? (
        /* Empty State with Action */
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

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setShowDemoWhenEmpty(true)}
              className="border border-[#d9b8b6] px-5 py-2.5 text-xs uppercase tracking-wider text-[#3a1f2e] hover:bg-[#f3ddda]"
            >
              View Sample Walkthrough
            </button>
            <button onClick={onNavigateToScan} className="dark py-2.5 px-6 text-xs uppercase tracking-wider">
              <span>Create Baseline Entry</span>
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
            {displayedRecords.map((record, index) => {
              const previewMetrics = record.metrics.slice(0, 6);

              return (
                <div key={record.id} className="relative md:pl-20">
                  {/* Timeline Node Bullet */}
                  <div className="hidden md:flex absolute left-6 top-6 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FAF1EE] border-2 border-[#8e3b5a] items-center justify-center z-10 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8e3b5a]"></span>
                  </div>

                  {/* Passport Card */}
                  <div className="bg-[#fffaf7] border border-[#eadbd7] hover:border-[#c98f94] transition-all p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Thumbnail & Core Identification */}
                      <div className="flex items-start sm:items-center gap-5">
                        <div className="w-20 h-24 bg-[#f0dedb] shrink-0 overflow-hidden border border-[#d9b8b6] shadow-inner relative">
                          {record.thumbnailUrl ? (
                            <img
                              src={record.thumbnailUrl}
                              alt={record.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#8e3b5a] font-serif text-xl font-bold bg-[#FAF1EE]">
                              L.
                            </div>
                          )}
                          <div className="absolute top-1 left-1 bg-[#3a1f2e]/80 text-white font-mono text-[8px] px-1">
                            #{displayedRecords.length - index}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#9a7479] uppercase tracking-wider flex items-center gap-1">
                              <Calendar size={11} />
                              {record.dateFormatted}
                            </span>
                            {index === 0 && (
                              <span className="bg-[#e2ede0] text-[#34582f] text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                                Most Recent
                              </span>
                            )}
                            {isDemo && (
                              <span className="bg-[#f0ddda] text-[#8e3b5a] text-[9px] font-mono px-2 py-0.5 uppercase font-semibold">
                                Demo
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-xl text-[#3a1f2e] m-0">
                            {record.name}
                          </h3>

                          {record.overall && (
                            <div className="flex items-center gap-3 text-xs text-[#705c60]">
                              {record.overall.overall_score && (
                                <span>
                                  Health Score: <b>{record.overall.overall_score}</b>/100
                                </span>
                              )}
                              {record.overall.skin_age && (
                                <span>
                                  Skin Age: <b>{record.overall.skin_age} yrs</b>
                                </span>
                              )}
                            </div>
                          )}

                          {record.qualityCheck && (
                            <div className="text-[11px] text-[#9a7479] font-mono flex items-center gap-2">
                              <span>Lux: {record.qualityCheck.brightness}%</span>
                              <span>•</span>
                              <span>Sharpness: {record.qualityCheck.sharpness}/100</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Center: Top Dermal Metric Chips */}
                      <div className="flex flex-wrap gap-2 lg:max-w-md">
                        {previewMetrics.map((m) => {
                          const def = getMetricDefinition(m.type);
                          return (
                            <div
                              key={m.type}
                              className="bg-[#faf1ee] px-2.5 py-1.5 border border-[#eedbd7] text-[11px] flex items-center gap-2"
                            >
                              <span className="text-[#7a6467]">{def.label}:</span>
                              <b className="text-[#3a1f2e]">{m.ui_score}</b>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                        <button
                          onClick={() => onOpenRecord(record)}
                          className="inline-flex items-center gap-1.5 border border-[#3a1f2e] bg-[#3a1f2e] text-[#fff8f5] px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#8e3b5a] transition-colors"
                        >
                          <span>View Diagnostics</span>
                          <ExternalLink size={12} />
                        </button>

                        {!isDemo && (
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-2 text-[#9a7479] hover:text-[#8e3b5a] transition-colors"
                            title="Delete entry"
                            aria-label="Delete entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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
