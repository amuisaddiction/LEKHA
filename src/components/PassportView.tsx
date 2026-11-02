import React from 'react';
import {
  ArrowRight,
  Trash2,
  GitCompare,
  Calendar,
  ExternalLink,
  Shield,
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
      <p className="eyebrow">YOUR PERSONAL RECORD</p>
      <h1>
        Skin <i>Passport.</i>
      </h1>
      <p className="sub">
        A timeline should tell the truth. Every entry below represents an authentic, dated YouCam AI
        scan stored privately within this browser.
      </p>

      <div className="passport-head flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#9a7479]">
            {records.length} {records.length === 1 ? 'LOCAL ENTRY' : 'LOCAL ENTRIES'}
          </span>
          <button
            onClick={onOpenPrivacy}
            className="text-[10px] text-[#8e3b5a] underline hover:text-[#3a1f2e] flex items-center gap-1"
          >
            <Shield size={11} />
            <span>Storage Details</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {records.length >= 2 && (
            <button
              onClick={onNavigateToCompare}
              className="inline-flex items-center gap-2 border border-[#d9b8b6] bg-white px-4 py-2.5 text-xs uppercase tracking-wider text-[#3a1f2e] hover:bg-[#f3ddda] transition-colors"
            >
              <GitCompare size={14} className="text-[#8e3b5a]" />
              <span>Compare Scans</span>
            </button>
          )}

          <button onClick={onNavigateToScan} className="dark py-2.5 px-4 text-xs uppercase">
            <span>Add a Scan</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty">
          <div className="empty-logo">L.</div>
          <h2>
            Your story starts <i>here.</i>
          </h2>
          <p>
            Your Skin Passport is currently empty. Run your first genuine YouCam scan to document
            your baseline skin parameters and monitor authentic changes over time.
          </p>
          <button onClick={onNavigateToScan} className="font-serif italic text-base">
            Create your first entry →
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {records.map((record) => {
            const previewMetrics = record.metrics.slice(0, 4);

            return (
              <div
                key={record.id}
                className="bg-[#fffaf7] p-5 border border-[#eadbd7] hover:border-[#c98f94] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className="w-16 h-20 bg-[#f1e4e0] shrink-0 overflow-hidden border border-[#eadbd7]">
                    {record.thumbnailUrl ? (
                      <img
                        src={record.thumbnailUrl}
                        alt="Scan thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8e3b5a] font-serif text-lg">
                        L.
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#9a7479] mb-1">
                      <Calendar size={12} />
                      <span>{record.dateFormatted}</span>
                    </div>
                    <h3 className="font-serif text-lg font-normal text-[#3a1f2e]">
                      {record.name || 'Untitled Scan'}
                    </h3>
                    <span className="text-[10px] text-[#856f72] font-mono">
                      Engine: {record.apiVersion.toUpperCase()} · {record.metrics.length} Metrics
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 flex-1 md:justify-center">
                  {previewMetrics.map((m) => {
                    const def = getMetricDefinition(m.type);
                    return (
                      <div
                        key={m.type}
                        className="bg-[#fcf5f3] border border-[#f0ddda] px-2.5 py-1 text-center"
                      >
                        <span className="text-[9px] text-[#8a7074] block uppercase">
                          {def.label}
                        </span>
                        <b className="font-serif text-sm text-[#3a1f2e]">{m.ui_score}</b>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onOpenRecord(record)}
                    className="inline-flex items-center gap-1.5 border border-[#3a1f2e] text-[#3a1f2e] hover:bg-[#3a1f2e] hover:text-white px-3.5 py-2 text-xs font-medium uppercase tracking-wider transition-colors"
                  >
                    <span>View Analysis</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this scan from your Passport?')) {
                        onDeleteRecord(record.id);
                      }
                    }}
                    title="Delete scan record"
                    className="p-2 text-[#a47b80] hover:text-[#8e3b5a] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="micro">
        Entries are stored securely in your browser's private local storage. No face images are uploaded
        to third-party databases.
      </p>
    </main>
  );
};
