import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react';
import React from 'react';
import {
  useFocusManagement,
  manageFocus,
  useFocusTrap,
  useAutoFocus,
  useKeyboardNavigation,
  announceToScreenReader,
  useLiveRegion,
  useAriaLiveRegion,
  SkipNavigation,
  generateAriaLabel,
  checkColorContrast,
  respectsReducedMotion,
  useReducedMotion,
  generateFormIds,
  accessibilityRoles,
  getAccessibilityProps,
  focusElement
} from '../../src/utils/accessibility';

// Mock DOM APIs and setup
const createMockElement = () => ({
  focus: vi.fn(),
  getAttribute: vi.fn(),
  setAttribute: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  querySelectorAll: vi.fn(() => []),
  contains: vi.fn(() => false),
  blur: vi.fn(),
  click: vi.fn(),
  scrollIntoView: vi.fn(),
  style: {},
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn()
  },
  dataset: {},
  offsetWidth: 100,
  offsetHeight: 100
});

let mockElement;

beforeEach(() => {
  mockElement = createMockElement();
  vi.clearAllMocks();
  // Clean up any ARIA live regions from previous tests
  document.querySelectorAll('[aria-live]').forEach(el => el.remove());
});

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

  it('handles ARIA props directly', () => {
    const props = getAccessibilityProps({
      'aria-describedby': 'help-text',
      'aria-labelledby': 'title',
      'aria-controls': 'menu'
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
    // Ensure container has dimensions
    Object.defineProperty(container, 'offsetWidth', { value: 100 });
    Object.defineProperty(container, 'offsetHeight', { value: 100 });
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('finds and focuses first focusable element', () => {
    const button = document.createElement('button');
    button.textContent = 'Test Button';
    // Ensure button has dimensions
    Object.defineProperty(button, 'offsetWidth', { value: 50 });
    Object.defineProperty(button, 'offsetHeight', { value: 20 });
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
    // Ensure buttons have dimensions
    Object.defineProperty(button1, 'offsetWidth', { value: 50 });
    Object.defineProperty(button1, 'offsetHeight', { value: 20 });
    Object.defineProperty(button2, 'offsetWidth', { value: 50 });
    Object.defineProperty(button2, 'offsetHeight', { value: 20 });

    container.appendChild(button1);
    container.appendChild(button2);

    const spy = vi.spyOn(button2, 'focus');
    manageFocus.focusLastElement(container);

    expect(spy).toHaveBeenCalled();
  });

  it('finds all focusable elements', () => {
    const button = document.createElement('button');
    const input = document.createElement('input');
    input.type = 'text'; // Specify input type
    const link = document.createElement('a');
    link.href = '#';

    // Ensure elements have dimensions
    Object.defineProperty(button, 'offsetWidth', { value: 50 });
    Object.defineProperty(button, 'offsetHeight', { value: 20 });
    Object.defineProperty(input, 'offsetWidth', { value: 50 });
    Object.defineProperty(input, 'offsetHeight', { value: 20 });
    Object.defineProperty(link, 'offsetWidth', { value: 50 });
    Object.defineProperty(link, 'offsetHeight', { value: 20 });

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

    // Ensure buttons have dimensions
    Object.defineProperty(button1, 'offsetWidth', { value: 50 });
    Object.defineProperty(button1, 'offsetHeight', { value: 20 });
    Object.defineProperty(button2, 'offsetWidth', { value: 50 });
    Object.defineProperty(button2, 'offsetHeight', { value: 20 });

    container.appendChild(button1);
    container.appendChild(button2);

    const focusable = manageFocus.getFocusableElements(container);
    expect(focusable).toHaveLength(1);
    expect(focusable[0]).toBe(button1);
  });

  it('excludes elements with tabindex -1', () => {
    const button1 = document.createElement('button');
    const div = document.createElement('div');
    div.tabIndex = -1;

    // Ensure buttons have dimensions
    Object.defineProperty(button1, 'offsetWidth', { value: 50 });
    Object.defineProperty(button1, 'offsetHeight', { value: 20 });
    Object.defineProperty(div, 'offsetWidth', { value: 50 });
    Object.defineProperty(div, 'offsetHeight', { value: 20 });

    container.appendChild(button1);
    container.appendChild(div);

    const focusable = manageFocus.getFocusableElements(container);
    expect(focusable).toHaveLength(1);
    expect(focusable[0]).toBe(button1);
  });
});describe('announceToScreenReader', () => {
  beforeEach(() => {
    // Clear any existing announcements
    const existing = document.querySelector('[aria-live]');
    if (existing) {
      document.body.removeChild(existing);
    }
  });

  it('creates aria-live region and announces message', () => {
    announceToScreenReader('Test announcement');

    const liveRegion = document.querySelector('[aria-live]');
    expect(liveRegion).toBeTruthy();
    expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    expect(liveRegion.textContent).toBe('Test announcement');
  });

  it('handles multiple announcements', () => {
    announceToScreenReader('First announcement');
    announceToScreenReader('Second announcement');

    // Both should exist initially since they auto-remove after 1 second
    const liveRegions = document.querySelectorAll('[aria-live]');
    expect(liveRegions.length).toBeGreaterThanOrEqual(1);
    // At least one should have the latest message
    const latestRegion = Array.from(liveRegions).find(region => 
      region.textContent === 'Second announcement'
    );
    expect(latestRegion).toBeTruthy();
  });  it('handles empty message', () => {
    announceToScreenReader('');

    const liveRegion = document.querySelector('[aria-live]');
    expect(liveRegion).toBeTruthy();
    expect(liveRegion.textContent).toBe('');
  });
});

describe('useKeyboardNavigation Hook', () => {
  let mockItems;
  let mockOnSelect;

  beforeEach(() => {
    mockItems = ['item1', 'item2', 'item3'];
    mockOnSelect = vi.fn();
  });

  it('returns navigation state and handler', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(mockItems, mockOnSelect)
    );

    expect(result.current).toHaveProperty('activeIndex');
    expect(result.current).toHaveProperty('setActiveIndex');
    expect(result.current).toHaveProperty('keyDownHandler');
    expect(typeof result.current.keyDownHandler).toBe('function');
  });

  it('handles arrow key navigation', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(mockItems, mockOnSelect)
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });

    result.current.keyDownHandler(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('handles Enter key to select', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(mockItems, mockOnSelect)
    );

    result.current.setActiveIndex(0);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });

    result.current.keyDownHandler(event);
    expect(mockOnSelect).toHaveBeenCalledWith('item1', 0);
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
});

