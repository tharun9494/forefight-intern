import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CourseAccessControlProps {
  children: React.ReactNode;
  requiredCourseId?: string;
}

export default function CourseAccessControl({ children, requiredCourseId }: CourseAccessControlProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        if (!userData) {
          toast.error('User data not found');
          navigate('/');
          return;
        }

        // If no specific course is required, allow access
        if (!requiredCourseId) {
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        // Check if user has access to the required course
        const hasCourseAccess = userData.enrolledCourses?.includes(requiredCourseId);
        
        if (!hasCourseAccess) {
          toast.error('You do not have access to this course');
          navigate('/courses');
          return;
        }

        setHasAccess(true);
      } catch (error) {
        toast.error('Error checking course access');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user, requiredCourseId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
} 