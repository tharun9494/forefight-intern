import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Eye, EyeOff, ShieldCheck, Mail, Lock, User, Phone, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { auth, db } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: boolean;
}

export default function AuthModal({ isOpen, onClose, defaultMode = true }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'student',
  });

  // Client-side mount check for React Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep mode in sync with defaultMode prop when opened
  useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultMode);
    }
  }, [defaultMode, isOpen]);

  // Handle ESC key, focus trap/restore, and background scroll locking
  useEffect(() => {
    if (!isOpen) return;

    // Capture currently focused element to restore on close
    previousActiveElement.current = document.activeElement as HTMLElement | null;

    // Auto-focus email input after animation starts
    const timer = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 60);

    // Lock background scroll with scrollbar compensation to prevent layout shift
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
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.email.trim()) {
        toast.error('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      if (!isLogin) {
        if (!formData.fullName.trim()) {
          toast.error('Please enter your full name');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim().toLowerCase(),
          formData.password
        );

        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          role: formData.role,
          verified: formData.role === 'student',
          createdAt: new Date().toISOString(),
        });

        toast.success('Account successfully registered!');

        if (formData.role === 'faculty') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email.trim().toLowerCase(),
          formData.password
        );
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (userData && userData.role === 'faculty') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        toast.success('Welcome back!');
      }

      onClose();
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        role: 'student',
      });
    } catch (error: unknown) {
      const errCode = error instanceof FirebaseError ? error.code : '';
      const errMsg = error instanceof Error ? error.message : 'Authentication failed';
      switch (errCode) {
        case 'auth/user-not-found':
          toast.error('No account registered with this email');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password. Please try again');
          break;
        case 'auth/invalid-credential':
          toast.error('Invalid credentials. Check email and password');
          break;
        case 'auth/email-already-in-use':
          toast.error('This email is already registered');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address');
          break;
        case 'auth/weak-password':
          toast.error('Password is too weak. Use at least 6 characters');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many attempts. Please try again in a few minutes');
          break;
        default:
          toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const targetElement = document.getElementById('modal-root') || document.body;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
          {/* Centralized Backdrop Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Viewport Centering Flex Container with Guaranteed Padding */}
          <div
            className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md my-auto bg-[#0a0f1b] rounded-3xl border border-white/[0.12] shadow-[0_24px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
            >
              {/* Top Amber Brand Trim */}
              <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shrink-0" />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-gray-400 hover:text-white border border-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                aria-label="Close authentication dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable Container with Guaranteed Internal Scroll */}
              <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-6">
                {/* Header Branding */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-inner">
                    {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      ForeFight Era Identity
                    </span>
                    <h2 id="auth-modal-title" className="text-2xl font-black tracking-tight text-white">
                      {isLogin ? 'Sign In to Portal' : 'Create Student Account'}
                    </h2>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                      {isLogin
                        ? 'Access project repositories, course modules, and verifiable certificates'
                        : 'Join verified practical technology and data science cohorts'}
                    </p>
                  </div>
                </div>

                {/* Mode Toggle Switch */}
                <div className="flex p-1 bg-[#060a12] rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      isLogin
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      !isLogin
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    New Registration
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-300">
                          Full Name <span className="text-amber-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Role Selector */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-300">
                          Account Type <span className="text-amber-400">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer"
                          >
                            <option value="student">Student / Intern Candidate</option>
                            <option value="faculty">Faculty / Enterprise Mentor</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-300">
                      Official Email <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        ref={emailInputRef}
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    /* Phone */
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-300">
                        Phone Number <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10-digit mobile number"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728]/90 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-300">
                      Password <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
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

                  {/* Confirm Password (Registration Only) */}
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-300">
                        Confirm Password <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="••••••••"
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
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 text-sm transition-all transform active:scale-[0.99] disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </span>
                      ) : isLogin ? (
                        'Authenticate & Enter Portal'
                      ) : (
                        'Create Student Account'
                      )}
                    </Button>
                  </div>
                </form>

                {/* Sub-text Switch Link (Transitions without closing modal) */}
                <div className="text-center pt-1">
                  {isLogin ? (
                    <p className="text-xs text-gray-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 ml-1 transition-colors"
                      >
                        Create one now
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 ml-1 transition-colors"
                      >
                        Sign in here
                      </button>
                    </p>
                  )}
                </div>

                {/* Bottom Disclaimer */}
                <div className="pt-2 border-t border-white/[0.08] text-center">
                  <p className="text-[11px] text-gray-400 flex items-center justify-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>ForeFight Era Security • End-to-end encrypted session</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    targetElement
  );
}
