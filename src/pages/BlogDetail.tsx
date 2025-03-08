import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { doc, getDoc, collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id) return;
        
        const blogDoc = await getDoc(doc(db, 'blogs', id));
        if (blogDoc.exists()) {
          const blogData = { id: blogDoc.id, ...blogDoc.data() };
          setBlog(blogData);

          // Fetch related posts
          const relatedQuery = query(
            collection(db, 'blogs'),
            where('category', '==', blogData.category),
            where('__name__', '!=', id),
            limit(2)
          );
          const relatedSnapshot = await getDocs(relatedQuery);
          const relatedData = relatedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setRelatedPosts(relatedData);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <Link to="/blogs" className="text-indigo-600 hover:text-indigo-700">
            Return to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/blogs" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>

          {/* Blog Header */}
          <div className="mb-8">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img
                src={blog.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                alt={blog.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {blog.category}
              </span>
              <span className="text-gray-500 text-sm">5 min read</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-2" />
                  {blog.author}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Button variant="outline">Share</Button>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <Link to={`/blogs/${post.id}`}>
                      <img
                        src={post.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.content.substring(0, 150)}...</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}