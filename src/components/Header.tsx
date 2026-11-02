import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Shield, GitCompare, User } from 'lucide-react';

interface HeaderProps {
  currentPage: 'home' | 'scan' | 'passport' | 'compare';
  onNavigate: (page: 'home' | 'scan' | 'passport' | 'compare') => void;
  passportCount: number;
  onOpenPrivacy: () => void;
  onOpenProfile: () => void;
  hasProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  passportCount,
  onOpenPrivacy,
  onOpenProfile,
  hasProfile,
}) => {
  return (
    <header className="h-20 px-[6%] flex items-center justify-between border-b border-[#eadbd7] bg-[#faf1ee]/90 sticky top-0 z-40 backdrop-blur-md">
      <button
        onClick={() => onNavigate('home')}
        className="font-serif text-[28px] font-semibold tracking-[-0.04em] text-[#3a1f2e] bg-transparent border-0 flex items-center gap-1 group"
        aria-label="LEKHA Home"
      >
        <span>LEKHA</span>
        <span className="text-[#c98f94] group-hover:text-[#8e3b5a] transition-colors">.</span>
      </button>

      <nav className="flex items-center gap-5 sm:gap-7 text-xs font-medium text-[#806b70]">
        <button
          onClick={() => onNavigate('home')}
          className={`transition-colors py-2 ${
            currentPage === 'home'
              ? 'text-[#3a1f2e] font-semibold border-b border-[#3a1f2e]'
              : 'hover:text-[#3a1f2e]'
          }`}
        >
          The Approach
        </button>

        <button
          onClick={() => onNavigate('scan')}
          className={`transition-colors py-2 flex items-center gap-1.5 ${
            currentPage === 'scan'
              ? 'text-[#3a1f2e] font-semibold border-b border-[#3a1f2e]'
              : 'hover:text-[#3a1f2e]'
          }`}
        >
          <Sparkles size={13} className="text-[#c98f94]" />
          <span>New Scan</span>
        </button>

        <button
          onClick={() => onNavigate('passport')}
          className={`transition-colors py-2 flex items-center gap-1.5 ${
            currentPage === 'passport'
              ? 'text-[#3a1f2e] font-semibold border-b border-[#3a1f2e]'
              : 'hover:text-[#3a1f2e]'
          }`}
        >
          <BookOpen size={13} />
          <span>Skin Passport</span>
          <span className="ml-1 text-[10px] bg-[#f0ddda] text-[#8e3b5a] px-2 py-0.5 rounded-full font-semibold">
            {passportCount}
          </span>
        </button>

        {passportCount >= 2 && (
          <button
            onClick={() => onNavigate('compare')}
            className={`transition-colors py-2 flex items-center gap-1.5 ${
              currentPage === 'compare'
                ? 'text-[#3a1f2e] font-semibold border-b border-[#3a1f2e]'
                : 'hover:text-[#3a1f2e]'
            }`}
          >
            <GitCompare size={13} />
            <span>Compare</span>
          </button>
        )}

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 text-[#806b70] hover:text-[#3a1f2e] transition-colors py-2"
          title="Personal Skin Profile"
        >
          <User size={13} className={hasProfile ? 'text-[#8e3b5a]' : 'text-[#806b70]'} />
          <span>Profile</span>
          {hasProfile && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#8e3b5a]" />
          )}
        </button>

        <button
          onClick={onOpenPrivacy}
          className="hidden md:flex items-center gap-1 text-[#9a7479] hover:text-[#3a1f2e] transition-colors py-2"
          title="Privacy & Data Control"
        >
          <Shield size={13} />
          <span>Privacy</span>
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('scan')}
          className="dark inline-flex items-center justify-center gap-2 bg-[#3a1f2e] text-[#fff8f5] px-5 py-3 text-xs tracking-wider uppercase font-medium hover:bg-[#8e3b5a] transition-all shadow-sm rounded-none"
        >
          <span>Begin Scan</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </header>
  );
};
