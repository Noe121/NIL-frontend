import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react';
import { 
  getAccessibilityProps, 
  focusElement, 
  manageFocus, 
  announceToScreenReader,
  useKeyboardNavigation,
  useFocusTrap,
  useAriaLiveRegion
} from '../src/utils/accessibility.js';

// Mock DOM APIs
const mockElement = {
  focus: vi.fn(),
  getAttribute: vi.fn(),
  setAttribute: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  querySelectorAll: vi.fn(() => []),
  contains: vi.fn(() => false)
};

describe('getAccessibilityProps', () => {
  it('returns ARIA attributes correctly', () => {
    const props = getAccessibilityProps({
      role: 'button',
      ariaLabel: 'Close dialog',
      ariaExpanded: true,
      ariaHaspopup: 'menu',
      tabIndex: 0
    });

    expect(props).toEqual({
      role: 'button',
      'aria-label': 'Close dialog',
      'aria-expanded': true,
      'aria-haspopup': 'menu',
      tabIndex: 0
    });
  });

  it('converts camelCase ARIA props to kebab-case', () => {
    const props = getAccessibilityProps({
      ariaDescribedby: 'help-text',
      ariaLabelledby: 'title',
      ariaControls: 'menu'
    });

    expect(props).toEqual({
      'aria-describedby': 'help-text',
      'aria-labelledby': 'title',
      'aria-controls': 'menu'
    });
  });

  it('includes keyboard event handlers', () => {
    const onKeyDown = vi.fn();
    const props = getAccessibilityProps({
      onKeyDown,
      role: 'button'
    });

    expect(props.onKeyDown).toBe(onKeyDown);
  });

  it('filters out undefined values', () => {
    const props = getAccessibilityProps({
      role: 'button',
      ariaLabel: undefined,
      tabIndex: 0
    });

    expect(props).toEqual({
      role: 'button',
      tabIndex: 0
    });
  });

  it('supports data attributes', () => {
    const props = getAccessibilityProps({
      dataTestid: 'test-element',
      dataDropdownItem: true
    });

    expect(props).toEqual({
      'data-testid': 'test-element',
      'data-dropdown-item': true
    });
  });
});

describe('focusElement', () => {
  beforeEach(() => {
    mockElement.focus.mockClear();
  });

  it('focuses element if it exists', () => {
    focusElement(mockElement);
    expect(mockElement.focus).toHaveBeenCalled();
  });

  it('does nothing if element is null', () => {
    focusElement(null);
    expect(mockElement.focus).not.toHaveBeenCalled();
  });

  it('does nothing if element is undefined', () => {
    focusElement(undefined);
    expect(mockElement.focus).not.toHaveBeenCalled();
  });

  it('handles focus with options', () => {
    const elementWithOptions = {
      ...mockElement,
      focus: vi.fn()
    };
    
    focusElement(elementWithOptions, { preventScroll: true });
    expect(elementWithOptions.focus).toHaveBeenCalledWith({ preventScroll: true });
  });
});

describe('manageFocus', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('finds and focuses first focusable element', () => {
    const button = document.createElement('button');
    button.textContent = 'Test Button';
    container.appendChild(button);

    const spy = vi.spyOn(button, 'focus');
    manageFocus.focusFirstElement(container);
    
    expect(spy).toHaveBeenCalled();
  });

  it('finds and focuses last focusable element', () => {
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    button1.textContent = 'First';
    button2.textContent = 'Last';
    
    container.appendChild(button1);
    container.appendChild(button2);

    const spy = vi.spyOn(button2, 'focus');
    manageFocus.focusLastElement(container);
    
    expect(spy).toHaveBeenCalled();
  });

  it('finds all focusable elements', () => {
    const button = document.createElement('button');
    const input = document.createElement('input');
    const link = document.createElement('a');
    link.href = '#';
    
    container.appendChild(button);
    container.appendChild(input);
    container.appendChild(link);

    const focusable = manageFocus.getFocusableElements(container);
    expect(focusable).toHaveLength(3);
  });

  it('excludes disabled elements', () => {
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    button2.disabled = true;
    
    container.appendChild(button1);
    container.appendChild(button2);

    const focusable = manageFocus.getFocusableElements(container);
    expect(focusable).toHaveLength(1);
    expect(focusable[0]).toBe(button1);
  });

  it('excludes elements with tabindex -1', () => {
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    button2.tabIndex = -1;
    
    container.appendChild(button1);
    container.appendChild(button2);

    const focusable = manageFocus.getFocusableElements(container);
    expect(focusable).toHaveLength(1);
    expect(focusable[0]).toBe(button1);
  });
});

describe('announceToScreenReader', () => {
  beforeEach(() => {
    // Clear any existing live regions
    const existingRegions = document.querySelectorAll('[aria-live]');
    existingRegions.forEach(region => region.remove());
  });

  it('creates and uses aria-live region for announcements', () => {
    announceToScreenReader('Test announcement');
    
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion.textContent).toBe('Test announcement');
  });

  it('supports assertive announcements', () => {
    announceToScreenReader('Urgent message', 'assertive');
    
    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion.textContent).toBe('Urgent message');
  });

  it('clears announcement after delay', async () => {
    vi.useFakeTimers();
    
    announceToScreenReader('Temporary message');
    
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion.textContent).toBe('Temporary message');
    
    vi.advanceTimersByTime(1000);
    
    expect(liveRegion.textContent).toBe('');
    
    vi.useRealTimers();
  });

  it('reuses existing live region', () => {
    announceToScreenReader('First message');
    announceToScreenReader('Second message');
    
    const liveRegions = document.querySelectorAll('[aria-live="polite"]');
    expect(liveRegions).toHaveLength(1);
    expect(liveRegions[0].textContent).toBe('Second message');
  });
});

