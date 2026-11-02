import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, FileText, Calendar, Clock, ArrowLeft, CheckCircle2, BookOpen, Download, Sparkles, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Program {
  id: string;
  title: string;
  about: string;
  price: string;
  duration: string;
  titleImageUrl: string;
  prerequisites: string[];
  learningObjectives: string[];
  videos: { title: string; url: string; description: string }[];
  recordedClasses: { 
    title: string; 
    url: string; 
    description: string;
    date: string;
    time: string;
  }[];
  resources: { title: string; url: string; type: 'pdf' | 'video' }[];
  tasks: {
    title: string;
    description: string;
    deadline: string;
    time: string;
  }[];
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) return;
        
        const courseDoc = await getDoc(doc(db, 'programs', courseId));
        if (!courseDoc.exists()) {
          toast.error('Course not found');
          return;
        }

        setCourse({ id: courseDoc.id, ...courseDoc.data() } as Program);
      } catch (error) {
        console.error('Failed to load course details:', error);
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#070a11]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm font-mono text-gray-400">Loading Enrolled Course Environment...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#070a11]">
        <div className="text-center bg-[#0c121e]/85 border border-white/[0.08] p-8 rounded-2xl max-w-md shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">The course you're looking for doesn't exist or you don't have active enrolled access.</p>
          <Link
            to="/profile"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
          >
            Return to Student Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a11] text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/profile"
          className="inline-flex items-center text-sm font-mono text-gray-400 hover:text-amber-400 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Student Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0c121e]/80 border border-white/[0.08] backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Course Hero Banner */}
          <div className="relative h-72 sm:h-80 w-full overflow-hidden">
            <img
              src={course.titleImageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c121e] via-[#0c121e]/70 to-transparent flex flex-col justify-end p-6 sm:p-10">
              <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-mono mb-3 w-fit">
                Active Enrolled Course
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
                {course.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-12">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#070a11]/70 border border-white/[0.06] p-5 rounded-xl">
                <div className="flex items-center text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                  <Clock className="w-4 h-4 mr-1.5" /> Program Duration
                </div>
                <p className="text-xl font-bold text-white">{course.duration}</p>
              </div>

              <div className="bg-[#070a11]/70 border border-white/[0.06] p-5 rounded-xl">
                <div className="flex items-center text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                  <BookOpen className="w-4 h-4 mr-1.5" /> Enrolled Status
                </div>
                <p className="text-xl font-bold text-white">Full Access Granted</p>
              </div>

              <div className="bg-[#070a11]/70 border border-white/[0.06] p-5 rounded-xl">
                <div className="flex items-center text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Prerequisites
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {course.prerequisites?.length > 0 ? course.prerequisites.join(', ') : 'None Required'}
                </p>
              </div>
            </div>

            {/* About & Objectives */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#070a11]/50 border border-white/[0.06] p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-amber-400 mr-2" /> About This Curriculum
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{course.about}</p>
              </div>

              <div className="bg-[#070a11]/50 border border-white/[0.06] p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mr-2" /> Learning Objectives
                </h2>
                <ul className="space-y-2 text-sm text-gray-300">
                  {course.learningObjectives?.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 mr-2.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Course Videos */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Play className="w-6 h-6 text-amber-400 mr-2" /> Course Technical Modules
                </h2>
                <span className="text-xs font-mono text-gray-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                  {course.videos?.length || 0} Modules
                </span>
              </div>

              {course.videos && course.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {course.videos.map((video, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      className="bg-[#070a11]/80 border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-5 transition-all shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-3 text-amber-400">
                            <Play className="w-4 h-4 fill-amber-400/20" />
                          </div>
                          <h3 className="font-bold text-white text-base line-clamp-1">{video.title}</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                          {video.description || 'Comprehensive module lecture and hands-on coding walkthrough.'}
                        </p>
                      </div>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-amber-500 hover:text-slate-950 border border-white/[0.08] hover:border-amber-500 text-xs font-semibold text-gray-200 transition-colors"
                      >
                        Launch Video Lecture &rarr;
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center text-sm text-gray-400">
                  No video modules uploaded yet. Check back soon.
                </div>
              )}
            </div>

            {/* Recorded Classes */}
            {course.recordedClasses && course.recordedClasses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Calendar className="w-6 h-6 text-amber-400 mr-2" /> Live Cohort Recordings
                  </h2>
                  <span className="text-xs font-mono text-gray-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                    {course.recordedClasses.length} Sessions
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {course.recordedClasses.map((class_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      className="bg-[#070a11]/80 border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-5 transition-all shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center mb-2">
                          <Calendar className="w-4 h-4 text-amber-400 mr-2" />
                          <h3 className="font-bold text-white text-base line-clamp-1">{class_.title}</h3>
                        </div>
                        <div className="flex items-center text-xs font-mono text-gray-400 mb-3">
                          <Clock className="w-3.5 h-3.5 mr-1 text-amber-500/70" />
                          <span>{class_.date} &bull; {class_.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 line-clamp-2">{class_.description}</p>
                      </div>
                      <a
                        href={class_.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-amber-500 hover:text-slate-950 border border-white/[0.08] hover:border-amber-500 text-xs font-semibold text-gray-200 transition-colors"
                      >
                        Access Recording &rarr;
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {course.resources && course.resources.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <FileText className="w-6 h-6 text-amber-400 mr-2" /> Lab Assets & Resources
                  </h2>
                  <span className="text-xs font-mono text-gray-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                    {course.resources.length} Assets
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {course.resources.map((resource, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      className="bg-[#070a11]/80 border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-5 transition-all shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-amber-400 mr-2" />
                            <h3 className="font-bold text-white text-sm line-clamp-1">{resource.title}</h3>
                          </div>
                          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono rounded">
                            {resource.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-gray-200 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 mr-2" /> Download Document
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignments / Tasks */}
            {course.tasks && course.tasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <CheckCircle2 className="w-6 h-6 text-amber-400 mr-2" /> Engineering Assignments
                  </h2>
                  <span className="text-xs font-mono text-gray-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                    {course.tasks.length} Deliverables
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {course.tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      className="bg-[#070a11]/80 border border-white/[0.08] rounded-xl p-5 shadow-lg"
                    >
                      <h3 className="font-bold text-white text-base mb-2">{task.title}</h3>
                      <div className="flex items-center text-xs font-mono text-amber-400/90 mb-3">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>Deadline: {task.deadline} {task.time ? `at ${task.time}` : ''}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{task.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
