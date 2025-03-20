import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Blogs from './pages/Blogs';
import About from './pages/About';
import CourseDetail from './pages/CourseDetail';
import BlogDetail from './pages/BlogDetail';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { useEffect, useState } from 'react';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import CourseDetails2 from './pages/CourseDetails2';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          setIsAdmin(userData?.email === 'edufertechnologies@gmail.com');
        } else {
          setIsAdmin(false);
        }
      });

      return () => unsubscribe();
    };

    checkAdmin();
  }, []);   

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar isAdmin={isAdmin} />
        <div className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} /> 
            <Route path="/programs/:id" element={<CourseDetail />} />
            <Route path="/programs/course-detail" element={<CourseDetail />} />
            <Route path="/programs/courseDetail2" element={<CourseDetails2 />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
          </Routes>
        </div>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;