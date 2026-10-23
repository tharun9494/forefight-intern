import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Code2,
  Database,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  HelpCircle,
  FileCheck,
  Building2,
  Sparkles,
  Award,
  Users,
  Check,
  Zap,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import InternshipApplicationModal from '@/components/InternshipApplicationModal';

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
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      {/* Top Banner / Hero with rich animated glow and no image */}
      <div className="relative bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white py-16 lg:py-24 overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Ambient Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -left-16 w-80 sm:w-96 h-80 sm:h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-16 -right-16 w-80 sm:w-96 h-80 sm:h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 bg-amber-500/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border border-amber-400/30 text-amber-300"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>ForeFight Era Official Internship Program</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight"
            >
              Internship Opportunities at{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                ForeFight Era
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl font-medium text-amber-100/90 mb-6 leading-relaxed"
            >
              “Build practical skills, work on industry-oriented projects, and gain hands-on experience in technology and digital innovation.”
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base text-gray-300 leading-relaxed mb-8"
            >
              ForeFight Era Pvt. Ltd. offers project-oriented internship opportunities designed to help students apply their academic knowledge to practical assignments and real-world technology projects. Interns may gain experience in web development, data science, software development, and related technology domains.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <a href="#apply">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-orange-500/25 px-8">
                  Apply for Internship
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
              <a href="#details">
                <Button size="lg" variant="outline" className="border-gray-700 hover:border-amber-400/50 bg-gray-900/60 text-gray-200 hover:text-white font-medium">
                  View Program Tracks
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key Highlights Ribbon */}
      <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Duration</p>
                <p className="text-base font-bold text-gray-900">3 Months</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Monthly Stipend</p>
                <p className="text-base font-bold text-gray-900">₹5,000 / month</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Working Mode</p>
                <p className="text-base font-bold text-gray-900">Online / Offline / Hybrid</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Certification</p>
                <p className="text-base font-bold text-gray-900">Verified Certificate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Internship Cards Section */}
      <section id="details" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Available Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Internship Opportunities at ForeFight Era
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Choose your specialization track. Each program is mentored by experienced tech leads and includes real project deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Web Development */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-amber-200/80 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Software & Tech Track
                  </span>
                  <Code2 className="w-8 h-8 text-amber-200" />
                </div>
                <h3 className="text-2xl font-bold">Web Development Internship</h3>
                <p className="text-white/90 text-sm mt-1">
                  Full-stack engineering with modern JavaScript, React, Node.js, and cloud deployments.
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">
                    Brief Description
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Interns will collaborate on the design and development of modern web applications, RESTful APIs, and responsive user interfaces. You will gain experience with production CI/CD workflows, database querying, component architecture, and Agile sprint planning.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">
                    Skills & Technologies Involved
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'Tailwind CSS', 'Git & GitHub', 'Express', 'Firebase / SQL'].map((sk) => (
                      <span key={sk} className="text-xs bg-amber-50 text-amber-800 font-medium px-2.5 py-1 rounded-md border border-amber-200">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">
                    Eligibility Criteria
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                    <li>B.Tech / B.E / BCA / MCA / B.Sc (Computer Science / IT / Related Branches) students or recent graduates.</li>
                    <li>Basic knowledge of HTML, CSS, JavaScript, and object-oriented programming concepts.</li>
                    <li>Commitment to complete hands-on weekly assignments and the final capstone project.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-center">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-500">Duration</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">3 Months</p>
                  </div>
                  <div className="border-x border-gray-200">
                    <p className="text-[11px] uppercase font-bold text-gray-500">Stipend</p>
                    <p className="text-sm font-bold text-green-700 mt-0.5">₹5,000 / mo</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-500">Mode</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">Online / Hybrid</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Button
                onClick={() => openApplyFor('Web Development Internship')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-md"
              >
                Apply for Web Development
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Card 2: Data Science */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-amber-200/80 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Analytics & AI Track
                  </span>
                  <Database className="w-8 h-8 text-amber-200" />
                </div>
                <h3 className="text-2xl font-bold">Data Science Internship</h3>
                <p className="text-white/90 text-sm mt-1">
                  Data processing, machine learning models, statistical analysis, and interactive business intelligence.
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">
                    Brief Description
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Interns will perform exploratory data analysis on real datasets, clean and preprocess raw information, train predictive models, and build interactive dashboards to communicate technical insights to stakeholders.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">
                    Skills & Technologies Involved
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Pandas & NumPy', 'SQL', 'Scikit-Learn', 'Matplotlib / Seaborn', 'Data Analytics', 'Model Evaluation', 'Power BI / Dashboarding'].map((sk) => (
                      <span key={sk} className="text-xs bg-amber-50 text-amber-800 font-medium px-2.5 py-1 rounded-md border border-amber-200">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">
                    Eligibility Criteria
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                    <li>B.Tech / B.E / BCA / MCA / M.Tech / B.Sc (CS, IT, Data Science, Math, Stats) students or graduates.</li>
                    <li>Basic knowledge of Python scripting, database queries (SQL), and foundational math/statistics.</li>
                    <li>Eagerness to analyze datasets and present data-backed problem-solving solutions.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-center">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-500">Duration</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">3 Months</p>
                  </div>
                  <div className="border-x border-gray-200">
                    <p className="text-[11px] uppercase font-bold text-gray-500">Stipend</p>
                    <p className="text-sm font-bold text-green-700 mt-0.5">₹5,000 / mo</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-500">Mode</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">Online / Hybrid</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Button
                onClick={() => openApplyFor('Data Science Internship')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-md"
              >
                Apply for Data Science
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Learning Roadmap / Milestone Structure */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 mb-16">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Structured 3-Month Internship Roadmap</h3>
            <p className="text-gray-600 text-sm">
              Our internship program follows a defined milestone structure designed to build industry readiness in accordance with technical education frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-orange-50/70 border border-orange-200">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-200/60 px-2 py-0.5 rounded">
                Month 1 (Weeks 1-4)
              </span>
              <h4 className="font-bold text-gray-900 mt-3 mb-1">Foundations & Tooling</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Development environment setup, Git best practices, architectural paradigms, code standards, and guided technical assignments.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">
                Month 2 (Weeks 5-8)
              </span>
              <h4 className="font-bold text-gray-900 mt-3 mb-1">Project Architecture</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sprint planning, database modeling, REST API integrations, and core feature implementation under mentor supervision.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-yellow-50/70 border border-yellow-200">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-700 bg-yellow-200/60 px-2 py-0.5 rounded">
                Month 3 (Weeks 9-11)
              </span>
              <h4 className="font-bold text-gray-900 mt-3 mb-1">Live Capstone Build</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                End-to-end project execution, unit testing, performance optimization, and production deployment.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-green-50/70 border border-green-200">
              <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-200/60 px-2 py-0.5 rounded">
                Week 12
              </span>
              <h4 className="font-bold text-gray-900 mt-3 mb-1">Evaluation & Credit Letter</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Code review, project viva presentation, issuance of Internship Certificate and Academic Credit Recommendation letter.
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Functional Application Form */}
        <div id="apply" className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white">
            <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Direct Application Form
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2">Submit Your Internship Application</h3>
            <p className="text-white/90 text-sm mt-1 max-w-2xl">
              Apply directly to ForeFight Era Pvt. Ltd. Fill out the details below. Our technical panel will review your credentials and contact you with next steps.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {submittedRefId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">Application Successfully Submitted!</h4>
                <p className="text-gray-600 max-w-md mx-auto text-sm">
                  We have logged your application into ForeFight Era’s review database.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 max-w-md mx-auto">
                  <p className="text-xs uppercase font-bold text-amber-800">Your Reference ID</p>
                  <p className="text-2xl font-mono font-bold text-amber-900 mt-1">{submittedRefId}</p>
                  <p className="text-xs text-amber-700 mt-2">
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
                  className="mt-4"
                >
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Internship Domain <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
                    >
                      <option value="Web Development Internship">Web Development Internship</option>
                      <option value="Data Science Internship">Data Science Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Internship Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
                    >
                      <option value="Hybrid">Hybrid (Remote + Periodic Review)</option>
                      <option value="Online">Online / Fully Remote</option>
                      <option value="Offline">Offline (Madanapalle, AP Office)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="student@college.edu"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      College / University Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="e.g. Jawaharlal Nehru Technological University"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Degree, Branch & Current Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      placeholder="e.g. B.Tech Computer Science - 3rd Year"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Technical Skills / Tool Knowledge <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="e.g. HTML, CSS, JavaScript, React, Python, Git"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Resume Link (Google Drive / GitHub / LinkedIn) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      placeholder="https://drive.google.com/... or https://linkedin.com/in/..."
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Brief Statement of Interest (Optional)
                  </label>
                  <textarea
                    name="statement"
                    value={formData.statement}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Briefly explain your career goals or any relevant projects..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  />
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Privacy Notice & Verification Assurance:</p>
                  <p>
                    ForeFight Era Pvt. Ltd. collects this information solely for evaluating internship candidates and verifying academic enrollment. We do not sell or share your personal details with third-party marketers.
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="pageAgreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-gray-300"
                  />
                  <label htmlFor="pageAgreeTerms" className="text-xs text-gray-700 leading-normal">
                    I confirm that the details submitted are true and accurate, and I authorize ForeFight Era Pvt. Ltd. to contact me regarding my internship application.
                  </label>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-10 shadow-lg"
                  >
                    {loading ? 'Submitting Application...' : 'Submit Application Now'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <HelpCircle className="w-7 h-7 text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">
                Is this internship eligible for university credits and academic submission?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Yes. Upon successful completion, ForeFight Era Pvt. Ltd. issues an official Certificate of Internship Completion, Project Performance Evaluation, and Academic Credit Letter specifying the duration (3 months) and technology domain.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">
                What is the stipend and payment disbursement schedule?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Eligible selected interns receive a stipend of ₹5,000 per month, disbursed on a monthly basis based on project milestone completion and active participation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">
                Can I attend classes while completing the internship?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Yes. Our internship modes (Online / Hybrid) are structured with flexible schedules specifically accommodating college lecture timetables and examinations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">
                What is the screening and selection procedure?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Applications submitted via this portal are screened based on technical skills and academic background, followed by a brief technical assessment or interview before selection offers are issued.
              </p>
            </div>
          </div>
        </div>

        {/* Contact and Corporate Verification Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Official Corporate Entity</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900">ForeFight Era Private Limited</h4>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              MCA Registered • MSME Recognized • DPIIT Approved • Domain: <a href="https://www.forefightedu.com/" className="text-orange-600 underline font-medium">www.forefightedu.com</a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              For institutional partnerships or verification queries: <span className="font-semibold text-gray-800">forefightera@gmail.com</span> | <span className="font-semibold text-gray-800">+91 8919403905</span>
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-3">
            <a href="#apply">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                Apply for Internship
              </Button>
            </a>
            <Link to="/about">
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
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
