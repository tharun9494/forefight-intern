import { useState, useEffect } from 'react';
import InternshipLaptopScene from './InternshipLaptopScene';
import LaptopClassroomScreen, { MonthKey } from './LaptopClassroomScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Sparkles, Layers, ShieldCheck, Award } from 'lucide-react';

export default function InternshipLaptopExperience() {
  const [activeMonth, setActiveMonth] = useState<MonthKey>('month1');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Under 640px, provide a dedicated high-fidelity mobile-optimized viewport
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full relative flex flex-col items-center">
      {/* Visual Accent Glow (Architectural Amber Ambient) */}
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-amber-500/[0.07] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-600/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {isMobile ? (
        /* ====================================================
           MOBILE-OPTIMIZED HIGH-DPI CLASSROOM DEVICE FRAME
           Ensures zero text clipping and 100% interactive clarity
           ==================================================== */
        <div className="w-full max-w-md mx-auto relative">
          {/* Beveled Device Frame simulating modern unibody display */}
          <div className="relative rounded-3xl bg-[#090d16] p-2.5 sm:p-3 border border-white/[0.12] shadow-2xl shadow-black/80 overflow-hidden">
            {/* Top Amber Trim */}
            <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 mb-2 rounded-full" />

            {/* Device Header Bar */}
            <div className="flex items-center justify-between px-2 pb-2 text-[10px] font-mono text-gray-400">
              <span className="flex items-center text-amber-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 mr-1" />
                Virtual Classroom
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Live Cohort
              </span>
            </div>

            {/* Screen Content */}
            <div className="w-full h-[460px] rounded-2xl overflow-hidden border border-white/10 shadow-inner">
              <LaptopClassroomScreen
                activeMonth={activeMonth}
                onSelectMonth={setActiveMonth}
                screenPower={1}
                isInteractive={true}
              />
            </div>
          </div>

          {/* Quick Tabs Pill */}
          <div className="mt-3 flex items-center justify-center space-x-2">
            {(['month1', 'month2', 'month3'] as MonthKey[]).map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveMonth(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeMonth === key
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-[#0c121e] border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                Month 0{i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ====================================================
           DESKTOP & TABLET: FULL 3D INTERACTIVE LAPTOP SCENE
           Blender-Grade PBR Aluminum Unibody + Hinge + CSS3D LMS
           ==================================================== */
        <div className="w-full relative">
          <InternshipLaptopScene
            activeMonth={activeMonth}
            onSelectMonth={setActiveMonth}
          />
        </div>
      )}
    </div>
  );
}
