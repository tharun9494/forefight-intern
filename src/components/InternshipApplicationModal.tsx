import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Briefcase, Mail, Phone, GraduationCap, Building, Link as LinkIcon, Send, AlertCircle } from 'lucide-react';
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
      toast.error('Please enter a valid 10-digit phone/WhatsApp number');
      return false;
    }
    if (!formData.college.trim()) {
      toast.error('Please enter your college/university name');
      return false;
    }
    if (!formData.degree.trim()) {
      toast.error('Please enter your degree and current year (e.g., B.Tech CSE 3rd Year)');
      return false;
    }
    if (!formData.skills.trim()) {
      toast.error('Please mention your key technical skills');
      return false;
    }
    if (!formData.resumeUrl.trim()) {
      toast.error('Please provide your resume link (Google Drive, LinkedIn, or GitHub)');
      return false;
    }
    if (!formData.agreeTerms) {
      toast.error('Please accept the privacy and application terms');
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase bg-white/20 w-fit px-3 py-1 rounded-full mb-2">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              ForeFight Era Pvt. Ltd. • Internship Portal
            </div>
            <h2 className="text-2xl font-bold">Apply for Internship</h2>
            <p className="text-white/90 text-sm mt-1">
              Join our 3-month project-oriented program with ₹5,000/month stipend and industry mentorship.
            </p>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {submittedRefId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Application Submitted!</h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
                  Thank you for applying to ForeFight Era Pvt. Ltd. Your application has been logged into our review system.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-xs uppercase tracking-wider font-semibold text-amber-800">Application Reference ID</p>
                  <p className="text-xl font-mono font-bold text-amber-900 mt-1">{submittedRefId}</p>
                  <p className="text-xs text-amber-700 mt-2">
                    Please save this ID for tracking. Our HR team will review your credentials and contact you at <span className="font-semibold">{formData.email}</span> within 3–5 working days.
                  </p>
                </div>

                <div className="pt-4">
                  <Button onClick={handleClose} className="bg-amber-600 hover:bg-amber-700 text-white px-8">
                    Done
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Domain Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Select Internship Domain <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.domain === 'Web Development Internship'
                          ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="domain"
                        value="Web Development Internship"
                        checked={formData.domain === 'Web Development Internship'}
                        onChange={handleChange}
                        className="text-orange-600 focus:ring-orange-500 mr-2.5"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Web Development</p>
                        <p className="text-xs text-gray-500">React, Node, TypeScript, APIs</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.domain === 'Data Science Internship'
                          ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="domain"
                        value="Data Science Internship"
                        checked={formData.domain === 'Data Science Internship'}
                        onChange={handleChange}
                        className="text-orange-600 focus:ring-orange-500 mr-2.5"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Data Science</p>
                        <p className="text-xs text-gray-500">Python, SQL, ML, Analytics</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      Preferred Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
                    >
                      <option value="Hybrid">Hybrid (Remote + Periodic Review)</option>
                      <option value="Online">Online / Fully Remote</option>
                      <option value="Offline">Offline (Madanapalle, AP Office)</option>
                    </select>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      College / University <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="e.g. JNTU / SVCE"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      Degree, Branch & Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech CSE - 3rd Year"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>

                {/* Skills & Resume */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Relevant Skills & Technologies <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. JavaScript, React, HTML/CSS, Git, Python, SQL"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Resume Link (Google Drive / LinkedIn / GitHub) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/... or https://linkedin.com/in/..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Ensure link access permissions are set to "Anyone with the link can view".
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Brief Statement of Purpose / Projects (Optional)
                  </label>
                  <textarea
                    name="statement"
                    value={formData.statement}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Tell us briefly about any past projects or why you wish to join ForeFight Era..."
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  />
                </div>

                {/* Program Terms Reminder */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                  <p className="font-semibold flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                    Key Internship Parameters:
                  </p>
                  <p>• Duration: 3 Months • Stipend: ₹5,000 per month • Mode: Online / Offline / Hybrid</p>
                  <p>• Verified completion certificate & academic credits letter provided upon project completion.</p>
                </div>

                {/* Privacy and Consent */}
                <div className="flex items-start space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-gray-300"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-tight">
                    I declare that the information provided is accurate and agree to ForeFight Era Pvt. Ltd. processing my details solely for internship selection in accordance with the Privacy Policy.
                  </label>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-6 shadow-md"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="w-4 h-4 mr-1.5" />
                        Submit Application
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
