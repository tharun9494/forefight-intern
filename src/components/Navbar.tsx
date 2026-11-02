import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, User, Briefcase, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import AuthModal from './AuthModal';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import logo1 from '../imgaes/logo1.png';

interface NavbarProps {
  isAdmin: boolean;
}

export default function Navbar({ isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Internship', path: '/internship', highlight: true },
    { name: 'Contact Us', path: '/about#contact' },
  ];

  const handleNavClick = (path: string, e?: React.MouseEvent) => {
    setIsOpen(false);
    if (path.includes('#')) {
      const [targetPage, hash] = path.split('#');
      if (location.pathname === targetPage || (targetPage === '' && location.pathname === '/')) {
        const el = document.getElementById(hash);
        if (el) {
          e?.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-[#070b13]/85 backdrop-blur-xl z-50 border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <Link to="/" onClick={(e) => handleNavClick('/', e)} className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src={logo1}
                alt="ForeFight Era Logo"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                ForeFight Era
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-mono -mt-1 hidden sm:block">
                Technology Headquarters
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              item.highlight ? (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleNavClick(item.path, e)}
                  className="relative inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-amber-200 bg-amber-500/15 border border-amber-400/35 hover:bg-amber-500/25 hover:border-amber-400/50 shadow-sm transition-all duration-200 group"
                >
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-amber-400 transition-transform group-hover:-translate-y-0.5" />
                  <span>{item.name}</span>
                  <span className="ml-2 px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-wide bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                    Cohorts
                  </span>
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleNavClick(item.path, e)}
                  className={`relative text-xs lg:text-sm font-medium transition-colors duration-200 py-1 ${
                    location.pathname === item.path
                      ? 'text-amber-400 font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    />
                  )}
                </Link>
              )
            ))}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-200 hover:text-white border border-white/10 text-xs font-medium transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-[#0c121e] border border-white/10 rounded-2xl shadow-2xl py-2 z-[60] overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-[11px] text-gray-400">Signed in as</p>
                        <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 mr-2" />
                        Student Portal
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center px-4 py-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors font-medium"
                        >
                          <Briefcase className="w-3.5 h-3.5 mr-2" />
                          Admin Command
                        </Link>
                      )}
                      <div className="border-t border-white/5 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Portal Login</span>
              </Button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#070b13]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 overflow-hidden"
          >
            {navItems.map((item) => (
              item.highlight ? (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-amber-300 bg-amber-500/15 border border-amber-400/30"
                  onClick={(e) => handleNavClick(item.path, e)}
                >
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2.5 text-amber-400" />
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono bg-amber-400/20 px-2 py-0.5 rounded text-amber-300">
                    Active Cohorts
                  </span>
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-amber-400 bg-white/5 font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={(e) => handleNavClick(item.path, e)}
                >
                  {item.name}
                </Link>
              )
            ))}

            <div className="pt-2 border-t border-white/10">
              {user ? (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-amber-300 font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-2.5 rounded-xl shadow-lg cursor-pointer"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Portal Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={true}
      />
    </nav>
  );
}
