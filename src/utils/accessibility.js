import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Gets accessibility props for a component
 * @param {Object} props - The props to enhance with accessibility attributes
 * @returns {Object} Enhanced props with accessibility attributes
 */
export const getAccessibilityProps = (props = {}) => {
  const result = { ...props };

  // Handle role validation and combinations
  if (props.role) {
    const roles = props.role.split(' ');
    const invalidCombinations = [
      ['button', 'link'],
      ['heading', 'button'],
      ['img', 'button']
    ];

    for (const [role1, role2] of invalidCombinations) {
      if (roles.includes(role1) && roles.includes(role2)) {
        throw new Error('Invalid role combination');
      }
    }
  }

  // Handle ARIA attribute validation
  if (props.role === 'combobox' && !props.ariaExpanded) {
    throw new Error('Missing required ARIA attributes for combobox role');
  }

  // Handle ARIA attribute precedence
  if (props.ariaLabelledby && props.ariaLabel) {
    delete result.ariaLabel; // aria-labelledby takes precedence
  }

  // Convert camelCase to kebab-case for ARIA and data attributes
  const transformedProps = Object.keys(result).reduce((acc, key) => {
    if (key.startsWith('aria') && key !== key.toLowerCase()) {
      // Convert ariaLabel to aria-label
      const kebabKey = `aria-${key.slice(4).toLowerCase()}`;
      acc[kebabKey] = result[key];
    } else if (key.startsWith('data') && key !== key.toLowerCase()) {
      // Convert dataTestId to data-test-id
      const kebabKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      acc[kebabKey] = result[key];
    } else {
      acc[key] = result[key];
    }
    return acc;
  }, {});

  // Add WCAG compliance features
  const finalProps = {
    role: transformedProps.role,
    'aria-label': transformedProps['aria-label'],
    'aria-labelledby': transformedProps['aria-labelledby'],
    'aria-describedby': transformedProps['aria-describedby'],
    'aria-expanded': transformedProps['aria-expanded'],
    'aria-haspopup': transformedProps['aria-haspopup'],
    'aria-controls': transformedProps['aria-controls'],
    'aria-selected': transformedProps['aria-selected'],
    'aria-current': transformedProps['aria-current'],
    'aria-disabled': transformedProps['aria-disabled'],
    'aria-invalid': transformedProps['aria-invalid'],
    'aria-required': transformedProps['aria-required'],
    'aria-live': transformedProps['aria-live'],
    'aria-atomic': transformedProps['aria-atomic'],
    'aria-relevant': transformedProps['aria-relevant'],
    'aria-modal': transformedProps['aria-modal'],
    'aria-owns': transformedProps['aria-owns'],
    'aria-activedescendant': transformedProps['aria-activedescendant'],
    'aria-autocomplete': transformedProps['aria-autocomplete'],
    'aria-busy': transformedProps['aria-busy'],
    'aria-checked': transformedProps['aria-checked'],
    'aria-colcount': transformedProps['aria-colcount'],
    'aria-colindex': transformedProps['aria-colindex'],
    'aria-colspan': transformedProps['aria-colspan'],
    'aria-dropeffect': transformedProps['aria-dropeffect'],
    'aria-flowto': transformedProps['aria-flowto'],
    'aria-grabbed': transformedProps['aria-grabbed'],
    'aria-hidden': transformedProps['aria-hidden'],
    'aria-keyshortcuts': transformedProps['aria-keyshortcuts'],
    'aria-level': transformedProps['aria-level'],
    'aria-multiline': transformedProps['aria-multiline'],
    'aria-multiselectable': transformedProps['aria-multiselectable'],
    'aria-orientation': transformedProps['aria-orientation'],
    'aria-placeholder': transformedProps['aria-placeholder'],
    'aria-posinset': transformedProps['aria-posinset'],
    'aria-pressed': transformedProps['aria-pressed'],
    'aria-readonly': transformedProps['aria-readonly'],
    'aria-rowcount': transformedProps['aria-rowcount'],
    'aria-rowindex': transformedProps['aria-rowindex'],
    'aria-rowspan': transformedProps['aria-rowspan'],
    'aria-setsize': transformedProps['aria-setsize'],
    'aria-sort': transformedProps['aria-sort'],
    'aria-valuemax': transformedProps['aria-valuemax'],
    'aria-valuemin': transformedProps['aria-valuemin'],
    'aria-valuenow': transformedProps['aria-valuenow'],
    'aria-valuetext': transformedProps['aria-valuetext'],
    ...transformedProps
  };

  // Add touch target size utilities
  if (props.minTouchTarget) {
    finalProps.style = {
      ...finalProps.style,
      minWidth: '44px',
      minHeight: '44px'
    };
  }

  // Add skip link styles
  if (props.isSkipLink) {
    finalProps.className = `${finalProps.className || ''} skip-link`.trim();
    finalProps.style = {
      ...finalProps.style,
      position: 'absolute',
      transform: 'translateY(-100%)'
    };
  }

  // Add high contrast utilities
  if (props.highContrast) {
    finalProps.className = `${finalProps.className || ''} high-contrast`.trim();
    finalProps['data-high-contrast'] = true;
  }

  // Add reduced motion preferences
  if (props.respectReducedMotion) {
    finalProps['data-reduced-motion'] = true;
    finalProps.className = `${finalProps.className || ''} respect-motion-preferences`.trim();
  }

  // Add focus visibility
  if (props.focusVisible) {
    finalProps.className = `${finalProps.className || ''} focus-visible`.trim();
    finalProps.style = {
      ...finalProps.style,
      outlineWidth: '2px',
      outlineStyle: 'solid'
    };
  }

  return finalProps;
};

