import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Globe,
  Award,
  Briefcase,
  Code2,
  Database,
  Clock,
  IndianRupee,
  MapPin,
  FileCheck,
  ShieldCheck,
  Check,
  Compass,
  Boxes
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import InternshipApplicationModal from '@/components/InternshipApplicationModal';
import HeroSculptureEngine from '@/components/3d/HeroSculptureEngine';

export default function Home() {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<
    'Web Development Internship' | 'Data Science Internship'
  >('Web Development Internship');

  const handleApplyClick = (domain: 'Web Development Internship' | 'Data Science Internship') => {
    setSelectedDomain(domain);
    setIsApplicationModalOpen(true);
  };

  return (
    <div className="space-y-16 lg:space-y-24 overflow-x-hidden bg-[#070a11] text-gray-100">
      {/* 1. HERO SECTION: Professional Studio 3D Art Experience */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-gradient-to-b from-[#060910] via-[#0a0f1b] to-[#070a11] overflow-hidden pt-6 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        {/* Architectural Studio Backdrop Lighting - Restrained and Cinematic */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-amber-500/[0.04] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[350px] bg-sky-900/[0.06] rounded-full blur-[130px]" />
        </div>

        {/* Main Content Container: 2-column layout on desktop */}
        <div className="relative max-w-7xl w-full mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Art-Directed Editorial Typography & Action Hub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 text-center lg:text-left space-y-7"
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#0d1422] border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider">
                ForeFight Era Pvt. Ltd. • Official Internship Program
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Transform Your Career with{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Practical Learning
              </span>{' '}
              & Industry Internships
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Work on live production assignments, learn modern software stacks, and earn verifiable internship certificates with real industry mentorship in Web Development and Data Science.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <Link to="/internship" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 border border-amber-300/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Explore Internships
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <a href="#internships" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/10 hover:border-amber-400/50 bg-[#0d1320]/80 text-gray-200 hover:text-white hover:bg-gray-800/80 font-semibold px-7 py-3.5 rounded-xl backdrop-blur-md transition-all active:scale-[0.99]"
                >
                  View Open Roles
                </Button>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-400 font-mono">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">3 Months Intensive</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">₹5,000 / Month Stipend</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">Online / Offline / Hybrid</span>
              </div>
            </div>

            {/* 3D Artwork Technical Specs Plaque */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-center lg:justify-start space-x-4 text-[11px] text-gray-400">
              <div className="flex items-center space-x-2">
                <Boxes className="w-4 h-4 text-amber-400" />
                <span>Original Procedural 3D Art</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-gray-400" />
                <span>Interactive Studio Orbit</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Original 3D Sculpture WebGL Viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-6 relative w-full"
          >
            <HeroSculptureEngine />
          </motion.div>
        </div>
      </section>

      {/* 2. DEDICATED HOMEPAGE INTERNSHIP SECTION (Refined Physical Surface Cards) */}
      <section id="internships" className="relative py-14 sm:py-20 bg-[#070b13] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Internship Opportunities</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Internship Opportunities at ForeFight Era
            </h2>

            <p className="text-base sm:text-lg text-amber-300/90 font-medium mb-3">
              “Build practical skills, work on industry-oriented projects, and gain hands-on experience in technology and digital innovation.”
            </p>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
              ForeFight Era Pvt. Ltd. offers project-oriented internship opportunities designed to help students apply their academic knowledge to practical assignments and real-world technology projects.
            </p>
          </motion.div>

          {/* Key Parameters Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
            <div className="bg-[#0c121e]/80 rounded-2xl p-4 border border-white/[0.08] shadow-lg flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider">Duration</p>
                <p className="text-sm font-bold text-white">3 Months</p>
              </div>
            </div>

            <div className="bg-[#0c121e]/80 rounded-2xl p-4 border border-white/[0.08] shadow-lg flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider">Stipend</p>
                <p className="text-sm font-bold text-emerald-400">₹5,000 / month</p>
              </div>
            </div>

            <div className="bg-[#0c121e]/80 rounded-2xl p-4 border border-white/[0.08] shadow-lg flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider">Mode</p>
                <p className="text-sm font-bold text-white">Online / Offline / Hybrid</p>
              </div>
            </div>

            <div className="bg-[#0c121e]/80 rounded-2xl p-4 border border-white/[0.08] shadow-lg flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider">Certification</p>
                <p className="text-sm font-bold text-white">Project Certified</p>
              </div>
            </div>
          </div>

          {/* Two Prominent Internship Cards with Refined Physical Surfaces */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Card 1: Web Development Internship */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[#0c121e] rounded-3xl border border-white/[0.08] hover:border-amber-400/40 shadow-2xl overflow-hidden flex flex-col justify-between transition-colors duration-300 relative group"
            >
              {/* Subtle top rim highlight */}
              <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

              <div>
                {/* Header banner */}
                <div className="p-6 sm:p-7 border-b border-white/[0.06] bg-[#0f1726]/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                      Software Domain
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                      <Code2 className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Web Development Internship</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Front-End, Back-End & Full-Stack Application Engineering
                  </p>
                </div>

                <div className="p-6 sm:p-7 space-y-6">
                  {/* Brief description */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2">
                      Brief Description
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Interns collaborate on real web application modules, develop scalable user interfaces, implement REST APIs, manage database states, and participate in modern code reviews and Git version control workflows.
                    </p>
                  </div>

                  {/* Skills or technologies involved */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2.5">
                      Skills & Technologies Involved
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'React.js',
                        'TypeScript',
                        'Node.js',
                        'REST APIs',
                        'Tailwind CSS',
                        'HTML5 / CSS3',
                        'Git / GitHub',
                        'Firebase / SQL'
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-[#111927] text-gray-200 font-medium px-2.5 py-1 rounded-lg border border-white/[0.08]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Eligibility criteria */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2">
                      Eligibility Criteria
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1.5 list-disc list-inside">
                      <li>B.Tech / B.E / BCA / MCA / B.Sc (Computer Science / IT / Related Branches) students or recent graduates.</li>
                      <li>Basic understanding of web technologies and programming fundamentals.</li>
                    </ul>
                  </div>

                  {/* Meta strip */}
                  <div className="grid grid-cols-3 gap-2 bg-[#090e17] p-3.5 rounded-2xl border border-white/[0.06] text-center">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-gray-400">Duration</p>
                      <p className="text-sm font-bold text-white mt-0.5">3 Months</p>
                    </div>
                    <div className="border-x border-white/[0.08]">
                      <p className="text-[10px] font-mono uppercase text-gray-400">Stipend</p>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">₹5,000 / mo</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase text-gray-400">Mode</p>
                      <p className="text-sm font-bold text-white mt-0.5">Online / Hybrid</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 sm:p-7 pt-0 space-y-3">
                <Button
                  onClick={() => handleApplyClick('Web Development Internship')}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 text-sm transition-all duration-200 active:scale-[0.99]"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Link
                  to="/internship"
                  className="block text-center text-xs text-amber-400 hover:text-amber-300 font-semibold py-1 transition-colors"
                >
                  View Full Syllabus & Program Details →
                </Link>
              </div>
            </motion.div>

            {/* Card 2: Data Science Internship */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[#0c121e] rounded-3xl border border-white/[0.08] hover:border-amber-400/40 shadow-2xl overflow-hidden flex flex-col justify-between transition-colors duration-300 relative group"
            >
              {/* Subtle top rim highlight */}
              <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

              <div>
                {/* Header banner */}
                <div className="p-6 sm:p-7 border-b border-white/[0.06] bg-[#0f1726]/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                      Analytics Domain
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Data Science Internship</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Data Analytics, Machine Learning & Predictive Modeling
                  </p>
                </div>

                <div className="p-6 sm:p-7 space-y-6">
                  {/* Brief description */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2">
                      Brief Description
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Interns clean and explore real-world datasets, build predictive algorithms, develop interactive visualization dashboards, and translate raw data into actionable decision-making insights.
                    </p>
                  </div>

                  {/* Skills or technologies involved */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2.5">
                      Skills & Technologies Involved
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Python',
                        'Pandas & NumPy',
                        'SQL Databases',
                        'Scikit-Learn',
                        'Matplotlib / Seaborn',
                        'Data Analytics',
                        'Model Evaluation',
                        'Power BI / Dashboards'
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-[#111927] text-gray-200 font-medium px-2.5 py-1 rounded-lg border border-white/[0.08]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Eligibility criteria */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2">
                      Eligibility Criteria
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1.5 list-disc list-inside">
                      <li>B.Tech / B.E / BCA / MCA / M.Tech / B.Sc (CS / IT / Data Science / Math / Stats) students or graduates.</li>
                      <li>Basic knowledge of Python scripting, database queries (SQL), and analytical thinking.</li>
                    </ul>
                  </div>

                  {/* Meta strip */}
                  <div className="grid grid-cols-3 gap-2 bg-[#090e17] p-3.5 rounded-2xl border border-white/[0.06] text-center">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-gray-400">Duration</p>
                      <p className="text-sm font-bold text-white mt-0.5">3 Months</p>
                    </div>
                    <div className="border-x border-white/[0.08]">
                      <p className="text-[10px] font-mono uppercase text-gray-400">Stipend</p>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">₹5,000 / mo</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase text-gray-400">Mode</p>
                      <p className="text-sm font-bold text-white mt-0.5">Online / Hybrid</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 sm:p-7 pt-0 space-y-3">
                <Button
                  onClick={() => handleApplyClick('Data Science Internship')}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 text-sm transition-all duration-200 active:scale-[0.99]"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Link
                  to="/internship"
                  className="block text-center text-xs text-amber-400 hover:text-amber-300 font-semibold py-1 transition-colors"
                >
                  View Full Syllabus & Program Details →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom Call to Action */}
          <div className="bg-[#0c121e]/90 rounded-3xl p-6 sm:p-8 border border-white/[0.08] text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-left space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Looking for comprehensive internship syllabus & project details?
              </h3>
              <p className="text-sm text-gray-400">
                Explore our full roadmap, curriculum modules, and verifiable certification standards on the dedicated internship portal.
              </p>
            </div>
            <Link to="/internship" className="shrink-0 w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-md">
                Visit Dedicated Internship Page
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CERTIFICATIONS SECTION (Institutional Metallic Plaques) */}
      <section className="py-16 sm:py-20 bg-[#060911] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Government of India Registrations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Our Certifications & Accreditations
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              Recognized and registered under leading Indian statutory bodies for genuine student credential credibility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b101a] rounded-2xl p-7 shadow-xl border border-white/[0.08] hover:border-amber-400/30 text-center flex flex-col items-center justify-between"
            >
              <div className="w-28 h-28 mb-5 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLsSviwgSgLrDRFVxrVTkqC8DQV_6uy7Y_nCarPnx_Gg&s"
                  alt="MCA Logo"
                  className="max-h-20 w-auto object-contain filter contrast-125"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">MCA Approved</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Registered under Ministry of Corporate Affairs, Government of India
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b101a] rounded-2xl p-7 shadow-xl border border-white/[0.08] hover:border-amber-400/30 text-center flex flex-col items-center justify-between"
            >
              <div className="w-28 h-28 mb-5 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img
                  src="https://5.imimg.com/data5/KS/RU/JK/SELLER-83054718/msme-certificate-500x500.jpg"
                  alt="MSME Logo"
                  className="max-h-20 w-auto object-contain filter contrast-125"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">MSME Registered</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Recognized by Ministry of Micro, Small & Medium Enterprises
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b101a] rounded-2xl p-7 shadow-xl border border-white/[0.08] hover:border-amber-400/30 text-center flex flex-col items-center justify-between"
            >
              <div className="w-28 h-28 mb-5 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img
                  src="https://www.startupindia.gov.in/sih/themes/custom/startup_india/images/header-icons/DPIIT-header.png"
                  alt="DPIIT Logo"
                  className="max-h-20 w-auto object-contain filter contrast-125"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">DPIIT Recognized</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Approved by Department for Promotion of Industry and Internal Trade
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE FOREFIGHT ERA (Pillars of Engineering) */}
      <section className="relative bg-[#070a11] py-16 sm:py-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Learn with ForeFight Era?
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Comprehensive industry preparation with hands-on practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c121e] rounded-2xl p-7 shadow-xl border border-white/[0.08] hover:border-amber-400/30 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-400 flex items-center justify-center mb-5">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">
                  Industry-Oriented Curriculum
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Learn modern stacks and practical patterns directly aligned with high-growth technology requirements.
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c121e] rounded-2xl p-7 shadow-xl border border-white/[0.08] hover:border-amber-400/30 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/25 text-amber-400 flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">
                  Interactive Mentorship
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Work directly with experienced tech practitioners who provide code reviews and milestone guidance.
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c121e] rounded-2xl p-7 shadow-xl border border-white/[0.08] hover:border-amber-400/30 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mb-5">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">
                  Verifiable Credentials
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Earn recognized certificates and project recommendation letters valid for college academic credit submission.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Application Modal */}
      <InternshipApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        defaultDomain={selectedDomain}
      />
    </div>
  );
}
