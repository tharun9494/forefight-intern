import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Trophy, Star, Clock, ChevronRight, Sparkles, Globe, Award, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  const [bgIndex, setBgIndex] = useState(0);
  const bgImages = [
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1920&q=80", // Students studying
    "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=1920&q=80", // Books and laptop
    "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1920&q=80", // Library
    "https://images.unsplash.com/photo-1510936111840-6cef99faf2a9?auto=format&fit=crop&w=1920&q=80", // Study desk
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1920&q=80"  // Group study
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 8000); // Change every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            src={bgImages[bgIndex]}
            alt="Education Banner"
            className="w-full h-full object-cover absolute inset-0"
            style={{ zIndex: 0 }}
          />
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white py-32"
        >
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4"
            >
              Welcome to ForeFight Era
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-6xl font-bold mb-6 leading-tight"
            >
              Transform Your Future with Modern Learning
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl mb-8 text-white/90"
            >
              Access world-class education from anywhere. Learn at your own pace
              with expert-led courses in programming, design, and more.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex space-x-4"
            >
              <Link to="/programs">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
                  Explore Courses
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Move the floating cards section below */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative bg-gray-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={item}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-6 shadow-xl"
            >
              <Globe className="w-10 h-10 text-indigo-600 mb-4" />
              <h3
                className="text-xl font-extrabold mb-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg"
              >
                Global Learning
              </h3>
              <p className="text-gray-600">Connect with students worldwide and learn from industry experts.</p>
            </motion.div>
            
            <motion.div
              variants={item}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-6 shadow-xl"
            >
              <Sparkles className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">Engage with hands-on projects and real-world applications.</p>
            </motion.div>
            
            <motion.div
              variants={item}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-6 shadow-xl"
            >
              <Award className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Certified Courses</h3>
              <p className="text-gray-600">Earn recognized certificates upon course completion.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}