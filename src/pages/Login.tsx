import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.email.trim() || !formData.password) {
        toast.error('Please enter both email and password');
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(
        auth,
        formData.email.trim().toLowerCase(),
        formData.password
      );
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error: unknown) {
      const errCode = error instanceof FirebaseError ? error.code : '';
      const errMsg = error instanceof Error ? error.message : 'Failed to log in. Please try again';
      switch (errCode) {
        case 'auth/user-not-found':
          toast.error('No account found with this email');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password');
          break;
        case 'auth/invalid-credential':
          toast.error('Invalid email or password. Please re-check your credentials.');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email format');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many failed attempts. Please try again later');
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
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[300px] bg-sky-900/[0.05] rounded-full blur-[130px]" />
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
              <LogIn className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">
              ForeFight Era Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Access project workspaces, coursework and internship dashboards
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
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

            {/* Password Field with Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                  Password <span className="text-amber-400">*</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
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

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 text-sm transition-all transform active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center space-y-3">
            <p className="text-xs text-gray-400">
              Don&apos;t have an account yet?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Create student account
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
