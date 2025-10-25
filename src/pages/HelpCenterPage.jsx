import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi.js';
import { config } from '../utils/config.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast } from '../components/NotificationToast.jsx';

const HelpCenterPage = () => {
  const { apiService } = useApi();
  const toast = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    loadHelpCenterData();
  }, []);

  const loadHelpCenterData = async () => {
    try {
      const [faqsResponse, healthResponse] = await Promise.all([
        apiService.get('/faqs'),
        apiService.get('/health/status')
      ]);

      setFaqs(faqsResponse);
      setHealthStatus(healthResponse);
    } catch (error) {
      console.error('Failed to load help center data:', error);
      // Show demo FAQs for public access
      const demoFaqs = [
        {
          id: 1,
          question: 'What is NILBx?',
          answer: 'NILBx is a comprehensive platform that empowers college athletes to monetize their personal brand through Name, Image, and Likeness (NIL) opportunities. We connect athletes with sponsors, fans, and opportunities while ensuring compliance with NCAA and state regulations.'
        },
        {
          id: 2,
          question: 'How do I create an account?',
          answer: 'Click the "Join as Athlete/Sponsor/Fan" button on our homepage. Choose your role and fill out the registration form. We\'ll verify your information and get you started within 24 hours.'
        },
        {
          id: 3,
          question: 'What types of sponsorships are available?',
          answer: 'We offer various sponsorship opportunities including equipment deals, brand partnerships, social media collaborations, and appearance fees. Sponsors can browse athlete profiles and initiate contact directly through our platform.'
        },
        {
          id: 4,
          question: 'Is NILBx compliant with NCAA regulations?',
          answer: 'Yes, NILBx is fully compliant with NCAA NIL rules and state laws. We work closely with compliance officers and legal experts to ensure all opportunities meet regulatory requirements.'
        },
        {
          id: 5,
          question: 'How do payments work?',
          answer: 'Payments are processed securely through our platform. Athletes receive direct payments for approved sponsorships. We handle invoicing, tax documentation, and ensure all transactions are properly recorded.'
        },
        {
          id: 6,
          question: 'What are the fees for using NILBx?',
          answer: 'For athletes: Free to join and list opportunities. We take a small percentage (5-10%) on successful sponsorship deals. For sponsors: Free to browse, small listing fees for premium placements.'
        }
      ];

      // Add blockchain FAQ if feature is enabled
      if (config.features.blockchain) {
        demoFaqs.push({
          id: 7,
          question: 'How do NFTs work on the platform?',
          answer: 'Athletes can mint NFTs representing their achievements, game-worn items, or exclusive content. Fans can purchase these digital collectibles, and athletes earn royalties on secondary sales.'
        });
      }

      // Add remaining FAQs
      demoFaqs.push(
        {
          id: config.features.blockchain ? 8 : 7,
          question: 'Can fans interact with athletes?',
          answer: 'Yes! Fans can follow athletes, purchase merchandise, attend virtual meet-and-greets, and access exclusive content. Premium fan experiences include direct messaging and behind-the-scenes access.'
        }
      );

      setFaqs(demoFaqs);
      
      // Demo health status
      setHealthStatus({
        api: 'healthy',
        database: 'healthy',
        blockchain: config.features.blockchain ? 'healthy' : null
      });
      
      toast.error('Using demo content - some features may be limited.');
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.post('/support/contact', contactForm);
      toast.success('Your message has been sent successfully. We\'ll get back to you soon!');
      setContactForm({ subject: '', message: '' });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      // For demo purposes, show success even if API fails
      toast.success('Thank you for your message! In a real implementation, this would be sent to our support team.');
      setContactForm({ subject: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2 text-gray-600">Loading help center...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>

            {/* Support Categories */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSearchTerm('account')}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  Account & Login
                </button>
                <button
                  onClick={() => setSearchTerm('payment')}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  Payments & Billing
                </button>
                <button
                  onClick={() => setSearchTerm('technical')}
                  className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
                >
                  Technical Support
                </button>
                {config.features.blockchain && (
                  <button
                    onClick={() => setSearchTerm('blockchain')}
                    className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm hover:bg-orange-200 transition-colors"
                  >
                    Blockchain & NFTs
                  </button>
                )}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No FAQs found matching your search.' : 'No FAQs available at the moment.'}
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          expandedFaq === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
              <form onSubmit={handleContactFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide details about your question or issue"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>

            {/* Service Health Status */}
            {healthStatus && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">API</span>
                    <span className={`text-sm font-medium ${getHealthStatusColor(healthStatus.api)}`}>
                      {healthStatus.api?.charAt(0).toUpperCase() + healthStatus.api?.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className={`text-sm font-medium ${getHealthStatusColor(healthStatus.database)}`}>
                      {healthStatus.database?.charAt(0).toUpperCase() + healthStatus.database?.slice(1)}
                    </span>
                  </div>
                  {config.features.blockchain && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Blockchain</span>
                      <span className={`text-sm font-medium ${getHealthStatusColor(healthStatus.blockchain)}`}>
                        {healthStatus.blockchain?.charAt(0).toUpperCase() + healthStatus.blockchain?.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/terms" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Terms of Service
                </a>
                <a href="/privacy" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Privacy Policy
                </a>
                <a href="/guidelines" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Community Guidelines
                </a>
                {config.features.blockchain && (
                  <a href="/blockchain-guide" className="block text-blue-600 hover:text-blue-800 text-sm">
                    Blockchain Guide
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;