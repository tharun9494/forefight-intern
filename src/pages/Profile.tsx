import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, BookOpen, Award, Clock, WifiOff, Link as LinkIcon, Save, Edit3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
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
          navigate('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = {
            id: userDoc.id,
            ...userDoc.data()
          } as UserData;
          setUser(userData);
          setEditedUser(userData);
        } else {
          setError('User not found');
        }

        const enrollmentsRef = collection(db, 'enrollments');
        const q = query(enrollmentsRef, where('userId', '==', currentUser.uid));
        const enrollmentsSnapshot = await getDocs(q);

        const enrolledCoursesData = await Promise.all(
          enrollmentsSnapshot.docs.map(async (enrollmentDoc) => {
            const enrollmentData = enrollmentDoc.data();
            const programDoc = await getDoc(doc(db, 'programs', enrollmentData.programId));

            if (programDoc.exists()) {
              return {
                id: programDoc.id,
                title: programDoc.data().title,
                progress: enrollmentData.progress || 0,
                enrolledAt: enrollmentData.enrolledAt,
                enrollmentId: enrollmentDoc.id
              };
            }
            return null;
          })
        );

        setEnrolledCourses(
          enrolledCoursesData.filter((course): course is Course => course !== null)
        );
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
        if (!isOffline) {
          toast.error('Failed to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, isOffline]);

  const handlePhotoUrlSave = async () => {
    if (!photoUrl.trim()) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { profilePhoto: photoUrl.trim() });

      setUser(prev => prev ? { ...prev, profilePhoto: photoUrl.trim() } : null);
      setEditedUser(prev => prev ? { ...prev, profilePhoto: photoUrl.trim() } : null);
      setShowPhotoInput(false);
      setPhotoUrl('');

      toast.success('Profile photo updated!');
    } catch (err) {
      console.error('Error updating photo URL:', err);
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
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070a11]">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070a11] px-4">
        <div className="text-center p-8 bg-[#0c121e] rounded-3xl border border-white/10 max-w-md w-full">
          <p className="text-red-400 mb-4">{error || 'User not found'}</p>
          <Button onClick={() => navigate('/login')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#070a11] text-gray-100 min-h-screen">
      {isOffline && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 flex items-center space-x-2.5 text-amber-300 text-xs font-mono">
            <WifiOff className="h-4 w-4 shrink-0" />
            <span>You are currently offline. Cached data is displayed.</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Banner Card */}
        <div className="bg-[#0c121e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
          <div className="h-44 sm:h-52 bg-gradient-to-r from-amber-500/20 via-orange-600/30 to-[#070a11] relative border-b border-white/5">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 border border-white/10 text-amber-300">
                {user.role}
              </span>
            </div>
            {/* Avatar */}
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#111827] rounded-3xl flex items-center justify-center border-4 border-[#0c121e] shadow-2xl overflow-hidden group">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
                <button
                  onClick={() => setShowPhotoInput(true)}
                  className="absolute inset-0 bg-black/70 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Update photo"
                >
                  <LinkIcon className="w-5 h-5 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-7 px-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedUser?.fullName || ''}
                    onChange={(e) => setEditedUser(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                    className="text-2xl font-black w-full p-2 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">{user.role}</p>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user.fullName}</h1>
                  <p className="text-xs font-mono text-amber-400 uppercase tracking-wider mt-0.5">
                    ForeFight Era Verified Student
                  </p>
                </>
              )}
            </div>

            <div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-gray-200 hover:text-white hover:bg-white/5 rounded-xl text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveProfile}
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser(user);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Update Photo Modal */}
        {showPhotoInput && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#0c121e] rounded-3xl border border-white/10 p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Update Profile Photo URL</h3>
                <button
                  onClick={() => {
                    setShowPhotoInput(false);
                    setPhotoUrl('');
                  }}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#111827] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  onClick={() => {
                    setShowPhotoInput(false);
                    setPhotoUrl('');
                  }}
                  variant="outline"
                  className="border-white/10 text-gray-300 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePhotoUrlSave}
                  disabled={!photoUrl}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                >
                  Save Photo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Account Details */}
          <div className="space-y-6">
            <div className="bg-[#0c121e] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold">
                Student Credentials
              </h2>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-3 text-amber-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-3 text-amber-400 shrink-0" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser?.phone || ''}
                      onChange={(e) => setEditedUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-white/10 bg-[#111827] text-white text-xs focus:outline-none focus:border-amber-400"
                      placeholder="Phone number"
                    />
                  ) : (
                    <span>{user.phone || 'No phone added'}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-300 font-mono">
                  <Calendar className="w-4 h-4 mr-3 text-amber-400 shrink-0" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0c121e] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold">
                Progress Overview
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2.5 text-amber-400" />
                    <span>Courses Enrolled</span>
                  </div>
                  <span className="font-mono font-bold text-white">{enrolledCourses.length}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2.5 text-emerald-400" />
                    <span>Certificates</span>
                  </div>
                  <span className="font-mono font-bold text-white">0</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2.5 text-sky-400" />
                    <span>Sprint Hours</span>
                  </div>
                  <span className="font-mono font-bold text-white">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enrolled Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0c121e] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white tracking-tight">Active Enrolled Courses</h2>
                <span className="text-xs font-mono text-gray-400">{enrolledCourses.length} Assigned</span>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="text-center py-12 bg-[#080d16] rounded-2xl border border-dashed border-white/10 p-6 space-y-3">
                  <BookOpen className="w-10 h-10 text-gray-500 mx-auto" />
                  <p className="text-xs sm:text-sm text-gray-400">You haven&apos;t been assigned any course modules yet.</p>
                  <Button
                    onClick={() => navigate('/programs')}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs"
                  >
                    Explore Course Catalog
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-[#080d16] rounded-2xl p-5 border border-white/[0.08] hover:border-amber-400/30 transition-all flex flex-col justify-between"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <h3 className="text-base font-bold text-white">{course.title}</h3>
                        <span className="text-[11px] font-mono text-gray-400">
                          Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-mono">
                          <span>Syllabus Completion</span>
                          <span className="text-amber-400 font-bold">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-[#111827] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate(`/programs/${course.id}`)}
                        variant="outline"
                        size="sm"
                        className="w-full border-white/10 text-gray-200 hover:text-white hover:bg-white/5 rounded-xl text-xs"
                      >
                        Continue Learning Modules
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
