import React, { useState, useEffect } from 'react';
import {
  X,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react';
import type { YouCamMetric, UserSkinProfile, RoutineSuggestion } from '../types/skin';
import { generateRoutineGuidance } from '../utils/skincareGuidance';
import {
  loadDailyRoutineState,
  toggleRoutineStepCompletion,
  clearDailyRoutineState,
  loadUserProfile,
} from '../utils/storage';

interface SkincareRoutineModalProps {
  metrics: YouCamMetric[];
  onClose: () => void;
  onOpenProfile?: () => void;
}

export const SkincareRoutineModal: React.FC<SkincareRoutineModalProps> = ({
  metrics,
  onClose,
  onOpenProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'am' | 'pm'>('all');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserSkinProfile | null>(null);

  useEffect(() => {
    const routineState = loadDailyRoutineState();
    setCompletedSteps(routineState.completedStepIds);
    setUserProfile(loadUserProfile());
  }, []);

  const suggestions: RoutineSuggestion[] = generateRoutineGuidance(metrics, userProfile);

  const amSteps = suggestions.filter((s) => s.timeOfDay === 'AM' || s.timeOfDay === 'BOTH');
  const pmSteps = suggestions.filter((s) => s.timeOfDay === 'PM' || s.timeOfDay === 'BOTH');

  const displayedSteps =
    activeTab === 'am' ? amSteps : activeTab === 'pm' ? pmSteps : suggestions;

  const totalStepsCount = suggestions.length;
  const completedCount = suggestions.filter((s) => completedSteps.includes(s.id)).length;
  const progressPercent =
    totalStepsCount > 0 ? Math.round((completedCount / totalStepsCount) * 100) : 0;

  const handleToggleStep = (stepId: string) => {
    const updated = toggleRoutineStepCompletion(stepId);
    setCompletedSteps(updated.completedStepIds);
  };

  const handleResetDaily = () => {
    clearDailyRoutineState();
    setCompletedSteps([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3a1f2e]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF1EE] border border-[#eadbd7] max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-[#806b70] hover:text-[#3a1f2e] transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div>
          <p className="eyebrow">DERIVED FROM AUTHENTIC METRICS &amp; PROFILE</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3a1f2e]">
            Tailored <i>Skincare Protocol.</i>
          </h2>
          <p className="text-xs text-[#806b70] mt-1 leading-relaxed">
            Formulated from your YouCam AI analysis readings and your personal skin profile.
            Track your daily morning and evening completion below.
          </p>
        </div>

        {/* Daily Completion Tracker Widget */}
        <div className="bg-white p-4 border border-[#eadbd7] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9a7479]">
                Today's Protocol Progress
              </span>
              <div className="text-sm font-semibold text-[#3a1f2e] mt-0.5">
                {completedCount} of {totalStepsCount} steps completed ({progressPercent}%)
              </div>
            </div>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleResetDaily}
                className="text-[11px] text-[#8e3b5a] hover:underline flex items-center gap-1"
              >
                <RotateCcw size={12} />
                <span>Reset today</span>
              </button>
            )}
          </div>

          <div className="w-full bg-[#f4e4e1] h-2 overflow-hidden">
            <div
              className="bg-[#416938] h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls: Time of Day Filter & Profile Prompt */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#eadbd7]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs px-3.5 py-1.5 transition-all ${
                activeTab === 'all'
                  ? 'bg-[#3a1f2e] text-[#fff8f5] font-semibold'
                  : 'bg-white text-[#7a6467] border border-[#eadbd7] hover:bg-[#ebdcd8]'
              }`}
            >
              All Steps ({suggestions.length})
            </button>
            <button
              onClick={() => setActiveTab('am')}
              className={`text-xs px-3.5 py-1.5 flex items-center gap-1 transition-all ${
                activeTab === 'am'
                  ? 'bg-[#3a1f2e] text-[#fff8f5] font-semibold'
                  : 'bg-white text-[#7a6467] border border-[#eadbd7] hover:bg-[#ebdcd8]'
              }`}
            >
              <Sun size={12} className="text-[#c98f94]" />
              <span>Morning ({amSteps.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('pm')}
              className={`text-xs px-3.5 py-1.5 flex items-center gap-1 transition-all ${
                activeTab === 'pm'
                  ? 'bg-[#3a1f2e] text-[#fff8f5] font-semibold'
                  : 'bg-white text-[#7a6467] border border-[#eadbd7] hover:bg-[#ebdcd8]'
              }`}
            >
              <Moon size={12} className="text-[#8e3b5a]" />
              <span>Evening ({pmSteps.length})</span>
            </button>
          </div>

          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="text-xs text-[#8e3b5a] hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles size={12} />
              <span>
                {userProfile ? `Profile: ${userProfile.skinType}` : 'Personalize with Skin Profile'}
              </span>
            </button>
          )}
        </div>

        {/* Routine Steps List */}
        <div className="space-y-3">
          {displayedSteps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                onClick={() => handleToggleStep(step.id)}
                className={`cursor-pointer p-4 border transition-all space-y-2 select-none ${
                  isCompleted
                    ? 'bg-[#f4f7f3] border-[#bdd4ba]'
                    : 'bg-white border-[#f0ddda] hover:border-[#c98f94]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      aria-label={isCompleted ? 'Mark step as incomplete' : 'Mark step as complete'}
                      className="mt-0.5 text-[#3e6837]"
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-[#3e6837]" />
                      ) : (
                        <Circle size={18} className="text-[#c98f94] hover:text-[#8e3b5a]" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-xs ${
                            isCompleted ? 'line-through text-[#806b70]' : 'text-[#3a1f2e]'
                          }`}
                        >
                          {step.step}
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#f5e8e4] text-[#8e3b5a] font-semibold">
                          {step.timeOfDay}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#8e3b5a] mt-0.5">{step.suggestion}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#9a7479] uppercase shrink-0 font-medium">
                    {step.category}
                  </span>
                </div>

                <div className="pl-7 space-y-1.5 text-xs text-[#705c60]">
                  <p className="leading-relaxed">{step.reason}</p>

                  <div className="bg-[#FAF1EE] p-2.5 border border-[#eadbd7] space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#3a1f2e] font-semibold">
                      <Sparkles size={11} className="text-[#8e3b5a]" />
                      <span>Key Actives: {step.ingredientSpotlight}</span>
                    </div>
                    <p className="text-[#684c55]">
                      <b>How to apply:</b> {step.howToApply}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#9c8587] font-mono">
                    <span>Evidence / Trigger: {step.triggeredByMetric}</span>
                    {step.isCustomizedForProfile && (
                      <span className="text-[#8e3b5a] font-sans font-medium">
                        Customized for your profile
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Honest Disclosure Note */}
        <div className="p-4 bg-[#f8ede9] border border-[#eadbd7] text-xs text-[#705c60] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#3a1f2e]">
            <ShieldCheck size={14} className="text-[#8e3b5a]" />
            <span>Honest Cosmetic Awareness Protocol</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            LEKHA provides cosmetic and lifestyle awareness guidance directly correlated with your
            measured skin parameters. LEKHA does not sell products, receive affiliate kickbacks, or
            make clinical dermatology guarantees. Always patch-test new skincare actives before full-face application.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-[#806b70] flex items-center gap-1">
            <Info size={12} />
            <span>Click any step to check it off today.</span>
          </div>
          <button onClick={onClose} className="dark py-2.5 px-6 text-xs uppercase">
            Close Routine
          </button>
        </div>
      </div>
    </div>
  );
};
