import { motion } from 'framer-motion';
import { Scale, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">ForeFight Legal Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Terms and Conditions
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
                Welcome to <span className="text-white font-medium">FOREFIGHT ERA PRIVATE LIMITED</span>. These terms and conditions outline the legally binding rules and regulations for the use of our Learning Management System (LMS), internship platforms, and enterprise training services.
              </p>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">02.</span> Payment Terms & Invoicing
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  All payments for our courses and internship programs are processed through PCI-DSS compliant secure payment gateways. We accept various approved payment instruments including UPI, credit/debit cards, and net banking:
                </p>
                <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl">
                  <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
                    <li>All pricing tiers are stated in Indian Rupees (INR) unless explicitly designated otherwise</li>
                    <li>Prices are subject to revision prior to enrollment confirmation without retroactive effect</li>
                    <li>Full payment clearance is required before course or internship repository access is unlocked</li>
                    <li>Enrollment credentials and digital laboratory access are granted immediately upon gateway confirmation</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Refund Policy */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">03.</span> Transparent Refund Policy
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  We strive to ensure complete satisfaction with our courses. Our refund schedule is governed by the following criteria:
                </p>
                <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl">
                  <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
                    <li><strong className="text-white">100% full refund</strong> within 7 days of purchase if zero course or lab modules have been accessed</li>
                    <li><strong className="text-white">50% partial refund</strong> within 14 days of purchase if less than 25% of the curriculum content has been consumed</li>
                    <li><strong className="text-white">Zero refund</strong> after 14 calendar days or if more than 25% of the curriculum has been accessed</li>
                    <li>Approved refunds will be processed and credited within 7–10 standard banking business days</li>
                    <li>Refunds are remitted exclusively back to the original originating payment method</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Course Access */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">04.</span> Course Access & Entitlements
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Upon verified payment completion, enrolled students receive:
                </p>
                <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl">
                  <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
                    <li>Immediate unhindered access to all syllabus modules, lecture recordings, and laboratory guides</li>
                    <li>Continuous access to curriculum revisions and supplemental coding sandboxes during tenure</li>
                    <li>Direct access to community technical channels, faculty office hours, and code-review forums</li>
                    <li>Access duration defined according to specific course track specifications (lifetime or cohort-based)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">05.</span> Student & User Responsibilities
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  As an enrolled user or registered student of our platform, you legally commit to:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
                  <li>Provide authentic, accurate, and up-to-date identification details during registration</li>
                  <li>Maintain strict confidentiality over student access credentials, tokens, and multi-factor logins</li>
                  <li>Refrain from pooling, loaning, reselling, or sharing authenticated account access with third parties</li>
                  <li>Never redistribute, mirror, rip, reverse-engineer, or commercially exploit platform coursework</li>
                  <li>Interact professionally within community discussions in full compliance with cybersecurity laws</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">06.</span> Intellectual Property & Proprietary Rights
              </h2>
              <p className="text-gray-300 leading-relaxed">
                All course content—including video lectures, 3D assets, source architecture, lab assignments, and written syllabi—is the proprietary intellectual property of <span className="text-white font-medium">FOREFIGHT ERA PRIVATE LIMITED</span>. Enrolled users are granted an individual, revocable, non-exclusive, non-transferable personal learning license.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">07.</span> Limitation of Liability
              </h2>
              <p className="text-gray-300 leading-relaxed">
                FOREFIGHT ERA PRIVATE LIMITED shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to access services, scheduled maintenance windows, or external gateway downtimes.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">08.</span> Modifications of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to revise these terms at any time. Material revisions will be highlighted through dashboard notifications. Continued utilization of the portal post-notification constitutes binding consent to the revised terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-t border-white/[0.08] pt-8">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-amber-400 font-mono mr-2">09.</span> Legal Notices & Corporate Inquiries
              </h2>
              <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl space-y-2 text-sm">
                <p><span className="text-gray-400">Entity:</span> <strong className="text-white">FOREFIGHT ERA PRIVATE LIMITED</strong></p>
                <p><span className="text-gray-400">Email:</span> <a href="mailto:forefightera@gmail.com" className="text-amber-400 hover:underline">forefightera@gmail.com</a></p>
                <p><span className="text-gray-400">Phone:</span> <a href="tel:+918919403905" className="text-gray-200 hover:text-white">+91 8919403905</a></p>
                <p><span className="text-gray-400">Corporate Office:</span> Madanapalle, Pin 517325, Andhra Pradesh, India</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
