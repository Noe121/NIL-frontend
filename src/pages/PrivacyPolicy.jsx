import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: November 8, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At NILBx, we are committed to protecting your privacy and personal information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="text-gray-700 space-y-1 ml-6">
                  <li>• Name, email address, and contact information</li>
                  <li>• Profile information and social media handles</li>
                  <li>• Student-athlete status and school information</li>
                  <li>• Payment and banking information (processed securely)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Data</h3>
                <ul className="text-gray-700 space-y-1 ml-6">
                  <li>• Platform usage patterns and preferences</li>
                  <li>• Device information and IP addresses</li>
                  <li>• Cookies and tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="text-gray-700 space-y-2 ml-6">
              <li>• Provide and maintain our platform services</li>
              <li>• Process payments and manage transactions</li>
              <li>• Ensure compliance with NCAA and state regulations</li>
              <li>• Communicate with you about your account and services</li>
              <li>• Improve our platform and develop new features</li>
              <li>• Provide customer support and respond to inquiries</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="text-gray-700 space-y-2 ml-6">
              <li>• With your explicit consent</li>
              <li>• To comply with legal obligations</li>
              <li>• To protect our rights and prevent fraud</li>
              <li>• With service providers who help us operate our platform</li>
              <li>• In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          {/* Demo Data Notice */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Demo Data Notice</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-purple-900 mb-2">About Demo Content</h3>
              <p className="text-purple-800 leading-relaxed">
                Our platform may display sample testimonials, user profiles, and statistics for demonstration purposes.
                This demo content is clearly marked and does not contain real user data. We are committed to protecting
                all real user information and will never share or display actual user data without explicit consent.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="text-gray-700 space-y-2 ml-6">
              <li>• Access and review your personal information</li>
              <li>• Correct inaccurate or incomplete information</li>
              <li>• Request deletion of your personal information</li>
              <li>• Object to or restrict certain processing activities</li>
              <li>• Data portability (receive your data in a structured format)</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns,
              and provide personalized content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform is not intended for children under 13. We do not knowingly collect personal information
              from children under 13. If we become aware that we have collected such information, we will take
              steps to delete it immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the new policy on our platform and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-gray-700">Email: privacy@nilbx.com</p>
              <p className="text-gray-700">Address: [Company Address]</p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;