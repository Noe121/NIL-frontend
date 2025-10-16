import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSize, useTouchGestures } from '../utils/responsive.jsx';
import { getAccessibilityProps, focusElement } from '../utils/accessibility.jsx';
import Button from './Button.jsx';

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  format = 'MM/DD/YYYY',
  minDate,
  maxDate,
  disabled = false,
  required = false,
  className = '',
  error,
  label,
  showTime = false,
  timeFormat = '12h', // '12h' or '24h'
  closeOnSelect = true,
  highlightToday = true,
  highlightWeekends = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const [selectedTime, setSelectedTime] = useState(
    value && showTime ? new Date(value) : new Date()
  );
  
  const datePickerRef = useRef(null);
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  const { isMobile } = useScreenSize();

  // Touch gestures for mobile calendar navigation
  useTouchGestures(calendarRef, {
    onSwipeLeft: () => navigateMonth(1),
    onSwipeRight: () => navigateMonth(-1),
    onSwipeUp: () => setIsOpen(false),
    threshold: 50
  });

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    if (showTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = timeFormat === '12h';
    }
    
    return date.toLocaleDateString('en-US', options);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    const newDate = new Date(date);
    
    if (showTime && selectedTime) {
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
    }
    
    setSelectedDate(newDate);
    onChange?.(newDate);
    
    if (closeOnSelect && !showTime) {
      setIsOpen(false);
    }
  };

  // Handle time change
  const handleTimeChange = (hours, minutes) => {
    const newTime = new Date(selectedTime);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    setSelectedTime(newTime);
    
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
  };

  // Navigate years
  const navigateYear = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setViewDate(newDate);
  };

  // Check if date is disabled
  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks of days
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    }
    
    return days;
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          focusElement(inputRef.current);
          break;
        case 'Enter':
          if (document.activeElement?.dataset?.date) {
            const date = new Date(document.activeElement.dataset.date);
            handleDateSelect(date);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div ref={datePickerRef} className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          required={required}
          onClick={() => !disabled && setIsOpen(true)}
          className={`
            w-full px-4 py-2 border rounded-lg bg-white cursor-pointer
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-blue-300'}
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            focus:ring-2 focus:ring-opacity-50 transition-colors duration-200
            min-h-[44px] text-left
          `}
          {...getAccessibilityProps({
            ariaExpanded: isOpen,
            ariaHaspopup: 'dialog',
            ariaLabel: label || 'Select date'
          })}
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <span className="text-gray-400 text-lg">📅</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Calendar Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-25 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* Calendar */}
            <motion.div
              ref={calendarRef}
              initial={{ 
                opacity: 0, 
                scale: 0.95, 
                y: isMobile ? 20 : -10 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: isMobile ? 20 : -10 
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`
                absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4
                ${isMobile 
                  ? 'fixed inset-x-4 top-1/2 transform -translate-y-1/2 max-h-[80vh] overflow-y-auto' 
                  : 'top-full mt-2 min-w-[320px]'
                }
              `}
              {...getAccessibilityProps({
                role: 'dialog',
                ariaLabel: 'Date picker',
                ariaModal: isMobile
              })}
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => navigateMonth(-1)}
                  className="min-w-[44px] min-h-[44px]"
                  icon="‹"
                  {...getAccessibilityProps({ ariaLabel: 'Previous month' })}
                />
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateYear(-1)}
                    className="text-lg font-semibold hover:text-blue-600 min-h-[44px] px-2"
                    {...getAccessibilityProps({ ariaLabel: 'Previous year' })}
                  >
                    {viewDate.getFullYear()}
                  </button>
                  <button
                    onClick={() => navigateYear(1)}
                    className="text-lg font-semibold hover:text-blue-600 min-h-[44px] px-2"
                    {...getAccessibilityProps({ ariaLabel: `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}` })}
                  >
                    {monthNames[viewDate.getMonth()]}
                  </button>
                </div>
                
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => navigateMonth(1)}
                  className="min-w-[44px] min-h-[44px]"
                  icon="›"
                  {...getAccessibilityProps({ ariaLabel: 'Next month' })}
                />
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                  const isTodayDate = isToday(date);
                  const isWeekendDate = isWeekend(date);
                  const disabled = isDateDisabled(date);

                  return (
                    <motion.button
                      key={index}
                      data-date={date.toISOString()}
                      whileHover={{ scale: disabled ? 1 : 1.1 }}
                      whileTap={{ scale: disabled ? 1 : 0.9 }}
                      onClick={() => !disabled && handleDateSelect(date)}
                      disabled={disabled}
                      className={`
                        min-h-[44px] min-w-[44px] text-sm rounded-lg transition-all duration-150
                        ${!isCurrentMonth ? 'text-gray-300' : ''}
                        ${isSelected 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : disabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'hover:bg-blue-100 text-gray-700'
                        }
                        ${isTodayDate && highlightToday && !isSelected ? 'bg-blue-50 border border-blue-300' : ''}
                        ${isWeekendDate && highlightWeekends && !isSelected && !disabled ? 'text-blue-600' : ''}
                      `}
                      {...getAccessibilityProps({
                        ariaLabel: `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                        ariaSelected: isSelected
                      })}
                    >
                      {date.getDate()}
                    </motion.button>
                  );
                })}
              </div>

              {/* Time Picker */}
              {showTime && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <select
                      value={selectedTime.getHours()}
                      onChange={(e) => handleTimeChange(parseInt(e.target.value), selectedTime.getMinutes())}
                      className="px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: timeFormat === '12h' ? 12 : 24 }, (_, i) => {
                        const hour = timeFormat === '12h' ? i + 1 : i;
                        const displayHour = timeFormat === '12h' && hour === 0 ? 12 : hour;
                        return (
                          <option key={hour} value={timeFormat === '12h' ? hour % 12 : hour}>
                            {displayHour.toString().padStart(2, '0')}
                          </option>
                        );
                      })}
                    </select>
                    <span>:</span>
                    <select
                      value={selectedTime.getMinutes()}
                      onChange={(e) => handleTimeChange(selectedTime.getHours(), parseInt(e.target.value))}
                      className="px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {timeFormat === '12h' && (
                      <select
                        value={selectedTime.getHours() >= 12 ? 'PM' : 'AM'}
                        onChange={(e) => {
                          const isPM = e.target.value === 'PM';
                          const newHours = isPM 
                            ? selectedTime.getHours() < 12 
                              ? selectedTime.getHours() + 12 
                              : selectedTime.getHours()
                            : selectedTime.getHours() >= 12 
                              ? selectedTime.getHours() - 12 
                              : selectedTime.getHours();
                          handleTimeChange(newHours, selectedTime.getMinutes());
                        }}
                        className="px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    const today = new Date();
                    handleDateSelect(today);
                    setViewDate(today);
                  }}
                  className="text-blue-600"
                >
                  Today
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  {showTime && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => setIsOpen(false)}
                    >
                      Done
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;