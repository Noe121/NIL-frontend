// Form validation utilities

export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return { isValid: false, error: 'Email is required' };
    if (!emailRegex.test(value)) return { isValid: false, error: 'Please enter a valid email address' };
    return { isValid: true };
  },

  password: (value) => {
    if (!value) return { isValid: false, error: 'Password is required' };
    if (value.length < 8) return { isValid: false, error: 'Password must be at least 8 characters' };
    if (!/(?=.*[a-z])/.test(value)) return { isValid: false, error: 'Password must contain a lowercase letter' };
    if (!/(?=.*[A-Z])/.test(value)) return { isValid: false, error: 'Password must contain an uppercase letter' };
    if (!/(?=.*\d)/.test(value)) return { isValid: false, error: 'Password must contain a number' };
    return { isValid: true };
  },

  confirmPassword: (value, originalPassword) => {
    if (!value) return { isValid: false, error: 'Please confirm your password' };
    if (value !== originalPassword) return { isValid: false, error: 'Passwords do not match' };
    return { isValid: true };
  },

  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  },

  name: (value) => {
    if (!value) return { isValid: false, error: 'Name is required' };
    if (value.length < 2) return { isValid: false, error: 'Name must be at least 2 characters' };
    if (!/^[a-zA-Z\s]+$/.test(value)) return { isValid: false, error: 'Name can only contain letters and spaces' };
    return { isValid: true };
  },

  phone: (value) => {
    if (!value) return { isValid: false, error: 'Phone number is required' };
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(value)) return { isValid: false, error: 'Please enter a valid phone number' };
    return { isValid: true };
  },

  url: (value) => {
    if (!value) return { isValid: true }; // Optional field
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(value)) return { isValid: false, error: 'Please enter a valid URL (starting with http:// or https://)' };
    return { isValid: true };
  },

  sport: (value) => {
    const validSports = [
      'football', 'basketball', 'baseball', 'soccer', 'tennis', 'golf',
      'swimming', 'track', 'volleyball', 'wrestling', 'hockey', 'gymnastics',
      'softball', 'cross-country', 'lacrosse', 'other'
    ];
    if (!value) return { isValid: false, error: 'Please select a sport' };
    if (!validSports.includes(value.toLowerCase())) return { isValid: false, error: 'Please select a valid sport' };
    return { isValid: true };
  },

  role: (value) => {
    const validRoles = ['athlete', 'sponsor', 'fan'];
    if (!value) return { isValid: false, error: 'Please select a role' };
    if (!validRoles.includes(value)) return { isValid: false, error: 'Please select a valid role' };
    return { isValid: true };
  }
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];

    for (const rule of rules) {
      let result;
      
      if (typeof rule === 'function') {
        result = rule(value);
      } else if (typeof rule === 'object' && rule.validator) {
        result = rule.validator(value, ...rule.args || []);
      }

      if (result && !result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
};

export const createValidator = (validatorFn, ...args) => ({
  validator: validatorFn,
  args
});