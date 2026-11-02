import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Blog {
  id: string;
  title: string;
  titleImageUrl: string;
  excerpt: string;
  category: string;
  author: string;
  createdAt: string;
  matter: string;
  references: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const blogsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Blog[];
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070a11]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="py-14 sm:py-20 bg-[#070a11] text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Latest Engineering & Tech Insights
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Explore our collection of insightful technical articles and stay updated with modern engineering practices.
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-16 bg-[#0c121e] rounded-3xl border border-white/10 max-w-md mx-auto">
              <p className="text-gray-400 text-sm">No blog posts available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  whileHover={{ y: -4 }}
                  className="bg-[#0c121e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={blog.titleImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono font-medium text-amber-300">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2.5 text-white tracking-tight">{blog.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">{blog.excerpt}</p>

                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500 font-mono">
                        <div className="flex items-center">
                          <User className="w-3.5 h-3.5 mr-1 text-amber-400" />
                          {blog.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link to={`/blogs/${blog.id}`}>
                      <Button className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2.5 rounded-xl shadow-md text-xs">
                        Read Full Article
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
