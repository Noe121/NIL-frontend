import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';
import FormField from '../components/FormField.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { validators, validateForm } from '../utils/validation.js';
import { config } from '../utils/config.js';

const FanRegistration = () => {
  const navigate = useNavigate();
  const { login, setLoading, loading } = useUser();

  const [formData, setFormData] = useState({
    // Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',

    // Fan Preferences
    favoriteTeam: '',
    favoriteSport: '',
    interests: [],
    location: '',
    age: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validationRules = {
    email: [validators.email],
    password: [validators.password],
    confirmPassword: [(value) => validators.confirmPassword(value, formData.password)],
    firstName: [validators.name],
    lastName: [validators.name],
    favoriteTeam: [validators.required],
    favoriteSport: [validators.required]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
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
          role: 'fan',
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            favoriteTeam: formData.favoriteTeam,
            favoriteSport: formData.favoriteSport,
            interests: formData.interests,
            location: formData.location,
            age: formData.age ? parseInt(formData.age) : null,
            bio: formData.bio
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        navigate('/dashboard/fan');
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

  const sports = [
    'Football', 'Basketball', 'Baseball', 'Soccer', 'Hockey',
    'Tennis', 'Golf', 'Track & Field', 'Swimming', 'Volleyball',
    'Lacrosse', 'Wrestling', 'Other'
  ];

  const interestOptions = [
    'NIL Deals', 'Player Stats', 'Team News', 'Live Games',
    'Player Stories', 'Sports Analysis', 'Community Events',
    'Fan Merchandise', 'Behind-the-Scenes', 'Training Tips'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join the Fan Community
            </h2>
            <p className="text-gray-600">
              Connect with athletes, follow your favorite teams, and be part of the action
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
                placeholder="john.doe@example.com"
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

            {/* Fan Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Fan Preferences</h3>

              <FormField
                name="favoriteTeam"
                label="Favorite Team"
                placeholder="Alabama Crimson Tide"
                value={formData.favoriteTeam}
                onChange={handleInputChange}
                error={errors.favoriteTeam}
                required
                icon="❤️"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favorite Sport *
                </label>
                <select
                  name="favoriteSport"
                  value={formData.favoriteSport}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.favoriteSport ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select your favorite sport</option>
                  {sports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
                {errors.favoriteSport && (
                  <p className="mt-1 text-sm text-red-600">{errors.favoriteSport}</p>
                )}
              </div>

              <FormField
                name="location"
                label="Location (Optional)"
                placeholder="City, State"
                value={formData.location}
                onChange={handleInputChange}
                icon="📍"
              />

              <FormField
                type="number"
                name="age"
                label="Age (Optional)"
                placeholder="25"
                value={formData.age}
                onChange={handleInputChange}
                min="13"
                max="120"
                icon="🎂"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself and why you love sports..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
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
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Join the Fan Community</span>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth')}
                className="text-purple-600 hover:text-purple-800 font-medium"
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

export default FanRegistration;