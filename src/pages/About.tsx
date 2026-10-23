import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Globe, BookOpen, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export default function About() {
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#contact') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const stats = [
    {
      icon: BookOpen,
      label: 'Courses',
      value: '10+'
    },
    {
      icon: Users,
      label: 'Students',
      value: '500+'
    },
    {
      icon: Award,
      label: 'Success Rate',
      value: '95%'
    }
  ];

  const team = [
    {
      name: 'Ontimitta Tharun',
      role: 'FOUNDER',
      title: 'ForeFight Era Pvt. Ltd.',
      initials: 'OT',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Kothala Prem sai',
      role: 'CO-FOUNDER',
      title: 'ForeFight Era Pvt. Ltd.',
      initials: 'KP',
      gradient: 'from-orange-500 to-amber-600',
    }
  ];  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value; 
    const message = event.target.message.value;

    // Store data in Firestore
    try {
      await addDoc(collection(db, 'contacts'), {
        name: name,
        email: email,
        message: message,
        timestamp: Timestamp.fromDate(new Date())
      });
      setSuccessMessage('Message sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div className="py-12">
      {/* Success message display */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          {successMessage}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mission Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To empower individuals worldwide with quality education through innovative
              online learning experiences, making education accessible to everyone,
              anywhere, at any time.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-3 text-center text-gray-900">Leadership Team</h2>
            <p className="text-gray-600 text-center max-w-xl mx-auto mb-8 text-sm">
              Dedicated founders committed to advancing modern digital skills and technical education.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)" }}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center transition-all"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 mb-2">
                    {member.role}
                  </span>
                  <p className="text-xs text-gray-500 font-medium">{member.title}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="bg-white rounded-xl shadow-lg p-8 scroll-mt-24 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-orange-600" />
                  <span className="text-gray-700">ForeFight Era Pvt. Ltd., Madanapalle, pin 517325, AP</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-orange-600" />
                  <span className="text-gray-700">+91 8919403905</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-orange-600" />
                  <span className="text-gray-700">forefightera@gmail.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                  <a href="https://www.forefightedu.com/" className="text-orange-600 hover:underline font-semibold">www.forefightedu.com</a>
                </div>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
