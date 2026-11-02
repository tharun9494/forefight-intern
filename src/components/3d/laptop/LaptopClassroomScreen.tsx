import React from 'react';
import {
  Code2,
  CheckCircle2,
  Sparkles,
  Terminal,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export type MonthKey = 'month1' | 'month2' | 'month3';

export interface LaptopClassroomScreenProps {
  activeMonth: MonthKey;
  onSelectMonth: (month: MonthKey) => void;
  screenPower?: number; // 0 (off) to 1 (full brightness)
  isInteractive?: boolean;
}

interface ModuleItem {
  title: string;
  desc: string;
  completed: boolean;
}

interface MonthConfig {
  id: MonthKey;
  number: string;
  tabTitle: string;
  phaseTitle: string;
  phaseDesc: string;
  progressPercent: number;
  statusBadge: string;
  modules: ModuleItem[];
  assignment: {
    title: string;
    description: string;
    status: string;
    isDone: boolean;
  };
  projectMilestone: {
    title: string;
    description: string;
    status: string;
  };
  techTags: string[];
}

const MONTH_DATA: Record<MonthKey, MonthConfig> = {
  month1: {
    id: 'month1',
    number: '01',
    tabTitle: 'Month 01 — Foundation',
    phaseTitle: 'Phase 01: Core Architecture & Toolchains',
    phaseDesc: 'Master modern engineering fundamentals, type safety, and development environments.',
    progressPercent: 100,
    statusBadge: '100% Completed',
    modules: [
      {
        title: 'Modern TypeScript & Algorithmic Design',
        desc: 'Strict type systems, reactive component lifecycles, and asynchronous logic.',
        completed: true,
      },
      {
        title: 'Production Build Toolchains & Node.js',
        desc: 'Vite bundler optimization, Tailwind styling architecture, and environment configuration.',
        completed: true,
      },
      {
        title: 'Git Version Control & Code Reviews',
        desc: 'Branching strategies, semantic commits, PR reviews, and automated CI workflows.',
        completed: true,
      },
    ],
    assignment: {
      title: 'Responsive Component UI System',
      description: 'Build a modular, accessible design system with zero layout shifts and strict type checks.',
      status: 'Verified & Merged • Grade A+',
      isDone: true,
    },
    projectMilestone: {
      title: 'Foundation Audit & Toolchain Defense',
      description: 'Validated by mentor panel. Ready for full-stack API integration.',
      status: 'Verified Milestone',
    },
    techTags: ['TypeScript', 'Node.js', 'Vite', 'Git', 'Tailwind'],
  },
  month2: {
    id: 'month2',
    number: '02',
    tabTitle: 'Month 02 — Development',
    phaseTitle: 'Phase 02: Full-Stack APIs & Cloud Systems',
    phaseDesc: 'Connect interactive frontend interfaces with cloud databases and secure microservices.',
    progressPercent: 65,
    statusBadge: '65% Active Sprint',
    modules: [
      {
        title: 'Express Backend & RESTful API Routing',
        desc: 'Modular endpoint architecture, input validation middleware, and global error handling.',
        completed: true,
      },
      {
        title: 'Cloud Firestore Database & Indexing',
        desc: 'Document schema modeling, real-time data synchronization, and query optimization.',
        completed: true,
      },
      {
        title: 'Security, JWT Tokens & Role-Based Access',
        desc: 'Protected route guards, token refreshing, and environment secret isolation.',
        completed: false,
      },
    ],
    assignment: {
      title: 'Real-Time Data Pipeline & Auth Service',
      description: 'Architect a secure authentication flow with persistent cloud storage and live data streams.',
      status: 'Sprint In Progress • 3/4 Done',
      isDone: false,
    },
    projectMilestone: {
      title: 'Full-Stack API Integration Review',
      description: 'Mid-term code defense scheduled with technical mentor lead.',
      status: 'Active Milestone',
    },
    techTags: ['React 18', 'REST APIs', 'Cloud Firestore', 'Express', 'Postman'],
  },
  month3: {
    id: 'month3',
    number: '03',
    tabTitle: 'Month 03 — Project Delivery',
    phaseTitle: 'Phase 03: Production Capstone & Certification',
    phaseDesc: 'Deploy a hardened, scalable enterprise solution and complete the final technical defense.',
    progressPercent: 20,
    statusBadge: 'Final Capstone Stage',
    modules: [
      {
        title: 'End-to-End Enterprise Capstone Solution',
        desc: 'Comprehensive production-ready web application addressing real-world industry requirements.',
        completed: false,
      },
      {
        title: 'Automated Testing, QA & Web Vitals Audit',
        desc: 'Unit test suites, error boundary hardening, and sub-second performance optimization.',
        completed: false,
      },
      {
        title: 'Cloud Deployment, CI/CD & Certification Defense',
        desc: 'Production hosting with SSL/TLS, architecture docs, and official credential issuance.',
        completed: false,
      },
    ],
    assignment: {
      title: 'Industry Capstone Platform & Documentation',
      description: 'Deploy full production build with continuous integration, performance benchmarks, and user manual.',
      status: 'Requirements Locked • Ready for Defense',
      isDone: false,
    },
    projectMilestone: {
      title: 'Capstone Defense & Verifiable Certificate',
      description: 'Final evaluation by engineering directors and verified credential issuance.',
      status: 'Upcoming Milestone',
    },
    techTags: ['Production CI/CD', 'Cloud Hosting', 'Testing/QA', 'Certification'],
  },
};

export default function LaptopClassroomScreen({
  activeMonth,
  onSelectMonth,
  screenPower = 1,
  isInteractive = true,
}: LaptopClassroomScreenProps) {
  const current = MONTH_DATA[activeMonth];

  // Screen powered off (during initial closed phase)
  if (screenPower < 0.05) {
    return (
      <div className="w-full h-full bg-[#05070c] flex items-center justify-center p-6 select-none">
        <div className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <div
      style={{
        opacity: screenPower,
        transition: 'opacity 0.25s ease-out',
      }}
      className="w-full h-full bg-[#0a0e17] text-gray-100 flex flex-col font-sans select-none overflow-hidden"
    >
      {/* ====================================================
          1. SCREEN HEADER (Clean, Prominent Branding)
          ==================================================== */}
      <header className="h-14 bg-[#070b13] border-b border-white/[0.08] px-5 flex items-center justify-between shrink-0">
        {/* Left: Brand & Classroom Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center font-black text-black text-sm shadow-md shadow-orange-500/20">
            F
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black tracking-tight text-white">
                ForeFight Era Classroom
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Cohort
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              3-Month Technology Internship Track
            </p>
          </div>
        </div>

        {/* Right: Current Month & Overall Progress */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-bold text-amber-300 font-mono">
              Month {current.number} • {current.statusBadge}
            </span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${current.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================
          2. MONTH NAVIGATION TABS (Spacious, Clear Amber Accent)
          ==================================================== */}
      <nav className="bg-[#0b101c] border-b border-white/[0.08] px-4 py-2.5 flex items-center shrink-0">
        <div className="grid grid-cols-3 gap-3 w-full">
          {(['month1', 'month2', 'month3'] as MonthKey[]).map((key) => {
            const data = MONTH_DATA[key];
            const isSelected = activeMonth === key;
            return (
              <button
                key={key}
                type="button"
                disabled={!isInteractive}
                onClick={() => onSelectMonth(key)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/15 border-amber-400/50 text-white shadow-md shadow-amber-500/15 ring-1 ring-amber-400/30'
                    : 'bg-[#060a12]/70 hover:bg-[#0e1524] border-white/5 text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-amber-400 text-black'
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    M{data.number}
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {data.tabTitle}
                  </span>
                </div>

                <div className="text-xs font-mono font-bold">
                  {key === 'month1' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {key === 'month2' && <span className="text-amber-400">65%</span>}
                  {key === 'month3' && <span className="text-gray-400">Final</span>}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ====================================================
          3. MAIN CONTENT: CLEAN 2-COLUMN LAYOUT (HIGH READABILITY)
          ==================================================== */}
      <main className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden bg-gradient-to-b from-[#0a0e17] to-[#070b13]">
        {/* LEFT COLUMN: 3 Key Learning Modules (7 cols) */}
        <section className="col-span-7 flex flex-col justify-between bg-[#0e1422] rounded-2xl border border-white/[0.08] p-4 shadow-lg">
          <div>
            {/* Phase Title */}
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-sm font-black text-amber-400 tracking-tight">
                {current.phaseTitle}
              </h3>
              <span className="text-xs font-bold text-gray-300 font-mono">
                {current.modules.filter((m) => m.completed).length} of 3 Completed
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              {current.phaseDesc}
            </p>

            {/* 3 Prominent Learning Modules */}
            <div className="space-y-2">
              {current.modules.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-2.5 rounded-xl bg-[#080d18] border border-white/[0.05] hover:border-white/15 transition-colors"
                >
                  <div className="pt-0.5 shrink-0">
                    {m.completed ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-amber-400/50 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-tight">
                      {m.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-1">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Tech Stack Pills */}
          <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-gray-400">Core Stack:</span>
            <div className="flex items-center space-x-1.5">
              {current.techTags.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-200 font-mono text-[11px] font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Practical Assignment & Milestone (5 cols) */}
        <section className="col-span-5 flex flex-col justify-between space-y-3">
          {/* Practical Assignment Card */}
          <div className="flex-1 bg-[#0e1422] rounded-2xl border border-white/[0.08] p-3.5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5 mb-2">
                <span className="text-xs font-bold uppercase text-amber-400 flex items-center font-mono">
                  <Terminal className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  Practical Assignment
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/25">
                  Sprint Task
                </span>
              </div>

              <h4 className="text-xs font-black text-white leading-snug">
                {current.assignment.title}
              </h4>
              <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                {current.assignment.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 font-medium">Evaluation:</span>
              <span className={`font-bold ${current.assignment.isDone ? 'text-emerald-400' : 'text-amber-300'}`}>
                {current.assignment.status}
              </span>
            </div>
          </div>

          {/* Project Milestone Card */}
          <div className="bg-[#0e1422] rounded-2xl border border-white/[0.08] p-3.5 space-y-2 shadow-lg">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
              <span className="text-xs font-bold text-gray-300 flex items-center font-mono">
                <Award className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Project Milestone
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {current.projectMilestone.status}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-white leading-tight">
                {current.projectMilestone.title}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                {current.projectMilestone.description}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
