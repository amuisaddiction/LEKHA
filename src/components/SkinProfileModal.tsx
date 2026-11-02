import React, { useState, useEffect } from 'react';
import { X, UserCheck, Shield, Sparkles, Check, RotateCcw } from 'lucide-react';
import type { UserSkinProfile, SkinType } from '../types/skin';
import { loadUserProfile, saveUserProfile, clearUserProfile } from '../utils/storage';

interface SkinProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: UserSkinProfile | null) => void;
}

const SKIN_TYPES: { id: SkinType; label: string; desc: string }[] = [
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone (forehead, nose) with normal to dry cheeks.' },
  { id: 'oily', label: 'Oily', desc: 'Produces excess shine throughout face, visible pores, prone to congestion.' },
  { id: 'dry', label: 'Dry', desc: 'Feels tight or parched, lack of natural oil, flaky patches in dry climate.' },
  { id: 'normal', label: 'Balanced / Normal', desc: 'Comfortable balance, neither overly shiny nor uncomfortably tight.' },
  { id: 'sensitive', label: 'Sensitive / Reactive', desc: 'Easily reddens, reacts to fragrance or environmental extremes.' },
  { id: 'unsure', label: 'Still Exploring', desc: 'Varies with weather, stress, or currently uncertain.' },
];

const BEHAVIORS = [
  { id: 'oily_midday', label: 'Shine develops midday' },
  { id: 'tight_after_cleansing', label: 'Feels tight immediately after washing' },
  { id: 'flushes_easily', label: 'Flushes or reddens with spicy food / heat' },
  { id: 'prone_to_blemishes', label: 'Prone to cyclical or stress breakouts' },
  { id: 'flaky_patches', label: 'Noticeable flaking under makeup or SPF' },
  { id: 'clogged_pores', label: 'Prone to blackheads along nose & chin' },
];

const CONCERNS = [
  { id: 'acne', label: 'Acne & Blemishes' },
  { id: 'pores', label: 'Enlarged Pores' },
  { id: 'texture', label: 'Rough Surface Texture' },
  { id: 'dark_spots', label: 'Dark Spots & Pigmentation' },
  { id: 'redness', label: 'Vascular Redness' },
  { id: 'fine_lines', label: 'Fine Lines & Expressions' },
  { id: 'dryness', label: 'Dehydration / Dryness' },
  { id: 'oiliness', label: 'Excess Sebum / Shine' },
  { id: 'dullness', label: 'Dullness & Lack of Radiance' },
];

const CURRENT_STEPS = [
  { id: 'cleanser', label: 'Cleanser' },
  { id: 'toner_essence', label: 'Toner / Essence' },
  { id: 'serum', label: 'Targeted Serum' },
  { id: 'moisturizer', label: 'Daily Moisturizer' },
  { id: 'sunscreen', label: 'Daily Sunscreen / SPF' },
  { id: 'exfoliant', label: 'Chemical Exfoliant (AHA/BHA)' },
  { id: 'retinoid', label: 'Retinoid / Retinol' },
  { id: 'night_cream', label: 'Rich Night Cream' },
];

const SENSITIVITIES = [
  { id: 'fragrance', label: 'Synthetic Fragrance' },
  { id: 'essential_oils', label: 'Essential Oils (Citrus, Lavender, Tea Tree)' },
  { id: 'alcohol', label: 'Denatured Alcohol / Drying Alcohols' },
  { id: 'strong_acids', label: 'High-Strength Glycolic / Lactic Acid' },
  { id: 'retinoids', label: 'Prescription or Strong Retinoids' },
  { id: 'sulfates', label: 'Harsh Sulfates (SLS / SLES)' },
];

