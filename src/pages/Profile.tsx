import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, BookOpen, Award, Clock, WifiOff, Link, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  progress: number;
  enrolledAt: string;
  enrollmentId: string;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  profilePhoto?: string;
}

interface Enrollment {
  enrollmentId: string;
  userId: string;
  programId: string;
  progress: number;
  enrolledAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/');
          return;
        }

        setError(null);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (!userDoc.exists()) {
          setError('User profile not found');
          return;
        }

        const userData = userDoc.data() as UserData;
        setUser({ ...userData, id: userDoc.id });

        // Fetch enrolled courses
        const enrollmentsRef = collection(db, 'enrollments');
        const q = query(enrollmentsRef, where('userId', '==', currentUser.uid));
        const enrollmentsSnapshot = await getDocs(q);
        
        const enrollmentData = enrollmentsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            enrollmentId: doc.id,
            userId: data.userId,
            programId: data.programId,
            progress: data.progress || 0,
            enrolledAt: data.enrolledAt || new Date().toISOString()
          } as Enrollment;
        });

        // Fetch course details for each enrollment
        const coursePromises = enrollmentData.map(async (enrollment) => {
          try {
            const courseDoc = await getDoc(doc(db, 'programs', enrollment.programId));
            if (!courseDoc.exists()) {
              console.warn(`Course ${enrollment.programId} not found`);
              return null;
            }
            return {
              id: courseDoc.id,
              title: courseDoc.data().title,
              progress: enrollment.progress,
              enrolledAt: enrollment.enrolledAt,
              enrollmentId: enrollment.enrollmentId
            };
          } catch (err) {
            console.error(`Error fetching course ${enrollment.programId}:`, err);
            return null;
          }
        });

        const enrolledCoursesData = (await Promise.all(coursePromises))
          .filter((course): course is Course => course !== null);
        
        setEnrolledCourses(enrolledCoursesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
        if (!isOffline) {
          toast.error('Failed to load profile data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, isOffline]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handlePhotoUrlSave = async () => {
    if (!photoUrl) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Update user document with new photo URL
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { profilePhoto: photoUrl });
      
      // Update local state
      setUser(prev => prev ? { ...prev, profilePhoto: photoUrl } : null);
      setEditedUser(prev => prev ? { ...prev, profilePhoto: photoUrl } : null);
      setShowPhotoInput(false);
      setPhotoUrl('');
      
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error updating photo URL:', error);
      toast.error('Failed to update profile photo');
    }
  };

  const handleSaveProfile = async () => {
    if (!editedUser) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        fullName: editedUser.fullName,
        phone: editedUser.phone
      });

      setUser(editedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const startEditing = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedUser(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      {isOffline && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">
                You are currently offline. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Profile Header */}
          <motion.div
            variants={item}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="absolute -bottom-12 left-8">
                <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                  {user.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-600" />
                  )}
                  <button 
                    onClick={() => setShowPhotoInput(true)}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Link className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-16 pb-8 px-8">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editedUser?.fullName || ''}
                    onChange={(e) => setEditedUser(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                    className="text-3xl font-bold w-full p-2 border rounded"
                  />
                  <p className="text-gray-600">{user.role}</p>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                  <p className="text-gray-600">{user.role}</p>
                </>
              )}
            </div>
          </motion.div>

          {/* Photo URL Input Modal */}
          {showPhotoInput && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Update Profile Photo</h3>
                <div className="space-y-4">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => {
                        setShowPhotoInput(false);
                        setPhotoUrl('');
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePhotoUrlSave}
                      disabled={!photoUrl}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-1">
              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Personal Information</h2>
                  {!isEditing ? (
                    <Button onClick={startEditing} variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button onClick={handleSaveProfile} variant="default" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser?.phone || ''}
                        onChange={(e) => setEditedUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        className="flex-1 p-2 border rounded"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <span>{user.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4">Learning Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="w-5 h-5 mr-3" />
                      <span>Courses Enrolled</span>
                    </div>
                    <span className="font-semibold">{enrolledCourses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Award className="w-5 h-5 mr-3" />
                      <span>Certificates Earned</span>
                    </div>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3" />
                      <span>Hours Learned</span>
                    </div>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Enrolled Courses */}
              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
              >
                <h2 className="text-xl font-bold mb-4">Enrolled Courses</h2>
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                    <Button
                      onClick={() => navigate('/programs')}
                      className="mt-4"
                    >
                      Browse Courses
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    className="space-y-4"
                  >
                    {enrolledCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg shadow p-6 border"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <span className="text-sm text-gray-500">
                            Enrolled on {new Date(course.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/programs/${course.id}`)}
                          variant="outline"
                          className="w-full"
                        >
                          Continue Learning
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Achievements */}
              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4">Achievements</h2>
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Complete courses to earn achievements!</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}