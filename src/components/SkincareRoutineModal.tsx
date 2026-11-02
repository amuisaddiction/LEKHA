import React from 'react';
import { X, Sun, Moon, ShieldCheck } from 'lucide-react';
import type { YouCamMetric } from '../types/skin';
import { generateRoutineGuidance } from '../utils/skincareGuidance';

interface SkincareRoutineModalProps {
  metrics: YouCamMetric[];
  onClose: () => void;
}

export const SkincareRoutineModal: React.FC<SkincareRoutineModalProps> = ({
  metrics,
  onClose,
}) => {
  const suggestions = generateRoutineGuidance(metrics);

  const amSteps = suggestions.filter((s) => s.timeOfDay === 'AM' || s.timeOfDay === 'BOTH');
  const pmSteps = suggestions.filter((s) => s.timeOfDay === 'PM' || s.timeOfDay === 'BOTH');

  return (
    <div className="fixed inset-0 z-50 bg-[#3a1f2e]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF1EE] border border-[#eadbd7] max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-[#806b70] hover:text-[#3a1f2e] transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div>
          <p className="eyebrow">DERIVED FROM YOUR SCAN METRICS</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3a1f2e]">
            Tailored <i>Skincare Guidance.</i>
          </h2>
          <p className="text-xs text-[#806b70] mt-1 leading-relaxed">
            These suggestions are algorithmically matched to your authentic YouCam analysis results.
            Each step specifies the exact measurement that informed it.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#eadbd7] text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider">
            <Sun size={15} className="text-[#c98f94]" />
            <span>Morning Routine (Defense &amp; Hydration)</span>
          </div>

          <div className="space-y-2.5">
            {amSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 border border-[#f0ddda] space-y-1 hover:border-[#c98f94] transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#3a1f2e]">{step.step}</span>
                  <span className="text-[10px] text-[#9a7479] uppercase">{step.category}</span>
                </div>
                <p className="text-xs font-medium text-[#8e3b5a]">{step.suggestion}</p>
                <p className="text-[11px] text-[#705c60] leading-relaxed">{step.reason}</p>
                <div className="pt-1 text-[10px] text-[#9c8587] font-mono">
                  Informed by: {step.triggeredByMetric}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#eadbd7] text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider">
            <Moon size={15} className="text-[#8e3b5a]" />
            <span>Evening Routine (Repair &amp; Renewal)</span>
          </div>

          <div className="space-y-2.5">
            {pmSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 border border-[#f0ddda] space-y-1 hover:border-[#c98f94] transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#3a1f2e]">{step.step}</span>
                  <span className="text-[10px] text-[#9a7479] uppercase">{step.category}</span>
                </div>
                <p className="text-xs font-medium text-[#8e3b5a]">{step.suggestion}</p>
                <p className="text-[11px] text-[#705c60] leading-relaxed">{step.reason}</p>
                <div className="pt-1 text-[10px] text-[#9c8587] font-mono">
                  Informed by: {step.triggeredByMetric}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#f8ede9] border border-[#eadbd7] text-xs text-[#705c60] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#3a1f2e]">
            <ShieldCheck size={14} className="text-[#8e3b5a]" />
            <span>Personal Awareness Disclaimer</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            LEKHA provides cosmetic and lifestyle guidance strictly for personal awareness. These
            suggestions do not constitute a medical prescription, diagnosis, or guarantee of clinical
            results. Always patch-test active formulations.
          </p>
        </div>

        <div className="text-right">
          <button onClick={onClose} className="dark py-2.5 px-6 text-xs uppercase">
            Close Routine
          </button>
        </div>
      </div>
    </div>
  );
};
