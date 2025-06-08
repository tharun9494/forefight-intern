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

      {/* Certifications Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-yellow-600">Our Certifications</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recognized and approved by leading government bodies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-32 h-32 mx-auto mb-4">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Ministry_of_Corporate_Affairs_India.svg/1200px-Ministry_of_Corporate_Affairs_India.svg.png"
                  alt="MCA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">MCA Approved</h3>
              <p className="text-gray-600">Registered under Ministry of Corporate Affairs</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-32 h-32 mx-auto mb-4">
                <img 
                  src="https://5.imimg.com/data5/KS/RU/JK/SELLER-83054718/msme-certificate-500x500.jpg"
                  alt="MSME Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">MSME Registered</h3>
              <p className="text-gray-600">Recognized by Ministry of Micro, Small & Medium Enterprises</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-32 h-32 mx-auto mb-4">
                <img 
                  src="https://www.startupindia.gov.in/sih/themes/custom/startup_india/images/header-icons/DPIIT-header.png"
                  alt="DPIIT Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">DPIIT Recognized</h3>
              <p className="text-gray-600">Approved by Department for Promotion of Industry and Internal Trade</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Internship Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-yellow-600">🎯 PAID INTERNSHIP – MAY 2025 BATCH</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              🚀 Boost Your Career with In-Demand Tech Skills
            </p>
            <div className="mt-4 flex justify-center gap-4 text-lg">
              <span className="flex items-center">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                Each Course Only ₹899
              </span>
              <span className="flex items-center">
                <Award className="w-5 h-5 text-yellow-500 mr-2" />
                Internship Certificate
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-indigo-600">💡 Available Courses</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Machine Learning (ML)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>SQL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>UI/UX Design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Data Visualization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Data Analyst</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Generative AI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Frontend Development</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Python Programming</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Aptitude & Reasoning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>React JS</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-indigo-600">🌟 Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2 mt-1" />
                  <span>Internship + Certification</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2 mt-1" />
                  <span>100% Online – Flexible Learning</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2 mt-1" />
                  <span>Work on Live Projects</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2 mt-1" />
                  <span>Direct Hiring Opportunity for Top Performers</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2 mt-1" />
                  <span>StarFund Recognition for Top Performers</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2 mt-1" />
                  <span>Industrial Visits to Top Companies</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2 mt-1" />
                  <span>Tech & Networking Events</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2 mt-1" />
                  <span>45 Days Duration</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="text-center space-y-6">
            <div className="bg-yellow-50 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-yellow-600 mb-4">⚠️ Limited Slots Only!</h3>
              <p className="text-gray-700 mb-4">💥 Don't wait till it's full. Secure your seat now and level up!</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="https://forms.gle/VGtgpZUoke6YV79CA" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="https://chat.whatsapp.com/GeCZNnHqbf2Lckcc0lZijX" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                    Join WhatsApp Group
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="text-gray-600">
              <p>📞 Contact Us: +91 89194 03905</p>
              <p>📧 forefightera@gmail.com</p>
              <p className="mt-4 italic">👉 Join the workshop first. If you're satisfied, continue with the internship. No pressure, just opportunities!</p>
            </div>
          </div>
        </div>
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