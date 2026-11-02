import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Trash2, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
  onClearAllData: () => void;
  recordCount: number;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  onClose,
  onClearAllData,
  recordCount,
}) => {
  const [isCleared, setIsCleared] = useState(false);

  const handlePurge = () => {
    if (
      window.confirm(
        'Are you sure you want to completely erase all your saved scans and local history? This action cannot be undone.'
      )
    ) {
      onClearAllData();
      setIsCleared(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3a1f2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF1EE] border border-[#eadbd7] max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-[#806b70] hover:text-[#3a1f2e] transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div>
          <p className="eyebrow">YOUR PRIVACY &amp; DATA GUARANTEE</p>
          <h2 className="font-serif text-2xl font-normal text-[#3a1f2e]">
            Honest <i>Data Integrity.</i>
          </h2>
          <p className="text-xs text-[#806b70] mt-1 leading-relaxed">
            LEKHA was built on the principle that your skin record belongs solely to you.
          </p>
        </div>

        <div className="space-y-3 text-xs text-[#705c60]">
          <div className="bg-white p-3.5 border border-[#f0ddda] space-y-1">
            <b className="text-[#3a1f2e] flex items-center gap-1.5 text-xs">
              <Lock size={13} className="text-[#8e3b5a]" />
              Local Browser Storage
            </b>
            <p className="leading-relaxed">
              All saved Skin Passport entries and diagnostic scores are stored exclusively in your
              current browser's private <span className="font-mono">localStorage</span>. We do not
              maintain a cloud database or user account tracker.
            </p>
          </div>

          <div className="bg-white p-3.5 border border-[#f0ddda] space-y-1">
            <b className="text-[#3a1f2e] flex items-center gap-1.5 text-xs">
              <ShieldCheck size={13} className="text-[#8e3b5a]" />
              Transient API Processing
            </b>
            <p className="leading-relaxed">
              When you execute a scan, your image is received in volatile memory by our secure
              backend, sent to the official YouCam API to compute dermal metrics, and immediately
              discarded. We do not retain or train AI models on your photos.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#eadbd7] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#806b70]">Current saved records:</span>
            <span className="font-mono font-semibold text-[#3a1f2e]">{recordCount}</span>
          </div>

          {isCleared ? (
            <div className="p-3 bg-[#e2ede0] text-[#34582f] text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>All local skin records have been purged.</span>
            </div>
          ) : (
            <button
              onClick={handlePurge}
              disabled={recordCount === 0}
              className="w-full flex items-center justify-center gap-2 border border-[#d9b8b6] hover:border-[#8e3b5a] text-[#8e3b5a] hover:bg-[#fbf2ef] py-3 text-xs uppercase tracking-wider font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} />
              <span>Purge All Local Records</span>
            </button>
          )}
        </div>

        <div className="text-right pt-2">
          <button onClick={onClose} className="dark py-2 px-5 text-xs uppercase">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
