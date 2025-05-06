import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Tag, BookOpen } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { doc, getDoc, collection, query, limit, getDocs, where } from 'firebase/firestore';
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

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id) return;
        
        const blogDoc = await getDoc(doc(db, 'blogs', id));
        if (blogDoc.exists()) {
          const blogData = { id: blogDoc.id, ...blogDoc.data() } as Blog;
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
          })) as Blog[];
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
    <div className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>

          {/* Blog Header */}
          <div className="mb-12">
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img
                src={blog.titleImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                alt={blog.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {blog.category}
              </span>
              <span className="text-gray-500 text-sm flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                5 min read
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-6 text-gray-900">{blog.title}</h1>
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-2" />
                  {blog.author}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                Share
              </Button>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {blog.matter.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* References */}
          {blog.references && (
            <div className="bg-gray-50 rounded-xl p-6 mb-12">
              <h3 className="text-xl font-bold mb-4 text-gray-900">References</h3>
              <div className="space-y-2">
                {blog.references.split('\n').map((reference, index) => (
                  <p key={index} className="text-gray-600">
                    {reference}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    <Link to={`/blogs/${post.id}`} className="block">
                      <img
                        src={post.titleImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{post.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
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