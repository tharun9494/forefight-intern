import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, FileText, Calendar, Clock } from 'lucide-react';
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
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Course Header */}
          <div className="relative h-64">
            <img
              src={course.titleImageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">{course.title}</h1>
            </div>
          </div>

          <div className="p-8">
            {/* Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-900">Duration</h3>
                <p className="text-indigo-700">{course.duration}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-900">Price</h3>
                <p className="text-indigo-700">${course.price}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-900">Prerequisites</h3>
                <ul className="list-disc list-inside text-indigo-700">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index}>{prerequisite}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Course Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-600">{course.about}</p>
            </div>

            {/* Learning Objectives */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
              <ul className="list-disc list-inside space-y-2">
                {course.learningObjectives.map((objective, index) => (
                  <li key={index} className="text-gray-600">{objective}</li>
                ))}
              </ul>
            </div>

            {/* Course Content */}
            <div className="space-y-8">
              {/* Videos */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Course Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.videos.map((video, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow p-4 border"
                    >
                      <div className="flex items-center mb-2">
                        <Play className="w-5 h-5 text-indigo-600 mr-2" />
                        <h3 className="font-semibold">{video.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 text-sm"
                      >
                        Watch Video →
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recorded Classes */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Recorded Classes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.recordedClasses.map((class_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow p-4 border"
                    >
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                        <h3 className="font-semibold">{class_.title}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{class_.date} at {class_.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{class_.description}</p>
                      <a
                        href={class_.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 text-sm"
                      >
                        Watch Recording →
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.resources.map((resource, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow p-4 border"
                    >
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                        <h3 className="font-semibold">{resource.title}</h3>
                      </div>
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600 mb-2">
                        {resource.type.toUpperCase()}
                      </span>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 text-sm block"
                      >
                        Download Resource →
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Assignments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow p-4 border"
                    >
                      <h3 className="font-semibold mb-2">{task.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Due: {task.deadline} at {task.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 