describe('useAriaLiveRegion Hook', () => {
  it('returns announce function and LiveRegion component', () => {
    const { result } = renderHook(() => useAriaLiveRegion());

    expect(result.current.announce).toBeInstanceOf(Function);
    expect(result.current.LiveRegion).toBeInstanceOf(Function);
  });

  it('announces messages through the LiveRegion component', () => {
    const { result } = renderHook(() => useAriaLiveRegion());

    const { container } = render(<result.current.LiveRegion />);

    act(() => {
      result.current.announce('Test message');
    });

    const liveRegion = container.querySelector('[aria-live]');
    expect(liveRegion).toBeTruthy();
    expect(liveRegion.textContent).toBe('Test message');
  });

  it('supports custom politeness level', () => {
    const { result } = renderHook(() => useAriaLiveRegion('assertive'));

    const { container } = render(<result.current.LiveRegion />);

    const liveRegion = container.querySelector('[aria-live]');
    expect(liveRegion.getAttribute('aria-live')).toBe('assertive');
  });

  it('cleans up announcements after timeout', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useAriaLiveRegion());

    const { container } = render(<result.current.LiveRegion />);

    act(() => {
      result.current.announce('Test message');
    });

    expect(container.querySelector('[aria-live]').textContent).toBe('Test message');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(container.querySelector('[aria-live]').textContent).toBe('');

    vi.useRealTimers();
  });
});describe('generateAriaLabel', () => {
  it('generates button labels', () => {
    expect(generateAriaLabel('button', { text: 'Save' })).toBe('Save');
    expect(generateAriaLabel('button', { loading: true, text: 'Save' })).toBe('Save - Loading');
    expect(generateAriaLabel('button', { disabled: true, text: 'Save' })).toBe('Save - Disabled');
  });

  it('generates link labels', () => {
    expect(generateAriaLabel('link', { text: 'Home' })).toBe('Home');
    expect(generateAriaLabel('link', { external: true, text: 'External' })).toBe('External - Opens in new window');
  });

  it('generates input labels', () => {
    expect(generateAriaLabel('input', { label: 'Email' })).toBe('Email');
    expect(generateAriaLabel('input', { label: 'Email', required: true })).toBe('Email - Required');
    expect(generateAriaLabel('input', { label: 'Email', error: 'Invalid' })).toBe('Email - Error: Invalid');
  });
});

describe('checkColorContrast', () => {
  it('calculates contrast ratio correctly', () => {
    const result = checkColorContrast('#000000', '#FFFFFF');
    expect(result.ratio).toBeGreaterThan(20);
    expect(result.passes.aa).toBe(true);
    expect(result.passes.aaa).toBe(true);
  });

  it('identifies failing contrast', () => {
    const result = checkColorContrast('#888888', '#999999');
    expect(result.passes.aa).toBe(false);
    expect(result.passes.aaa).toBe(false);
  });
});

describe('respectsReducedMotion', () => {
  it('returns false when matchMedia is not available', () => {
    const originalMatchMedia = window.matchMedia;
    delete window.matchMedia;

    expect(respectsReducedMotion()).toBe(false);

    window.matchMedia = originalMatchMedia;
  });

  it('checks for reduced motion preference', () => {
    const mockMatchMedia = vi.fn(() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    window.matchMedia = mockMatchMedia;

    expect(respectsReducedMotion()).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});

describe('useReducedMotion', () => {
  it('returns current reduced motion preference', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(typeof result.current).toBe('boolean');
  });
});

describe('generateFormIds', () => {
  it('generates form element IDs', () => {
    const ids = generateFormIds('contact');
    expect(ids).toEqual({
      input: 'contact-input',
      label: 'contact-label',
      error: 'contact-error',
      description: 'contact-description',
      help: 'contact-help'
    });
  });
});

describe('accessibilityRoles', () => {
  it('provides predefined role configurations', () => {
    expect(accessibilityRoles.button).toEqual({
      role: 'button',
      tabIndex: 0
    });

    expect(accessibilityRoles.dialog).toEqual({
      role: 'dialog',
      'aria-modal': true
    });
  });
});

describe('SkipNavigation Component', () => {
  it('renders skip links', () => {
    render(<SkipNavigation />);

    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    expect(screen.getByText('Skip to navigation')).toBeInTheDocument();
    expect(screen.getByText('Skip to footer')).toBeInTheDocument();
  });

  it('supports custom links', () => {
    const customLinks = [
      { href: '#content', text: 'Skip to content' }
    ];

    render(<SkipNavigation links={customLinks} />);

    expect(screen.getByText('Skip to content')).toBeInTheDocument();
  });
});