export const SkinProfileModal: React.FC<SkinProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [skinType, setSkinType] = useState<SkinType>('combination');
  const [behaviors, setBehaviors] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [routineSteps, setRoutineSteps] = useState<string[]>(['cleanser', 'moisturizer', 'sunscreen']);
  const [sensitivities, setSensitivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = loadUserProfile();
      if (existing) {
        setSkinType(existing.skinType);
        setBehaviors(existing.skinBehavior || []);
        setConcerns(existing.primaryConcerns || []);
        setRoutineSteps(existing.currentRoutineSteps || []);
        setSensitivities(existing.sensitivities || []);
        setNotes(existing.notes || '');
      }
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleItem = (list: string[], setList: (val: string[]) => void, id: string) => {
    if (list.includes(id)) {
      setList(list.filter((x) => x !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleSave = () => {
    const profile: UserSkinProfile = {
      skinType,
      skinBehavior: behaviors,
      primaryConcerns: concerns,
      currentRoutineSteps: routineSteps,
      sensitivities,
      notes: notes.trim(),
      lastUpdated: new Date().toISOString(),
    };

    saveUserProfile(profile);
    setSavedSuccess(true);
    if (onProfileUpdated) onProfileUpdated(profile);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    if (window.confirm('Reset your skin profile to defaults?')) {
      clearUserProfile();
      setSkinType('combination');
      setBehaviors([]);
      setConcerns([]);
      setRoutineSteps(['cleanser', 'moisturizer', 'sunscreen']);
      setSensitivities([]);
      setNotes('');
      if (onProfileUpdated) onProfileUpdated(null);
    }
  };

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
          <p className="eyebrow">YOUR SKIN CONTEXT · PERSONAL PROFILE</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3a1f2e]">
            Your <i>Skin Profile.</i>
          </h2>
          <p className="text-xs text-[#806b70] mt-1 leading-relaxed">
            AI skin metrics are only half the picture. Tell LEKHA how your skin actually behaves so
            routine steps, ingredient recommendations, and comparisons are personally calibrated.
          </p>
        </div>

        {/* 1. Skin Type */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider block">
            1. How would you describe your baseline skin type?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SKIN_TYPES.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setSkinType(t.id)}
                className={`text-left p-3 border transition-all ${
                  skinType === t.id
                    ? 'border-[#8e3b5a] bg-white shadow-sm ring-1 ring-[#8e3b5a]'
                    : 'border-[#eadbd7] bg-[#fffaf7] hover:border-[#c98f94]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-[#3a1f2e]">{t.label}</span>
                  {skinType === t.id && <Check size={14} className="text-[#8e3b5a]" />}
                </div>
                <p className="text-[11px] text-[#806b70] mt-1 leading-snug">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Skin Behaviors */}
        <div className="space-y-3 pt-2 border-t border-[#eadbd7]">
          <label className="text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider block">
            2. Daily Skin Behaviors (Select all that apply)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BEHAVIORS.map((b) => {
              const active = behaviors.includes(b.id);
              return (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => toggleItem(behaviors, setBehaviors, b.id)}
                  className={`text-left px-3 py-2 text-xs border transition-all flex items-center justify-between ${
                    active
                      ? 'bg-[#3a1f2e] text-white border-[#3a1f2e]'
                      : 'bg-white text-[#504044] border-[#eadbd7] hover:border-[#c98f94]'
                  }`}
                >
                  <span>{b.label}</span>
                  {active && <Check size={13} className="text-[#f3ddda]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Primary Concerns */}
        <div className="space-y-3 pt-2 border-t border-[#eadbd7]">
          <label className="text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider block">
            3. Primary Focus Areas &amp; Goals
          </label>
          <div className="flex flex-wrap gap-2">
            {CONCERNS.map((c) => {
              const active = concerns.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleItem(concerns, setConcerns, c.id)}
                  className={`px-3 py-1.5 text-xs transition-all border ${
                    active
                      ? 'bg-[#8e3b5a] text-white border-[#8e3b5a] font-medium'
                      : 'bg-white text-[#6d4b55] border-[#eadbd7] hover:border-[#c98f94]'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Current Routine Habits */}
        <div className="space-y-3 pt-2 border-t border-[#eadbd7]">
          <label className="text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider block">
            4. Current Skincare Steps in Regular Use
          </label>
          <div className="flex flex-wrap gap-2">
            {CURRENT_STEPS.map((s) => {
              const active = routineSteps.includes(s.id);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleItem(routineSteps, setRoutineSteps, s.id)}
                  className={`px-3 py-1.5 text-xs transition-all border ${
                    active
                      ? 'bg-[#416938] text-white border-[#416938] font-medium'
                      : 'bg-white text-[#554045] border-[#eadbd7] hover:border-[#bcd6b8]'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Known Sensitivities & Exclusions */}
        <div className="space-y-3 pt-2 border-t border-[#eadbd7]">
          <label className="text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider block">
            5. Sensitivities &amp; Ingredients to Avoid
          </label>
          <div className="flex flex-wrap gap-2">
            {SENSITIVITIES.map((s) => {
              const active = sensitivities.includes(s.id);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleItem(sensitivities, setSensitivities, s.id)}
                  className={`px-3 py-1.5 text-xs transition-all border ${
                    active
                      ? 'bg-[#a3394c] text-white border-[#a3394c] font-medium'
                      : 'bg-white text-[#705056] border-[#eadbd7] hover:border-[#e5a0aa]'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Personal Notes */}
        <div className="space-y-2 pt-2 border-t border-[#eadbd7]">
          <label className="text-xs font-semibold text-[#3a1f2e] uppercase tracking-wider block">
            6. Personal Skin Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Currently adjusting to a new climate, dry air in office, trying to keep routines under 4 steps..."
            className="w-full bg-white border border-[#eadbd7] p-2.5 text-xs text-[#3a1f2e] focus:outline-none focus:border-[#8e3b5a]"
          />
        </div>

        {/* Privacy Note */}
        <div className="p-3 bg-[#f8ede9] border border-[#eadbd7] text-[11px] text-[#705c60] flex items-center gap-2">
          <Shield size={14} className="text-[#8e3b5a] shrink-0" />
          <span>
            Profile data is saved strictly inside your browser's local storage and is never uploaded to third-party databases.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-xs text-[#806b70] hover:text-[#8e3b5a] transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset Profile</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase text-[#806b70] hover:text-[#3a1f2e]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="dark py-2.5 px-6 text-xs uppercase flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <UserCheck size={14} />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Save Skin Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