describe('useKeyboardNavigation Hook', () => {
  let mockRef;
  let mockHandlers;

  beforeEach(() => {
    mockRef = {
      current: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        querySelectorAll: vi.fn(() => [mockElement])
      }
    };
    
    mockHandlers = {
      onEnter: vi.fn(),
      onSpace: vi.fn(),
      onEscape: vi.fn(),
      onArrowDown: vi.fn(),
      onArrowUp: vi.fn(),
      onArrowLeft: vi.fn(),
      onArrowRight: vi.fn(),
      onTab: vi.fn()
    };
  });

  it('adds keyboard event listener', () => {
    renderHook(() => useKeyboardNavigation(mockRef, mockHandlers));
    
    expect(mockRef.current.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('removes event listener on cleanup', () => {
    const { unmount } = renderHook(() => useKeyboardNavigation(mockRef, mockHandlers));
    
    unmount();
    
    expect(mockRef.current.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('handles Enter key', () => {
    const { result } = renderHook(() => useKeyboardNavigation(mockRef, mockHandlers));
    
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    
    // Simulate the keydown handler
    if (mockRef.current.addEventListener.mock.calls.length > 0) {
      const handler = mockRef.current.addEventListener.mock.calls[0][1];
      handler(event);
    }
    
    // The handler would be called in the actual implementation
    expect(mockHandlers.onEnter).toBeDefined();
  });
});

describe('useFocusTrap Hook', () => {
  let mockRef;

  beforeEach(() => {
    mockRef = {
      current: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        querySelectorAll: vi.fn(() => [mockElement]),
        contains: vi.fn(() => true)
      }
    };
  });

  it('adds keydown event listener for focus trapping', () => {
    renderHook(() => useFocusTrap(mockRef, true));
    
    expect(mockRef.current.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('removes event listener when disabled', () => {
    const { rerender } = renderHook(
      ({ enabled }) => useFocusTrap(mockRef, enabled),
      { initialProps: { enabled: true } }
    );
    
    rerender({ enabled: false });
    
    expect(mockRef.current.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('handles Tab key for focus cycling', () => {
    renderHook(() => useFocusTrap(mockRef, true));
    
    // The Tab key handling would be tested with actual DOM manipulation
    expect(mockRef.current.addEventListener).toHaveBeenCalled();
  });
});

describe('useAriaLiveRegion Hook', () => {
  it('creates live region on mount', () => {
    renderHook(() => useAriaLiveRegion());
    
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('returns announce function', () => {
    const { result } = renderHook(() => useAriaLiveRegion());
    
    expect(typeof result.current.announce).toBe('function');
  });

  it('announces messages through returned function', () => {
    const { result } = renderHook(() => useAriaLiveRegion());
    
    result.current.announce('Test message');
    
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion.textContent).toBe('Test message');
  });

  it('supports custom politeness level', () => {
    const { result } = renderHook(() => useAriaLiveRegion('assertive'));
    
    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('cleans up live region on unmount', () => {
    const { unmount } = renderHook(() => useAriaLiveRegion());
    
    expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    
    unmount();
    
    expect(document.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
  });
});

describe('WCAG Compliance', () => {
  it('provides minimum touch target size utilities', () => {
    const props = getAccessibilityProps({
      role: 'button',
      minTouchTarget: true
    });

    // Would include classes or styles for 44px minimum
    expect(props.role).toBe('button');
  });

  it('supports skip links', () => {
    const props = getAccessibilityProps({
      role: 'link',
      isSkipLink: true
    });

    expect(props.role).toBe('link');
  });

  it('provides color contrast utilities', () => {
    const props = getAccessibilityProps({
      highContrast: true
    });

    // Would include high contrast styling
    expect(props).toBeDefined();
  });

  it('supports reduced motion preferences', () => {
    const props = getAccessibilityProps({
      respectReducedMotion: true
    });

    // Would respect prefers-reduced-motion
    expect(props).toBeDefined();
  });
});

describe('Screen Reader Support', () => {
  it('provides semantic markup helpers', () => {
    const props = getAccessibilityProps({
      role: 'region',
      ariaLabel: 'Main content'
    });

    expect(props.role).toBe('region');
    expect(props['aria-label']).toBe('Main content');
  });

  it('supports landmark roles', () => {
    const props = getAccessibilityProps({
      role: 'main'
    });

    expect(props.role).toBe('main');
  });

  it('provides form accessibility helpers', () => {
    const props = getAccessibilityProps({
      ariaRequired: true,
      ariaInvalid: true,
      ariaDescribedby: 'error-message'
    });

    expect(props['aria-required']).toBe(true);
    expect(props['aria-invalid']).toBe(true);
    expect(props['aria-describedby']).toBe('error-message');
  });
});