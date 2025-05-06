import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Latest Blog Posts
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of insightful articles and stay updated with the latest trends and knowledge.
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={blog.titleImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                      alt={blog.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-600">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{blog.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {blog.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <Link to={`/blogs/${blog.id}`}>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
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