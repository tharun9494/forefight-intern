import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim().toLowerCase(),
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phoneNumber.trim(),
        role: formData.role,
        createdAt: new Date().toISOString(),
        enrolledCourses: [],
        verified: formData.role === 'student'
      });

      toast.success('Account successfully registered!');
      navigate('/');
    } catch (error: unknown) {
      const errCode = error instanceof FirebaseError ? error.code : '';
      const errMsg = error instanceof Error ? error.message : 'Failed to create account. Please try again';
      switch (errCode) {
        case 'auth/email-already-in-use':
          toast.error('This email is already registered');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email address format');
          break;
        case 'auth/weak-password':
          toast.error('Password is too weak. Minimum 6 characters required');
          break;
        default:
          toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#070a11] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Architectural Studio Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[300px] bg-sky-900/[0.05] rounded-full blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-[#0a0f1b]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.12] shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-7 sm:p-9 relative overflow-hidden">
          {/* Top Amber Trim */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-inner">
              <UserPlus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">
              ForeFight Era Platform
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Join project cohorts, live mentoring, and accredited skill courses
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Email Address <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            {/* Phone & Role Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                  Account Role <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty / Mentor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Confirm Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 text-sm transition-all transform active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : 'Register Account'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center space-y-3">
            <p className="text-xs text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ForeFight Era Secure Authentication</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
