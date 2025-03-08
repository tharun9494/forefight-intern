import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, BookOpen, Award, MessageSquare, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db, storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  description?: string;
  aboutCourse?: string;
  prerequisites?: string;
  duration?: string;
  level?: string;
  price?: number;
  image?: string;
  videoContent?: any[];
  syllabus?: any[];
  assignments?: any[];
  resources?: any[];
  students?: number;
  rating?: number;
  learningObjectives?: string;
}

interface CourseDocument {
  id: string;
  title: string;
  path: string;
  url?: string;
}

export default function CourseDetails2() {
  const location = useLocation();
  const { course } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [pythonCode, setPythonCode] = useState('print("Hello, World!")');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you with your learning today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState<CourseDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Define your documents
        const courseDocuments: CourseDocument[] = [
          { id: '1', title: 'Class 1 - TUPLE', path: 'Content/class13.docx' },
          { id: '2', title: 'Class 2 - Lists', path: 'Content/class4.docx' },
          { id: '3', title: 'Class 3 - Dictionaries', path: 'Content/class7.docx' },
          { id: '3', title: 'Class 4 - basic', path: 'Conten/class8.docx' },
          

          // Add more documents as needed
        ];

        // Fetch URLs for all documents
        const docsWithUrls = await Promise.all(
          courseDocuments.map(async (doc) => {
            try {
              const docRef = ref(storage, doc.path);
              const url = await getDownloadURL(docRef);
              return { ...doc, url };
            } catch (error) {
              console.error(`Error fetching document ${doc.title}:`, error);
              return doc;
            }
          })
        );

        setDocuments(docsWithUrls);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to load documents');
      }
    };

    fetchDocuments();
    fetchVideoContent();
  }, []);

  // Fetch video content from Firebase Storage
  const fetchVideoContent = async () => {
    try {
      const videoDocuments: CourseDocument[] = [
        { id: '1', title: 'Introduction to Python', path: 'Videos/video1.mp4' },
        { id: '2', title: 'Python Variables & Data Types', path: 'Videos/video2.mp4' },
        { id: '3', title: 'Python ', path: 'Videos/video3.mp4' },
        // Add more video documents as needed
      ];

      // Fetch URLs for all videos
      const videosWithUrls = await Promise.all(
        videoDocuments.map(async (video) => {
          try {
            const videoRef = ref(storage, video.path);
            const url = await getDownloadURL(videoRef);
            return { ...video, url };
          } catch (error) {
            console.error(`Error fetching video ${video.title}:`, error);
            return video;
          }
        })
      );

      setCourse((prevCourse) => ({
        ...prevCourse,
        videoContent: videosWithUrls,
      }));
    } catch (error) {
      console.error('Error fetching video content:', error);
      toast.error('Failed to load video content');
    }
  };

  

  const VideoPlayer = ({ video }) => {
    const [quality, setQuality] = useState('720p'); // Default quality

    if (!video || !video.url) return null; // Ensure video URL is available

    return (
      <div className="bg-black rounded-lg overflow-hidden">
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="mb-2 p-2 border rounded"
        >
          <option value="360p">360p</option>
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
        <video
          controls
          className="w-full aspect-video"
          src={video.url} // Ensure the video URL is used here
          poster={video.thumbnail || "default-poster.jpg"} // Provide a default poster if none exists
        >
          Your browser does not support the video tag.
        </video>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
          <p className="text-gray-600">{video.description}</p>
        </div>
      </div>
    );
  };

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
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
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
          {/* Course Header */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center">
              <div className="max-w-3xl mx-auto text-center text-white p-8">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <div className="flex justify-center items-center space-x-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{course.students || 0} students</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    <span>{course.rating || 4.5}</span>
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
              variant={activeTab === 'content' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('content')}
            >
              Course Content
            </Button>
            <Button
              variant={activeTab === 'assignments' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('assignments')}
            >
              Assignments
            </Button>
            <Button
              variant={activeTab === 'resources' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </Button>
            <Button
              variant={activeTab === 'ide' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('ide')}
            >
              Python IDE
            </Button>
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('chat')}
            >
              Course Assistant
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'about' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-6">{course.aboutCourse || course.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
                    <p className="text-gray-600 mb-6">{course.prerequisites}</p>
                    
                    <h3 className="text-xl font-semibold mb-3">Learning Objectives</h3>
                    <p className="text-gray-600">{course.learningObjectives}</p>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                  
                  {/* Document Links */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Course Materials</h3>
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="mb-4">
                          <button
                            onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 w-full"
                          >
                            <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                            <span>{doc.title}</span>
                          </button>
                          
                          {selectedDoc === doc.id && doc.url && (
                            <div className="mt-4">
                              <iframe
                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`}
                                width="100%"
                                height="500px"
                                frameBorder="0"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Video Player */}
                  {selectedVideo && (
                    <div className="mb-6 relative">
                      <VideoPlayer video={selectedVideo} />
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-2 right-2 bg-red-0 text-white rounded-full p-2"
                      >
                        X
                      </button>
                    </div>
                  )}
                  
                  {/* Video List */}
                  <div className="space-y-4">
                    {course.videoContent?.map((video, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -2 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedVideo?.title === video.title
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                            <Play className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{video.title}</h3>
                            <p className="text-sm text-gray-600">{video.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Syllabus */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Course Syllabus</h3>
                    <div className="space-y-6">
                      {course.syllabus?.map((week, index) => (
                        <div key={index} className="border-b pb-4">
                          <h3 className="text-xl font-semibold mb-2">Week {week.week}: {week.topic}</h3>
                          <p className="text-gray-600">{week.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Assignments</h2>
                  <div className="space-y-6">
                    {course.assignments?.map((assignment, index) => (
                      <div key={index} className="border-b pb-4">
                        <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
                        <p className="text-gray-600 mb-2">{assignment.description}</p>
                        <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.resources?.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <BookOpen className="w-6 h-6 text-indigo-600 mr-3" />
                        <div>
                          <h3 className="font-semibold">{resource.title}</h3>
                          <p className="text-sm text-gray-500">{resource.type}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ide' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Python IDE</h2>
                  <div className="h-[500px] rounded-lg overflow-hidden">
                    <Editor
                      height="100%"
                      defaultLanguage="python"
                      value={pythonCode}
                      onChange={(value) => setPythonCode(value || '')}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <Button className="mt-4">Run Code</Button>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Course Assistant</h2>
                  <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1 p-2 border rounded-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Course Progress */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Course Progress</h2>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                        In Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        30%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                    <div
                      style={{ width: "30%" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Next Steps</h2>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                    Complete Module 2
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Award className="w-5 h-5 mr-2 text-indigo-600" />
                    Take Quiz 1
                  </li>
                </ul>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Course Information</h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{course.duration}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-semibold capitalize">{course.level}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">${course.price}</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full">Enroll Now</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
