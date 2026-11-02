import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onNavigate: (page: 'home' | 'scan' | 'passport' | 'compare') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onNavigate }) => {
  return (
    <footer className="border-t border-[#eadbd7] bg-[#FAF1EE] py-10 px-[6%] text-xs text-[#806b70] space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => onNavigate('home')}
            className="font-serif text-2xl font-semibold tracking-tight text-[#3a1f2e] bg-transparent border-0 flex items-center gap-1 group text-left"
          >
            <span>LEKHA</span>
            <span className="text-[#c98f94]">.</span>
          </button>
          <p className="text-[10px] tracking-widest uppercase font-semibold text-[#9a7479] mt-1">
            Skin Intelligence &amp; Personal Care
          </p>
          <p className="text-xs text-[#806b70] mt-2 italic font-serif">
            "Your skin, documented. Your progress, understood."
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#786165]">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#3a1f2e] transition-colors"
          >
            Philosophy
          </button>
          <button
            onClick={() => onNavigate('scan')}
            className="hover:text-[#3a1f2e] transition-colors"
          >
            Skin Scan
          </button>
          <button
            onClick={() => onNavigate('passport')}
            className="hover:text-[#3a1f2e] transition-colors"
          >
            Skin Passport
          </button>
          <button
            onClick={() => onNavigate('compare')}
            className="hover:text-[#3a1f2e] transition-colors"
          >
            Skin Lab
          </button>
          <button
            onClick={onOpenPrivacy}
            className="hover:text-[#3a1f2e] transition-colors flex items-center gap-1 text-[#8e3b5a]"
          >
            <ShieldCheck size={13} />
            <span>Privacy &amp; Data Control</span>
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-[#f0ddda] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9c8587]">
        <p>
          Built for the <b>Perfect Corp YouCam API Skin AI &amp; eCommerce VTO Hackathon</b>. Released under the MIT License.
        </p>
        <p className="flex items-center gap-1">
          <span>Crafted with care &amp; honesty · 2026</span>
        </p>
      </div>
    </footer>
  );
};
