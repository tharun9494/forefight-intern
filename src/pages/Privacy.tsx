import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>

          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                At FOREFIGHT ERA PRIVATE LIMITED, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Learning Management System (LMS).
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium mb-2">2.1 Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Payment information</li>
                  <li>Profile picture (optional)</li>
                </ul>

                <h3 className="text-xl font-medium mb-2">2.2 Usage Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Course progress and completion</li>
                  <li>Assessment results</li>
                  <li>Login history</li>
                  <li>Device information</li>
                  <li>IP address</li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We use the collected information for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Providing and maintaining our services</li>
                  <li>Processing payments and managing subscriptions</li>
                  <li>Tracking course progress and performance</li>
                  <li>Sending important updates and notifications</li>
                  <li>Improving our platform and user experience</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>
            </section>

            {/* Payment Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Payment Information</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We use secure payment gateways to process your payments. Your payment information is:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Encrypted during transmission</li>
                  <li>Stored securely by our payment processors</li>
                  <li>Never stored on our servers</li>
                  <li>Used only for processing your transactions</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage and backup</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Sharing</h2>
              <p className="text-gray-600">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                <li>Payment processors for transaction processing</li>
                <li>Service providers who assist in platform operations</li>
                <li>Legal authorities when required by law</li>
                <li>Your consent will be obtained before sharing with any third parties</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
              <p className="text-gray-600">
                We use cookies to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                <li>Maintain your session</li>
                <li>Remember your preferences</li>
                <li>Analyze platform usage</li>
                <li>Improve user experience</li>
              </ul>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Privacy Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-gray-600">
                For any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-none pl-6 text-gray-600 space-y-2 mt-2">
                <li>Email: forefightera@gmail.com</li>
                <li>Phone: +91 8919403905</li>
                <li>Address: Madanpalle, pin 517325, AP</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 