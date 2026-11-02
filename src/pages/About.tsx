import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Globe, BookOpen, Users, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
      label: 'Specialized Tracks',
      value: '10+'
    },
    {
      icon: Users,
      label: 'Students Mentored',
      value: '500+'
    },
    {
      icon: Award,
      label: 'Success & Certification Rate',
      value: '95%'
    }
  ];

  const team = [
    {
      name: 'Ontimitta Tharun',
      role: 'FOUNDER & MANAGING DIRECTOR',
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    try {
      await addDoc(collection(db, 'contacts'), {
        name: name,
        email: email,
        message: message,
        timestamp: Timestamp.fromDate(new Date())
      });
      setSuccessMessage('Message dispatched to ForeFight Era executive team!');
      form.reset();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div className="py-14 sm:py-20 bg-[#070a11] text-gray-100 min-h-screen">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c121e] border border-emerald-400/40 text-emerald-300 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 font-medium text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Mission Section */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Corporate Philosophy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-5 text-white tracking-tight">Our Mission</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              To empower next-generation engineers worldwide with verified practical skills, production workflows, and immersive mentorship—bridging academic curricula with high-performance industry reality.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0c121e] p-7 rounded-3xl border border-white/[0.08] shadow-xl text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black mb-1 text-white font-mono">{stat.value}</div>
                <div className="text-xs font-mono uppercase tracking-wider text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Leadership Team</h2>
              <p className="text-gray-400 text-sm">
                Dedicated founders committed to advancing modern digital skills and technical education.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#0c121e] rounded-3xl p-7 border border-white/[0.08] hover:border-amber-400/30 shadow-xl text-center transition-all relative overflow-hidden"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                    {member.initials}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1.5">{member.name}</h3>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 mb-2">
                    {member.role}
                  </span>
                  <p className="text-xs text-gray-400 font-mono">{member.title}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="bg-[#0c121e] rounded-3xl shadow-2xl p-8 sm:p-10 scroll-mt-24 border border-white/[0.08]">
            <h2 className="text-3xl font-black mb-8 text-center text-white tracking-tight">Contact Corporate Headquarters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Location</h4>
                    <span className="text-gray-200 text-sm">ForeFight Era Pvt. Ltd., Madanapalle, PIN 517325, Andhra Pradesh, India</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Telephone</h4>
                    <span className="text-gray-200 text-sm font-mono">+91 8919403905</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Electronic Mail</h4>
                    <span className="text-gray-200 text-sm font-mono">forefightera@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Official Portal</h4>
                    <a href="https://www.forefightedu.com/" className="text-amber-400 hover:text-amber-300 hover:underline font-mono text-sm">
                      www.forefightedu.com
                    </a>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-3.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Corporate / Academic Email"
                  className="w-full p-3.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Detail your inquiry or institutional partnership requirements..."
                  rows={4}
                  className="w-full p-3.5 rounded-xl border border-white/10 bg-[#111827] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99]"
                >
                  Dispatch Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
