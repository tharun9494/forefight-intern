import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, Bell, CheckCircle, Upload, Edit, Trash2, Download, Play, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db, storage } from '@/lib/firebase';
import { collection, query, getDocs, updateDoc, doc, addDoc, deleteDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';

interface Blog {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  excerpt: string;
  tags: string[];
  titleImageUrl: string;
  matter: string;
  references: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  verified: boolean;
  assignedPrograms?: string[];
  enrolledCourses?: string[];
}

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
}

interface Notification {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [newBlog, setNewBlog] = useState<Omit<Blog, 'id' | 'createdAt'>>({
    title: '',
    content: '',
    category: '',
    image: '',
    excerpt: '',
    tags: [],
    titleImageUrl: '',
    matter: '',
    references: ''
  });
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [newProgram, setNewProgram] = useState<Omit<Program, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    about: '',
    price: '',
    duration: '',
    titleImageUrl: '',
    prerequisites: [''],
    learningObjectives: [''],
    videos: [{ title: '', url: '', description: '' }],
    recordedClasses: [{ title: '', url: '', description: '', date: '', time: '' }],
    resources: [{ title: '', url: '', type: 'pdf' }],
    tasks: [{ title: '', description: '', deadline: '', time: '' }]
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error('Please login to access admin dashboard');
          navigate('/login');
          return;
        }

        // Get user data from Firestore
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('email', '==', user.email)
        ));

        const userData = userDoc.docs[0]?.data();
        console.log('User Data:', userData); // Debug log

        // Check if user exists and has faculty role
        if (!userData) {
          toast.error('User data not found');
          navigate('/');
          return;
        }

        // Check for faculty role
        if (userData.role !== 'faculty') {
          console.log('User role:', userData.role); // Debug log
          toast.error('Only faculty members can access the admin dashboard');
          navigate('/');
          return;
        }

        // If we get here, user is authenticated and is an admin
        console.log('Admin access granted'); // Debug log
        fetchUsers();
        fetchBlogs();
        fetchPrograms();
        fetchNotifications();
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error('Error checking admin status');
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersData = await Promise.all(snapshot.docs.map(async doc => {
        const userData = doc.data();
        
        // Fetch enrollments for this user
        const enrollmentsRef = collection(db, 'enrollments');
        const enrollmentsQuery = await getDocs(query(
          enrollmentsRef,
          where('userId', '==', doc.id)
        ));
        
        const enrolledCourses = enrollmentsQuery.docs.map(enrollment => enrollment.data().programId);
        
        return {
          id: doc.id,
          email: userData.email || '',
          fullName: userData.fullName || '',
          role: userData.role || 'student',
          verified: userData.verified || false,
          assignedPrograms: userData.assignedPrograms || [],
          enrolledCourses: enrolledCourses
        } as User;
      }));
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchBlogs = async () => {
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    const blogsData = snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '',
      content: doc.data().content || '',
      category: doc.data().category || '',
      image: doc.data().image || '',
      excerpt: doc.data().excerpt || '',
      tags: doc.data().tags || [],
      titleImageUrl: doc.data().titleImageUrl || '',
      matter: doc.data().matter || '',
      references: doc.data().references || '',
      createdAt: doc.data().createdAt || new Date().toISOString()
    })) as Blog[];
    setBlogs(blogsData);
  };

  const fetchPrograms = async () => {
    const programsRef = collection(db, 'programs');
    const snapshot = await getDocs(programsRef);
    const programsData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        about: data.about || '',
        price: data.price || '',
        duration: data.duration || '',
        titleImageUrl: data.titleImageUrl || '',
        prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [''],
        learningObjectives: Array.isArray(data.learningObjectives) ? data.learningObjectives : [''],
        videos: Array.isArray(data.videos) ? data.videos : [{ title: '', url: '', description: '' }],
        recordedClasses: Array.isArray(data.recordedClasses) ? data.recordedClasses : [{ title: '', url: '', description: '', date: '', time: '' }],
        resources: Array.isArray(data.resources) ? data.resources : [{ title: '', url: '', type: 'pdf' }],
        tasks: Array.isArray(data.tasks) ? data.tasks : [{ title: '', description: '', deadline: '', time: '' }],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
    }) as Program[];
    setPrograms(programsData);
  };

  const fetchNotifications = async () => {
    const notificationsRef = collection(db, 'contacts');
    const snapshot = await getDocs(notificationsRef);
    const notificationsData = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      email: doc.data().email || '',
      message: doc.data().message || '',
      createdAt: doc.data().createdAt || new Date().toISOString()
    })) as Notification[];
    setNotifications(notificationsData);
  };

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { verified: isVerified });
    fetchUsers();
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'blogs'), {
        ...newBlog,
        author: auth.currentUser?.email,
        createdAt: new Date().toISOString()
      });
      toast.success('Blog post added successfully!');
      setShowAddBlog(false);
      setNewBlog({
        title: '',
        content: '',
        category: '',
        image: '',
        excerpt: '',
        tags: [],
        titleImageUrl: '',
        matter: '',
        references: ''
      });
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to add blog post');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', blogId));
        toast.success('Blog post deleted successfully!');
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'programs'), {
        ...newProgram,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast.success('Program added successfully!');
      setShowAddProgram(false);
      setNewProgram({
        title: '',
        about: '',
        price: '',
        duration: '',
        titleImageUrl: '',
        prerequisites: [''],
        learningObjectives: [''],
        videos: [{ title: '', url: '', description: '' }],
        recordedClasses: [{ title: '', url: '', description: '', date: '', time: '' }],
        resources: [{ title: '', url: '', type: 'pdf' }],
        tasks: [{ title: '', description: '', deadline: '', time: '' }]
      });
      fetchPrograms();
    } catch (error) {
      toast.error('Failed to add program');
    }
  };

  const handleUpdateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    try {
      await updateDoc(doc(db, 'programs', editingProgram.id), {
        ...editingProgram,
        updatedAt: new Date().toISOString()
      });
      toast.success('Program updated successfully!');
      setEditingProgram(null);
      fetchPrograms();
    } catch (error) {
      toast.error('Failed to update program');
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await deleteDoc(doc(db, 'programs', programId));
        toast.success('Program deleted successfully!');
        fetchPrograms();
      } catch (error) {
        toast.error('Failed to delete program');
      }
    }
  };

  const addVideo = () => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        videos: [...editingProgram.videos, { title: '', url: '', description: '' }]
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        videos: [...prev.videos, { title: '', url: '', description: '' }]
      }));
    }
  };

  const removeVideo = (index: number) => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        videos: editingProgram.videos.filter((_, i) => i !== index)
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };

  const addResource = () => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        resources: [...editingProgram.resources, { title: '', url: '', type: 'pdf' }]
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        resources: [...prev.resources, { title: '', url: '', type: 'pdf' }]
      }));
    }
  };

  const removeResource = (index: number) => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        resources: editingProgram.resources.filter((_, i) => i !== index)
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        resources: prev.resources.filter((_, i) => i !== index)
      }));
    }
  };

  const addPrerequisite = () => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        prerequisites: [...editingProgram.prerequisites, '']
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, '']
      }));
    }
  };

  const removePrerequisite = (index: number) => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        prerequisites: editingProgram.prerequisites.filter((_, i) => i !== index)
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        prerequisites: prev.prerequisites.filter((_, i) => i !== index)
      }));
    }
  };

  const addLearningObjective = () => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        learningObjectives: [...editingProgram.learningObjectives, '']
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, '']
      }));
    }
  };

  const removeLearningObjective = (index: number) => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        learningObjectives: editingProgram.learningObjectives.filter((_, i) => i !== index)
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
      }));
    }
  };

  const addRecordedClass = () => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        recordedClasses: [...editingProgram.recordedClasses, { title: '', url: '', description: '', date: '', time: '' }]
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        recordedClasses: [...prev.recordedClasses, { title: '', url: '', description: '', date: '', time: '' }]
      }));
    }
  };

  const removeRecordedClass = (index: number) => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        recordedClasses: editingProgram.recordedClasses.filter((_, i) => i !== index)
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        recordedClasses: prev.recordedClasses.filter((_, i) => i !== index)
      }));
    }
  };

  const addTask = () => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        tasks: [...editingProgram.tasks, { title: '', description: '', deadline: '', time: '' }]
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        tasks: [...prev.tasks, { title: '', description: '', deadline: '', time: '' }]
      }));
    }
  };

  const removeTask = (index: number) => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        tasks: editingProgram.tasks.filter((_, i) => i !== index)
      });
    } else {
      setNewProgram(prev => ({
        ...prev,
        tasks: prev.tasks.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOpenAssignModal = (user: User) => {
    setSelectedUser(user);
    const currentAccess = user.enrolledCourses || [];
    setSelectedPrograms(currentAccess);
    setShowAssignModal(true);
  };

  const handleAssignPrograms = async () => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      
      // Update assigned programs and enrolled courses
      await updateDoc(userRef, { 
        assignedPrograms: selectedPrograms,
        enrolledCourses: selectedPrograms // This ensures only assigned courses are accessible
      });

      // Handle enrollments
      const enrollmentsRef = collection(db, 'enrollments');
      const existingEnrollmentsQuery = await getDocs(query(
        enrollmentsRef,
        where('userId', '==', selectedUser.id)
      ));
      
      // Get existing enrollment IDs
      const existingEnrollments = existingEnrollmentsQuery.docs.map(doc => doc.data().programId);
      
      // Add new enrollments for newly assigned courses
      for (const programId of selectedPrograms) {
        if (!existingEnrollments.includes(programId)) {
          await addDoc(enrollmentsRef, {
            userId: selectedUser.id,
            programId: programId,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            status: 'active',
            accessGranted: true // Add access control flag
          });
        }
      }

      // Remove enrollments and access for unselected courses
      for (const enrollment of existingEnrollmentsQuery.docs) {
        const enrollmentData = enrollment.data();
        if (!selectedPrograms.includes(enrollmentData.programId)) {
          // Delete the enrollment to remove access
          await deleteDoc(doc(db, 'enrollments', enrollment.id));
        }
      }

      toast.success('Course access updated successfully!');
      setShowAssignModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating course access:', error);
      toast.error('Failed to update course access');
    }
  };

  const updateUserToFaculty = async (email: string) => {
    try {
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        toast.error('User not found');
        return;
      }

      const userDoc = userSnapshot.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), {
        role: 'faculty'
      });

      toast.success('User role updated to faculty');
      // Refresh the page to apply changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <Button onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <Users className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="text-xl font-bold">{users.length}</h3>
              <p className="text-sm text-gray-600">Total Users</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <BookOpen className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="text-xl font-bold">{blogs.length}</h3>
              <p className="text-sm text-gray-600">Total Blogs</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <Bell className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="text-xl font-bold">{notifications.length}</h3>
              <p className="text-sm text-gray-600">Notifications</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <FileText className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="text-xl font-bold">{programs.length}</h3>
              <p className="text-sm text-gray-600">Total Programs</p>
            </motion.div>
          </div>

          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button
              variant={activeTab === 'blogs' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('blogs')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Blogs
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button
              variant={activeTab === 'programs' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('programs')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Programs
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">User Management</h2>
                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Users
                    </Button>
                  </div>
                </div>
                <div className="mb-4">
                  <Button
                    onClick={() => {
                      const email = prompt('Enter the email of the user to make faculty:');
                      if (email) {
                        updateUserToFaculty(email);
                      }
                    }}
                    variant="outline"
                  >
                    Make User Faculty
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled Courses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.enrolledCourses?.length || 0} courses
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {user.enrolledCourses?.map(courseId => {
                                const course = programs.find(p => p.id === courseId);
                                return course?.title;
                              }).filter(Boolean).join(', ') || 'No courses enrolled'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button
                              onClick={() => handleVerifyUser(user.id, !user.verified)}
                              variant="outline"
                              size="sm"
                              className="mr-2"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {user.verified ? 'Unverify' : 'Verify'}
                            </Button>
                            <Button
                              onClick={() => handleOpenAssignModal(user)}
                              variant="outline"
                              size="sm"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Manage Courses
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Blog Management</h2>
                  <Button onClick={() => setShowAddBlog(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Add Blog Post
                  </Button>
                </div>

                {showAddBlog && (
                  <div className="mb-6">
                    <form onSubmit={handleAddBlog} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
                          <input
                            type="text"
                            placeholder="Enter blog title"
                            className="w-full p-2 border rounded"
                            value={newBlog.title}
                            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <input
                            type="text"
                            placeholder="Enter category"
                            className="w-full p-2 border rounded"
                            value={newBlog.category}
                            onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title Image URL</label>
                        <input
                          type="url"
                          placeholder="Enter title image URL"
                          className="w-full p-2 border rounded"
                          value={newBlog.titleImageUrl}
                          onChange={(e) => setNewBlog({ ...newBlog, titleImageUrl: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                        <textarea
                          placeholder="Enter a brief excerpt"
                          className="w-full p-2 border rounded h-20"
                          value={newBlog.excerpt}
                          onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
                        <textarea
                          placeholder="Enter the main content"
                          className="w-full p-2 border rounded h-40"
                          value={newBlog.matter}
                          onChange={(e) => setNewBlog({ ...newBlog, matter: e.target.value })}
                          required
                        />
                      </div>
 
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">References</label>
                        <textarea
                          placeholder="Enter references (one per line)"
                          className="w-full p-2 border rounded h-20"
                          value={newBlog.references}
                          onChange={(e) => setNewBlog({ ...newBlog, references: e.target.value })}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowAddBlog(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Blog Post</Button>
                      </div>
                    </form>
                  </div>
                )}

                {editingBlog && (
                  <div className="mb-6">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          await updateDoc(doc(db, 'blogs', editingBlog.id), {
                            ...editingBlog,
                            updatedAt: new Date().toISOString(),
                          });
                          toast.success('Blog updated successfully!');
                          setEditingBlog(null);
                          fetchBlogs();
                        } catch (error) {
                          toast.error('Failed to update blog');
                        }
                      }}
                      className="space-y-4"
                    >
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editingBlog.title}
                        onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editingBlog.category}
                        onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                        required
                      />
                      <input
                        type="url"
                        className="w-full p-2 border rounded"
                        value={editingBlog.titleImageUrl}
                        onChange={(e) => setEditingBlog({ ...editingBlog, titleImageUrl: e.target.value })}
                        required
                      />
                      <textarea
                        className="w-full p-2 border rounded h-20"
                        value={editingBlog.excerpt}
                        onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                        required
                      />
                      <textarea
                        className="w-full p-2 border rounded h-40"
                        value={editingBlog.matter}
                        onChange={(e) => setEditingBlog({ ...editingBlog, matter: e.target.value })}
                        required
                      />
                      <textarea
                        className="w-full p-2 border rounded h-20"
                        value={editingBlog.references}
                        onChange={(e) => setEditingBlog({ ...editingBlog, references: e.target.value })}
                      />
                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEditingBlog(null)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Update Blog</Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {blogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow p-4 border"
                    >
                      <div className="mb-3">
                        {blog.titleImageUrl && (
                          <img 
                            src={blog.titleImageUrl} 
                            alt={blog.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="text-base font-bold mb-1 line-clamp-2">{blog.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blog.excerpt}</p>
                        <div className="text-xs text-gray-500 mb-2">
                          Category: {blog.category}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-indigo-600 font-semibold">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBlog(blog)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Program Management</h2>
                  <Button onClick={() => setShowAddProgram(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Program
                  </Button>
                </div>

                {(showAddProgram || editingProgram) && (
                  <div className="mb-6">
                    <form onSubmit={editingProgram ? handleUpdateProgram : handleAddProgram} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
                        <input
                          type="text"
                          placeholder="Enter program title"
                          className="w-full p-2 border rounded"
                          value={editingProgram ? editingProgram.title : newProgram.title}
                          onChange={(e) => editingProgram
                            ? setEditingProgram({ ...editingProgram, title: e.target.value })
                            : setNewProgram({ ...newProgram, title: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">About Program</label>
                        <textarea
                          placeholder="Enter program description"
                          className="w-full p-2 border rounded h-32"
                          value={editingProgram ? editingProgram.about : newProgram.about}
                          onChange={(e) => editingProgram
                            ? setEditingProgram({ ...editingProgram, about: e.target.value })
                            : setNewProgram({ ...newProgram, about: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                          type="text"
                          placeholder="Enter program price"
                          className="w-full p-2 border rounded"
                          value={editingProgram ? editingProgram.price : newProgram.price}
                          onChange={(e) => editingProgram
                            ? setEditingProgram({ ...editingProgram, price: e.target.value })
                            : setNewProgram({ ...newProgram, price: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          placeholder="Enter program duration (e.g., 3 months)"
                          className="w-full p-2 border rounded"
                          value={editingProgram ? editingProgram.duration : newProgram.duration}
                          onChange={(e) => editingProgram
                            ? setEditingProgram({ ...editingProgram, duration: e.target.value })
                            : setNewProgram({ ...newProgram, duration: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title Image URL</label>
                        <input
                          type="url"
                          placeholder="Enter program title image URL"
                          className="w-full p-2 border rounded"
                          value={editingProgram ? editingProgram.titleImageUrl : newProgram.titleImageUrl}
                          onChange={(e) => editingProgram
                            ? setEditingProgram({ ...editingProgram, titleImageUrl: e.target.value })
                            : setNewProgram({ ...newProgram, titleImageUrl: e.target.value })
                          }
                        />
                        {editingProgram?.titleImageUrl || newProgram.titleImageUrl ? (
                          <div className="mt-2">
                            <img 
                              src={editingProgram?.titleImageUrl || newProgram.titleImageUrl} 
                              alt="Title preview" 
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
                        {(editingProgram ? editingProgram.prerequisites : newProgram.prerequisites).map((req, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Enter prerequisite"
                              className="flex-1 p-2 border rounded"
                              value={req}
                              onChange={(e) => {
                                const newReqs = [...(editingProgram ? editingProgram.prerequisites : newProgram.prerequisites)];
                                newReqs[index] = e.target.value;
                                editingProgram
                                  ? setEditingProgram({ ...editingProgram, prerequisites: newReqs })
                                  : setNewProgram({ ...newProgram, prerequisites: newReqs });
                              }}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => editingProgram
                                ? setEditingProgram({ ...editingProgram, prerequisites: editingProgram.prerequisites.filter((_, i) => i !== index) })
                                : removePrerequisite(index)
                              }
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editingProgram
                            ? setEditingProgram({ ...editingProgram, prerequisites: [...editingProgram.prerequisites, ''] })
                            : addPrerequisite()
                          }
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Prerequisite
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Learning Objectives</label>
                        {(editingProgram ? editingProgram.learningObjectives : newProgram.learningObjectives).map((obj, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Enter learning objective"
                              className="flex-1 p-2 border rounded"
                              value={obj}
                              onChange={(e) => {
                                const newObjs = [...(editingProgram ? editingProgram.learningObjectives : newProgram.learningObjectives)];
                                newObjs[index] = e.target.value;
                                editingProgram
                                  ? setEditingProgram({ ...editingProgram, learningObjectives: newObjs })
                                  : setNewProgram({ ...newProgram, learningObjectives: newObjs });
                              }}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => editingProgram
                                ? setEditingProgram({ ...editingProgram, learningObjectives: editingProgram.learningObjectives.filter((_, i) => i !== index) })
                                : removeLearningObjective(index)
                              }
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editingProgram
                            ? setEditingProgram({ ...editingProgram, learningObjectives: [...editingProgram.learningObjectives, ''] })
                            : addLearningObjective()
                          }
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Learning Objective
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Videos</label>
                        {(editingProgram ? editingProgram.videos : newProgram.videos).map((video, index) => (
                          <div key={index} className="border p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Video Title"
                                className="flex-1 p-2 border rounded"
                                value={video.title}
                                onChange={(e) => {
                                  const newVideos = [...(editingProgram ? editingProgram.videos : newProgram.videos)];
                                  newVideos[index] = { ...newVideos[index], title: e.target.value };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, videos: newVideos })
                                    : setNewProgram({ ...newProgram, videos: newVideos });
                                }}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => editingProgram
                                  ? setEditingProgram({ ...editingProgram, videos: editingProgram.videos.filter((_, i) => i !== index) })
                                  : removeVideo(index)
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <input
                              type="url"
                              placeholder="YouTube Video URL"
                              className="w-full p-2 border rounded mb-2"
                              value={video.url}
                              onChange={(e) => {
                                const newVideos = [...(editingProgram ? editingProgram.videos : newProgram.videos)];
                                newVideos[index] = { ...newVideos[index], url: e.target.value };
                                editingProgram
                                  ? setEditingProgram({ ...editingProgram, videos: newVideos })
                                  : setNewProgram({ ...newProgram, videos: newVideos });
                              }}
                              required
                            />
                            <textarea
                              placeholder="Video Description"
                              className="w-full p-2 border rounded"
                              value={video.description}
                              onChange={(e) => {
                                const newVideos = [...(editingProgram ? editingProgram.videos : newProgram.videos)];
                                newVideos[index] = { ...newVideos[index], description: e.target.value };
                                editingProgram
                                  ? setEditingProgram({ ...editingProgram, videos: newVideos })
                                  : setNewProgram({ ...newProgram, videos: newVideos });
                              }}
                              required
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editingProgram
                            ? setEditingProgram({ ...editingProgram, videos: [...editingProgram.videos, { title: '', url: '', description: '' }] })
                            : addVideo()
                          }
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Video
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recorded Classes</label>
                        {(editingProgram ? editingProgram.recordedClasses : newProgram.recordedClasses).map((class_, index) => (
                          <div key={index} className="border p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Class Title"
                                className="flex-1 p-2 border rounded"
                                value={class_.title}
                                onChange={(e) => {
                                  const newClasses = [...(editingProgram ? editingProgram.recordedClasses : newProgram.recordedClasses)];
                                  newClasses[index] = { ...newClasses[index], title: e.target.value };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, recordedClasses: newClasses })
                                    : setNewProgram({ ...newProgram, recordedClasses: newClasses });
                                }}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => editingProgram
                                  ? setEditingProgram({ ...editingProgram, recordedClasses: editingProgram.recordedClasses.filter((_, i) => i !== index) })
                                  : removeRecordedClass(index)
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <input
                                type="date"
                                placeholder="Class Date"
                                className="p-2 border rounded"
                                value={class_.date}
                                onChange={(e) => {
                                  const newClasses = [...(editingProgram ? editingProgram.recordedClasses : newProgram.recordedClasses)];
                                  newClasses[index] = { ...newClasses[index], date: e.target.value };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, recordedClasses: newClasses })
                                    : setNewProgram({ ...newProgram, recordedClasses: newClasses });
                                }}
                                required
                              />
                              <input
                                type="time"
                                placeholder="Class Time"
                                className="p-2 border rounded"
                                value={class_.time}
                                onChange={(e) => {
                                  const newClasses = [...(editingProgram ? editingProgram.recordedClasses : newProgram.recordedClasses)];
                                  newClasses[index] = { ...newClasses[index], time: e.target.value };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, recordedClasses: newClasses })
                                    : setNewProgram({ ...newProgram, recordedClasses: newClasses });
                                }}
                                required
                              />
                            </div>
                            <input
                              type="url"
                              placeholder="Recorded Class URL"
                              className="w-full p-2 border rounded mb-2"
                              value={class_.url}
                              onChange={(e) => {
                                const newClasses = [...(editingProgram ? editingProgram.recordedClasses : newProgram.recordedClasses)];
                                newClasses[index] = { ...newClasses[index], url: e.target.value };
                                editingProgram
                                  ? setEditingProgram({ ...editingProgram, recordedClasses: newClasses })
                                  : setNewProgram({ ...newProgram, recordedClasses: newClasses });
                              }}
                              required
                            />
                            <textarea
                              placeholder="Class Description"
                              className="w-full p-2 border rounded"
                              value={class_.description}
                              onChange={(e) => {
                                const newClasses = [...(editingProgram ? editingProgram.recordedClasses : newProgram.recordedClasses)];
                                newClasses[index] = { ...newClasses[index], description: e.target.value };
                                editingProgram
                                  ? setEditingProgram({ ...editingProgram, recordedClasses: newClasses })
                                  : setNewProgram({ ...newProgram, recordedClasses: newClasses });
                              }}
                              required
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editingProgram
                            ? setEditingProgram({ ...editingProgram, recordedClasses: [...editingProgram.recordedClasses, { title: '', url: '', description: '', date: '', time: '' }] })
                            : addRecordedClass()
                          }
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Recorded Class
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resources</label>
                        {(editingProgram ? editingProgram.resources : newProgram.resources).map((resource, index) => (
                          <div key={index} className="border p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Resource Title"
                                className="flex-1 p-2 border rounded"
                                value={resource.title}
                                onChange={(e) => {
                                  const newResources = [...(editingProgram ? editingProgram.resources : newProgram.resources)];
                                  newResources[index] = { ...newResources[index], title: e.target.value };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, resources: newResources })
                                    : setNewProgram({ ...newProgram, resources: newResources });
                                }}
                                required
                              />
                              <select
                                className="p-2 border rounded"
                                value={resource.type}
                                onChange={(e) => {
                                  const newResources = [...(editingProgram ? editingProgram.resources : newProgram.resources)];
                                  newResources[index] = { ...newResources[index], type: e.target.value as 'pdf' | 'video' };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, resources: newResources })
                                    : setNewProgram({ ...newProgram, resources: newResources });
                                }}
                              >
                                <option value="pdf">PDF</option>
                                <option value="video">Video</option>
                              </select>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => editingProgram
                                  ? setEditingProgram({ ...editingProgram, resources: editingProgram.resources.filter((_, i) => i !== index) })
                                  : removeResource(index)
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <input
                              type="url"
                              placeholder="Resource URL"
                              className="w-full p-2 border rounded"
                              value={resource.url}
                              onChange={(e) => {
                                const newResources = [...(editingProgram ? editingProgram.resources : newProgram.resources)];
                                newResources[index] = { ...newResources[index], url: e.target.value };
                                editingProgram
                                  ? setEditingProgram({ ...editingProgram, resources: newResources })
                                  : setNewProgram({ ...newProgram, resources: newResources });
                              }}
                              required
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editingProgram
                            ? setEditingProgram({ ...editingProgram, resources: [...editingProgram.resources, { title: '', url: '', type: 'pdf' }] })
                            : addResource()
                          }
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Resource
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tasks</label>
                        {(editingProgram ? editingProgram.tasks : newProgram.tasks).map((task, index) => (
                          <div key={index} className="border p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Task Title"
                                className="flex-1 p-2 border rounded"
                                value={task.title}
                                onChange={(e) => {
                                  const newTasks = [...(editingProgram ? editingProgram.tasks : newProgram.tasks)];
                                  newTasks[index] = { ...newTasks[index], title: e.target.value };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, tasks: newTasks })
                                    : setNewProgram({ ...newProgram, tasks: newTasks });
                                }}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => editingProgram
                                  ? setEditingProgram({ ...editingProgram, tasks: editingProgram.tasks.filter((_, i) => i !== index) })
                                  : removeTask(index)
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <input
                                type="date"
                                placeholder="Task Deadline"
                                className="p-2 border rounded"
                                value={task.deadline}
                                onChange={(e) => {
                                  const newTasks = [...(editingProgram ? editingProgram.tasks : newProgram.tasks)];
                                  newTasks[index] = { ...newTasks[index], deadline: e.target.value };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, tasks: newTasks })
                                    : setNewProgram({ ...newProgram, tasks: newTasks });
                                }}
                                required
                              />
                              <input
                                type="time"
                                placeholder="Task Time"
                                className="p-2 border rounded"
                                value={task.time}
                                onChange={(e) => {
                                  const newTasks = [...(editingProgram ? editingProgram.tasks : newProgram.tasks)];
                                  newTasks[index] = { ...newTasks[index], time: e.target.value };
                                  editingProgram
                                    ? setEditingProgram({ ...editingProgram, tasks: newTasks })
                                    : setNewProgram({ ...newProgram, tasks: newTasks });
                                }}
                                required
                              />
                            </div>
                            <textarea
                              placeholder="Task Description"
                              className="w-full p-2 border rounded"
                              value={task.description}
                              onChange={(e) => {
                                const newTasks = [...(editingProgram ? editingProgram.tasks : newProgram.tasks)];
                                newTasks[index] = { ...newTasks[index], description: e.target.value };
                                editingProgram
                                  ? setEditingProgram({ ...editingProgram, tasks: newTasks })
                                  : setNewProgram({ ...newProgram, tasks: newTasks });
                              }}
                              required
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editingProgram
                            ? setEditingProgram({ ...editingProgram, tasks: [...editingProgram.tasks, { title: '', description: '', deadline: '', time: '' }] })
                            : addTask()
                          }
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Task
                        </Button>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowAddProgram(false);
                            setEditingProgram(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingProgram ? 'Update Program' : 'Add Program'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {programs.map((program) => (
                    <motion.div
                      key={program.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow p-4 border"
                    >
                      <div className="mb-3">
                        {program.titleImageUrl && (
                          <img 
                            src={program.titleImageUrl} 
                            alt={program.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="text-base font-bold mb-1 line-clamp-2">{program.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{program.about}</p>
                        <div className="text-xs text-gray-500 mb-2">
                          Price: ${program.price} | Duration: {program.duration}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-indigo-600 font-semibold">
                          {new Date(program.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingProgram(program)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProgram(program.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Notifications</h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg shadow p-6 border"
                      >
                        <h3 className="text-lg font-bold mb-2">{notification.name}</h3>
                        <p className="text-gray-600 mb-4">{notification.email}</p>
                        <p className="text-gray-600 mb-4">{notification.message}</p>
                        <span className="text-gray-500 text-sm">
                      
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-600">No notifications available.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {showAssignModal && (
        <Dialog
          open={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black opacity-30" />

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                Manage Course Access for {selectedUser?.fullName}
              </Dialog.Title>

              <div className="mb-4 text-sm text-gray-600">
                Select the courses this user should have access to. Unselected courses will be inaccessible.
              </div>

              <div className="mt-4">
                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto">
                    {programs.map((program) => (
                      <div key={program.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          id={`program-${program.id}`}
                          checked={selectedPrograms.includes(program.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPrograms([...selectedPrograms, program.id]);
                            } else {
                              setSelectedPrograms(selectedPrograms.filter(id => id !== program.id));
                            }
                          }}
                          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`program-${program.id}`} className="flex-1">
                          <div className="font-medium text-gray-900">{program.title}</div>
                          <div className="text-sm text-gray-500">
                            Duration: {program.duration} | Price: ${program.price}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignPrograms}
                >
                  Update Access
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}