/**
 * Focus management utilities
 */
export const manageFocus = {
  getFocusableElements: (container) => {
    if (!container || typeof container.querySelectorAll !== 'function') {
      return [];
    }

    const focusableSelector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const elements = Array.from(container.querySelectorAll(focusableSelector));
    return elements.filter(el => {
      const style = window.getComputedStyle(el);
      // Check if element or any parent has tabindex="-1"
      let current = el;
      while (current) {
        if (current.getAttribute && current.getAttribute('tabindex') === '-1') {
          return false;
        }
        current = current.parentElement;
      }
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  },
  
  focusFirstElement: (container) => {
    const focusable = manageFocus.getFocusableElements(container);
    if (focusable.length > 0) {
      focusElement(focusable[0]);
      return true;
    }
    return false;
  },
  
  focusLastElement: (container) => {
    const focusable = manageFocus.getFocusableElements(container);
    if (focusable.length > 0) {
      focusElement(focusable[focusable.length - 1]);
      return true;
    }
    return false;
  }
};

/**
 * Focuses an element with proper handling
 * @param {HTMLElement} element - The element to focus
 * @param {Object} options - Focus options
 */
export const focusElement = (element, options = {}) => {
  if (!element) return false;
  
  if (typeof element.focus === 'function') {
    try {
      element.focus(options);
      return document.activeElement === element;
    } catch (error) {
      console.error('Error focusing element:', error);
    }
  }
  return false;
};

/**
 * Announces a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} politeness - The politeness setting ('polite' or 'assertive')
 */
export const announceToScreenReader = (message, politeness = 'polite') => {
  const region = document.querySelector(`[aria-live="${politeness}"]`) || createLiveRegion(politeness);
  region.textContent = message;
  
  setTimeout(() => {
    region.textContent = '';
  }, 1000);
};

// Helper to create a live region
const createLiveRegion = (politeness) => {
  const region = document.createElement('div');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  region.classList.add('sr-only');
  region.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
  document.body.appendChild(region);
  return region;
};

/**
 * Hook for keyboard navigation
 * @param {Object} ref - Reference to the container element
 * @param {Object} handlers - Keyboard event handlers
 */
export const useKeyboardNavigation = (ref, handlers) => {
  const handleKeyDown = useCallback((event) => {
    const { key } = event;
    if (handlers[key]) {
      event.preventDefault();
      handlers[key](event);
    }
  }, [handlers]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref, handleKeyDown]);
};

/**
 * Hook for focus trapping
 * @param {Object} ref - Reference to the container element
 * @param {boolean} enabled - Whether focus trapping is enabled
 */
export const useFocusTrap = (ref, enabled) => {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    // Store the previously focused element
    const prevActiveElement = document.activeElement;
    // Initial focus state
    let lastFocusedElement = null;

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      const focusableElements = manageFocus.getFocusableElements(element);
      if (focusableElements.length === 0) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      const isFirstElement = activeElement === firstFocusable;
      const isLastElement = activeElement === lastFocusable;
      const isInsideContainer = focusableElements.includes(activeElement);

      if (!isInsideContainer) {
        event.preventDefault();
        focusElement(firstFocusable);
        return;
      }

      if (event.shiftKey && isFirstElement) {
        event.preventDefault();
        focusElement(lastFocusable);
        lastFocusedElement = lastFocusable;
      } else if (!event.shiftKey && isLastElement) {
        event.preventDefault();
        focusElement(firstFocusable);
        lastFocusedElement = firstFocusable;
      } else {
        lastFocusedElement = activeElement;
      }
    };

    const handleFocusIn = (event) => {
      if (!element.contains(event.target)) {
        event.preventDefault();
        if (lastFocusedElement && element.contains(lastFocusedElement)) {
          focusElement(lastFocusedElement);
        } else {
          manageFocus.focusFirstElement(element);
        }
      }
    };

    // Initial focus
    requestAnimationFrame(() => {
      if (!element.contains(document.activeElement)) {
        manageFocus.focusFirstElement(element);
      }
    });

    element.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      if (enabled && prevActiveElement instanceof HTMLElement) {
        requestAnimationFrame(() => {
          prevActiveElement.focus({ preventScroll: true });
        });
      }
    };
  }, [ref, enabled]);
};

