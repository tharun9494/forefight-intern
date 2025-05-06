import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram as InstagramIcon, Youtube, Mail, Phone, MapPin, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">FOREFIGHT ERA PRIVATE LIMITED</h3>
            <p className="text-gray-400">
              Empowering learners worldwide with quality education and innovative
              learning experiences.
            </p>
            <div className="flex space-x-4">
             
              <a href="https://www.linkedin.com/company/edufer-technologies/" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/edufer_tech_solutions/profilecard/?igsh=MWdlc2Nxb3ozcjhpYQ==" className="text-gray-400 hover:text-white transition-colors">
                <InstagramIcon className="w-6 h-6" />
              </a>
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
              <Link to="/programs" className="text-gray-400 hover:text-white transition-colors">
                  Programs
              </Link>
              </li>
              <li>
              <Link to="/blogs" className="text-gray-400 hover:text-white transition-colors">
                  Blogs
              </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Programs</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                 Python
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  SQl
                </Link>
              </li>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Data Visualization
                </Link>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <span className="text-gray-400">
                Madanpalle, pin 517325 ,AP
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <span className="text-gray-400">+91 8919403905</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <span className="text-gray-400">forefightera@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400">
            © {currentYear} FOREFIGHT ERA PRIVATE LIMITED. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}