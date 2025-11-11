import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';
import FormField from '../components/FormField.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { validators, validateForm } from '../utils/validation.js';
import { config } from '../utils/config.js';
import StateSelector from '../components/Compliance/StateSelector.jsx';

const AthleteRegistration = () => {
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

    // Step 2: Athlete Type Selection
    userType: '',

    // Step 3: State Selection
    state: '',

    // Step 4: Compliance Info
    age: '',
    school: '',
    sport: '',

    // Step 5: Athlete Details
    team: '',
    position: '',
    year: '',
    university: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [complianceCheck, setComplianceCheck] = useState(null);
  const [complianceLoading, setComplianceLoading] = useState(false);

  const totalSteps = 5;

  // Get step label
  const getStepLabel = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Select Athlete Category';
      case 3: return 'Select Your State';
      case 4: return 'Compliance Information';
      case 5: return 'Complete Your Profile';
      default: return 'Register';
    }
  };

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
      userType: [(value) => value ? null : 'Please select your athlete category']
    },
    3: {
      state: [(value) => value ? null : 'Please select a state']
    },
    4: {
      age: [validators.age],
      school: [validators.required],
      sport: [validators.sport]
    },
    5: {
      sport: [validators.sport],
      university: [validators.required],
      year: [validators.required]
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleStateSelect = (selectedState) => {
    setFormData(prev => ({ ...prev, state: selectedState }));

    // Check compliance for the selected state
    checkStateCompliance(selectedState);
  };

  const checkStateCompliance = async (state) => {
    setComplianceLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/compliance/rules/${state}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComplianceCheck(data.rules);
      } else {
        setComplianceCheck(null);
      }
    } catch (error) {
      console.error('Compliance check failed:', error);
      setComplianceCheck(null);
    } finally {
      setComplianceLoading(false);
    }
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
      // First validate compliance
      const validationResponse = await fetch(`${config.apiUrl}/compliance/validate-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: formData.state,
          user_type: formData.userType,
          age: parseInt(formData.age)
        })
      });

      if (!validationResponse.ok) {
        const validationData = await validationResponse.json();
        setSubmitError(validationData.detail || 'State compliance validation failed');
        setLoading(false);
        return;
      }

      const validationData = await validationResponse.json();
      if (!validationData.is_valid) {
        setSubmitError(validationData.errors?.join(', ') || 'Your registration does not meet state compliance requirements');
        setLoading(false);
        return;
      }

      // Register user
      const response = await fetch(`${config.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'athlete',
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            sport: formData.sport,
            school: formData.school,
            state: formData.state,
            age: parseInt(formData.age),
            userType: formData.userType,
            team: formData.team,
            position: formData.position,
            year: formData.year,
            university: formData.university
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, { ...data.user, state: formData.state });
        navigate('/dashboard/athlete');
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
              {getStepLabel()} ({currentStep} of {totalSteps})
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
                  Athlete Registration
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

            {/* Step 2: Athlete Type Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2-athlete-type"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  What Type of Athlete Are You?
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                  This helps us ensure compliance with your state's NIL regulations
                </p>

                <div className="space-y-4">
                  {[
                    { value: 'es_athlete', label: 'Elementary School Athlete', icon: '🏃‍♂️', desc: 'Ages 6-10', ageRange: '6-10' },
                    { value: 'ms_athlete', label: 'Middle School Athlete', icon: '🏃‍♂️', desc: 'Ages 11-13', ageRange: '11-13' },
                    { value: 'hs_athlete', label: 'High School Athlete', icon: '🏃‍♂️', desc: 'Ages 14-18', ageRange: '14-18' },
                    { value: 'college_athlete', label: 'College Athlete', icon: '🎓', desc: 'Ages 18-22', ageRange: '18-22' },
                    { value: 'amateur_athlete', label: 'Amateur Athlete', icon: '⚽', desc: 'Post-college, no professional contract', ageRange: '18+' },
                    { value: 'semi_pro_athlete', label: 'Semi-Pro Athlete', icon: '🏆', desc: 'Minor league/semi-professional', ageRange: '18+' },
                    { value: 'pro_athlete', label: 'Professional Athlete', icon: '⭐', desc: 'Professional league athlete', ageRange: '18+' }
                  ].map((type) => (
                    <motion.label
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                        ${formData.userType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value={type.value}
                        checked={formData.userType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl" role="img" aria-label={type.label}>
                          {type.icon}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-600">{type.desc}</p>
                          <p className="text-xs text-gray-500 mt-1">Age range: {type.ageRange}</p>
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </div>

                {errors.userType && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {errors.userType}
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 3: State Selection */}
            {currentStep === 3 && (
              <motion.div
                key="step3-state"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Select Your State
                </h2>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Your state determines NIL eligibility and restrictions
                </p>

                <StateSelector onStateSelect={handleStateSelect} selectedState={formData.state} />

                {errors.state && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {errors.state}
                  </p>
                )}

                {complianceLoading && (
                  <div className="mt-4 flex justify-center">
                    <LoadingSpinner size="small" color="blue" />
                  </div>
                )}

                {complianceCheck && !complianceLoading && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                    <p className="font-medium text-blue-900">State Requirements:</p>
                    <ul className="mt-2 space-y-1 text-blue-800">
                      {complianceCheck.hs_nil_allowed !== undefined && (
                        <li>✓ High School NIL: {complianceCheck.hs_nil_allowed ? 'Allowed' : 'Not Allowed'}</li>
                      )}
                      {complianceCheck.parental_consent_required && (
                        <li>⚠ Parental Consent Required</li>
                      )}
                      {complianceCheck.school_notification_required && (
                        <li>⚠ School Notification Required</li>
                      )}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Compliance Information */}
            {currentStep === 4 && (
              <motion.div
                key="step4-compliance"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Compliance Information
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                  We need this information to ensure compliance with NIL regulations
                </p>

                <div className="space-y-4">
                  <FormField
                    type="number"
                    name="age"
                    label="Age"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleInputChange}
                    error={errors.age}
                    required
                    min="6"
                    max="100"
                    icon="🎂"
                    hint="Must be 13 or older for COPPA compliance"
                  />

                  <FormField
                    name="school"
                    label="School"
                    placeholder="e.g., Lincoln High School"
                    value={formData.school}
                    onChange={handleInputChange}
                    error={errors.school}
                    required
                    icon="🏫"
                    hint="Your current school or most recent school"
                  />

                  <FormField
                    name="sport"
                    label="Primary Sport"
                    placeholder="e.g., Basketball"
                    value={formData.sport}
                    onChange={handleInputChange}
                    error={errors.sport}
                    required
                    icon="🏀"
                    hint="Your main sport for NIL opportunities"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Athlete Details */}
            {currentStep === 5 && (
              <motion.div
                key="step5-athlete-details"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Complete Your Profile
                </h2>

                <div className="space-y-4">
                  <FormField
                    name="university"
                    label="University/College"
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

export default AthleteRegistration;