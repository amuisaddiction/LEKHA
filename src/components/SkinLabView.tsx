import React, { useState, useMemo } from 'react';
import {
  Compass,
  Layers,
  Calendar,
  Target,
  GitCompare,
  ArrowRight,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Download,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import type { SkinScanRecord } from '../types/skin';
import type {
  SkinLabTab,
  CustomRoutineProduct,
  UserRoutine,
  SkinDiaryEntry,
  UserGoalProgress,
  ProductStepType,
} from '../types/skinLab';
import {
  SKIN_FOCUS_TOPICS,
  SKIN_GOAL_TRACKS,
  checkRoutineCompatibility,
  checkFaceConsistency,
} from '../utils/skinLabData';
import {
  loadUserRoutine,
  saveUserRoutine,
  resetUserRoutine,
  loadSkinDiaryEntries,
  saveSkinDiaryEntry,
  deleteSkinDiaryEntry,
  exportSkinDiaryAsCsv,
  exportSkinDiaryAsJson,
  loadGoalProgress,
  saveGoalProgress,
  toggleDailyGoalHabit,
  getTodayDateString,
} from '../utils/storage';
import { compareSkinScans } from '../utils/comparisonEngine';

interface SkinLabViewProps {
  records: SkinScanRecord[];
  onNavigateToScan: () => void;
  onNavigateToPassport: () => void;
  onOpenRecord: (record: SkinScanRecord) => void;
}

const COMMON_ACTIVE_INGREDIENTS = [
  'Niacinamide (5%)',
  'Hyaluronic Acid',
  'Retinol (0.2%)',
  'Retinaldehyde (0.05%)',
  'Salicylic Acid (BHA 2%)',
  'Glycolic Acid (AHA 7%)',
  'Lactic Acid (5%)',
  'L-Ascorbic Acid (Vitamin C 15%)',
  'Azelaic Acid (10%)',
  'Ceramides NP/AP/EOP',
  'Panthenol (Vitamin B5)',
  'Centella Asiatica',
  'Zinc PCA',
  'Benzoyl Peroxide (2.5%)',
  'Peptides (Matrixyl 3000)',
  'Glycerin',
  'Squalane',
];

export const SkinLabView: React.FC<SkinLabViewProps> = ({
  records,
  onNavigateToScan,
  onNavigateToPassport,
  onOpenRecord,
}) => {
  const [activeTab, setActiveTab] = useState<SkinLabTab>('explorer');

  // --------------------------------------------------------------------------
  // A. SKIN FOCUS EXPLORER STATE
  // --------------------------------------------------------------------------
  const [selectedFocusId, setSelectedFocusId] = useState<string>('texture');
  const selectedFocus = useMemo(
    () => SKIN_FOCUS_TOPICS.find((t) => t.id === selectedFocusId) || SKIN_FOCUS_TOPICS[0],
    [selectedFocusId]
  );

  // --------------------------------------------------------------------------
  // B. ROUTINE BUILDER STATE
  // --------------------------------------------------------------------------
  const [routine, setRoutine] = useState<UserRoutine>(loadUserRoutine);
  const [routineTab, setRoutineTab] = useState<'am' | 'pm'>('am');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductStep, setNewProductStep] = useState<ProductStepType>('serum');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredientInput, setCustomIngredientInput] = useState('');
  const [routineSavedToast, setRoutineSavedToast] = useState(false);

  // Active compatibility notices for the selected routine (AM or PM)
  const activeRoutineProducts = routineTab === 'am' ? routine.amProducts : routine.pmProducts;
  const compatibilityNotices = useMemo(
    () => checkRoutineCompatibility(activeRoutineProducts),
    [activeRoutineProducts]
  );

  const handleAddProduct = () => {
    if (!newProductName.trim()) return;

    const newProd: CustomRoutineProduct = {
      id: `prod_${Date.now()}`,
      name: newProductName.trim(),
      stepType: newProductStep,
      ingredients: selectedIngredients,
    };

    const updated = {
      ...routine,
      [routineTab === 'am' ? 'amProducts' : 'pmProducts']: [
        ...activeRoutineProducts,
        newProd,
      ],
    };

    setRoutine(updated);
    saveUserRoutine(updated);
    setNewProductName('');
    setSelectedIngredients([]);
    setIsAddingProduct(false);
    triggerToast();
  };

  const handleRemoveProduct = (id: string) => {
    const key = routineTab === 'am' ? 'amProducts' : 'pmProducts';
    const updated = {
      ...routine,
      [key]: routine[key].filter((p) => p.id !== id),
    };
    setRoutine(updated);
    saveUserRoutine(updated);
  };

  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    const key = routineTab === 'am' ? 'amProducts' : 'pmProducts';
    const list = [...routine[key]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const updated = {
      ...routine,
      [key]: list,
    };
    setRoutine(updated);
    saveUserRoutine(updated);
  };

  const handleResetRoutine = () => {
    if (window.confirm('Reset routine to dermatological default template?')) {
      const reset = resetUserRoutine();
      setRoutine(reset);
      triggerToast();
    }
  };

  const triggerToast = () => {
    setRoutineSavedToast(true);
    setTimeout(() => setRoutineSavedToast(false), 2500);
  };

  // --------------------------------------------------------------------------
  // C. SKIN DIARY STATE
  // --------------------------------------------------------------------------
  const [diaryEntries, setDiaryEntries] = useState<SkinDiaryEntry[]>(loadSkinDiaryEntries);
  const [diaryDate, setDiaryDate] = useState<string>(getTodayDateString());
  const [drynessScore, setDrynessScore] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [oilinessScore, setOilinessScore] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [rednessScore, setRednessScore] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [breakoutsScore, setBreakoutsScore] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [irritationScore, setIrritationScore] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [diaryTags, setDiaryTags] = useState<string[]>(['Wore SPF']);
  const [diaryNotes, setDiaryNotes] = useState<string>('');
  const [diarySavedNotice, setDiarySavedNotice] = useState(false);

  const DIARY_TAG_OPTIONS = [
    'Wore SPF',
    'Used Retinoid',
    'Exfoliated',
    'Double Cleansed',
    'Heavy Makeup',
    'High Stress',
    'Late Sleep',
    'Air Travel',
    'Good Hydration',
  ];

  const handleSaveDiaryEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: SkinDiaryEntry = {
      id: `diary_${Date.now()}`,
      date: diaryDate,
      timestamp: new Date().toISOString(),
      dryness: drynessScore,
      oiliness: oilinessScore,
      redness: rednessScore,
      breakouts: breakoutsScore,
      irritation: irritationScore,
      tags: diaryTags,
      notes: diaryNotes.trim(),
    };

    saveSkinDiaryEntry(entry);
    setDiaryEntries(loadSkinDiaryEntries());
    setDiarySavedNotice(true);
    setTimeout(() => setDiarySavedNotice(false), 2500);
  };

  const handleDeleteDiary = (id: string) => {
    if (window.confirm('Delete this diary log?')) {
      deleteSkinDiaryEntry(id);
      setDiaryEntries(loadSkinDiaryEntries());
    }
  };

  const handleExportCsv = () => {
    const csv = exportSkinDiaryAsCsv();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lekha_skin_diary_${getTodayDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const json = exportSkinDiaryAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lekha_skin_diary_${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------------------------------
  // D. 28-DAY SKIN GOALS STATE
  // --------------------------------------------------------------------------
  const [goalProgress, setGoalProgress] = useState<UserGoalProgress>(loadGoalProgress);
  const activeGoalTrack = useMemo(
    () => SKIN_GOAL_TRACKS.find((g) => g.id === goalProgress.goalId) || SKIN_GOAL_TRACKS[0],
    [goalProgress.goalId]
  );

  const todayStr = getTodayDateString();
  const todayCompletedHabits = goalProgress.dailyHabitCompletions[todayStr] || [];

  const handleSelectGoalTrack = (trackId: string) => {
    const updated: UserGoalProgress = {
      goalId: trackId,
      startDate: todayStr,
      completedDates: [],
      dailyHabitCompletions: {},
    };
    setGoalProgress(updated);
    saveGoalProgress(updated);
  };

  const handleToggleHabit = (habitId: string) => {
    const updated = toggleDailyGoalHabit(goalProgress.goalId, habitId, todayStr);
    setGoalProgress(updated);
  };

  const daysCompleted = goalProgress.completedDates.length;
  const progressPercent = Math.min(100, Math.round((daysCompleted / 28) * 100));

  // --------------------------------------------------------------------------
  // E. REAL SCAN COMPARISON STATE (ACTIVE WHEN RECORDS >= 2)
  // --------------------------------------------------------------------------
  const hasTwoScans = records.length >= 2;
  const [baselineId, setBaselineId] = useState<string>(
    hasTwoScans ? records[records.length - 1].id : ''
  );
  const [currentId, setCurrentId] = useState<string>(
    hasTwoScans ? records[0].id : ''
  );

  const baselineRecord = useMemo(
    () => (hasTwoScans ? records.find((r) => r.id === baselineId) || records[records.length - 1] : null),
    [records, baselineId, hasTwoScans]
  );

  const currentRecord = useMemo(
    () => (hasTwoScans ? records.find((r) => r.id === currentId) || records[0] : null),
    [records, currentId, hasTwoScans]
  );

  const comparisonResult = useMemo(() => {
    if (!baselineRecord || !currentRecord) return null;
    return compareSkinScans(baselineRecord, currentRecord);
  }, [baselineRecord, currentRecord]);

  const faceConsistency = useMemo(() => {
    if (!baselineRecord || !currentRecord) return null;
    return checkFaceConsistency(baselineRecord, currentRecord);
  }, [baselineRecord, currentRecord]);

  return (
    <main className="workspace">
      {/* 1. SKIN LAB HEADER & MISSION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#eadbd7] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8e3b5a] bg-[#fbf2ef] px-2.5 py-1 border border-[#eadbd7] font-semibold flex items-center gap-1.5">
              <Compass size={12} className="text-[#8e3b5a]" />
              DERMATOLOGICAL WORKBENCH · ZERO API CONSUMPTION
            </span>
            <span className="text-[11px] font-mono text-[#9a7479]">
              {hasTwoScans ? '✓ 2+ Scans Ready' : `${records.length}/2 Scans Saved`}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3a1f2e] m-0 mb-2">
            LEKHA <i>Skin Lab.</i>
          </h1>
          <p className="font-serif italic text-[#8e3b5a] text-base sm:text-lg m-0">
            "Understand your skin. Build better habits. See what changes."
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
          <button
            onClick={onNavigateToPassport}
            className="inline-flex items-center gap-1.5 border border-[#d9b8b6] px-4 py-2.5 bg-[#fffaf7] text-xs font-mono uppercase tracking-wider text-[#3a1f2e] hover:bg-[#f3ddda] transition-all"
          >
            <span>View Passport ({records.length})</span>
          </button>
          <button
            onClick={onNavigateToScan}
            className="dark inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider shadow-sm"
          >
            <span>New Scan</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 2. REAL SCAN UNLOCK STATUS BANNER */}
      {!hasTwoScans ? (
        <div className="mb-8 p-5 bg-[#fffaf7] border border-[#eadbd7] border-l-4 border-l-[#8e3b5a] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#fdf2ef] text-[#8e3b5a] rounded-full shrink-0">
              <GitCompare size={18} />
            </div>
            <div>
              <b className="text-[#3a1f2e] text-sm block">
                Real Biometric Scan Comparison unlocks after 2 saved scans.
              </b>
              <p className="text-xs text-[#786366] mt-0.5 m-0 leading-relaxed max-w-2xl">
                You currently have <b>{records.length} of 2</b> saved scans. Capture{' '}
                {2 - records.length === 1 ? '1 more scan' : '2 scans'} in your private Skin Passport to compare
                authentic YouCam computer vision deltas. In the meantime, explore all four interactive habit tools below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-28 bg-[#eddcd8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#8e3b5a] h-full transition-all duration-500"
                style={{ width: `${(records.length / 2) * 100}%` }}
              ></div>
            </div>
            <button
              onClick={onNavigateToScan}
              className="bg-[#3a1f2e] text-white px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider hover:bg-[#8e3b5a] transition-colors"
            >
              Add Entry
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-[#e8f1e6] border border-[#c3dcbf] flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#2c4e28]">
            <CheckCircle2 size={16} className="text-[#386733]" />
            <span>
              <b>Authentic Scan Comparison Unlocked:</b> You have {records.length} genuine scans saved. Open the
              "Compare Real Scans" tab anytime to review objective photographic evolution.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('compare')}
            className="bg-[#2c4e28] text-white px-3.5 py-1.5 font-mono uppercase tracking-wider text-[11px] shrink-0 hover:bg-[#1f381c] transition-colors"
          >
            Open Compare
          </button>
        </div>
      )}

      {/* 3. MAIN NAVIGATION TABS */}
      <div className="flex border-b border-[#eadbd7] gap-2 sm:gap-4 overflow-x-auto pb-px mb-8 scrollbar-none">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'explorer'
              ? 'border-[#8e3b5a] text-[#8e3b5a] font-bold bg-[#fffaf7]'
              : 'border-transparent text-[#7a6467] hover:text-[#3a1f2e]'
          }`}
        >
          <Compass size={14} />
          <span>1. Skin Focus Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('routine')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'routine'
              ? 'border-[#8e3b5a] text-[#8e3b5a] font-bold bg-[#fffaf7]'
              : 'border-transparent text-[#7a6467] hover:text-[#3a1f2e]'
          }`}
        >
          <Layers size={14} />
          <span>2. Routine Builder</span>
          {compatibilityNotices.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#c98f94]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('diary')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'diary'
              ? 'border-[#8e3b5a] text-[#8e3b5a] font-bold bg-[#fffaf7]'
              : 'border-transparent text-[#7a6467] hover:text-[#3a1f2e]'
          }`}
        >
          <Calendar size={14} />
          <span>3. Skin Diary</span>
          <span className="text-[10px] font-mono text-[#9a7479] bg-[#f5e8e4] px-1.5 py-0.2">
            {diaryEntries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'goals'
              ? 'border-[#8e3b5a] text-[#8e3b5a] font-bold bg-[#fffaf7]'
              : 'border-transparent text-[#7a6467] hover:text-[#3a1f2e]'
          }`}
        >
          <Target size={14} />
          <span>4. 28-Day Goals</span>
          <span className="text-[10px] font-mono text-[#8e3b5a] font-semibold">
            {daysCompleted}/28d
          </span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'compare'
              ? 'border-[#8e3b5a] text-[#8e3b5a] font-bold bg-[#fffaf7]'
              : 'border-transparent text-[#7a6467] hover:text-[#3a1f2e]'
          }`}
        >
          <GitCompare size={14} />
          <span>5. Compare Real Scans</span>
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 border ${
              hasTwoScans
                ? 'bg-[#e2ede0] text-[#34582f] border-[#c0dac0]'
                : 'bg-[#fbf2ef] text-[#9a7479] border-[#eadbd7]'
            }`}
          >
            {hasTwoScans ? 'Ready' : 'Locked'}
          </span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: SKIN FOCUS EXPLORER
         ===================================================================== */}
      {activeTab === 'explorer' && (
        <div className="space-y-8 animate-fadeIn">
          {/* 8 Concern Pill Selector */}
          <div className="flex flex-wrap gap-2.5 pb-2">
            {SKIN_FOCUS_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedFocusId(topic.id)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
                  selectedFocusId === topic.id
                    ? 'bg-[#3a1f2e] text-white border-[#3a1f2e] shadow-sm font-semibold'
                    : 'bg-[#fffaf7] text-[#6b5558] border-[#eadbd7] hover:border-[#c98f94]'
                }`}
              >
                {topic.title.split('&')[0].trim()}
              </button>
            ))}
          </div>

          {/* Detailed Editorial Presentation of Selected Topic */}
          <div className="bg-[#fffaf7] border border-[#eadbd7] p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: High-Res Macro Photography */}
              <div className="lg:col-span-5 space-y-4">
                <div className="aspect-[4/5] bg-[#f1e4e0] overflow-hidden border border-[#d9b8b6] shadow-sm relative group">
                  <img
                    src={selectedFocus.imageUrl}
                    alt={selectedFocus.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#3a1f2e]/90 text-white font-mono text-[9px] uppercase px-2.5 py-1 tracking-widest">
                    {selectedFocus.categoryBadge}
                  </div>
                  <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-xs p-2.5 border border-[#eadbd7] text-[10px] text-[#735e61] font-mono leading-tight">
                    Optical Focus · {selectedFocus.title}
                  </div>
                </div>

                <div className="p-3.5 bg-[#fbf2ef] border border-[#eadbd7] text-[11px] text-[#786366] space-y-1">
                  <div className="font-mono text-[9px] uppercase font-bold text-[#8e3b5a] tracking-wider">
                    Dermatological Truth
                  </div>
                  <p className="m-0 leading-relaxed">
                    Educational observation guidance only. LEKHA presents objective cosmetic optics without diagnosing medical dermatoses.
                  </p>
                </div>
              </div>

              {/* Right Column: In-Depth Explanation & Actionable Mirror Cues */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="eyebrow">TOPIC DEEP-DIVE / COSMETIC EDUCATION</span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#3a1f2e] m-0 mb-3">
                    {selectedFocus.title}
                  </h2>
                  <p className="text-sm md:text-base text-[#6b5558] leading-relaxed">
                    {selectedFocus.simpleExplanation}
                  </p>
                </div>

                {/* What Users Can Observe Themselves */}
                <div className="bg-[#faf1ee] border border-[#eadbd7] p-5 space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#3a1f2e] m-0 font-bold flex items-center gap-2">
                    <Compass size={14} className="text-[#8e3b5a]" />
                    <span>What You Can Observe In Your Mirror (No Device Needed)</span>
                  </h3>
                  <ul className="space-y-2 m-0 pl-0 list-none">
                    {selectedFocus.selfObservationCues.map((cue, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#705a5d] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8e3b5a] mt-1.5 shrink-0" />
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Daily Tracking Suggestion */}
                <div className="border-l-2 border-[#8e3b5a] pl-4 py-1 space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8e3b5a] font-bold block">
                    Daily Habit Suggestion
                  </span>
                  <p className="text-xs text-[#6b5558] leading-relaxed m-0">
                    {selectedFocus.dailyTrackingSuggestion}
                  </p>
                </div>

                {/* Beneficial Ingredients */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#9a7479] block">
                    Formulations & Active Ingredients To Look For:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFocus.ingredientsToLookFor.map((ing) => (
                      <span
                        key={ing}
                        className="bg-white border border-[#d9b8b6] px-2.5 py-1 text-xs text-[#3a1f2e] font-mono"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab('routine')}
                    className="border border-[#3a1f2e] px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#3a1f2e] hover:bg-[#3a1f2e] hover:text-white transition-all"
                  >
                    Build Routine for This Concern →
                  </button>
                  <button
                    onClick={onNavigateToScan}
                    className="text-xs font-mono uppercase tracking-wider text-[#8e3b5a] hover:underline"
                  >
                    Scan with YouCam AI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: ROUTINE BUILDER
         ===================================================================== */}
      {activeTab === 'routine' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fffaf7] p-5 border border-[#eadbd7]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRoutineTab('am')}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border ${
                  routineTab === 'am'
                    ? 'bg-[#3a1f2e] text-white border-[#3a1f2e] shadow-sm font-semibold'
                    : 'bg-[#fbf2ef] text-[#6b5558] border-[#eadbd7]'
                }`}
              >
                <Sun size={13} className={routineTab === 'am' ? 'text-[#e8a598]' : ''} />
                <span>AM Routine ({routine.amProducts.length} Steps)</span>
              </button>

              <button
                onClick={() => setRoutineTab('pm')}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border ${
                  routineTab === 'pm'
                    ? 'bg-[#3a1f2e] text-white border-[#3a1f2e] shadow-sm font-semibold'
                    : 'bg-[#fbf2ef] text-[#6b5558] border-[#eadbd7]'
                }`}
              >
                <Moon size={13} className={routineTab === 'pm' ? 'text-[#c98f94]' : ''} />
                <span>PM Routine ({routine.pmProducts.length} Steps)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {routineSavedToast && (
                <span className="text-xs font-mono text-[#386733] bg-[#e2ede0] px-2.5 py-1 border border-[#c3dcbf] animate-pulse">
                  ✓ Routine saved locally
                </span>
              )}
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-[#8e3b5a] text-white px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-[#3a1f2e] transition-colors flex items-center gap-1.5"
              >
                <Plus size={13} />
                <span>Add Product</span>
              </button>
              <button
                onClick={handleResetRoutine}
                title="Reset to default template"
                className="p-2 border border-[#d9b8b6] text-[#7a6467] hover:text-[#3a1f2e] bg-white"
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Compatibility & Ingredient Overlap Warning Banner */}
          {compatibilityNotices.length > 0 && (
            <div className="space-y-3">
              {compatibilityNotices.map((notice, idx) => (
                <div
                  key={idx}
                  className={`p-4 border flex items-start gap-3 text-xs ${
                    notice.severity === 'warning'
                      ? 'bg-[#fdf2ef] border-[#e5a0aa] text-[#6b2535]'
                      : notice.severity === 'caution'
                      ? 'bg-[#fff8f0] border-[#ecd3b3] text-[#7a481c]'
                      : 'bg-[#f5f8ff] border-[#ccd8f0] text-[#2c4e7a]'
                  }`}
                >
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <b className="font-mono text-xs uppercase tracking-wider block">
                      {notice.title}
                    </b>
                    <p className="m-0 leading-relaxed">{notice.description}</p>
                    <p className="m-0 font-mono text-[11px] opacity-90">
                      Recommendation: {notice.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Product Modal / Drawer */}
          {isAddingProduct && (
            <div className="bg-[#fffaf7] border border-[#8e3b5a] p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-[#eadbd7] pb-3">
                <h3 className="font-serif text-lg text-[#3a1f2e] m-0">
                  Add New Product to {routineTab.toUpperCase()} Routine
                </h3>
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="text-xs text-[#8e3b5a] hover:underline font-mono"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#7a6467] mb-1">
                    Product Name & Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CeraVe PM Facial Moisturizing Lotion"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full p-2.5 border border-[#d9b8b6] bg-white text-xs text-[#3a1f2e] outline-none focus:border-[#8e3b5a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#7a6467] mb-1">
                    Step Category
                  </label>
                  <select
                    value={newProductStep}
                    onChange={(e) => setNewProductStep(e.target.value as ProductStepType)}
                    className="w-full p-2.5 border border-[#d9b8b6] bg-white text-xs text-[#3a1f2e] outline-none focus:border-[#8e3b5a]"
                  >
                    <option value="cleanser">Cleanser</option>
                    <option value="toner">Toner / Essence</option>
                    <option value="serum">Serum</option>
                    <option value="treatment">Treatment / Active</option>
                    <option value="moisturizer">Moisturizer / Cream</option>
                    <option value="sunscreen">Sunscreen SPF</option>
                    <option value="night_cream">Night Cream</option>
                    <option value="oil">Facial Oil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#7a6467] mb-1">
                  Tag Key Active Ingredients (for compatibility analysis)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_ACTIVE_INGREDIENTS.map((ing) => {
                    const isSelected = selectedIngredients.includes(ing);
                    return (
                      <button
                        key={ing}
                        type="button"
                        onClick={() =>
                          setSelectedIngredients((prev) =>
                            isSelected ? prev.filter((i) => i !== ing) : [...prev, ing]
                          )
                        }
                        className={`text-[11px] font-mono px-2 py-0.5 border transition-all ${
                          isSelected
                            ? 'bg-[#8e3b5a] text-white border-[#8e3b5a]'
                            : 'bg-white text-[#786366] border-[#d9b8b6] hover:border-[#8e3b5a]'
                        }`}
                      >
                        {isSelected ? `✓ ${ing}` : `+ ${ing}`}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Custom ingredient (e.g. Copper Tripeptide)..."
                    value={customIngredientInput}
                    onChange={(e) => setCustomIngredientInput(e.target.value)}
                    className="p-1.5 border border-[#d9b8b6] bg-white text-xs flex-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customIngredientInput.trim()) {
                        setSelectedIngredients((prev) => [...prev, customIngredientInput.trim()]);
                        setCustomIngredientInput('');
                      }
                    }}
                    className="bg-[#eadbd7] text-[#3a1f2e] px-3 py-1 text-xs font-mono uppercase"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-[#3a1f2e] text-white px-5 py-2 text-xs font-mono uppercase tracking-wider hover:bg-[#8e3b5a]"
                >
                  Save Product Step
                </button>
              </div>
            </div>
          )}

          {/* List of Product Steps in the Selected Routine */}
          <div className="space-y-4">
            {activeRoutineProducts.length === 0 ? (
              <div className="p-8 text-center bg-[#fffaf7] border border-[#eadbd7] text-[#7a6467]">
                <p className="text-sm m-0">No steps defined for your {routineTab.toUpperCase()} routine yet.</p>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="mt-3 text-xs font-mono uppercase text-[#8e3b5a] underline"
                >
                  + Add Your First Step
                </button>
              </div>
            ) : (
              activeRoutineProducts.map((prod, index) => (
                <div
                  key={prod.id}
                  className="bg-[#fffaf7] border border-[#eadbd7] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#c98f94] transition-all shadow-xs"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#fbf2ef] border border-[#d9b8b6] text-[#8e3b5a] font-mono text-xs flex items-center justify-center font-bold shrink-0">
                      0{index + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-[#f0dedb] text-[#3a1f2e] font-semibold">
                          {prod.stepType.replace('_', ' ')}
                        </span>
                        <h4 className="font-serif text-base text-[#3a1f2e] m-0">
                          {prod.name}
                        </h4>
                      </div>
                      {prod.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {prod.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="text-[10px] font-mono text-[#8e3b5a] bg-white border border-[#eadbd7] px-1.5 py-0.2"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveProduct(index, 'up')}
                      title="Move up"
                      className="p-1.5 border border-[#eadbd7] text-[#7a6467] hover:text-[#3a1f2e] disabled:opacity-30 bg-white"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      disabled={index === activeRoutineProducts.length - 1}
                      onClick={() => handleMoveProduct(index, 'down')}
                      title="Move down"
                      className="p-1.5 border border-[#eadbd7] text-[#7a6467] hover:text-[#3a1f2e] disabled:opacity-30 bg-white"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => handleRemoveProduct(prod.id)}
                      title="Remove product"
                      className="p-1.5 border border-[#eadbd7] text-[#c98f94] hover:text-[#8e3b5a] bg-white"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: SKIN DIARY
         ===================================================================== */}
      {activeTab === 'diary' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Daily Observation Check-in Form */}
          <div className="bg-[#fffaf7] border border-[#eadbd7] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eadbd7] pb-3 mb-6">
              <div>
                <span className="eyebrow">SUBJECTIVE SELF-ASSESSMENT / DAILY JOURNAL</span>
                <h3 className="font-serif text-2xl text-[#3a1f2e] m-0">
                  Daily Skin Check-in
                </h3>
              </div>
              <input
                type="date"
                value={diaryDate}
                onChange={(e) => setDiaryDate(e.target.value)}
                className="p-2 border border-[#d9b8b6] bg-white text-xs font-mono text-[#3a1f2e] outline-none"
              />
            </div>

            <form onSubmit={handleSaveDiaryEntry} className="space-y-6">
              {/* 5 Sliders / 1-5 Parameter Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  {
                    key: 'dryness',
                    label: 'Dryness / Tightness',
                    val: drynessScore,
                    set: setDrynessScore,
                    low: 'Supple',
                    high: 'Tight/Flaking',
                  },
                  {
                    key: 'oiliness',
                    label: 'Oiliness / Shine',
                    val: oilinessScore,
                    set: setOilinessScore,
                    low: 'Balanced',
                    high: 'Heavy Shine',
                  },
                  {
                    key: 'redness',
                    label: 'Redness / Sensitivity',
                    val: rednessScore,
                    set: setRednessScore,
                    low: 'Calm',
                    high: 'Flushed/Irritated',
                  },
                  {
                    key: 'breakouts',
                    label: 'Breakout Activity',
                    val: breakoutsScore,
                    set: setBreakoutsScore,
                    low: 'Clear',
                    high: 'Active Lesions',
                  },
                  {
                    key: 'irritation',
                    label: 'Comfort / Irritation',
                    val: irritationScore,
                    set: setIrritationScore,
                    low: 'Comfortable',
                    high: 'Stinging/Burning',
                  },
                ].map((param) => (
                  <div key={param.key} className="bg-[#fbf2ef] p-4 border border-[#eadbd7] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#3a1f2e]">
                        {param.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#8e3b5a]">{param.val}/5</span>
                    </div>

                    <div className="flex gap-1 justify-between pt-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => param.set(lvl as any)}
                          className={`w-7 h-7 text-xs font-mono transition-all border ${
                            param.val === lvl
                              ? 'bg-[#3a1f2e] text-white border-[#3a1f2e] font-bold'
                              : 'bg-white text-[#786366] border-[#d9b8b6] hover:border-[#8e3b5a]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between text-[9px] font-mono text-[#9a7479] pt-1">
                      <span>{param.low}</span>
                      <span>{param.high}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#7a6467] mb-2">
                  Lifestyle & Product Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DIARY_TAG_OPTIONS.map((tag) => {
                    const isSelected = diaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setDiaryTags((prev) =>
                            isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                          )
                        }
                        className={`text-xs font-mono px-3 py-1 border transition-all ${
                          isSelected
                            ? 'bg-[#8e3b5a] text-white border-[#8e3b5a]'
                            : 'bg-white text-[#786366] border-[#d9b8b6] hover:border-[#8e3b5a]'
                        }`}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subjective Notes */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#7a6467] mb-1">
                  Daily Observation Notes (Weather, Sleep, Reactions)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Felt mild tightness after morning walk in dry wind. Applied extra ceramide cream."
                  value={diaryNotes}
                  onChange={(e) => setDiaryNotes(e.target.value)}
                  className="w-full p-3 border border-[#d9b8b6] bg-white text-xs text-[#3a1f2e] outline-none focus:border-[#8e3b5a]"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-[#9a7479]">
                  {diarySavedNotice ? '✓ Entry recorded into local diary!' : 'Stored privately on this browser.'}
                </span>

                <button
                  type="submit"
                  className="bg-[#3a1f2e] text-white px-6 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#8e3b5a] transition-colors"
                >
                  Save Daily Entry
                </button>
              </div>
            </form>
          </div>

          {/* Historical Log Entries & Export Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#3a1f2e] m-0">
                Diary Log History ({diaryEntries.length} entries)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  disabled={diaryEntries.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#d9b8b6] bg-white text-xs font-mono text-[#3a1f2e] hover:bg-[#fbf2ef] disabled:opacity-40"
                >
                  <Download size={12} />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handleExportJson}
                  disabled={diaryEntries.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#d9b8b6] bg-white text-xs font-mono text-[#3a1f2e] hover:bg-[#fbf2ef] disabled:opacity-40"
                >
                  <Download size={12} />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            {diaryEntries.length === 0 ? (
              <div className="p-8 text-center bg-[#fffaf7] border border-[#eadbd7] text-[#7a6467]">
                <p className="text-sm m-0">No diary check-ins saved yet. Log today's skin feel above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {diaryEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-[#fffaf7] border border-[#eadbd7] p-5 hover:border-[#c98f94] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#8e3b5a] bg-[#fdf2ef] px-2.5 py-0.5 border border-[#eadbd7]">
                          {entry.date}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono text-[#786366] bg-[#f5e8e4] px-2 py-0.2"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs font-mono text-[#6b5558] pt-1">
                        <span>Dryness: <b>{entry.dryness}/5</b></span>
                        <span>•</span>
                        <span>Oiliness: <b>{entry.oiliness}/5</b></span>
                        <span>•</span>
                        <span>Redness: <b>{entry.redness}/5</b></span>
                        <span>•</span>
                        <span>Breakouts: <b>{entry.breakouts}/5</b></span>
                        <span>•</span>
                        <span>Irritation: <b>{entry.irritation}/5</b></span>
                      </div>

                      {entry.notes && (
                        <p className="text-xs text-[#705a5d] italic m-0 pt-1">"{entry.notes}"</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteDiary(entry.id)}
                      className="text-[#c98f94] hover:text-[#8e3b5a] p-1.5 self-end md:self-center"
                      title="Delete log"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: 28-DAY SKIN GOALS
         ===================================================================== */}
      {activeTab === 'goals' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Goal Track Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SKIN_GOAL_TRACKS.map((track) => {
              const isSelected = activeGoalTrack.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectGoalTrack(track.id)}
                  className={`p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#3a1f2e] text-white border-[#3a1f2e] shadow-md ring-1 ring-[#8e3b5a]'
                      : 'bg-[#fffaf7] text-[#3a1f2e] border-[#eadbd7] hover:border-[#c98f94]'
                  }`}
                >
                  <div className="space-y-2">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider block ${
                        isSelected ? 'text-[#e8a598]' : 'text-[#8e3b5a]'
                      }`}
                    >
                      {track.targetFocus}
                    </span>
                    <h4 className={`font-serif text-lg m-0 ${isSelected ? 'text-white' : 'text-[#3a1f2e]'}`}>
                      {track.title}
                    </h4>
                    <p className={`text-xs leading-relaxed m-0 ${isSelected ? 'text-[#e2cdc9]' : 'text-[#705a5d]'}`}>
                      {track.tagline}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs font-mono">
                    <span className={isSelected ? 'text-[#e8a598]' : 'text-[#9a7479]'}>
                      28-Day Cycle
                    </span>
                    {isSelected && <span className="text-white font-bold">Active Track ✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Goal Progress Dashboard */}
          <div className="bg-[#fffaf7] border border-[#eadbd7] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eadbd7] pb-4">
              <div>
                <span className="eyebrow">EPIDERMAL TURNOVER TRACKER / CYCLE PROGRESS</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#3a1f2e] m-0">
                  {activeGoalTrack.title}
                </h3>
                <p className="text-xs text-[#705a5d] mt-1 m-0">
                  Started: {goalProgress.startDate} · Cycle Length: 28 Days
                </p>
              </div>

              <div className="text-right">
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#8e3b5a]">
                  {daysCompleted} <span className="text-sm text-[#7a6467] font-normal">/ 28 Days Completed</span>
                </div>
                <span className="text-[11px] font-mono text-[#9a7479]">
                  Activity-Based Progress: {progressPercent}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-[#eddcd8] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#8e3b5a] h-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#9a7479]">
                <span>Day 0 (Baseline)</span>
                <span>Day 7 (Awakening)</span>
                <span>Day 14 (Turnover)</span>
                <span>Day 21 (Consolidation)</span>
                <span>Day 28 (Cycle Complete)</span>
              </div>
            </div>

            {/* Today's Habit Checklist */}
            <div className="bg-[#faf1ee] border border-[#eadbd7] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#3a1f2e] m-0 font-bold flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#8e3b5a]" />
                  <span>Today's Daily Habit Checklist ({todayStr})</span>
                </h4>
                <span className="text-[11px] font-mono text-[#7a6467]">
                  {todayCompletedHabits.length} of {activeGoalTrack.dailyHabits.length} done
                </span>
              </div>

              <div className="space-y-2.5">
                {activeGoalTrack.dailyHabits.map((habit) => {
                  const isDone = todayCompletedHabits.includes(habit.id);
                  return (
                    <div
                      key={habit.id}
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`p-3 border cursor-pointer transition-all flex items-start gap-3 ${
                        isDone
                          ? 'bg-[#eef5ed] border-[#c0dac0] text-[#2c4e28]'
                          : 'bg-white border-[#d9b8b6] hover:border-[#8e3b5a] text-[#3a1f2e]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                          isDone ? 'bg-[#386733] border-[#386733] text-white' : 'border-[#b5989c]'
                        }`}
                      >
                        {isDone && <Check size={12} />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium block leading-snug">{habit.label}</span>
                        <span className="text-[11px] text-[#705a5d] block leading-tight">
                          Why: {habit.whyItMatters}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 Dermatology Milestones */}
            <div className="space-y-3 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#9a7479] block">
                Dermatological Cellular Milestones
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeGoalTrack.milestones.map((milestone) => {
                  const isUnlocked = daysCompleted >= milestone.day;
                  return (
                    <div
                      key={milestone.day}
                      className={`p-4 border space-y-2 ${
                        isUnlocked
                          ? 'bg-[#fffaf7] border-[#8e3b5a] shadow-xs'
                          : 'bg-[#fbf7f6] border-[#eadbd7] opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#8e3b5a]">
                          Day {milestone.day}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[9px] font-mono text-[#386733] bg-[#e2ede0] px-1.5 py-0.2">
                            Reached ✓
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-[#9a7479]">Upcoming</span>
                        )}
                      </div>
                      <b className="font-serif text-sm text-[#3a1f2e] block leading-snug">
                        {milestone.title}
                      </b>
                      <p className="text-[11px] text-[#705a5d] leading-relaxed m-0">
                        {milestone.dermatologicalInsight}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: COMPARE REAL SCANS (HONEST SCAN-TO-SCAN ENGINE)
         ===================================================================== */}
      {activeTab === 'compare' && (
        <div className="space-y-8 animate-fadeIn">
          {!hasTwoScans ? (
            /* First-time / 1-scan user locked state */
            <div className="bg-[#fffaf7] border border-[#eadbd7] p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#fdf2ef] text-[#8e3b5a] border border-[#d9b8b6] flex items-center justify-center mx-auto">
                <GitCompare size={24} />
              </div>

              <div className="max-w-xl mx-auto space-y-3">
                <span className="eyebrow">HONEST BIOMETRIC INTEGRITY</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#3a1f2e] m-0">
                  Real Scan Comparison requires 2 authentic YouCam scans.
                </h3>
                <p className="text-xs sm:text-sm text-[#6b5558] leading-relaxed">
                  LEKHA strictly avoids generating fabricated comparison graphs or simulating progress from a single image.
                  To measure objective biological change, you need two distinct, dated scans saved in your private Skin Passport.
                </p>
              </div>

              <div className="p-4 bg-[#fbf2ef] border border-[#eadbd7] max-w-md mx-auto text-xs font-mono text-[#786366]">
                Current status: <b>{records.length} of 2 scans recorded</b>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onNavigateToPassport}
                  className="border border-[#d9b8b6] px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#3a1f2e] bg-white hover:bg-[#fbf2ef]"
                >
                  View Passport Records
                </button>
                <button
                  onClick={onNavigateToScan}
                  className="dark px-6 py-2.5 text-xs font-mono uppercase tracking-wider"
                >
                  <span>Capture Next Scan</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ) : (
            /* Genuine 2+ Scans Comparison Studio */
            <div className="space-y-8">
              {/* Divergent Subject / Face Consistency Warning */}
              {faceConsistency && faceConsistency.divergenceLevel !== 'low' && (
                <div className="p-4 bg-[#fdf2ef] border-l-4 border-[#8e3b5a] text-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#8e3b5a] font-bold font-mono">
                    <AlertTriangle size={15} />
                    <span>CAUTION: DIVERGENT CAPTURE PROFILE OR SUBJECT DETECTED</span>
                  </div>
                  <p className="text-[#6b2535] m-0 leading-relaxed">
                    {faceConsistency.warningMessage ||
                      'The two selected scans exhibit differing photo framing, lighting, or entry identifiers. Biometric comparison is scientifically meaningful only when evaluating the exact same face over time.'}
                  </p>
                </div>
              )}

              {/* Side-by-Side Dual Portrait Studio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Baseline Capture */}
                <div className="bg-[#fffaf7] p-6 border border-[#eadbd7] shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#eadbd7] pb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#8e3b5a]">
                        01 / BASELINE SCAN (EARLIER)
                      </span>
                      <span className="font-mono text-xs text-[#7a6467]">
                        {baselineRecord?.dateFormatted}
                      </span>
                    </div>

                    <select
                      value={baselineId}
                      onChange={(e) => setBaselineId(e.target.value)}
                      className="w-full bg-[#fbf2ef] border border-[#d9b8b6] p-2 text-xs font-mono text-[#3a1f2e] outline-none"
                    >
                      {records.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.dateFormatted} — {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {baselineRecord && (
                    <div className="space-y-3">
                      <div className="aspect-[3/4] max-h-[420px] bg-[#f1e4e0] overflow-hidden border border-[#d9b8b6] relative">
                        {baselineRecord.thumbnailUrl ? (
                          <img
                            src={baselineRecord.thumbnailUrl}
                            alt={baselineRecord.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-[#8e3b5a]">
                            L.
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-[#3a1f2e]/85 text-white font-mono text-[9px] uppercase px-2 py-1">
                          Baseline · {baselineRecord.dateFormatted}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-[#7a6467]">
                        <span>Lux: {baselineRecord.qualityCheck?.brightness ?? 'N/A'}%</span>
                        <button
                          onClick={() => onOpenRecord(baselineRecord)}
                          className="text-[#8e3b5a] hover:underline uppercase inline-flex items-center gap-1"
                        >
                          <span>Full Metrics</span>
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Current Follow-Up */}
                <div className="bg-[#fffaf7] p-6 border border-[#eadbd7] shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#eadbd7] pb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#386733]">
                        02 / CURRENT SCAN (FOLLOW-UP)
                      </span>
                      <span className="font-mono text-xs text-[#7a6467]">
                        {currentRecord?.dateFormatted}
                      </span>
                    </div>

                    <select
                      value={currentId}
                      onChange={(e) => setCurrentId(e.target.value)}
                      className="w-full bg-[#fbf2ef] border border-[#d9b8b6] p-2 text-xs font-mono text-[#3a1f2e] outline-none"
                    >
                      {records.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.dateFormatted} — {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentRecord && (
                    <div className="space-y-3">
                      <div className="aspect-[3/4] max-h-[420px] bg-[#f1e4e0] overflow-hidden border border-[#d9b8b6] relative">
                        {currentRecord.thumbnailUrl ? (
                          <img
                            src={currentRecord.thumbnailUrl}
                            alt={currentRecord.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-[#8e3b5a]">
                            L.
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-[#2c4e28]/85 text-white font-mono text-[9px] uppercase px-2 py-1">
                          Follow-up · {currentRecord.dateFormatted}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-[#7a6467]">
                        <span>Lux: {currentRecord.qualityCheck?.brightness ?? 'N/A'}%</span>
                        <button
                          onClick={() => onOpenRecord(currentRecord)}
                          className="text-[#8e3b5a] hover:underline uppercase inline-flex items-center gap-1"
                        >
                          <span>Full Metrics</span>
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison Confidence Rating Card */}
              {comparisonResult && (
                <div className="bg-[#fdf8f6] border border-[#d9b8b6] p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eedbd7] pb-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#9a7479] tracking-wider block">
                        SCIENTIFIC INTEGRITY VERIFICATION
                      </span>
                      <b className="font-serif text-lg text-[#3a1f2e]">Comparison Confidence Rating</b>
                    </div>
                    <span
                      className={`text-xs font-mono uppercase px-3 py-1 font-semibold ${
                        comparisonResult.confidence.overallConfidence === 'high'
                          ? 'bg-[#e2ede0] text-[#34582f]'
                          : 'bg-[#fff2e0] text-[#7a481c]'
                      }`}
                    >
                      {comparisonResult.confidence.overallConfidence.toUpperCase()} SCIENTIFIC CONFIDENCE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white p-3 border border-[#eadbd7]">
                      <span className="font-mono text-[10px] text-[#9a7479] uppercase block mb-1">
                        Lighting Match
                      </span>
                      <span className="font-serif text-sm text-[#3a1f2e] capitalize">
                        {comparisonResult.confidence.factors.lightingMatch}
                      </span>
                    </div>

                    <div className="bg-white p-3 border border-[#eadbd7]">
                      <span className="font-mono text-[10px] text-[#9a7479] uppercase block mb-1">
                        Resolution Match
                      </span>
                      <span className="font-serif text-sm text-[#3a1f2e] capitalize">
                        {comparisonResult.confidence.factors.resolutionMatch}
                      </span>
                    </div>

                    <div className="bg-white p-3 border border-[#eadbd7]">
                      <span className="font-mono text-[10px] text-[#9a7479] uppercase block mb-1">
                        Observation Window
                      </span>
                      <span className="font-serif text-sm text-[#3a1f2e]">
                        {comparisonResult.confidence.factors.timeGapDays} Days Apart
                      </span>
                    </div>
                  </div>

                  {comparisonResult.confidence.caveats.length > 0 && (
                    <div className="p-3 bg-white border border-[#eadbd7] space-y-1 text-xs text-[#705a5d]">
                      {comparisonResult.confidence.caveats.map((c, i) => (
                        <p key={i} className="m-0 leading-relaxed">• {c}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Metric Delta Cards */}
              {comparisonResult && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-[#3a1f2e] m-0">
                    Parameter Shifts & Engine Deltas
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {comparisonResult.deltas.map((d) => (
                      <div
                        key={d.type}
                        className="bg-[#fffaf7] border border-[#eadbd7] p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#f0dedb] pb-2">
                          <span className="font-mono text-[10px] uppercase text-[#9a7479]">
                            {d.type.toUpperCase()}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 font-bold uppercase ${
                              d.trend === 'improved'
                                ? 'bg-[#e2ede0] text-[#34582f]'
                                : d.trend === 'declined'
                                ? 'bg-[#fdf2ef] text-[#8e3b5a]'
                                : 'bg-[#f5e8e4] text-[#7a6467]'
                            }`}
                          >
                            {d.trend}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-xs text-[#7a6467] block">Baseline</span>
                            <span className="font-mono text-base font-bold text-[#3a1f2e]">
                              {d.baselineUiScore}
                            </span>
                          </div>

                          <div className="text-center font-mono text-sm text-[#8e3b5a] font-bold">
                            {d.uiDelta > 0 ? `+${d.uiDelta}` : d.uiDelta}
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-[#7a6467] block">Current</span>
                            <span className="font-mono text-base font-bold text-[#3a1f2e]">
                              {d.currentUiScore}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#705a5d] leading-relaxed m-0 border-t border-[#f0dedb] pt-2">
                          {d.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
};
