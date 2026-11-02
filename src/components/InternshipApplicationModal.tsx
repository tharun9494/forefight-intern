import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export interface InternshipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain?: 'Web Development Internship' | 'Data Science Internship' | '';
}

export default function InternshipApplicationModal({
  isOpen,
  onClose,
  defaultDomain = 'Web Development Internship',
}: InternshipApplicationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    domain: defaultDomain || 'Web Development Internship',
    mode: 'Hybrid',
    skills: '',
    resumeUrl: '',
    statement: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync domain if defaultDomain prop updates
  useEffect(() => {
    if (defaultDomain) {
      setFormData((prev) => ({
        ...prev,
        domain: defaultDomain,
      }));
    }
  }, [defaultDomain]);

  // Handle ESC key to close and body scroll locking with scrollbar compensation
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleChange = (
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

  const validate = () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return false;
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.college.trim()) {
      toast.error('Please enter your college name');
      return false;
    }
    if (!formData.degree.trim()) {
      toast.error('Please enter your degree and current year');
      return false;
    }
    if (!formData.skills.trim()) {
      toast.error('Please specify your key skills');
      return false;
    }
    if (!formData.resumeUrl.trim()) {
      toast.error('Please provide a link to your resume or portfolio');
      return false;
    }
    if (!formData.agreeTerms) {
      toast.error('Please agree to the declaration to proceed');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
        source: 'ForeFight Era Website - Internship Application',
      });

      const refId = `FFE-INT-${docRef.id.slice(0, 6).toUpperCase()}`;
      setSubmittedRefId(refId);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmittedRefId(null);
    onClose();
  };

  if (!mounted) return null;

  const targetElement = document.getElementById('modal-root') || document.body;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="internship-modal-title">
          {/* Backdrop Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Centering Flex Container */}
          <div
            className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0c121e] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-w-2xl w-full my-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden border border-white/10"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white relative">
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider uppercase bg-white/20 w-fit px-3 py-1 rounded-full mb-2">
                  <Briefcase className="w-3.5 h-3.5 mr-1" />
                  ForeFight Era Pvt. Ltd. • Internship Portal
                </div>
                <h2 id="internship-modal-title" className="text-2xl font-black tracking-tight">Apply for Internship</h2>
                <p className="text-white/90 text-xs sm:text-sm mt-1">
                  Join our 3-month project-oriented program with ₹5,000/month stipend and industry mentorship.
                </p>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {submittedRefId ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Application Submitted!</h3>
                    <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                      Thank you for applying to ForeFight Era Pvt. Ltd. Your application has been logged into our review system.
                    </p>

                    <div className="bg-[#090e17] border border-amber-400/30 rounded-2xl p-5 max-w-md mx-auto">
                      <p className="text-xs font-mono uppercase tracking-wider font-semibold text-amber-300">Application Reference ID</p>
                      <p className="text-2xl font-mono font-bold text-white mt-1">{submittedRefId}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Please save this ID for tracking. Our HR team will review your credentials and contact you at <span className="font-semibold text-amber-300">{formData.email}</span> within 3–5 working days.
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button onClick={handleClose} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 rounded-xl shadow-md">
                        Done
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Domain Selection */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                        Select Internship Domain <span className="text-amber-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                            formData.domain === 'Web Development Internship'
                              ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/30'
                              : 'border-white/10 bg-[#111827] hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="domain"
                            value="Web Development Internship"
                            checked={formData.domain === 'Web Development Internship'}
                            onChange={handleChange}
                            className="text-amber-500 focus:ring-amber-400 mr-2.5"
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">Web Development</p>
                            <p className="text-xs text-gray-400">React, Node, TypeScript, APIs</p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                            formData.domain === 'Data Science Internship'
                              ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/30'
                              : 'border-white/10 bg-[#111827] hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="domain"
                            value="Data Science Internship"
                            checked={formData.domain === 'Data Science Internship'}
                            onChange={handleChange}
                            className="text-amber-500 focus:ring-amber-400 mr-2.5"
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">Data Science</p>
                            <p className="text-xs text-gray-400">Python, SQL, ML, Analytics</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Personal Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                          Full Name <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Rahul Sharma"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                          Email Address <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="student@college.edu"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                          Phone Number <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                          Internship Mode <span className="text-amber-500">*</span>
                        </label>
                        <select
                          name="mode"
                          value={formData.mode}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#111827] text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        >
                          <option value="Hybrid">Hybrid (Remote + Periodic Review)</option>
                          <option value="Online">Online / Fully Remote</option>
                          <option value="Offline">Offline (Madanapalle, AP Office)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                          College / University <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          placeholder="e.g. JNTU Anantapur"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                          Degree & Current Year <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="degree"
                          value={formData.degree}
                          onChange={handleChange}
                          placeholder="e.g. B.Tech CSE - 3rd Year"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                        Technical Skills <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g. HTML, CSS, JavaScript, React, Python, SQL, Git"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                        Resume Link (Google Drive / GitHub / LinkedIn) <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="resumeUrl"
                        value={formData.resumeUrl}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/... or https://github.com/..."
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                        Statement of Purpose / Goals (Optional)
                      </label>
                      <textarea
                        name="statement"
                        value={formData.statement}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Briefly state your motivation and what you aim to achieve..."
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                      />
                    </div>

                    <div className="flex items-start space-x-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="modalAgreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                        className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-400 rounded border-gray-600 bg-gray-800"
                      />
                      <label htmlFor="modalAgreeTerms" className="text-xs text-gray-400 leading-normal">
                        I confirm that the submitted details are correct, and I agree to be evaluated for ForeFight Era’s official internship program.
                      </label>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 text-sm active:scale-[0.99]"
                      >
                        {loading ? 'Submitting Application...' : 'Submit Application'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    targetElement
  );
}
