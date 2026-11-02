import { Link } from 'react-router-dom';
import { Instagram as InstagramIcon, Youtube, Mail, Phone, MapPin, Linkedin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05080f] text-gray-200 border-t border-white/[0.08] relative overflow-hidden">
      {/* Studio Hairline Accent Top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-xl font-black tracking-tight text-white">
                FOREFIGHT ERA PRIVATE LIMITED
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Empowering next-generation engineering talent with verified hands-on industry cohorts, production software development, and real-world applied data science.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.linkedin.com/in/ontimitta-tharun-8510842aa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-400/40 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/forefight_era/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-400/40 transition-all duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@forefightera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-400/40 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-amber-400/90 font-semibold">
              Platform Architecture
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/programs" className="text-gray-400 hover:text-white transition-colors">
                  Programs & Curricula
                </Link>
              </li>
              <li>
                <Link to="/internship" className="inline-flex items-center text-amber-400 font-medium hover:text-amber-300 transition-colors">
                  <span>Internship Portal</span>
                  <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                    Hiring
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About the Enterprise
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

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-amber-400/90 font-semibold">
              Corporate Headquarters
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-gray-400 leading-snug">
                  Madanpalle, PIN 517325, Andhra Pradesh, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-gray-400 font-mono">+91 8919403905</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-gray-400 font-mono">forefightera@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2 pt-2 text-xs text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>MCA Registered • MSME Certified • DPIIT Recognized</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {currentYear} FOREFIGHT ERA PRIVATE LIMITED. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px] text-gray-500">
            Precision 3D Experience • Production Grade
          </p>
        </div>
      </div>
    </footer>
  );
}
