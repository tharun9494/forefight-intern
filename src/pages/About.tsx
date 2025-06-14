import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Globe, BookOpen, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import arfi from '../imgaes/arfi.jpeg'
import dsp from '../imgaes/dsp.jpeg'
import gowri from '../imgaes/gowri.jpg'
import hari from '../imgaes/hari.jpg'

export default function About() {
  const [successMessage, setSuccessMessage] = useState('');

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
      image: 'https://www.forefightera.in/assets/Tharun-C6RsZTH9.jpeg'
    },
    {
      name: 'Kothala Prem sai',
      role: 'CO-FOUNDER',
      image: 'https://www.forefightera.in/assets/Prem-D5sTfgQ1.png'
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
            <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
            <div className="flex justify-center items-center gap-16">
              {/* Founder */}
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-xl overflow-hidden w-80 h-80 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                  <img
                    src={team[0].image}
                    alt={team[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{team[0].name}</h3>
                <p className="text-gray-600 mt-2">{team[0].role}</p>
              </motion.div>

              {/* Co-Founder */}
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-xl overflow-hidden w-80 h-80 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                  <img
                    src={team[1].image}
                    alt={team[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{team[1].name}</h3>
                <p className="text-gray-600 mt-2">{team[1].role}</p>
              </motion.div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  <span>Madanpalle, pin 517325 ,AP</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-indigo-600" />
                  <span>+91 8919403905</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-indigo-600" />
                  <span>forefightera@gmail.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Globe className="w-6 h-6 text-indigo-600" />
                  <span>www.forefightera.in</span>
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
