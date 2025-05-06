import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Star, Video, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';

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
  resources: { title: string; url: string; type: 'pdf' | 'video' }[];
  createdAt: string;
  updatedAt: string;
  students?: number;
  rating?: number;
  ratingCount?: number;
}

interface Video {
  title: string;
  url: string;
  thumbnail?: string;
  description: string;
}

interface VideoPreviewModalProps {
  video: Video;
  onClose: () => void;
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgramsAndEnrollments = async () => {
      try {
        const user = auth.currentUser;
        const querySnapshot = await getDocs(collection(db, 'programs'));
        const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
        const ratingsSnapshot = await getDocs(collection(db, 'ratings'));

        // Get all enrollments
        const enrollments = enrollmentsSnapshot.docs.map(doc => doc.data());
        
        // Get user's enrollments if logged in
        if (user) {
          const userEnrollmentsQuery = await getDocs(query(
            collection(db, 'enrollments'),
            where('userId', '==', user.uid)
          ));
          const userEnrollmentsData = userEnrollmentsQuery.docs.map(doc => doc.data().programId);
          setUserEnrollments(userEnrollmentsData);
        }

        // Get all ratings
        const ratings = ratingsSnapshot.docs.map(doc => doc.data());

        const programsData = querySnapshot.docs.map(doc => {
          const programId = doc.id;
          // Count students enrolled in this program
          const studentCount = enrollments.filter(e => e.programId === programId).length;
          // Calculate average rating for this program
          const programRatings = ratings.filter(r => r.programId === programId);
          const averageRating = programRatings.length > 0 
            ? (programRatings.reduce((acc, curr) => acc + curr.rating, 0) / programRatings.length).toFixed(1)
            : 0;

          return {
            id: programId,
            ...doc.data(),
            students: studentCount,
            rating: averageRating
          } as Program;
        });
        
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast.error('Failed to load programs');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramsAndEnrollments();
  }, []);

  const handleViewDetails = (programId: string) => {
    if (!auth.currentUser) {
      toast.error('Please login to view course details');
      return;
    }

    if (!userEnrollments.includes(programId)) {
      toast.error('You do not have access to this course. Please contact your administrator for access.');
      return;
    }

    const program = programs.find(p => p.id === programId);
    if (program) {
      navigate(`/programs/${programId}`, { state: { program } });
    }
  };

  const handleRating = async (programId: string, rating: number) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to rate this program');
        return;
      }

      // Check if user has already rated
      const ratingsRef = collection(db, 'ratings');
      const ratingQuery = await getDocs(ratingsRef);
      const existingRating = ratingQuery.docs.find(
        doc => doc.data().userId === user.uid && doc.data().programId === programId
      );

      if (existingRating) {
        toast.error('You have already rated this program');
        return;
      }

      // Add new rating
      await addDoc(collection(db, 'ratings'), {
        userId: user.uid,
        programId: programId,
        rating: rating,
        createdAt: new Date().toISOString()
      });

      toast.success('Thank you for rating!');
      // Refresh programs to update the rating
      window.location.reload();
    } catch (error) {
      console.error('Error rating program:', error);
      toast.error('Failed to submit rating');
    }
  };

  const VideoPreviewModal = ({ video, onClose }: VideoPreviewModalProps) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{video.title}</h3>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>
        <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4">
          <video
            src={video.url}
            controls
            className="w-full h-full"
            poster={video.thumbnail}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-gray-600 mb-4">{video.description}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-8">Our Programs</h1>
        {programs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No programs available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => {
              const hasAccess = userEnrollments.includes(program.id);
              return (
                <motion.div
                  key={program.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={program.titleImageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
                      alt={program.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-600">
                        {program.duration}
                      </span>
                    </div>
                    {!hasAccess && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{program.about}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                          <Clock className="w-4 h-4 mr-1 text-indigo-500" />
                          {program.duration}
                        </span>
                        <span className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                          <Users className="w-4 h-4 mr-1 text-indigo-500" />
                          {program.students || 0} students
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarRating
                          rating={parseFloat(program.rating?.toString() || '0')}
                          onRatingChange={(rating: number) => auth.currentUser && handleRating(program.id, rating)}
                          readOnly={!auth.currentUser}
                          size={16}
                        />
                        <span className="text-xs ml-1 text-gray-500 align-middle">
                          {program.rating && program.rating > 0
                            ? `${program.rating} (${program.ratingCount || 0} ratings)`
                            : 'No ratings yet'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">
                        ₹{program.price}
                      </span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleViewDetails(program.id)}
                        >
                          {hasAccess ? (
                            <>
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Access Required
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Video Preview Modal */}
      {selectedVideo && (
        <VideoPreviewModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}