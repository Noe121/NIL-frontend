import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FormField = ({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  autoFocus = false,
  disabled = false,
  icon,
  validate,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [localError, setLocalError] = useState('');

  // Auto-focus effect
  useEffect(() => {
    if (autoFocus) {
      const input = document.getElementById(name);
      if (input) input.focus();
    }
  }, [autoFocus, name]);

  // Real-time validation
  useEffect(() => {
    if (validate) {
      const validationResult = validate(value);
      setIsValid(validationResult.isValid);
      setLocalError(validationResult.error || '');
    } else if (value) {
      setIsValid(true);
      setLocalError('');
    } else if (required) {
      setIsValid(false);
      setLocalError(`${label || 'Field'} is required`);
    } else {
      setIsValid(null);
      setLocalError('');
    }
  }, [value, validate, required, label]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const displayError = error || localError;
  const inputClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none
    ${icon ? 'pl-12' : ''}
    ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : ''}
    ${displayError ? 'border-red-500' : ''}
    ${isValid === true ? 'border-green-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    hover:border-gray-400 focus:border-blue-500
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1"
    >
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={!!displayError}
          aria-describedby={
            displayError ? `${name}-error` : hint ? `${name}-hint` : undefined
          }
          required={required}
          {...props}
        />

        {/* Validation Icon */}
        {value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid === true && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                ✓
              </motion.div>
            )}
            {displayError && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                ⚠
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Hint */}
      {hint && !displayError && (
        <p id={`${name}-hint`} className="text-sm text-gray-500">
          {hint}
        </p>
      )}

      {/* Error Message */}
      {displayError && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          id={`${name}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {displayError}
        </motion.p>
      )}

      {/* Success Message */}
      {isValid === true && !displayError && value && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-600"
        >
          {type === 'email' && 'Valid email address'}
          {type === 'password' && 'Strong password'}
          {type === 'text' && 'Looks good!'}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormField;