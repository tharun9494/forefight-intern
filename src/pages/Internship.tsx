import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Code2,
  Database,
  IndianRupee,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FileCheck,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import InternshipApplicationModal from '@/components/InternshipApplicationModal';
import InternshipLaptopExperience from '@/components/3d/laptop/InternshipLaptopExperience';

export default function Internship() {
  const location = useLocation();
  const [selectedDomain, setSelectedDomain] = useState<'Web Development Internship' | 'Data Science Internship'>('Web Development Internship');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  // Embedded Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    domain: 'Web Development Internship',
    mode: 'Hybrid',
    skills: '',
    resumeUrl: '',
    statement: '',
    agreeTerms: false,
  });

  useEffect(() => {
    // Scroll to #apply if anchor is present
    if (location.hash === '#apply') {
      const el = document.getElementById('apply');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const openApplyFor = (domain: 'Web Development Internship' | 'Data Science Internship') => {
    setSelectedDomain(domain);
    setFormData((prev) => ({ ...prev, domain }));
    const el = document.getElementById('apply');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.college.trim()) {
      toast.error('Please enter your college name');
      return;
    }
    if (!formData.degree.trim()) {
      toast.error('Please enter your degree and current year');
      return;
    }
    if (!formData.skills.trim()) {
      toast.error('Please mention your key technical skills');
      return;
    }
    if (!formData.resumeUrl.trim()) {
      toast.error('Please provide a resume link (Google Drive, LinkedIn, or GitHub)');
      return;
    }
    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms to proceed');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'internship_applications'), {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        degree: formData.degree.trim(),
        domain: formData.domain,
        mode: formData.mode,
        skills: formData.skills.trim(),
        resumeUrl: formData.resumeUrl.trim(),
        statement: formData.statement.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        timestamp: Timestamp.now(),
        source: 'Dedicated Internship Page Application Form',
      });

      const refId = `FFE-INT-${docRef.id.slice(0, 6).toUpperCase()}`;
      setSubmittedRefId(refId);
      toast.success('Application submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#070a11] text-gray-100 min-h-screen overflow-x-hidden">
      {/* Top Banner / Hero with Studio Depth and No Images */}
      <div className="relative bg-gradient-to-b from-[#060910] via-[#0a0f1b] to-[#070a11] text-white py-16 lg:py-24 overflow-hidden px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        {/* Architectural lighting subtle background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[450px] h-[300px] bg-sky-900/[0.05] rounded-full blur-[130px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* LEFT HERO: Unchanged Official Heading, Description, and CTAs */}
            <div className="lg:col-span-5 xl:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 bg-amber-500/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wide uppercase mb-4 border border-amber-400/30 text-amber-300"
              >
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>ForeFight Era Official Internship Program</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white mb-4 leading-tight"
              >
                Internship Opportunities at{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  ForeFight Era
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl font-medium text-amber-200/90 mb-5 leading-relaxed"
              >
                “Build practical skills, work on industry-oriented projects, and gain hands-on experience in technology and digital innovation.”
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base text-gray-300 leading-relaxed mb-8"
              >
                ForeFight Era Pvt. Ltd. offers project-oriented internship opportunities designed to help students apply their academic knowledge to practical assignments and real-world technology projects. Interns may gain experience in web development, data science, software development, and related technology domains.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 pt-1"
              >
                <a href="#apply">
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-orange-500/20 px-8 rounded-xl active:scale-[0.99]">
                    Apply for Internship
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href="#details">
                  <Button size="lg" variant="outline" className="border-white/10 hover:border-amber-400/50 bg-[#0c121e]/80 text-gray-200 hover:text-white font-semibold rounded-xl active:scale-[0.99]">
                    View Program Tracks
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* RIGHT HERO: 3D Interactive Laptop Internship Classroom Experience */}
            <div className="lg:col-span-7 xl:col-span-7 w-full flex items-center justify-center">
              <InternshipLaptopExperience />
            </div>
          </div>
        </div>
      </div>

      {/* Key Highlights Ribbon */}
      <div className="bg-[#0b101a] border-b border-white/[0.08] py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">Duration</p>
                <p className="text-base font-bold text-white">3 Months</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">Monthly Stipend</p>
                <p className="text-base font-bold text-emerald-400">₹5,000 / month</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">Working Mode</p>
                <p className="text-base font-bold text-white">Online / Offline / Hybrid</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">Certification</p>
                <p className="text-base font-bold text-white">Verified Certificate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Internship Cards Section */}
      <section id="details" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-400/30 px-3 py-1 rounded-full">
            Available Programs
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 mb-4 tracking-tight">
            Internship Opportunities at ForeFight Era
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Choose your specialization track. Each program is mentored by experienced tech leads and includes real project deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Web Development */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0c121e] rounded-3xl border border-white/[0.08] hover:border-amber-400/40 shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="p-6 sm:p-7 border-b border-white/[0.06] bg-[#0f1726]/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                    Software & Tech Track
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">Web Development Internship</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Full-stack engineering with modern JavaScript, React, Node.js, and cloud deployments.
                </p>
              </div>

              <div className="p-6 sm:p-7 space-y-6">
                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2">
                    Brief Description
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Interns will collaborate on the design and development of modern web applications, RESTful APIs, and responsive user interfaces. You will gain experience with production CI/CD workflows, database querying, component architecture, and Agile sprint planning.
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2.5">
                    Skills & Technologies Involved
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'Tailwind CSS', 'Git & GitHub', 'Express', 'Firebase / SQL'].map((sk) => (
                      <span key={sk} className="text-xs bg-[#111927] text-gray-200 font-medium px-2.5 py-1 rounded-lg border border-white/[0.08]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2">
                    Eligibility Criteria
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1.5 list-disc list-inside">
                    <li>B.Tech / B.E / BCA / MCA / B.Sc (Computer Science / IT / Related Branches) students or recent graduates.</li>
                    <li>Basic knowledge of HTML, CSS, JavaScript, and object-oriented programming concepts.</li>
                    <li>Commitment to complete hands-on weekly assignments and the final capstone project.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-[#090e17] p-3.5 rounded-2xl border border-white/[0.06] text-center">
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

            <div className="p-6 sm:p-7 pt-0">
              <Button
                onClick={() => openApplyFor('Web Development Internship')}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99]"
              >
                Apply for Web Development
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Card 2: Data Science */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0c121e] rounded-3xl border border-white/[0.08] hover:border-amber-400/40 shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="p-6 sm:p-7 border-b border-white/[0.06] bg-[#0f1726]/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                    Analytics & AI Track
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">Data Science Internship</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Data processing, machine learning models, statistical analysis, and interactive business intelligence.
                </p>
              </div>

              <div className="p-6 sm:p-7 space-y-6">
                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2">
                    Brief Description
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Interns will perform exploratory data analysis on real datasets, clean and preprocess raw information, train predictive models, and build interactive dashboards to communicate technical insights to stakeholders.
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2.5">
                    Skills & Technologies Involved
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Pandas & NumPy', 'SQL', 'Scikit-Learn', 'Matplotlib / Seaborn', 'Data Analytics', 'Model Evaluation', 'Power BI / Dashboarding'].map((sk) => (
                      <span key={sk} className="text-xs bg-[#111927] text-gray-200 font-medium px-2.5 py-1 rounded-lg border border-white/[0.08]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400/90 mb-2">
                    Eligibility Criteria
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1.5 list-disc list-inside">
                    <li>B.Tech / B.E / BCA / MCA / M.Tech / B.Sc (CS, IT, Data Science, Math, Stats) students or graduates.</li>
                    <li>Basic knowledge of Python scripting, database queries (SQL), and foundational math/statistics.</li>
                    <li>Eagerness to analyze datasets and present data-backed problem-solving solutions.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-[#090e17] p-3.5 rounded-2xl border border-white/[0.06] text-center">
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

            <div className="p-6 sm:p-7 pt-0">
              <Button
                onClick={() => openApplyFor('Data Science Internship')}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99]"
              >
                Apply for Data Science
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Learning Roadmap / Milestone Structure */}
        <div className="bg-[#0c121e] rounded-3xl shadow-xl border border-white/[0.08] p-6 sm:p-8 mb-16">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Structured 3-Month Internship Roadmap</h3>
            <p className="text-gray-400 text-sm">
              Our internship program follows a defined milestone structure designed to build industry readiness in accordance with technical education frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#090e17] border border-white/[0.08]">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded">
                Month 1 (Weeks 1-4)
              </span>
              <h4 className="font-bold text-white mt-3 mb-1">Foundations & Tooling</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Development environment setup, Git best practices, architectural paradigms, code standards, and guided technical assignments.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e17] border border-white/[0.08]">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded">
                Month 2 (Weeks 5-8)
              </span>
              <h4 className="font-bold text-white mt-3 mb-1">Project Architecture</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sprint planning, database modeling, REST API integrations, and core feature implementation under mentor supervision.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e17] border border-white/[0.08]">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded">
                Month 3 (Weeks 9-11)
              </span>
              <h4 className="font-bold text-white mt-3 mb-1">Live Capstone Build</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                End-to-end project execution, unit testing, performance optimization, and production deployment.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e17] border border-white/[0.08]">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 rounded">
                Week 12
              </span>
              <h4 className="font-bold text-white mt-3 mb-1">Evaluation & Credit Letter</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Code review, project viva presentation, issuance of Internship Certificate and Academic Credit Recommendation letter.
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Functional Application Form */}
        <div id="apply" className="bg-[#0c121e] rounded-3xl shadow-2xl border border-white/[0.08] overflow-hidden mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white">
            <span className="bg-white/20 text-xs font-mono font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Direct Application Form
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">Submit Your Internship Application</h3>
            <p className="text-white/90 text-sm mt-1 max-w-2xl">
              Apply directly to ForeFight Era Pvt. Ltd. Fill out the details below. Our technical panel will review your credentials and contact you with next steps.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {submittedRefId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-white">Application Successfully Submitted!</h4>
                <p className="text-gray-400 max-w-md mx-auto text-sm">
                  We have logged your application into ForeFight Era’s review database.
                </p>
                <div className="bg-[#090e17] border border-amber-400/30 rounded-2xl p-5 max-w-md mx-auto">
                  <p className="text-xs font-mono uppercase font-bold text-amber-300">Your Reference ID</p>
                  <p className="text-2xl font-mono font-bold text-white mt-1">{submittedRefId}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Confirmation has been queued for {formData.email}. We will contact you regarding interview scheduling.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSubmittedRefId(null);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      college: '',
                      degree: '',
                      domain: 'Web Development Internship',
                      mode: 'Hybrid',
                      skills: '',
                      resumeUrl: '',
                      statement: '',
                      agreeTerms: false,
                    });
                  }}
                  variant="outline"
                  className="mt-4 border-white/10 text-gray-200 hover:text-white hover:bg-white/5"
                >
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                      Internship Domain <span className="text-amber-500">*</span>
                    </label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white"
                    >
                      <option value="Web Development Internship">Web Development Internship</option>
                      <option value="Data Science Internship">Data Science Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                      Internship Mode <span className="text-amber-500">*</span>
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white"
                    >
                      <option value="Hybrid">Hybrid (Remote + Periodic Review)</option>
                      <option value="Online">Online / Fully Remote</option>
                      <option value="Offline">Offline (Madanapalle, AP Office)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Full Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Email Address <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="student@college.edu"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Phone Number <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                      College / University Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="e.g. Jawaharlal Nehru Technological University"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Degree, Branch & Current Year <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      placeholder="e.g. B.Tech Computer Science - 3rd Year"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Technical Skills / Tool Knowledge <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="e.g. HTML, CSS, JavaScript, React, Python, Git"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Resume Link (Google Drive / GitHub / LinkedIn) <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      placeholder="https://drive.google.com/... or https://linkedin.com/in/..."
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Brief Statement of Interest (Optional)
                  </label>
                  <textarea
                    name="statement"
                    value={formData.statement}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Briefly explain your career goals or any relevant projects..."
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-[#111827] text-white placeholder-gray-500"
                  />
                </div>

                <div className="bg-[#090e17] rounded-2xl p-4 border border-amber-400/20 text-xs text-amber-200/90 space-y-1">
                  <p className="font-bold text-amber-300">Privacy Notice & Verification Assurance:</p>
                  <p>
                    ForeFight Era Pvt. Ltd. collects this information solely for evaluating internship candidates and verifying academic enrollment. We do not sell or share your personal details with third-party marketers.
                  </p>
                </div>

                <div className="flex items-start space-x-2.5">
                  <input
                    type="checkbox"
                    id="pageAgreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-400 rounded border-gray-600 bg-gray-800"
                  />
                  <label htmlFor="pageAgreeTerms" className="text-xs text-gray-300 leading-normal">
                    I confirm that the details submitted are true and accurate, and I authorize ForeFight Era Pvt. Ltd. to contact me regarding my internship application.
                  </label>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-10 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99]"
                  >
                    {loading ? 'Submitting Application...' : 'Submit Application Now'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#0c121e] rounded-3xl shadow-xl border border-white/[0.08] p-6 sm:p-8 mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div className="p-5 rounded-2xl bg-[#090e17] border border-white/[0.06]">
              <h4 className="font-bold text-white mb-1.5">
                Is this internship eligible for university credits and academic submission?
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Yes. Upon successful completion, ForeFight Era Pvt. Ltd. issues an official Certificate of Internship Completion, Project Performance Evaluation, and Academic Credit Letter specifying the duration (3 months) and technology domain.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e17] border border-white/[0.06]">
              <h4 className="font-bold text-white mb-1.5">
                What is the stipend and payment disbursement schedule?
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Eligible selected interns receive a stipend of ₹5,000 per month, disbursed on a monthly basis based on project milestone completion and active participation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e17] border border-white/[0.06]">
              <h4 className="font-bold text-white mb-1.5">
                Can I attend classes while completing the internship?
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Yes. Our internship modes (Online / Hybrid) are structured with flexible schedules specifically accommodating college lecture timetables and examinations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e17] border border-white/[0.06]">
              <h4 className="font-bold text-white mb-1.5">
                What is the screening and selection procedure?
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Applications submitted via this portal are screened based on technical skills and academic background, followed by a brief technical assessment or interview before selection offers are issued.
              </p>
            </div>
          </div>
        </div>

        {/* Contact and Corporate Verification Info */}
        <div className="bg-[#0c121e] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-1">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Official Corporate Entity</span>
            </div>
            <h4 className="text-xl font-bold text-white">ForeFight Era Private Limited</h4>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              MCA Registered • MSME Recognized • DPIIT Approved • Domain: <a href="https://www.forefightedu.com/" className="text-amber-400 underline font-medium">www.forefightedu.com</a>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              For institutional partnerships or verification queries: <span className="font-mono text-gray-200">forefightera@gmail.com</span> | <span className="font-mono text-gray-200">+91 8919403905</span>
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-3">
            <a href="#apply">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md">
                Apply for Internship
              </Button>
            </a>
            <Link to="/about">
              <Button variant="outline" className="border-white/10 text-gray-200 hover:text-white hover:bg-white/5 rounded-xl">
                About Company
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Application Modal if opened from buttons */}
      <InternshipApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDomain={selectedDomain}
      />
    </div>
  );
}
