import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, User, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import AuthModal from './AuthModal';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import logo1 from '../imgaes/logo1.png'

interface NavbarProps {
  isAdmin: boolean;
}

export default function Navbar({ isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo1} alt='ForeFight Era Logo' className="h-16 w-auto mt-0 opacity-90"></img>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
              ForeFight Era
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              item.highlight ? (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-md hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 border border-amber-300/40 ring-2 ring-orange-400/30"
                >
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-amber-100" />
                  <span>{item.name}</span>
                  <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wide bg-white/25 rounded-full">
                    Hiring
                  </span>
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'text-orange-600 font-semibold'
                      : 'text-gray-700 hover:text-orange-600 font-medium'
                  } transition-colors duration-200 text-sm`}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>{user.email?.split('@')[0]}</span>
                </Button>

                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-indigo-50"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navItems.map((item) => (
              item.highlight ? (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-md my-1"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-amber-100" />
                    {item.name}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    Apply Now
                  </span>
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAuthModal(true);
                  setIsOpen(false);
                }}
                className="w-full justify-center"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </motion.div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultMode={true}
      />
    </nav>
  );
}