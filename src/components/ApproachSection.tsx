import React, { useState } from 'react';
import {
  ArrowRight,
  ScanFace,
  Sparkles,
  Clock3,
  ShieldCheck,
  LockKeyhole,
  Sun,
  Moon,
  Camera,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface ApproachSectionProps {
  onStartScan: () => void;
  onExplorePassport: () => void;
  passportCount: number;
}

interface SkinConcern {
  id: string;
  title: string;
  category: string;
  metricKey: string;
  description: string;
  imageUrl: string;
  detail: string;
}

const SKIN_CONCERNS: SkinConcern[] = [
  {
    id: 'texture',
    title: 'Skin Texture',
    category: 'Surface Uniformity',
    metricKey: 'texture',
    description: 'Measures microscopic epidermal smoothness and cellular turnover regularity.',
    detail: 'Evaluates textural micro-roughness across 12 facial zones for true tactile skin health.',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pores',
    title: 'Pore Appearance',
    category: 'Follicular Refinement',
    metricKey: 'pore',
    description: 'Tracks visible follicular openings across cheeks, nose, and central T-zone.',
    detail: 'Differentiates clean optical shadow depth from enlarged or congested pores.',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'wrinkles',
    title: 'Fine Lines & Wrinkles',
    category: 'Elasticity & Creasing',
    metricKey: 'wrinkle',
    description: 'Quantifies crease depth and micro-lines around peri-orbital and expression zones.',
    detail: 'Separates temporary dehydration fine lines from structural dermal creases.',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'acne',
    title: 'Blemish Clarity',
    category: 'Inflammatory Signals',
    metricKey: 'acne',
    description: 'Pinpoints localized papules, micro-comedones, and active flare points.',
    detail: 'Tracks active erythema centers versus healing post-inflammatory marks.',
    imageUrl: 'https://images.unsplash.com/photo-1595955793665-c174881341d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'redness',
    title: 'Vascular Redness',
    category: 'Micro-Circulation',
    metricKey: 'redness',
    description: 'Analyzes capillary micro-reactivity, surface flushing, and barrier calm.',
    detail: 'Monitors skin barrier sensitivity, environmental stress, and facial flushing patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pigmentation',
    title: 'Age Spots & Pigment',
    category: 'Melanin Distribution',
    metricKey: 'age_spot',
    description: 'Evaluates localized sun spots, UV hyperpigmentation, and tone uniformity.',
    detail: 'Distinguishes natural genetic freckles from progressive sun exposure spots.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'oiliness',
    title: 'Sebum & Oil Balance',
    category: 'Lipid Regulation',
    metricKey: 'oiliness',
    description: 'Calculates specular surface reflection to isolate active lipid output.',
    detail: 'Tracks diurnal shifts in sebum production without confusing healthy hydration with excess shine.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'moisture',
    title: 'Hydration Retention',
    category: 'Stratum Corneum Plumpness',
    metricKey: 'moisture',
    description: 'Gauges epidermal water-binding capacity, plumpness, and barrier suppleness.',
    detail: 'Monitors trans-epidermal hydration resilience under changing climates, sleep, and rest.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
];

interface RitualProduct {
  step: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  metricTieIn: string;
}

const AM_RITUAL: RitualProduct[] = [
  {
    step: 'Step 01',
    name: 'Gentle Purifying Gel Cleanser',
    category: 'Cleanser',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    description: 'Low-foam amino-acid emulsion that lifts overnight sebum while preserving essential intercellular ceramides.',
    metricTieIn: 'Regulates morning Sebum Balance and prevents follicular congestion flagged by Pore metrics.',
  },
  {
    step: 'Step 02',
    name: 'Antioxidant Defense Serum',
    category: 'Serum',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    description: 'Stabilized Vitamin C (L-Ascorbic) & Ferulic acid fluid that neutralizes free radicals from daylight exposure.',
    metricTieIn: 'Targets Age Spots & Pigmentation by mitigating oxidative UV-induced melanin activation.',
  },
  {
    step: 'Step 03',
    name: 'Physiological Barrier Moisturizer',
    category: 'Moisturizer',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80',
    description: 'Lightweight ceramide-dominant cream that seals hydration into the epidermis without heaviness.',
    metricTieIn: 'Directly reinforces low Moisture scores when stratum corneum water retention is depressed.',
  },
  {
    step: 'Step 04',
    name: 'Broad-Spectrum Mineral Sunscreen SPF 50+',
    category: 'Sunscreen',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80',
    description: 'Photostable non-nano zinc barrier defending against collagen-degrading UVA and erythema-inducing UVB rays.',
    metricTieIn: 'Foundational photoprotection preventing accelerated Wrinkle depth and vascular Redness flares.',
  },
];

const PM_RITUAL: RitualProduct[] = [
  {
    step: 'Step 01',
    name: 'Balm-to-Milk Double Cleanser',
    category: 'Cleanser',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    description: 'Silky lipid balm that melts water-resistant daytime sunscreen, oxidized sebum, and urban micro-particles.',
    metricTieIn: 'Ensures follicular opening clarity, directly improving Pore Refinement and Blemish Clarity.',
  },
  {
    step: 'Step 02',
    name: 'Cellular Turnover & Renewal Serum',
    category: 'Serum',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    description: 'Encapsulated Retinaldehyde or PHA resurfacing complex that stimulates nighttime cellular turnover.',
    metricTieIn: 'Directly smooths tactile Skin Texture micro-roughness and supports dermal collagen matrices.',
  },
  {
    step: 'Step 03',
    name: 'Restorative Night Cream Jar',
    category: 'Night Cream',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80',
    description: 'Rich peptide and squalane nocturnal balm accelerating natural cellular repair while you sleep.',
    metricTieIn: 'Soothes daily Vascular Redness and replenishes overnight lipid bilayers.',
  },
  {
    step: 'Step 04',
    name: 'Occlusive Barrier Recovery Seal',
    category: 'Moisturizer',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80',
    description: 'Multi-molecular lipid seal preventing nocturnal trans-epidermal water loss (TEWL).',
    metricTieIn: 'Ensures sustained Hydration Retention across the 8-hour circadian rest window.',
  },
];

export const ApproachSection: React.FC<ApproachSectionProps> = ({
  onStartScan,
  onExplorePassport,
  passportCount,
}) => {
  const [activeRitualTab, setActiveRitualTab] = useState<'am' | 'pm'>('am');
  const [activeConcern, setActiveConcern] = useState<string>('texture');

  const selectedConcern = SKIN_CONCERNS.find((c) => c.id === activeConcern) || SKIN_CONCERNS[0];

  return (
    <>
      {/* 1. HERO SECTION (PRESERVED IN FULL DESIGN INTEGRITY) */}
      <section className="hero">
        <div>
          <p className="eyebrow">A MORE THOUGHTFUL WAY TO KNOW YOUR SKIN</p>
          <h1>
            Your skin has<br />
            a story. <i>Let’s</i><br />
            <i>keep track.</i>
          </h1>
          <p className="sub">
            Most skincare tools provide a scan, output arbitrary numbers, and leave you wondering what
            they mean. LEKHA is a personal skin passport grounded in verified YouCam AI Skin analysis
            and transparent context over time.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button className="dark" onClick={onStartScan}>
              Start with a scan <ArrowRight size={16} />
            </button>
            <button
              onClick={onExplorePassport}
              className="inline-flex items-center gap-2 border border-[#d9b8b6] px-5 py-3 text-xs tracking-wider uppercase text-[#3a1f2e] hover:bg-[#f3ddda] transition-colors"
            >
              <span>Explore Skin Passport</span>
              {passportCount > 0 && (
                <span className="text-[10px] bg-[#f0ddda] text-[#8e3b5a] px-2 py-0.5 rounded-full font-semibold">
                  {passportCount}
                </span>
              )}
            </button>
          </div>

          <p className="micro">
            <LockKeyhole size={13} /> Your images. Your choice. Your local history.
          </p>
        </div>

        <div className="art">
          <div className="sun"></div>
          <div className="face">
            <div className="hair"></div>
            <div className="skin">
              <span></span>
            </div>
          </div>
          <div className="stamp">
            SKIN
            <br />
            IS
            <br />
            PERSONAL
          </div>
          <small>01 / THE SKIN JOURNAL</small>
        </div>
      </section>

      {/* 2. THE EDITORIAL APPROACH: PHOTOGRAPHY & LIVING CHRONICLE */}
      <section className="bg-[#f5e8e4] py-20 px-[6%] md:px-[8%] border-y border-[#eadbd7]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Large Editorial Portrait Composition */}
          <div className="lg:col-span-5 relative">
            <div className="border border-[#d9b8b6] p-3.5 bg-white shadow-md">
              <div className="aspect-[4/5] overflow-hidden bg-[#e8d5d1] relative">
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80"
                  alt="Adult female portrait with natural, radiant skin"
                  className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-[#3a1f2e]/90 backdrop-blur-sm text-white px-3 py-1 font-mono text-[9px] uppercase tracking-widest">
                  Natural Daylight · Unfiltered
                </div>
              </div>
            </div>

            {/* Overlapping Floating Stamp */}
            <div className="absolute -bottom-6 -right-3 md:-right-6 bg-[#faf1ee] border border-[#c99da0] p-4 shadow-lg max-w-[220px] hidden sm:block">
              <div className="flex items-center gap-2 text-[#8e3b5a] mb-1">
                <ShieldCheck size={16} />
                <span className="font-mono text-[9px] uppercase tracking-wider font-semibold">
                  Skin Truth Check
                </span>
              </div>
              <p className="text-[11px] leading-snug text-[#735e61] m-0">
                Luminance, focus, and camera sharpness verified before analysis.
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative & Visual Progress Process */}
          <div className="lg:col-span-7 space-y-6">
            <p className="eyebrow mb-2">THE LEKHA METHODOLOGY / AUTHENTIC AWARENESS</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#3a1f2e] leading-[1.1]">
              Not another score to chase.
              <br />
              <i className="text-[#a96e78]">A living record you understand.</i>
            </h2>

            <p className="text-[#6d575a] text-sm md:text-base leading-relaxed max-w-xl">
              Skin appearance shifts naturally with circadian sleep, hormonal cycles, humidity, and lighting angle.
              Treating every numerical bump as biological progress is misleading. LEKHA pairs certified YouCam AI diagnostics
              with client-side quality validation to give you a genuine, longitudinal story.
            </p>

            {/* Visual Process Timeline Card */}
            <div className="bg-[#fffaf7] border border-[#eadbd7] p-6 shadow-sm mt-8 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#9a7479] block border-b border-[#f0dedb] pb-2">
                HOW LEKHA DOCUMENTS TRUE SKIN PROGRESS
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5 border-l-2 border-[#8e3b5a] pl-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3a1f2e]">
                    <Camera size={13} className="text-[#8e3b5a]" />
                    <span>01 / Truth Check</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#7e696c]">
                    Pre-flight validation checks lux balance and sharpness so poor lighting never distorts your record.
                  </p>
                </div>

                <div className="space-y-1.5 border-l-2 border-[#c98f94] pl-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3a1f2e]">
                    <Layers size={13} className="text-[#c98f94]" />
                    <span>02 / Certified AI</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#7e696c]">
                    16 isolated YouCam parameters evaluated with clear separation between calibrated UI and continuous engine floats.
                  </p>
                </div>

                <div className="space-y-1.5 border-l-2 border-[#a96e78] pl-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3a1f2e]">
                    <Clock3 size={13} className="text-[#a96e78]" />
                    <span>03 / Delta Ledger</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#7e696c]">
                    Side-by-side comparison accounts for capture drift before declaring a shift in your skin.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button onClick={onStartScan} className="dark">
                <span>Start Your First Entry</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={onExplorePassport}
                className="text-xs font-medium uppercase tracking-wider text-[#8e3b5a] hover:text-[#3a1f2e] underline underline-offset-4"
              >
                Inspect The Passport Architecture →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SKIN CONCERNS / WHAT WE OBSERVE (8 MACRO CARDS) */}
      <section className="py-24 px-[6%] md:px-[8%]">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow">YOUCAM COMPUTER VISION / CORE ATTRIBUTES</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#3a1f2e] leading-tight">
            Every concern, <i>observed in detail.</i>
          </h2>
          <p className="text-sm md:text-base text-[#7e696c] leading-relaxed mt-3">
            LEKHA analyzes 8 primary skin health dimensions through verified Perfect Corp algorithms.
            Explore how each attribute is measured without exaggerated claims or beauty filters.
          </p>
        </div>

        {/* 8 Concern Macro Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKIN_CONCERNS.map((concern) => (
            <div
              key={concern.id}
              onClick={() => setActiveConcern(concern.id)}
              className={`group bg-[#fffaf7] border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                activeConcern === concern.id
                  ? 'border-[#8e3b5a] shadow-md ring-1 ring-[#8e3b5a]/30'
                  : 'border-[#eadbd7] hover:border-[#c98f94] hover:shadow-sm'
              }`}
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden bg-[#f0dedb] relative">
                  <img
                    src={concern.imageUrl}
                    alt={concern.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[#faf1ee]/90 backdrop-blur-xs px-2 py-0.5 border border-[#eadbd7] text-[9px] font-mono uppercase tracking-wider text-[#3a1f2e]">
                    {concern.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-lg text-[#3a1f2e] group-hover:text-[#8e3b5a] transition-colors m-0">
                    {concern.title}
                  </h3>
                  <p className="text-[12px] text-[#786366] leading-relaxed m-0">
                    {concern.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 border-t border-[#f4e8e5] flex items-center justify-between text-[11px] font-mono text-[#9a7479]">
                <span>KEY: {concern.metricKey.toUpperCase()}</span>
                <span className="text-[#8e3b5a] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Inspect <ChevronRight size={11} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Selected Concern Deep-Dive Drawer */}
        <div className="mt-8 bg-[#fdf8f6] border border-[#d9b8b6] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-[#8e3b5a] overflow-hidden shrink-0 shadow-sm">
              <img
                src={selectedConcern.imageUrl}
                alt={selectedConcern.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8e3b5a] block mb-0.5">
                ACTIVE OBSERVATION / {selectedConcern.category}
              </span>
              <h4 className="font-serif text-xl text-[#3a1f2e] m-0">
                {selectedConcern.title}: <i>Scientific Context</i>
              </h4>
              <p className="text-xs text-[#786366] mt-1 max-w-2xl leading-relaxed">
                {selectedConcern.detail} Supported by both normalized consumer scores (0–100) and raw continuous engine floats.
              </p>
            </div>
          </div>

          <button onClick={onStartScan} className="dark whitespace-nowrap py-3 px-5 text-xs shrink-0">
            <span>Scan This Dimension</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* 4. EDITORIAL CAMPAIGN SECTION: LUXURY PLUM / ROSE BEAUTY-TECH */}
      <section className="bg-[#3a1f2e] text-[#faf1ee] py-24 px-[6%] md:px-[8%] relative overflow-hidden border-y border-[#502a3f]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Campaign Editorial Portrait Composition */}
          <div className="lg:col-span-5 relative">
            <div className="border border-[#c98f94]/40 p-3 bg-[#4a273b] shadow-2xl">
              <div className="aspect-[4/5] overflow-hidden bg-[#2d1824] relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80"
                  alt="Editorial beauty portrait featuring natural skin radiance"
                  className="w-full h-full object-cover grayscale-[5%] hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-[#1f0f18]/80 text-[#f5e8e4] px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-[#c98f94]/30">
                  LEKHA CAMPAIGN · VOL. I
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-3 md:-left-6 bg-[#fbf2ef] text-[#3a1f2e] p-4 border border-[#c98f94] shadow-xl max-w-[210px] hidden sm:block">
              <div className="flex items-center gap-1.5 text-[#8e3b5a] mb-1 font-mono text-[10px] uppercase font-bold tracking-wider">
                <Sparkles size={13} />
                <span>Zero Filters</span>
              </div>
              <p className="text-[11px] leading-snug text-[#705c60] m-0">
                True skin health, documented over real cycles.
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative & Brand Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#e8a598] block">
              EDITORIAL CAMPAIGN · FORMULATED FOR TRUTH
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#fff8f5] leading-[1.1]">
              Formulated for reality.
              <br />
              <i className="text-[#e8a598]">Documented with precision.</i>
            </h2>

            <p className="text-[#e2cdc9] text-sm md:text-base leading-relaxed max-w-xl">
              Most beauty products promise overnight transformation. True dermatology and skin biology know that
              the epidermal turnover cycle takes 28 to 45 days. LEKHA was created to give you the honest tools,
              scientific computer vision, and chronological confidence to know what is actually changing.
            </p>

            {/* 3 Core Brand Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#5e354c]">
              <div className="space-y-1">
                <b className="font-serif text-lg text-[#fff8f5] block">Objective Vision</b>
                <p className="text-xs text-[#cfb7b3] leading-relaxed m-0">
                  Powered by Perfect Corp's certified YouCam neural networks.
                </p>
              </div>

              <div className="space-y-1">
                <b className="font-serif text-lg text-[#fff8f5] block">Dual Scores</b>
                <p className="text-xs text-[#cfb7b3] leading-relaxed m-0">
                  Calibrated 0–100 consumer scales alongside continuous raw floats.
                </p>
              </div>

              <div className="space-y-1">
                <b className="font-serif text-lg text-[#fff8f5] block">Private Vault</b>
                <p className="text-xs text-[#cfb7b3] leading-relaxed m-0">
                  Images analyzed in memory. Records stored locally in your browser.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartScan}
                className="inline-flex items-center justify-center gap-2 bg-[#f5e8e4] text-[#3a1f2e] px-6 py-3.5 text-xs tracking-wider uppercase font-medium hover:bg-white transition-all shadow-sm"
              >
                <span>Experience Genuine Skin AI</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={onExplorePassport}
                className="text-xs font-mono tracking-wider uppercase text-[#e8a598] hover:text-white underline underline-offset-4"
              >
                View Skin Passport Demo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SKINCARE RITUALS (AM / PM INTERACTIVE PRODUCT EDIT) */}
      <section className="py-24 px-[6%] md:px-[8%] bg-[#faf1ee]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="eyebrow">RATIONAL BEAUTY / METRIC-DERIVED RITUALS</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#3a1f2e] leading-tight">
              Skincare rituals, <i>informed by data.</i>
            </h2>
            <p className="text-sm md:text-base text-[#7e696c] leading-relaxed mt-3">
              How daily formulations correlate to observed YouCam diagnostic parameters.
              Guidance is based on authentic skin measurements without simulated doctor endorsements or branded claims.
            </p>
          </div>

          {/* AM / PM Interactive Pill Switcher */}
          <div className="inline-flex p-1 bg-[#eddcd8] border border-[#d9b8b6] self-start md:self-end">
            <button
              onClick={() => setActiveRitualTab('am')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeRitualTab === 'am'
                  ? 'bg-[#3a1f2e] text-white shadow-sm'
                  : 'text-[#6e5357] hover:text-[#3a1f2e]'
              }`}
            >
              <Sun size={13} className={activeRitualTab === 'am' ? 'text-[#e8a598]' : ''} />
              <span>AM Ritual (Cleanse · Serum · Cream · SPF)</span>
            </button>
            <button
              onClick={() => setActiveRitualTab('pm')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeRitualTab === 'pm'
                  ? 'bg-[#3a1f2e] text-white shadow-sm'
                  : 'text-[#6e5357] hover:text-[#3a1f2e]'
              }`}
            >
              <Moon size={13} className={activeRitualTab === 'pm' ? 'text-[#c98f94]' : ''} />
              <span>PM Ritual (Cleanse · Serum · Night Cream · Barrier)</span>
            </button>
          </div>
        </div>

        {/* Product Imagery & Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeRitualTab === 'am' ? AM_RITUAL : PM_RITUAL).map((prod) => (
            <div
              key={prod.name}
              className="bg-[#fffaf7] border border-[#eadbd7] hover:border-[#c98f94] transition-all p-5 flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="aspect-[4/5] bg-[#f1e4e0] overflow-hidden mb-5 relative border border-[#f0dedb]">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#3a1f2e] text-white font-mono text-[10px] px-2 py-0.5 tracking-wider">
                    {prod.step}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#3a1f2e] font-mono text-[9px] uppercase px-2 py-0.5 border border-[#eadbd7] font-semibold">
                    {prod.category}
                  </div>
                </div>

                <h3 className="font-serif text-lg text-[#3a1f2e] mb-2 leading-snug">
                  {prod.name}
                </h3>
                <p className="text-[12px] text-[#735e61] leading-relaxed mb-4">
                  {prod.description}
                </p>
              </div>

              <div className="border-t border-[#f2e2de] pt-3 mt-2">
                <span className="text-[9px] font-mono text-[#8e3b5a] uppercase tracking-wider block mb-1 font-semibold">
                  DIAGNOSTIC CORRELATION
                </span>
                <p className="text-[11px] text-[#856f72] leading-snug m-0 italic">
                  {prod.metricTieIn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Disclaimer Notice */}
        <div className="mt-8 p-4 bg-[#f4e8e5] border-l-2 border-[#8e3b5a] text-[#7a6467] text-xs leading-relaxed flex items-start gap-3">
          <ShieldCheck size={16} className="text-[#8e3b5a] shrink-0 mt-0.5" />
          <p className="m-0">
            <strong>Editorial Transparency:</strong> Skincare routine guidance in LEKHA links purely to supported cosmetic parameters
            (hydration balance, surface sebum, vascular sensitivity). We never diagnose, prescribe dermatological pharmaceuticals,
            or simulate branded endorsements. Always perform patch tests before introducing new formulations.
          </p>
        </div>
      </section>

      {/* 6. A SIMPLE PRACTICE (THREE REFINED STEPS) */}
      <section className="steps border-t border-[#eadbd7] bg-white">
        <p className="eyebrow">A CLEAR PRACTICE</p>
        <h2>
          Three steps. <i>Complete clarity.</i>
        </h2>
        <div className="steps-grid">
          <article className="group hover:bg-[#fffaf7] transition-colors rounded-none p-6 border-b sm:border-b-0">
            <div className="w-12 h-12 bg-[#f4e8e5] rounded-full flex items-center justify-center text-[#8e3b5a] mb-5 group-hover:scale-110 transition-transform">
              <ScanFace size={24} />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-[#9a7479] uppercase block mb-1">
              STAGE 01
            </span>
            <b className="block text-xl text-[#3a1f2e] mb-2">Capture thoughtfully</b>
            <p className="text-xs text-[#7e696c] leading-relaxed">
              Pre-flight Skin Truth Check screens your photograph for ideal exposure, sharp focus, and optimal resolution before sending,
              preventing distorted diagnostic readings.
            </p>
          </article>

          <article className="group hover:bg-[#fffaf7] transition-colors rounded-none p-6 border-b sm:border-b-0">
            <div className="w-12 h-12 bg-[#f4e8e5] rounded-full flex items-center justify-center text-[#8e3b5a] mb-5 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-[#9a7479] uppercase block mb-1">
              STAGE 02
            </span>
            <b className="block text-xl text-[#3a1f2e] mb-2">Understand the details</b>
            <p className="text-xs text-[#7e696c] leading-relaxed">
              16 certified YouCam Skin AI dimensions interpreted into objective insights, displaying calibrated UI scales alongside
              continuous engine floats and diagnostic overlays.
            </p>
          </article>

          <article className="group hover:bg-[#fffaf7] transition-colors rounded-none p-6">
            <div className="w-12 h-12 bg-[#f4e8e5] rounded-full flex items-center justify-center text-[#8e3b5a] mb-5 group-hover:scale-110 transition-transform">
              <Clock3 size={24} />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-[#9a7479] uppercase block mb-1">
              STAGE 03
            </span>
            <b className="block text-xl text-[#3a1f2e] mb-2">Keep your own record</b>
            <p className="text-xs text-[#7e696c] leading-relaxed">
              Chronicle entries in your browser-local Skin Passport. Contrast two dated captures with Comparison Confidence to discern
              genuine barrier changes from lighting drift.
            </p>
          </article>
        </div>
      </section>

      {/* 7. TRUST & CALL TO ACTION */}
      <section className="trust shadow-sm border border-[#d9b8b6]">
        <ShieldCheck size={28} className="text-[#8e3b5a] shrink-0" />
        <div>
          <b className="text-lg text-[#3a1f2e]">Honesty is woven into the design.</b>
          <p className="text-xs text-[#735e61] mt-1 max-w-xl">
            Zero cloud biometric storage. No fabricated claims. Pure client-side privacy combined with authentic Perfect Corp computer vision.
          </p>
        </div>
        <button onClick={onStartScan} className="dark py-3 px-5 text-xs whitespace-nowrap ml-auto">
          <span>Start Your Entry</span>
          <ArrowRight size={13} />
        </button>
      </section>
    </>
  );
};
