import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Terms and Conditions</h1>

          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                Welcome to FOREFIGHT ERA PRIVATE LIMITED. These terms and conditions outline the rules and regulations for the use of our Learning Management System (LMS).
              </p>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Payment Terms</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  All payments for our courses and programs are processed through our secure payment gateway. We accept various payment methods including credit/debit cards and online banking.
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>All prices are in Indian Rupees (INR) unless otherwise specified</li>
                  <li>Prices are subject to change without prior notice</li>
                  <li>Payment must be made in full before accessing any course content</li>
                  <li>Course access will be granted immediately upon successful payment</li>
                </ul>
              </div>
            </section>
    
            {/* Refund Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Refund Policy</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We strive to ensure complete satisfaction with our courses. Our refund policy is as follows:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Full refund within 7 days of purchase if no course content has been accessed</li>
                  <li>50% refund within 14 days if less than 25% of the course content has been accessed</li>
                  <li>No refunds after 14 days or if more than 25% of the course content has been accessed</li>
                  <li>Refunds will be credited within 7-10 business days</li>
                  <li>Refunds will be issued to the original payment method</li>
                </ul>
              </div>
            </section>

            {/* Course Access */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Course Access</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Upon successful payment, you will receive:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Immediate access to all course materials</li>
                  <li>Access to course updates and new content</li>
                  <li>Access to course community and support</li>
                  <li>Access duration as specified in the course details</li>
                </ul>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  As a user of our platform, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Not share your account access with others</li>
                  <li>Not reproduce or distribute course materials without permission</li>
                  <li>Use the platform in compliance with all applicable laws</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="text-gray-600">
                All course content, including but not limited to videos, documents, and materials, is the intellectual property of FOREFIGHT ERA PRIVATE LIMITED. Users are granted a limited, non-transferable license to access and use the content for personal learning purposes only.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600">
                FOREFIGHT ERA PRIVATE LIMITED shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. Users will be notified of any significant changes. Continued use of the platform after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
              <p className="text-gray-600">
                For any questions regarding these terms, please contact us at:
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