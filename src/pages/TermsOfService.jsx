import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: November 8, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to NILBx ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our platform
              that connects student-athletes, influencers, brands, and fans for Name, Image, and Likeness (NIL) opportunities.
              By accessing or using our services, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Demo Content Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Demo Content Disclaimer</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Important Notice About Demo Content</h3>
              <p className="text-blue-800 leading-relaxed">
                Some user profiles, testimonials, statistics, follower counts, and earnings data displayed on our platform
                may contain sample or demo data for illustrative purposes. This content is not representative of actual
                user experiences and is provided solely to demonstrate platform capabilities.
              </p>
              <ul className="text-blue-800 mt-3 space-y-1">
                <li>• Demo testimonials are clearly marked and not from real users</li>
                <li>• Sample follower counts and earnings are for demonstration only</li>
                <li>• Platform statistics may include projected or illustrative numbers</li>
                <li>• We are committed to transparency and will replace demo data with real data as our community grows</li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use certain features of our platform, you must create an account. You are responsible for:
            </p>
            <ul className="text-gray-700 space-y-2 ml-6">
              <li>• Providing accurate and complete information</li>
              <li>• Maintaining the confidentiality of your account credentials</li>
              <li>• All activities that occur under your account</li>
              <li>• Complying with NCAA and state NIL regulations (for student-athletes)</li>
            </ul>
          </section>

          {/* Platform Fees */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Platform Fees</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-900 mb-2">NILBx Athlete Pricing – Final Fine Print</h3>
              <ul className="text-green-800 space-y-2">
                <li><strong>Year 1:</strong> 0% platform fee - You keep 100% of every deal</li>
                <li><strong>Starting Year 2:</strong> 9% platform fee - 40-70% less than competing platforms</li>
                <li><strong>Business Model:</strong> Brands pay service add-ons for premium tools</li>
                <li><strong>Guarantee:</strong> Secure escrow with 24-hour payouts</li>
              </ul>
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Compliance Requirements</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Student-athletes using our platform must comply with all applicable NCAA rules and state laws.
              We provide compliance tools and monitoring, but ultimate responsibility rests with the user.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Disclaimer:</strong> NILBx provides compliance assistance but does not guarantee approval
                of any deals. Users are responsible for ensuring their activities comply with all applicable laws and regulations.
              </p>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
            <ul className="text-gray-700 space-y-2 ml-6">
              <li>• Violate any NCAA rules or state NIL laws</li>
              <li>• Provide false or misleading information</li>
              <li>• Engage in fraudulent or deceptive practices</li>
              <li>• Infringe on intellectual property rights</li>
              <li>• Harass, abuse, or harm other users</li>
              <li>• Use the platform for illegal activities</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of these Terms
              or for other conduct that we determine to be harmful to our platform or other users.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              NILBx shall not be liable for any indirect, incidental, special, or consequential damages arising
              out of or in connection with your use of our platform. Our total liability shall not exceed the
              amount paid by you to us in the 12 months preceding the claim.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-gray-700">Email: legal@nilbx.com</p>
              <p className="text-gray-700">Address: [Company Address]</p>
            </div>
          </section>

          {/* Agreement */}
          <section className="border-t pt-8">
            <p className="text-gray-700 leading-relaxed">
              By using NILBx, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
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

export default TermsOfService;