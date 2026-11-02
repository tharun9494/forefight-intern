import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#070a11] py-16 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-400 hover:text-amber-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0c121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Subtle Ambient Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">ForeFight Legal Trust & Safety</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 mb-10 pb-6 border-b border-white/[0.08]">
            Effective Date: November 2024 &bull; Last Revised: 2026
          </p>

          <div className="space-y-10 text-gray-300">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">01.</span> Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                At <span className="text-white font-medium">FOREFIGHT ERA PRIVATE LIMITED</span>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Learning Management System (LMS) and corporate digital platforms.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">02.</span> Information We Collect
              </h2>
              <div className="space-y-6">
                <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl">
                  <h3 className="text-base font-semibold text-amber-300 mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-2" /> 2.1 Personal Information
                  </h3>
                  <ul className="list-disc pl-6 text-gray-300 space-y-1.5 text-sm">
                    <li>Full legal name</li>
                    <li>Official email address</li>
                    <li>Phone number</li>
                    <li>Payment confirmation references (via secured gateways)</li>
                    <li>Profile picture (optional)</li>
                  </ul>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl">
                  <h3 className="text-base font-semibold text-amber-300 mb-2 flex items-center">
                    <Eye className="w-4 h-4 mr-2" /> 2.2 Usage & Telemetry Information
                  </h3>
                  <ul className="list-disc pl-6 text-gray-300 space-y-1.5 text-sm">
                    <li>Course progression, milestones, and completion status</li>
                    <li>Assessment outcomes and technical submissions</li>
                    <li>Authenticated session history</li>
                    <li>Device metadata and browser user-agent</li>
                    <li>IP address for geolocation verification and fraud detection</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">03.</span> How We Use Your Information
              </h2>
              <p className="text-gray-300 mb-3">
                We use the collected information for:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm leading-relaxed">
                <li>Providing and maintaining our LMS ecosystem and student services</li>
                <li>Processing secure payments, tuition invoicing, and subscription authorizations</li>
                <li>Tracking student course progress, certificate validation, and grading performance</li>
                <li>Sending critical operational updates, internship alerts, and academic notifications</li>
                <li>Improving our technical platform performance and engineering user experience</li>
                <li>Complying with statutory reporting and legal regulatory obligations</li>
              </ul>
            </section>

            {/* Payment Information */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">04.</span> Payment Information
              </h2>
              <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl">
                <p className="text-gray-300 text-sm mb-3">
                  We use secure payment gateways to process your payments. Your financial credentials are:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-1.5 text-sm">
                  <li>Encrypted during transmission using industry-standard TLS 1.3</li>
                  <li>Stored securely directly by our RBI-compliant payment aggregator partners</li>
                  <li>Never stored or cached on ForeFight Era servers</li>
                  <li>Used strictly for authorized student enrollment transactions</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">05.</span> Data Security
              </h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                We implement rigorous technical safeguards to protect your personal data, including:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular automated and manual vulnerability evaluations</li>
                <li>Granular role-based access controls and multi-factor authentication</li>
                <li>Redundant cloud storage architectures and automated disaster recovery</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">06.</span> Data Sharing & Third Parties
              </h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                We do not sell personal data. We may share information only with:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
                <li>Certified payment processors for transaction clearance</li>
                <li>Verified cloud infrastructure providers essential for platform operations</li>
                <li>Regulatory bodies and law enforcement authorities when strictly mandated by Indian law</li>
                <li>Corporate hiring partners only after explicit affirmative student consent</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">07.</span> Your Statutory Rights
              </h2>
              <p className="text-gray-300 mb-3">
                You have the enforceable right to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
                <li>Access your complete stored student record and personal dossier</li>
                <li>Request rectification of erroneous personal records</li>
                <li>Request permanent account deletion subject to legal credential archiving</li>
                <li>Opt out of non-transactional marketing and promotional communications</li>
                <li>Export your academic and task records in structured portable formats</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">08.</span> Cookies & Local State
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We utilize minimal functional cookies and browser storage tokens solely to maintain authenticated user sessions, retain user preferences, and observe critical platform reliability metrics.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">09.</span> Amendments to Privacy Policy
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We may periodically update this policy to mirror technological or legislative evolutions. Any modifications will be posted to this page with an updated timestamp.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-t border-white/[0.08] pt-8">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">10.</span> Data Protection Officer & Inquiries
              </h2>
              <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl space-y-2 text-sm">
                <p><span className="text-gray-400">Entity:</span> <strong className="text-white">FOREFIGHT ERA PRIVATE LIMITED</strong></p>
                <p><span className="text-gray-400">Email:</span> <a href="mailto:forefightera@gmail.com" className="text-amber-400 hover:underline">forefightera@gmail.com</a></p>
                <p><span className="text-gray-400">Phone:</span> <a href="tel:+918919403905" className="text-gray-200 hover:text-white">+91 8919403905</a></p>
                <p><span className="text-gray-400">Registered Office:</span> Madanapalle, Pin 517325, Andhra Pradesh, India</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