/**
 * Hook for ARIA live regions
 * @param {string} politeness - The politeness level for announcements ('polite' or 'assertive')
 * @returns {Object} An object containing the announce function
 */
export const useAriaLiveRegion = (politeness = 'polite') => {
  const regionRef = useRef(null);
  const timeoutRef = useRef(null);
  const messageQueueRef = useRef([]);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    // Create the live region
    const liveRegion = createLiveRegion(politeness);
    regionRef.current = liveRegion;
    isUnmountedRef.current = false;

    return () => {
      isUnmountedRef.current = true;
      // Clean up all timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Clear message queue
      messageQueueRef.current = [];
      // Remove the region from DOM if it exists
      if (liveRegion && document.body.contains(liveRegion)) {
        liveRegion.remove();
      }
      regionRef.current = null;
    };
  }, [politeness]);

  const processNextMessage = useCallback(() => {
    const region = regionRef.current;
    if (!region || isUnmountedRef.current) return;

    const nextMessage = messageQueueRef.current.shift();
    if (nextMessage) {
      const { text, duration } = nextMessage;
      region.textContent = text;

      timeoutRef.current = setTimeout(() => {
        if (!isUnmountedRef.current) {
          region.textContent = '';
          timeoutRef.current = null;

          // Process next message if any
          if (messageQueueRef.current.length > 0) {
            processNextMessage();
          }
        }
      }, duration);
    }
  }, []);

  const announce = useCallback((message, duration = 1000) => {
    if (!message || typeof message !== 'string') return;
    
    const region = regionRef.current;
    if (!region || isUnmountedRef.current) return;

    // Add message to queue
    messageQueueRef.current.push({ text: message, duration });

    // If no active announcement, process immediately
    if (!timeoutRef.current) {
      processNextMessage();
    }
  }, [processNextMessage]);

  return { announce };
};