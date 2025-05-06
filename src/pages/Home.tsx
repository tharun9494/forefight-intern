import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Trophy, Star, Clock, ChevronRight, Sparkles, Globe, Award, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';

interface Program {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  titleImageUrl?: string;
  image?: string;
  category?: string;
  rating?: number;
}

interface Blog {
  id: string;
  title: string;
  content?: string;
  titleImageUrl?: string;
  image?: string;
}

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Program[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  const bgImages = [
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1920&q=80", // Students studying
    "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=1920&q=80", // Books and laptop
    "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1920&q=80", // Library
    "https://images.unsplash.com/photo-1510936111840-6cef99faf2a9?auto=format&fit=crop&w=1920&q=80", // Study desk
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1920&q=80"  // Group study
  ];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const coursesQuery = query(
          collection(db, 'programs'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || '',
          description: doc.data().description || '',
          duration: doc.data().duration || '',
          titleImageUrl: doc.data().titleImageUrl || '',
          image: doc.data().image || '',
          category: doc.data().category || '',
          rating: doc.data().rating || 0,
        }));
        setFeaturedCourses(coursesData);

        const blogsQuery = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc'),
          limit(2)
        );
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogsData = blogsSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || '',
          content: doc.data().content || '',
          titleImageUrl: doc.data().titleImageUrl || '',
          image: doc.data().image || '',
        }));
        setLatestBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const checkLoginStatusAndFetchEnrollments = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      setIsLoggedIn(!!user);
      if (user) {
        // Fetch user enrollments
        const enrollmentsQuery = query(
          collection(db, 'enrollments'),
          where('userId', '==', user.uid)
        );
        const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
        const enrollments = enrollmentsSnapshot.docs.map(doc => doc.data().programId);
        setUserEnrollments(enrollments);
      } else {
        setUserEnrollments([]);
      }
    };
    checkLoginStatusAndFetchEnrollments();
  }, []);

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

      {/* Featured Courses */}
      {isLoggedIn && (
        <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Courses</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular courses and start your learning journey today.
              </p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {featuredCourses.map((course, index) => {
                  const hasAccess = userEnrollments.includes(course.id);
                  return (
                    <motion.div
                      key={course.id}
                      variants={item}
                      whileHover={{ y: -6 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden p-0"
                    >
                      <div className="relative">
                        <img
                          src={course.titleImageUrl || course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
                          alt={course.title}
                          className="w-full h-28 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-indigo-600">
                            {course.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-lg font-bold mb-1 line-clamp-1">{course.title}</h3>
                        <p className="text-gray-600 mb-2 text-sm line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-gray-500 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center text-yellow-500 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            <span>{course.rating || 4.5}</span>
                          </div>
                        </div>
                        {hasAccess ? (
                          <Link to={`/programs/${course.id}`}>
                            <Button className="w-full h-8 text-xs">
                              View Course
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        ) : (
                          <Button className="w-full h-8 text-xs" variant="outline" disabled>
                            <Lock className="mr-1 h-3 w-3" />
                            Access Required
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </section>
      )}

      {/* Latest Blogs */}
      {isLoggedIn && (
        <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Latest from Our Blog</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Stay updated with the latest trends and insights in education and technology.
              </p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {latestBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    variants={item}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden p-0"
                  >
                    <img
                      src={blog.titleImageUrl || blog.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                      alt={blog.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-lg font-bold mb-1 line-clamp-1">{blog.title}</h3>
                      <p className="text-gray-600 mb-2 text-sm line-clamp-2">{blog.content}</p>
                      <Link to={`/blogs/${blog.id}`}>
                        <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 h-8 text-xs">
                          Read More <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </section>
      )}
    </div>
  );
}