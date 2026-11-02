import React from 'react';
import { ArrowRight, ScanFace, Sparkles, Clock3, ShieldCheck, LockKeyhole } from 'lucide-react';

interface ApproachSectionProps {
  onStartScan: () => void;
  onExplorePassport: () => void;
  passportCount: number;
}

export const ApproachSection: React.FC<ApproachSectionProps> = ({
  onStartScan,
  onExplorePassport,
  passportCount,
}) => {
  return (
    <>
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
            {passportCount > 0 && (
              <button
                onClick={onExplorePassport}
                className="inline-flex items-center gap-2 border border-[#d9b8b6] px-5 py-3 text-xs tracking-wider uppercase text-[#3a1f2e] hover:bg-[#f3ddda] transition-colors"
              >
                <span>Open Passport ({passportCount})</span>
              </button>
            )}
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

      <section className="manifesto">
        <p className="eyebrow">OUR POINT OF VIEW</p>
        <h2>
          Not another score to chase.
          <br />
          <i>A record you can understand.</i>
        </h2>
        <p>
          Skin appearance shifts with hydration, hormones, climate, sleep, and camera lighting.
          LEKHA documents your skin with honesty: distinguishing consumer UI calibrations from
          scientific engine scores, evaluating image consistency, and giving you an authentic timeline.
        </p>
      </section>

      <section className="steps">
        <p className="eyebrow">A SIMPLE PRACTICE</p>
        <h2>
          Three steps. <i>More clarity.</i>
        </h2>
        <div className="grid">
          <article>
            <ScanFace />
            <b>01 / Capture thoughtfully</b>
            <p>
              Pre-flight Skin Truth Check monitors exposure, focus, and camera resolution before you
              submit, ensuring reliable diagnostic data.
            </p>
          </article>
          <article>
            <Sparkles />
            <b>02 / Understand the details</b>
            <p>
              16 certified YouCam Skin AI dimensions explained in human language, with complete
              distinction between UI scores and raw engine values.
            </p>
          </article>
          <article>
            <Clock3 />
            <b>03 / Keep your own record</b>
            <p>
              Save dated scans to your private browser Passport. Compare historical scans with
              Comparison Confidence to know if changes are real or lighting artifacts.
            </p>
          </article>
        </div>
      </section>

      <section className="trust">
        <ShieldCheck />
        <div>
          <b>Honesty is part of the design.</b>
          <p>
            No fabricated scores. No unrealistic filters. No permanent cloud storage of your face
            images. Designed strictly for personal awareness, not medical diagnosis.
          </p>
        </div>
        <button onClick={onExplorePassport} className="flex items-center gap-1">
          <span>Explore Skin Passport</span>
          <ArrowRight size={13} />
        </button>
      </section>
    </>
  );
};
