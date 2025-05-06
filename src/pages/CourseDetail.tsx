import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Play, Video, FileText, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  createdAt: string;
  updatedAt: string;
  students?: number;
  rating?: number;
}

const getYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { program: initialProgram } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; url: string; description: string } | null>(null);
  const [selectedRecordedClass, setSelectedRecordedClass] = useState<{ 
    title: string; 
    url: string; 
    description: string;
    date: string;
    time: string;
  } | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [videoCompletion, setVideoCompletion] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) {
        navigate('/programs');
        return;
      }

      try {
        if (initialProgram) {
          setProgram(initialProgram);
        } else {
          const programDoc = await getDoc(doc(db, 'programs', id));
          if (programDoc.exists()) {
            setProgram({ id: programDoc.id, ...programDoc.data() } as Program);
          } else {
            toast.error('Program not found');
            navigate('/programs');
          }
        }
      } catch (error) {
        console.error('Error fetching program:', error);
        toast.error('Failed to load program');
        navigate('/programs');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id, initialProgram, navigate]);

  useEffect(() => {
    if (program?.videos) {
      const initialCompletion: Record<string, boolean> = {};
      program.videos.forEach(video => {
        initialCompletion[video.title] = false;
      });
      setVideoCompletion(initialCompletion);
    }
  }, [program]);

  useEffect(() => {
    const completedCount = Object.values(videoCompletion).filter(Boolean).length;
    const totalVideos = program?.videos?.length || 0;
    setProgress(totalVideos > 0 ? Math.min((completedCount / totalVideos) * 100, 100) : 0);
  }, [videoCompletion, program]);

  const handleVideoCompletion = (videoTitle: string) => {
    setVideoCompletion(prev => ({
      ...prev,
      [videoTitle]: true,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Program not found</h2>
          <Button onClick={() => navigate('/programs')}>Return to Programs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Program Header */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={program.titleImageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
              alt={program.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center">
              <div className="max-w-3xl mx-auto text-center text-white p-8">
                <h1 className="text-4xl font-bold mb-4">{program.title}</h1>
                <div className="flex justify-center items-center space-x-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{program.students || 0} students</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    <span>{program.rating || 'No ratings'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-8 overflow-x-auto">
            <Button
              variant={activeTab === 'about' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('about')}
            >
              About
            </Button>
            <Button
              variant={activeTab === 'videos' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </Button>
            <Button
              variant={activeTab === 'recorded' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('recorded')}
            >
              Recorded Classes
            </Button>
            <Button
              variant={activeTab === 'resources' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </Button>
            <Button
              variant={activeTab === 'tasks' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'about' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">About This Program</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-6">{program.about}</p>
                    
                    <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
                    <ul className="list-disc list-inside text-gray-600 mb-6">
                      {program.prerequisites.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                    
                    <h3 className="text-xl font-semibold mb-3">Learning Objectives</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {program.learningObjectives.map((obj, index) => (
                        <li key={index}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Program Videos</h2>
                  
                  {/* Video Player */}
                  <div className="mb-6">
                    {selectedVideo ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-black">
                        {selectedVideo.url.includes('youtube.com') || selectedVideo.url.includes('youtu.be') ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            controls
                            className="w-full h-full"
                            src={selectedVideo.url}
                            onEnded={() => handleVideoCompletion(selectedVideo.title)}
                            onError={(e) => {
                              console.error('Video playback error:', e);
                              toast.error('Failed to play video. Please check the URL.');
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">Select a video to play</p>
                      </div>
                    )}
                  </div>

                  {/* Video List */}
                  <div className="space-y-3">
                    {program.videos.slice(0, showAllVideos ? program.videos.length : 5).map((video, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -2 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedVideo?.title === video.title
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (!video.url) {
                            toast.error('Video URL is missing');
                            return;
                          }
                          setSelectedVideo(video);
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                            <Play className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{video.title}</h3>
                            <p className="text-sm text-gray-600">{video.description}</p>
                          </div>
                          {videoCompletion[video.title] && (
                            <div className="ml-4 text-green-500">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {program.videos.length > 5 && (
                    <Button
                      variant="ghost"
                      className="mt-4"
                      onClick={() => setShowAllVideos(!showAllVideos)}
                    >
                      {showAllVideos ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </div>
              )}

              {activeTab === 'recorded' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Recorded Classes</h2>
                  
                  {/* Recorded Class Player */}
                  <div className="mb-6">
                    {selectedRecordedClass ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-black">
                        {selectedRecordedClass.url.includes('youtube.com') || selectedRecordedClass.url.includes('youtu.be') ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeId(selectedRecordedClass.url)}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            controls
                            className="w-full h-full"
                            src={selectedRecordedClass.url}
                            onError={(e) => {
                              console.error('Video playback error:', e);
                              toast.error('Failed to play recorded class. Please check the URL.');
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">Select a recorded class to play</p>
                      </div>
                    )}
                  </div>

                  {/* Recorded Classes List */}
                  <div className="space-y-3">
                    {program.recordedClasses.map((class_, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -2 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedRecordedClass?.title === class_.title
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (!class_.url) {
                            toast.error('Recorded class URL is missing');
                            return;
                          }
                          setSelectedRecordedClass(class_);
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                            <Play className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{class_.title}</h3>
                            <p className="text-sm text-gray-600">{class_.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{new Date(class_.date).toLocaleDateString()} at {class_.time}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Program Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                      >
                        {resource.type === 'pdf' ? (
                          <FileText className="w-6 h-6 text-indigo-600 mr-3" />
                        ) : (
                          <Video className="w-6 h-6 text-indigo-600 mr-3" />
                        )}
                        <div>
                          <h3 className="font-semibold">{resource.title}</h3>
                          <p className="text-sm text-gray-500">{resource.type.toUpperCase()}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Program Tasks</h2>
                  <div className="space-y-4">
                    {program.tasks.map((task, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -2 }}
                        className="p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                            <p className="text-gray-600 mb-3">{task.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>Deadline: {new Date(task.deadline).toLocaleDateString()} at {task.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Program Progress */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Program Progress</h2>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                        In Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                    <div
                      style={{ width: `${progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Program Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Program Information</h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{program.duration}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">${program.price}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-semibold">{program.students || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold">{program.rating || 'No ratings'}</span>
                  </li>
                </ul>
              </div>

              {/* Access Status */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Access Status</h2>
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Course access is managed by your administrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}