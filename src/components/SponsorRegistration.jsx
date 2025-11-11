import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';
import FormField from '../components/FormField.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { validators, validateForm } from '../utils/validation.js';
import { config } from '../utils/config.js';

const SponsorRegistration = () => {
  const navigate = useNavigate();
  const { login, setLoading, loading } = useUser();

  const [formData, setFormData] = useState({
    // Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',

    // Company Info
    companyName: '',
    industry: '',
    jobTitle: '',
    budget: '',
    website: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validationRules = {
    email: [validators.email],
    password: [validators.password],
    confirmPassword: [(value) => validators.confirmPassword(value, formData.password)],
    firstName: [validators.name],
    lastName: [validators.name],
    companyName: [validators.required],
    industry: [validators.required],
    jobTitle: [validators.required]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: formErrors } = validateForm(formData, validationRules);
    setErrors(formErrors);

    if (!isValid) return;

    setLoading(true);
    setSubmitError('');

    try {
      const response = await fetch(`${config.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'sponsor',
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
            industry: formData.industry,
            jobTitle: formData.jobTitle,
            budget: formData.budget,
            website: formData.website,
            description: formData.description
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        navigate('/dashboard/sponsor');
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || 'Registration failed');
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join as a Brand Partner
            </h2>
            <p className="text-gray-600">
              Connect with athletes and create meaningful sponsorship opportunities
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  required
                  validate={validators.name}
                  icon="👤"
                />

                <FormField
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                  validate={validators.name}
                  icon="👤"
                />
              </div>

              <FormField
                type="email"
                name="email"
                label="Email Address"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                validate={validators.email}
                icon="📧"
              />

              <FormField
                type="password"
                name="password"
                label="Password"
                placeholder="Choose a strong password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                validate={validators.password}
                icon="🔒"
                hint="At least 8 characters with uppercase, lowercase, and number"
              />

              <FormField
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
                validate={(value) => validators.confirmPassword(value, formData.password)}
                icon="🔒"
              />
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Company Information</h3>

              <FormField
                name="companyName"
                label="Company Name"
                placeholder="Nike Inc."
                value={formData.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                required
                icon="🏢"
              />

              <FormField
                name="jobTitle"
                label="Job Title"
                placeholder="Marketing Manager"
                value={formData.jobTitle}
                onChange={handleInputChange}
                error={errors.jobTitle}
                required
                icon="💼"
              />

              <FormField
                name="industry"
                label="Industry"
                placeholder="Athletic Apparel"
                value={formData.industry}
                onChange={handleInputChange}
                error={errors.industry}
                required
                icon="🏭"
              />

              <FormField
                name="budget"
                label="Annual NIL Budget (Optional)"
                placeholder="$50,000"
                value={formData.budget}
                onChange={handleInputChange}
                icon="💰"
                hint="Your approximate annual budget for athlete partnerships"
              />

              <FormField
                name="website"
                label="Company Website (Optional)"
                placeholder="https://www.company.com"
                value={formData.website}
                onChange={handleInputChange}
                icon="🌐"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description (Optional)
                </label>
                <textarea
                  name="description"
                  placeholder="Tell us about your company and what you're looking for in athlete partnerships..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                role="alert"
              >
                {submitError}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Brand Partner Account</span>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth')}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SponsorRegistration;