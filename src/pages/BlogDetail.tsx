import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, BookOpen, Share2, Sparkles, Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { doc, getDoc, collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id) return;
        
        const blogDoc = await getDoc(doc(db, 'blogs', id));
        if (blogDoc.exists()) {
          const blogData = { id: blogDoc.id, ...blogDoc.data() } as Blog;
          setBlog(blogData);

          // Fetch related posts
          try {
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
          } catch (relatedErr) {
            console.error('Error fetching related blogs:', relatedErr);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title || 'ForeFight Era Blog',
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch {
        // user cancelled or failed, fallback to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#070a11]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm font-mono text-gray-400">Loading ForeFight Technical Publication...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#070a11]">
        <div className="text-center bg-[#0c121e]/80 border border-white/[0.08] p-8 rounded-2xl max-w-md">
          <h2 className="text-2xl font-bold text-white mb-3">Publication Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">The article you are searching for does not exist or has been archived.</p>
          <Link to="/blogs">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold">
              Return to Engineering Blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#070a11] text-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Navigation */}
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-sm font-mono text-gray-400 hover:text-amber-400 mb-8 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            &larr; Back to Engineering Publications
          </Link>

          {/* Article Header */}
          <div className="mb-10">
            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden mb-8 border border-white/[0.08] bg-[#0c121e] shadow-2xl relative">
              <img
                src={blog.titleImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                alt={blog.title}
                className="w-full h-[360px] sm:h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a11] via-transparent to-transparent opacity-80" />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-mono font-medium">
                {blog.category}
              </span>
              <span className="text-gray-400 text-xs font-mono flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-500/70" />
                5 min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/[0.08] py-4">
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-2 text-amber-400 font-bold text-xs">
                    {blog.author ? blog.author.charAt(0).toUpperCase() : 'F'}
                  </div>
                  <span className="font-medium text-white">{blog.author || 'ForeFight Research'}</span>
                </div>
                <div className="flex items-center text-gray-400 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-500/70" />
                  {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-gray-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share Publication'}</span>
              </button>
            </div>
          </div>

          {/* Article Content / Matter */}
          <div className="mb-14">
            <div className="text-gray-300 text-base sm:text-lg leading-relaxed space-y-6 font-normal">
              {blog.matter ? (
                blog.matter.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-8">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>{blog.excerpt}</p>
              )}
            </div>
          </div>

          {/* References */}
          {blog.references && (
            <div className="bg-[#0c121e]/80 border border-white/[0.08] rounded-xl p-6 sm:p-8 mb-14 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-white flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-amber-400" /> References & Citations
              </h3>
              <div className="space-y-2 text-sm text-gray-400 font-mono">
                {blog.references.split('\n').map((reference, index) => (
                  <p key={index} className="break-words">
                    &bull; {reference}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Related Publications */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-white/[0.08] pt-12">
              <h2 className="text-2xl font-bold mb-8 text-white">Related Technical Publications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ y: -4 }}
                    className="bg-[#0c121e]/80 border border-white/[0.08] rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 group shadow-lg"
                  >
                    <Link to={`/blogs/${post.id}`} className="block">
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={post.titleImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 bg-black/70 backdrop-blur-md border border-white/10 text-amber-300 rounded text-[11px] font-mono">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                          <div className="flex items-center">
                            <User className="w-3.5 h-3.5 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
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
