// Accessibility utilities and hooks for WCAG 2.1 compliance

import { useEffect, useRef, useState } from 'react';

// Focus management utilities
export const useFocusManagement = () => {
  const focusableElementsSelector = `
    a[href]:not([disabled]),
    button:not([disabled]),
    textarea:not([disabled]),
    input[type="text"]:not([disabled]),
    input[type="radio"]:not([disabled]),
    input[type="checkbox"]:not([disabled]),
    input[type="email"]:not([disabled]),
    input[type="password"]:not([disabled]),
    input[type="number"]:not([disabled]),
    input[type="search"]:not([disabled]),
    input[type="tel"]:not([disabled]),
    input[type="url"]:not([disabled]),
    select:not([disabled]),
    [tabindex]:not([tabindex="-1"]):not([disabled]),
    [contenteditable]:not([contenteditable="false"])
  `;

  const getFocusableElements = (container = document) => {
    return Array.from(container.querySelectorAll(focusableElementsSelector))
      .filter(element => {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
      });
  };

  const trapFocus = (container) => {
    const focusableElements = getFocusableElements(container);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  return { getFocusableElements, trapFocus };
};

// Auto-focus hook for modals and dialogs
export const useAutoFocus = (enabled = true) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (enabled && elementRef.current) {
      // Small delay to ensure element is rendered
      const timeoutId = setTimeout(() => {
        elementRef.current.focus();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [enabled]);

  return elementRef;
};

// Keyboard navigation hook
export const useKeyboardNavigation = (items, onSelect, options = {}) => {
  const {
    loop = true,
    orientation = 'vertical', // 'vertical' | 'horizontal' | 'both'
    disabled = false
  } = options;

  const activeIndexRef = useRef(-1);

  const handleKeyDown = (e) => {
    if (disabled || !items || items.length === 0) return;

    const { key } = e;
    let newIndex = activeIndexRef.current;

    switch (key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = newIndex < items.length - 1 ? newIndex + 1 : (loop ? 0 : newIndex);
        }
        break;
      
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = newIndex > 0 ? newIndex - 1 : (loop ? items.length - 1 : newIndex);
        }
        break;
      
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = newIndex > 0 ? newIndex - 1 : (loop ? items.length - 1 : newIndex);
        }
        break;
      
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = newIndex < items.length - 1 ? newIndex + 1 : (loop ? 0 : newIndex);
        }
        break;
      
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      
      case 'Enter':
      case ' ':
        if (newIndex >= 0 && onSelect) {
          e.preventDefault();
          onSelect(items[newIndex], newIndex);
        }
        break;
      
      default:
        return;
    }

    activeIndexRef.current = newIndex;
  };

  return {
    activeIndex: activeIndexRef.current,
    setActiveIndex: (index) => { activeIndexRef.current = index; },
    keyDownHandler: handleKeyDown
  };
};

// Screen reader utilities
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Live region hook for dynamic content updates
export const useLiveRegion = () => {
  const regionRef = useRef(null);

  const announce = (message, priority = 'polite') => {
    if (regionRef.current) {
      regionRef.current.setAttribute('aria-live', priority);
      regionRef.current.textContent = message;
    }
  };

  const LiveRegion = ({ className = 'sr-only' }) => (
    <div
      ref={regionRef}
      aria-live="polite"
      aria-atomic="true"
      className={className}
    />
  );

  return { announce, LiveRegion };
};

// Skip navigation component
export const SkipNavigation = ({ links = [] }) => {
  const defaultLinks = [
    { href: '#main', text: 'Skip to main content' },
    { href: '#nav', text: 'Skip to navigation' },
    { href: '#footer', text: 'Skip to footer' }
  ];

  const skipLinks = links.length > 0 ? links : defaultLinks;

  return (
    <div className="skip-nav">
      {skipLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-nav-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:text-sm focus:font-medium"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector(link.href);
            if (target) {
              target.focus();
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
};

// ARIA label generators
export const generateAriaLabel = (type, context = {}) => {
  switch (type) {
    case 'button':
      if (context.loading) return `${context.text || 'Button'} - Loading`;
      if (context.disabled) return `${context.text || 'Button'} - Disabled`;
      return context.text || 'Button';
    
    case 'link':
      if (context.external) return `${context.text} - Opens in new window`;
      return context.text;
    
    case 'input':
      let label = context.label || 'Input';
      if (context.required) label += ' - Required';
      if (context.error) label += ` - Error: ${context.error}`;
      if (context.description) label += ` - ${context.description}`;
      return label;
    
    case 'navigation':
      return context.label || 'Navigation';
    
    case 'search':
      return `Search ${context.scope || ''}`.trim();
    
    default:
      return context.text || 'Interactive element';
  }
};

// Color contrast utilities
export const checkColorContrast = (foreground, background) => {
  // This is a simplified contrast checker
  // For production, use a more comprehensive library like wcag-contrast
  const getLuminance = (color) => {
    // Convert hex to RGB
    const rgb = parseInt(color.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    
    // Calculate relative luminance
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  const contrast = (lighter + 0.05) / (darker + 0.05);
  
  return {
    ratio: contrast,
    passes: {
      aa: contrast >= 4.5,
      aaa: contrast >= 7
    }
  };
};

// Reduced motion utilities
export const respectsReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => respectsReducedMotion()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Form accessibility helpers
export const generateFormIds = (baseName) => {
  const id = baseName.replace(/\s+/g, '-').toLowerCase();
  return {
    input: `${id}-input`,
    label: `${id}-label`,
    error: `${id}-error`,
    description: `${id}-description`,
    help: `${id}-help`
  };
};

// Role-based access patterns
export const accessibilityRoles = {
  button: {
    role: 'button',
    tabIndex: 0
  },
  link: {
    role: 'link'
  },
  navigation: {
    role: 'navigation'
  },
  main: {
    role: 'main'
  },
  banner: {
    role: 'banner'
  },
  contentinfo: {
    role: 'contentinfo'
  },
  search: {
    role: 'search'
  },
  dialog: {
    role: 'dialog',
    'aria-modal': true
  },
  alertdialog: {
    role: 'alertdialog',
    'aria-modal': true
  },
  menu: {
    role: 'menu'
  },
  menuitem: {
    role: 'menuitem'
  },
  listbox: {
    role: 'listbox'
  },
  option: {
    role: 'option'
  }
};

// Generate accessibility props
export const getAccessibilityProps = (props) => {
  const {
    ariaLabel,
    ariaDescribedBy,
    ariaExpanded,
    ariaHaspopup,
    ariaSelected,
    ariaControls,
    ariaLive,
    ariaModal,
    role,
    tabIndex,
    ...rest
  } = props;

  return {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHaspopup,
    'aria-selected': ariaSelected,
    'aria-controls': ariaControls,
    'aria-live': ariaLive,
    'aria-modal': ariaModal,
    role,
    tabIndex,
    ...rest
  };
};

export default {
  useFocusManagement,
  useAutoFocus,
  useKeyboardNavigation,
  useLiveRegion,
  useReducedMotion,
  announceToScreenReader,
  generateAriaLabel,
  checkColorContrast,
  respectsReducedMotion,
  generateFormIds,
  accessibilityRoles,
  getAccessibilityProps,
  SkipNavigation
};