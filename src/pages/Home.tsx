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
  CheckCircle2,
  FileCheck,
  Cpu,
  Layers,
  Terminal,
  Zap,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import InternshipApplicationModal from '@/components/InternshipApplicationModal';

export default function Home() {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<
    'Web Development Internship' | 'Data Science Internship'
  >('Web Development Internship');

  const handleApplyClick = (domain: 'Web Development Internship' | 'Data Science Internship') => {
    setSelectedDomain(domain);
    setIsApplicationModalOpen(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-16 lg:space-y-24 overflow-x-hidden">
      {/* 1. HERO SECTION: Rich animated background, No images, 100% responsive */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Animated ambient glowing orbs */}
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.25, 0.95, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-24 -left-20 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-amber-500/25 via-orange-600/20 to-transparent rounded-full blur-3xl pointer-events-none"
        />

        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 40, -50, 0],
            scale: [1, 1.15, 1.05, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-28 -right-20 w-96 h-96 sm:w-[520px] sm:h-[520px] bg-gradient-to-bl from-orange-500/20 via-amber-600/15 to-indigo-900/25 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"
        />

        {/* Main Content Container: 2-column layout on desktop, stacked on mobile */}
        <div className="relative max-w-7xl w-full mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-semibold shadow-inner"
            >
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>ForeFight Era Pvt. Ltd. • Official Internship Program</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]"
            >
              Transform Your Career with{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Practical Learning
              </span>{' '}
              & Industry Internships
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Work on live production assignments, learn modern software stacks, and earn verifiable internship certificates with real industry mentorship in Web Development and Data Science.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link to="/internship" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 border border-amber-300/30 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Explore Internships
                  <ChevronRight className="ml-1.5 h-5 w-5" />
                </Button>
              </Link>
              <a href="#internships" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gray-700 hover:border-amber-400/50 bg-gray-900/60 text-gray-200 hover:text-white hover:bg-gray-800/80 font-semibold px-7 py-3.5 rounded-xl backdrop-blur-md transition-all"
                >
                  View Open Roles
                </Button>
              </a>
            </motion.div>

            {/* Micro Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-400"
            >
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-amber-400" />
                <span>3 Months Duration</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-green-400" />
                <span>₹5,000 / Month Stipend</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Online / Offline / Hybrid</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Animated Glassmorphism Internship Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Backlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-3xl blur-2xl -z-10" />

            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-800/80">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">ForeFight Era Cohort</h3>
                    <p className="text-xs text-gray-400">Project-Oriented Programs</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Active Enrollment
                </span>
              </div>

              {/* Tracks overview */}
              <div className="py-6 space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/60 hover:border-amber-500/50 transition-all cursor-pointer"
                  onClick={() => handleApplyClick('Web Development Internship')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Web Development</h4>
                        <p className="text-xs text-gray-400">React, TypeScript, Node.js, REST APIs</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-amber-400">Apply →</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/60 hover:border-amber-500/50 transition-all cursor-pointer"
                  onClick={() => handleApplyClick('Data Science Internship')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Data Science</h4>
                        <p className="text-xs text-gray-400">Python, SQL, ML Models, Analytics</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-amber-400">Apply →</span>
                  </div>
                </motion.div>
              </div>

              {/* Stipend & Duration Summary Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl p-4 border border-amber-500/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block">Internship Stipend</span>
                  <span className="text-base font-extrabold text-green-400">₹5,000 / month</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block">Program Span</span>
                  <span className="text-base font-extrabold text-white">3 Months</span>
                </div>
              </div>

              {/* Quick CTA */}
              <div className="mt-5">
                <Button
                  onClick={() => handleApplyClick('Web Development Internship')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-md text-sm"
                >
                  Apply Online Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Floating Tech Badges with Framer Motion Animation */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="hidden sm:flex absolute -top-4 -right-4 bg-gray-900/90 border border-gray-700/80 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold text-amber-300 backdrop-blur-md items-center space-x-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Full-Stack & ML</span>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8
              }}
              className="hidden sm:flex absolute -bottom-4 -left-4 bg-gray-900/90 border border-gray-700/80 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold text-emerald-300 backdrop-blur-md items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Certified Completion</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. DEDICATED HOMEPAGE INTERNSHIP SECTION (Immediately below Hero) */}
      <section id="internships" className="relative py-12 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Internship Opportunities</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Internship Opportunities at ForeFight Era
            </h2>

            <p className="text-lg sm:text-xl text-amber-700 font-medium mb-4 italic">
              “Build practical skills, work on industry-oriented projects, and gain hands-on experience in technology and digital innovation.”
            </p>

            <p className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
              ForeFight Era Pvt. Ltd. offers project-oriented internship opportunities designed to help students apply their academic knowledge to practical assignments and real-world technology projects. Interns may gain experience in web development, data science, software development, and related technology domains.
            </p>
          </motion.div>

          {/* Key Parameters Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Duration</p>
                <p className="text-sm font-bold text-gray-900">3 Months</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Stipend</p>
                <p className="text-sm font-bold text-gray-900">₹5,000 / month</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Mode</p>
                <p className="text-sm font-bold text-gray-900">Online / Offline / Hybrid</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Certification</p>
                <p className="text-sm font-bold text-gray-900">Project Certified</p>
              </div>
            </div>
          </div>

          {/* Two Prominent Internship Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Card 1: Web Development Internship */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-amber-200/90 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header banner */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      Software Domain
                    </span>
                    <Code2 className="w-8 h-8 text-amber-200" />
                  </div>
                  <h3 className="text-2xl font-bold">Web Development Internship</h3>
                  <p className="text-amber-100 text-sm mt-1">
                    Front-End, Back-End & Full-Stack Application Engineering
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Brief description */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-1.5">
                      Brief Description
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Interns collaborate on real web application modules, develop scalable user interfaces, implement REST APIs, manage database states, and participate in modern code reviews and Git version control workflows.
                    </p>
                  </div>

                  {/* Skills or technologies involved */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">
                      Skills & Technologies Involved
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'Tailwind CSS', 'HTML5 / CSS3', 'Git / GitHub', 'Firebase / SQL'].map((skill) => (
                        <span key={skill} className="text-xs bg-amber-50 text-amber-900 font-medium px-2.5 py-1 rounded-md border border-amber-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Eligibility criteria */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-1.5">
                      Eligibility Criteria
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>B.Tech / B.E / BCA / MCA / B.Sc (Computer Science / IT / Related Branches) students or recent graduates.</li>
                      <li>Basic understanding of web technologies and programming fundamentals.</li>
                    </ul>
                  </div>

                  {/* Meta strip */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500">Duration</p>
                      <p className="text-sm font-bold text-gray-900">3 Months</p>
                    </div>
                    <div className="border-x border-gray-200">
                      <p className="text-[10px] uppercase font-bold text-gray-500">Stipend</p>
                      <p className="text-sm font-bold text-green-700">₹5,000 / mo</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500">Mode</p>
                      <p className="text-sm font-bold text-gray-900">Online / Hybrid</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 space-y-2.5">
                <Button
                  onClick={() => handleApplyClick('Web Development Internship')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-md text-sm"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Link to="/internship" className="block text-center text-xs text-orange-600 hover:text-orange-700 font-semibold py-1">
                  View Full Syllabus & Program Details →
                </Link>
              </div>
            </motion.div>

            {/* Card 2: Data Science Internship */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-amber-200/90 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header banner */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      Analytics Domain
                    </span>
                    <Database className="w-8 h-8 text-amber-200" />
                  </div>
                  <h3 className="text-2xl font-bold">Data Science Internship</h3>
                  <p className="text-amber-100 text-sm mt-1">
                    Data Analytics, Machine Learning & Predictive Modeling
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Brief description */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-1.5">
                      Brief Description
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Interns clean and explore real-world datasets, build predictive algorithms, develop interactive visualization dashboards, and translate raw data into actionable decision-making insights.
                    </p>
                  </div>

                  {/* Skills or technologies involved */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">
                      Skills & Technologies Involved
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Python', 'Pandas & NumPy', 'SQL Databases', 'Scikit-Learn', 'Matplotlib / Seaborn', 'Data Analytics', 'Model Evaluation', 'Power BI / Dashboards'].map((skill) => (
                        <span key={skill} className="text-xs bg-amber-50 text-amber-900 font-medium px-2.5 py-1 rounded-md border border-amber-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Eligibility criteria */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-1.5">
                      Eligibility Criteria
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>B.Tech / B.E / BCA / MCA / M.Tech / B.Sc (CS / IT / Data Science / Math / Stats) students or graduates.</li>
                      <li>Basic knowledge of Python scripting, database queries (SQL), and analytical thinking.</li>
                    </ul>
                  </div>

                  {/* Meta strip */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500">Duration</p>
                      <p className="text-sm font-bold text-gray-900">3 Months</p>
                    </div>
                    <div className="border-x border-gray-200">
                      <p className="text-[10px] uppercase font-bold text-gray-500">Stipend</p>
                      <p className="text-sm font-bold text-green-700">₹5,000 / mo</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500">Mode</p>
                      <p className="text-sm font-bold text-gray-900">Online / Hybrid</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 space-y-2.5">
                <Button
                  onClick={() => handleApplyClick('Data Science Internship')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-md text-sm"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Link to="/internship" className="block text-center text-xs text-orange-600 hover:text-orange-700 font-semibold py-1">
                  View Full Syllabus & Program Details →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom Call to Action for Dedicated Internship Page */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 rounded-2xl p-6 sm:p-8 border border-amber-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">
                Looking for comprehensive internship syllabus & project details?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Explore our full roadmap, curriculum modules, and verifiable certification standards on the dedicated internship portal.
              </p>
            </div>
            <Link to="/internship" className="shrink-0">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md">
                Visit Dedicated Internship Page
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CERTIFICATIONS SECTION */}
      <section className="bg-white py-14 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-yellow-600">Our Certifications & Accreditations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recognized and registered under leading Indian statutory bodies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200 text-center"
            >
              <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLsSviwgSgLrDRFVxrVTkqC8DQV_6uy7Y_nCarPnx_Gg&s"
                  alt="MCA Logo"
                  className="max-h-24 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">MCA Approved</h3>
              <p className="text-gray-600 text-sm">Registered under Ministry of Corporate Affairs, Government of India</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200 text-center"
            >
              <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="https://5.imimg.com/data5/KS/RU/JK/SELLER-83054718/msme-certificate-500x500.jpg"
                  alt="MSME Logo"
                  className="max-h-24 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">MSME Registered</h3>
              <p className="text-gray-600 text-sm">Recognized by Ministry of Micro, Small & Medium Enterprises</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200 text-center"
            >
              <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="https://www.startupindia.gov.in/sih/themes/custom/startup_india/images/header-icons/DPIIT-header.png"
                  alt="DPIIT Logo"
                  className="max-h-24 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">DPIIT Recognized</h3>
              <p className="text-gray-600 text-sm">Approved by Department for Promotion of Industry and Internal Trade</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE FOREFIGHT ERA FEATURES SECTION */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Learn with ForeFight Era?</h2>
            <p className="text-gray-600 mt-2">Comprehensive industry preparation with hands-on practice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={item}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <Globe className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Industry-Oriented Curriculum
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Learn modern stacks and practical patterns directly aligned with high-growth technology requirements.
              </p>
            </motion.div>
            
            <motion.div
              variants={item}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <Sparkles className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Interactive Mentorship
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Work directly with experienced tech practitioners who provide code reviews and milestone guidance.
              </p>
            </motion.div>
            
            <motion.div
              variants={item}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <Award className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Verifiable Credentials
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Earn recognized certificates and project recommendation letters valid for college academic credit submission.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Global Application Modal */}
      <InternshipApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        defaultDomain={selectedDomain}
      />
    </div>
  );
}