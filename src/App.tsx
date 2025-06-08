import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth';
import CourseAccessControl from '@/components/CourseAccessControl';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Blogs from './pages/Blogs';
import About from './pages/About';
import CourseDetail from './pages/CourseDetail';
import BlogDetail from './pages/BlogDetail';
import AdminDashboard from '@/pages/AdminDashboard';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { useEffect, useState } from 'react';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetails from '@/pages/CourseDetails';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          setIsAdmin(userData?.email === 'ontimittatharun2002@gmail.com');
        } else {
          setIsAdmin(false);
        }
      });

      return () => unsubscribe();
    };

    checkAdmin();
  }, []);   

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar isAdmin={isAdmin} />
          <div className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<CourseDetail />} />
              <Route path="/programs/course-detail" element={<CourseDetail />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin" element={
                <CourseAccessControl>
                  <AdminDashboard />
                </CourseAccessControl>
              } />
              <Route path="/courses/:courseId" element={
                <CourseAccessControl>
                  <CourseDetails />
                </CourseAccessControl>
              } />
            </Routes>
          </div>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;