import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';
import FormField from '../components/FormField.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation.js';

const MultiStepRegister = () => {
  const navigate = useNavigate();
  const { login, setLoading, loading } = useUser();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    
    // Step 2: Role Selection
    role: '',
    
    // Step 3: Role-specific Info
    // Athlete
    sport: '',
    team: '',
    position: '',
    year: '',
    university: '',
    
    // Sponsor
    companyName: '',
    industry: '',
    budget: '',
    
    // Fan
    favoriteTeam: '',
    interests: []
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const totalSteps = 3;

  // Validation rules for each step
  const validationRules = {
    1: {
      email: [validators.email],
      password: [validators.password],
      confirmPassword: [(value) => validators.confirmPassword(value, formData.password)],
      firstName: [validators.name],
      lastName: [validators.name]
    },
    2: {
      role: [validators.role]
    },
    3: getStep3ValidationRules()
  };

  function getStep3ValidationRules() {
    switch (formData.role) {
      case 'athlete':
        return {
          sport: [validators.sport],
          university: [validators.required],
          year: [validators.required]
        };
      case 'sponsor':
        return {
          companyName: [validators.required],
          industry: [validators.required]
        };
      case 'fan':
        return {
          favoriteTeam: [validators.required]
        };
      default:
        return {};
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInterestsChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateCurrentStep = () => {
    const stepRules = validationRules[currentStep];
    const { isValid, errors: stepErrors } = validateForm(formData, stepRules);
    setErrors(stepErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    setSubmitError('');
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          profile: getProfileData()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        navigate('/dashboard');
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

  const getProfileData = () => {
    switch (formData.role) {
      case 'athlete':
        return {
          firstName: formData.firstName,
          lastName: formData.lastName,
          sport: formData.sport,
          team: formData.team,
          position: formData.position,
          year: formData.year,
          university: formData.university
        };
      case 'sponsor':
        return {
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          industry: formData.industry,
          budget: formData.budget
        };
      case 'fan':
        return {
          firstName: formData.firstName,
          lastName: formData.lastName,
          favoriteTeam: formData.favoriteTeam,
          interests: formData.interests
        };
      default:
        return {
          firstName: formData.firstName,
          lastName: formData.lastName
        };
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Create Your Account
                </h2>
                
                <div className="space-y-4">
                  <FormField
                    name="firstName"
                    label="First Name"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                    autoFocus
                    validate={validators.name}
                    icon="👤"
                  />
                  
                  <FormField
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                    validate={validators.name}
                    icon="👤"
                  />
                  
                  <FormField
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="e.g., john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                    validate={validators.email}
                    icon="📧"
                    hint="We'll use this to send you important updates"
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
              </motion.div>
            )}

            {/* Step 2: Role Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Choose Your Role
                </h2>
                
                <div className="space-y-4">
                  {[
                    { value: 'athlete', label: 'Athlete', icon: '🏃‍♂️', desc: 'Student athlete looking for NIL opportunities' },
                    { value: 'sponsor', label: 'Sponsor', icon: '🏢', desc: 'Business looking to sponsor athletes' },
                    { value: 'fan', label: 'Fan', icon: '⭐', desc: 'Sports fan supporting favorite athletes' }
                  ].map((role) => (
                    <motion.label
                      key={role.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                        ${formData.role === role.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl" role="img" aria-label={role.label}>
                          {role.icon}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900">{role.label}</h3>
                          <p className="text-sm text-gray-600">{role.desc}</p>
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </div>
                
                {errors.role && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {errors.role}
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 3: Role-specific Information */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Tell Us More
                </h2>
                
                {formData.role === 'athlete' && (
                  <div className="space-y-4">
                    <FormField
                      name="sport"
                      label="Sport"
                      placeholder="e.g., Basketball"
                      value={formData.sport}
                      onChange={handleInputChange}
                      error={errors.sport}
                      required
                      icon="🏀"
                    />
                    
                    <FormField
                      name="university"
                      label="University"
                      placeholder="e.g., University of Alabama"
                      value={formData.university}
                      onChange={handleInputChange}
                      error={errors.university}
                      required
                      icon="🏫"
                    />
                    
                    <FormField
                      name="year"
                      label="Academic Year"
                      placeholder="e.g., Junior"
                      value={formData.year}
                      onChange={handleInputChange}
                      error={errors.year}
                      required
                      icon="📚"
                    />
                    
                    <FormField
                      name="team"
                      label="Team (Optional)"
                      placeholder="e.g., Crimson Tide"
                      value={formData.team}
                      onChange={handleInputChange}
                      icon="👥"
                    />
                    
                    <FormField
                      name="position"
                      label="Position (Optional)"
                      placeholder="e.g., Point Guard"
                      value={formData.position}
                      onChange={handleInputChange}
                      icon="📍"
                    />
                  </div>
                )}

                {formData.role === 'sponsor' && (
                  <div className="space-y-4">
                    <FormField
                      name="companyName"
                      label="Company Name"
                      placeholder="e.g., Nike Inc."
                      value={formData.companyName}
                      onChange={handleInputChange}
                      error={errors.companyName}
                      required
                      icon="🏢"
                    />
                    
                    <FormField
                      name="industry"
                      label="Industry"
                      placeholder="e.g., Athletic Apparel"
                      value={formData.industry}
                      onChange={handleInputChange}
                      error={errors.industry}
                      required
                      icon="🏭"
                    />
                    
                    <FormField
                      name="budget"
                      label="Annual NIL Budget (Optional)"
                      placeholder="e.g., $50,000"
                      value={formData.budget}
                      onChange={handleInputChange}
                      icon="💰"
                    />
                  </div>
                )}

                {formData.role === 'fan' && (
                  <div className="space-y-4">
                    <FormField
                      name="favoriteTeam"
                      label="Favorite Team"
                      placeholder="e.g., Alabama Crimson Tide"
                      value={formData.favoriteTeam}
                      onChange={handleInputChange}
                      error={errors.favoriteTeam}
                      required
                      icon="❤️"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sports Interests (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Football', 'Basketball', 'Baseball', 'Soccer', 'Tennis', 'Golf'].map((sport) => (
                          <label key={sport} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(sport)}
                              onChange={() => handleInterestsChange(sport)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{sport}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
              role="alert"
            >
              {submitError}
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }
              `}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </motion.button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/auth')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiStepRegister;