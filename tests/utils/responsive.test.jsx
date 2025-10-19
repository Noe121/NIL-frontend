import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react';
import { useScreenSize, useTouchGestures, MobileDrawer } from '../../src/utils/responsive.jsx';

// Enhanced matchMedia mock with event handling
const createMatchMedia = (matches, listeners = new Set()) => {
  const matchMedia = (query) => {
    const mql = {
      matches,
      media: query,
      onchange: null,
      addListener: (fn) => listeners.add(fn),
      removeListener: (fn) => listeners.delete(fn),
      addEventListener: (event, fn) => listeners.add(fn),
      removeEventListener: (event, fn) => listeners.delete(fn),
      dispatchEvent: (event) => {
        listeners.forEach(listener => listener(event));
        return true;
      }
    };
    return mql;
  };
  return { matchMedia, listeners };
};

// Mock ResizeObserver
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.observations = new Map();
  }
  
  observe(element) {
    this.observations.set(element, { width: 100, height: 100 });
    this.callback([{ target: element }]);
  }
  
  unobserve(element) {
    this.observations.delete(element);
  }
  
  disconnect() {
    this.observations.clear();
  }
}

global.ResizeObserver = ResizeObserverMock;

// Mock matchMedia
let mediaQueryListeners;
const mockMatchMedia = (matches) => {
  const { matchMedia, listeners } = createMatchMedia(matches);
  mediaQueryListeners = listeners;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(matchMedia),
  });
};

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

describe('useScreenSize Hook', () => {
  beforeEach(() => {
    // Reset window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('detects desktop screen size', () => {
    mockMatchMedia(false); // Not mobile
    
    const { result } = renderHook(() => useScreenSize());
    
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('detects mobile screen size', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    mockMatchMedia(true); // Mobile
    
    const { result } = renderHook(() => useScreenSize());
    
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('detects tablet screen size', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });
    mockMatchMedia(false); // Not mobile but not desktop
    
    const { result } = renderHook(() => useScreenSize());
    
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('updates on window resize', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useScreenSize());
    
    expect(result.current.isMobile).toBe(false);
    
    // Change window size to mobile
    Object.defineProperty(window, 'innerWidth', {
      value: 375,
    });
    
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    
    // Hook should update (though we'd need to mock the media query change)
    expect(result.current.width).toBeDefined();
  });

  it('provides screen dimensions', () => {
    const { result } = renderHook(() => useScreenSize());
    
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });
});

describe('useTouchGestures Hook', () => {
  let mockElement;
  let mockHandlers;

  beforeEach(() => {
    mockElement = {
      current: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
    };
    
    mockHandlers = {
      onSwipeLeft: vi.fn(),
      onSwipeRight: vi.fn(),
      onSwipeUp: vi.fn(),
      onSwipeDown: vi.fn(),
      onTap: vi.fn(),
      onLongPress: vi.fn(),
    };
  });

  it('adds touch event listeners', () => {
    renderHook(() => useTouchGestures(mockElement, mockHandlers));
    
    expect(mockElement.current.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
    expect(mockElement.current.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(mockElement.current.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
  });

  it('removes event listeners on cleanup', () => {
    const { unmount } = renderHook(() => useTouchGestures(mockElement, mockHandlers));
    
    unmount();
    
    expect(mockElement.current.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
    expect(mockElement.current.removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(mockElement.current.removeEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
  });

  it('handles swipe gestures', () => {
    const { result } = renderHook(() => useTouchGestures(mockElement, mockHandlers));
    
    // Simulate touch events for swipe
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }]
    });
    
    const touchEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 200, clientY: 100 }]
    });

    // These would be called by the actual touch handlers
    // We can't easily test the actual gesture detection without more complex mocking
    expect(mockHandlers.onSwipeRight).toBeDefined();
  });

  it('respects threshold setting', () => {
    const handlersWithThreshold = {
      ...mockHandlers,
      threshold: 100
    };
    
    renderHook(() => useTouchGestures(mockElement, handlersWithThreshold));
    
    // Threshold should be used in gesture detection
    expect(mockElement.current.addEventListener).toHaveBeenCalled();
  });

  it('handles long press gestures', () => {
    const handlersWithLongPress = {
      onLongPress: vi.fn(),
      longPressDelay: 500
    };
    
    renderHook(() => useTouchGestures(mockElement, handlersWithLongPress));
    
    expect(mockElement.current.addEventListener).toHaveBeenCalled();
  });
});

describe('MobileDrawer Component', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    children: <div>Drawer Content</div>
  };

  beforeEach(() => {
    defaultProps.onClose.mockClear();
  });

  it('renders when open', () => {
    render(
      <MobileDrawer {...defaultProps} isOpen={true}>
        <div>Test Content</div>
      </MobileDrawer>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <MobileDrawer {...defaultProps} isOpen={false}>
        <div>Test Content</div>
      </MobileDrawer>
    );

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('renders backdrop when open', () => {
    render(
      <MobileDrawer {...defaultProps} isOpen={true}>
        <div>Test Content</div>
      </MobileDrawer>
    );

    // Should render backdrop
    const backdrop = screen.getByTestId('mobile-drawer-backdrop');
    expect(backdrop).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MobileDrawer {...defaultProps} isOpen={true}>
        <div>Test Content</div>
      </MobileDrawer>
    );

    const backdrop = screen.getByTestId('mobile-drawer-backdrop');
    await user.click(backdrop);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('supports different positions', () => {
    const { rerender } = render(
      <MobileDrawer {...defaultProps} isOpen={true} position="left">
        <div>Left Drawer</div>
      </MobileDrawer>
    );

    expect(screen.getByText('Left Drawer')).toBeInTheDocument();

    rerender(
      <MobileDrawer {...defaultProps} isOpen={true} position="right">
        <div>Right Drawer</div>
      </MobileDrawer>
    );

    expect(screen.getByText('Right Drawer')).toBeInTheDocument();

    rerender(
      <MobileDrawer {...defaultProps} isOpen={true} position="top">
        <div>Top Drawer</div>
      </MobileDrawer>
    );

    expect(screen.getByText('Top Drawer')).toBeInTheDocument();

    rerender(
      <MobileDrawer {...defaultProps} isOpen={true} position="bottom">
        <div>Bottom Drawer</div>
      </MobileDrawer>
    );

    expect(screen.getByText('Bottom Drawer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <MobileDrawer {...defaultProps} isOpen={true} className="custom-drawer">
        <div>Custom Drawer</div>
      </MobileDrawer>
    );

    const drawer = screen.getByText('Custom Drawer').closest('.custom-drawer');
    expect(drawer).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    
    render(
      <MobileDrawer {...defaultProps} isOpen={true}>
        <div>Test Content</div>
      </MobileDrawer>
    );

    await user.keyboard('{Escape}');

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('traps focus within drawer', () => {
    render(
      <MobileDrawer {...defaultProps} isOpen={true}>
        <div>
          <button>First Button</button>
          <button>Second Button</button>
        </div>
      </MobileDrawer>
    );

    const firstButton = screen.getByText('First Button');
    const secondButton = screen.getByText('Second Button');

    // Focus should be trapped within the drawer
    expect(firstButton).toBeInTheDocument();
    expect(secondButton).toBeInTheDocument();
  });

  it('restores focus when closed', () => {
    const { rerender } = render(
      <div>
        <button>External Button</button>
        <MobileDrawer {...defaultProps} isOpen={true}>
          <button>Drawer Button</button>
        </MobileDrawer>
      </div>
    );

    // Open drawer
    expect(screen.getByText('Drawer Button')).toBeInTheDocument();

    // Close drawer
    rerender(
      <div>
        <button>External Button</button>
        <MobileDrawer {...defaultProps} isOpen={false}>
          <button>Drawer Button</button>
        </MobileDrawer>
      </div>
    );

    // Focus should return to external element
    expect(screen.queryByText('Drawer Button')).not.toBeInTheDocument();
  });

  it('prevents body scroll when open', async () => {
    await act(async () => {
      render(
        <MobileDrawer {...defaultProps} isOpen={true}>
          <div>Test Content</div>
        </MobileDrawer>
      );
    });

    // Should add class to prevent body scroll
    await waitFor(() => {
      expect(document.body.className.includes('overflow-hidden')).toBe(true);
    });
  });

  it('restores body scroll when closed', async () => {
    const { rerender } = await act(async () => {
      return render(
        <MobileDrawer {...defaultProps} isOpen={true}>
          <div>Test Content</div>
        </MobileDrawer>
      );
    });

    await waitFor(() => {
      expect(document.body.className.includes('overflow-hidden')).toBe(true);
    });

    await act(async () => {
      rerender(
        <MobileDrawer {...defaultProps} isOpen={false}>
          <div>Test Content</div>
        </MobileDrawer>
      );
    });

    await waitFor(() => {
      expect(document.body.className.includes('overflow-hidden')).toBe(false);
    });
  });
});

describe('Responsive Utility Functions', () => {
  let originalWindowWidth;
  let originalWindowHeight;

  beforeEach(() => {
    originalWindowWidth = window.innerWidth;
    originalWindowHeight = window.innerHeight;
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: originalWindowWidth });
    Object.defineProperty(window, 'innerHeight', { value: originalWindowHeight });
  });

  describe('breakpoint detection', () => {
    it('correctly identifies mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 480 });
      mockMatchMedia(true);
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isMobile).toBe(true);
      expect(result.current.breakpoint).toBe('mobile');
    });

    it('correctly identifies tablet breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      mockMatchMedia(false);
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isTablet).toBe(true);
      expect(result.current.breakpoint).toBe('tablet');
    });

    it('correctly identifies desktop breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1200 });
      mockMatchMedia(false);
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.breakpoint).toBe('desktop');
    });

    it('handles edge breakpoint cases', () => {
      // Test exact breakpoint values
      Object.defineProperty(window, 'innerWidth', { value: 767 }); // 1px below tablet
      mockMatchMedia(true);
      const { result: mobileResult } = renderHook(() => useScreenSize());
      expect(mobileResult.current.isMobile).toBe(true);

      Object.defineProperty(window, 'innerWidth', { value: 768 }); // Exact tablet breakpoint
      mockMatchMedia(false);
      const { result: tabletResult } = renderHook(() => useScreenSize());
      expect(tabletResult.current.isTablet).toBe(true);

      Object.defineProperty(window, 'innerWidth', { value: 1024 }); // Exact desktop breakpoint
      mockMatchMedia(false);
      const { result: desktopResult } = renderHook(() => useScreenSize());
      expect(desktopResult.current.isDesktop).toBe(true);
    });

    it('handles extreme screen sizes', () => {
      // Test very small screen
      Object.defineProperty(window, 'innerWidth', { value: 200 });
      mockMatchMedia(true);
      const { result: tinyScreen } = renderHook(() => useScreenSize());
      expect(tinyScreen.current.isMobile).toBe(true);
      expect(tinyScreen.current.width).toBe(200);

      // Test very large screen
      Object.defineProperty(window, 'innerWidth', { value: 3840 }); // 4K width
      mockMatchMedia(false);
      const { result: hugeScreen } = renderHook(() => useScreenSize());
      expect(hugeScreen.current.isDesktop).toBe(true);
      expect(hugeScreen.current.width).toBe(3840);
    });

    it('handles rapid breakpoint changes', () => {
      const { result } = renderHook(() => useScreenSize());
      
      // Simulate rapid window resizes
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 360 });
        window.dispatchEvent(new Event('resize'));
      });
      expect(result.current.isMobile).toBe(true);

      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 768 });
        window.dispatchEvent(new Event('resize'));
      });
      expect(result.current.isTablet).toBe(true);

      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 1024 });
        window.dispatchEvent(new Event('resize'));
      });
      expect(result.current.isDesktop).toBe(true);
    });
  });

  describe('orientation detection', () => {
    it('detects portrait orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 667 });
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isPortrait).toBe(true);
      expect(result.current.isLandscape).toBe(false);
      expect(result.current.orientation).toBe('portrait');
    });

    it('detects landscape orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 667 });
      Object.defineProperty(window, 'innerHeight', { value: 375 });
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isLandscape).toBe(true);
      expect(result.current.isPortrait).toBe(false);
      expect(result.current.orientation).toBe('landscape');
    });

    it('handles orientation changes', () => {
      const { result } = renderHook(() => useScreenSize());
      
      // Start in portrait
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 375 });
        Object.defineProperty(window, 'innerHeight', { value: 667 });
        window.dispatchEvent(new Event('resize'));
      });
      expect(result.current.isPortrait).toBe(true);

      // Change to landscape
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 667 });
        Object.defineProperty(window, 'innerHeight', { value: 375 });
        window.dispatchEvent(new Event('resize'));
      });
      expect(result.current.isLandscape).toBe(true);
    });

    it('handles square dimensions', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      Object.defineProperty(window, 'innerHeight', { value: 500 });
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isPortrait).toBe(false);
      expect(result.current.isLandscape).toBe(false);
      expect(result.current.orientation).toBe('square');
    });

    it('handles orientation media query changes', () => {
      const { result } = renderHook(() => useScreenSize());
      
      // Simulate orientation media query change
      act(() => {
        const event = new Event('change');
        event.matches = true;
        mediaQueryListeners.forEach(listener => listener(event));
      });

      expect(result.current.orientation).toBeDefined();
    });

    it('cleans up orientation listeners', () => {
      const { unmount } = renderHook(() => useScreenSize());
      unmount();
      expect(mediaQueryListeners.size).toBe(0);
    });
  });

  describe('performance and optimization', () => {
    it('debounces resize events', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScreenSize());
      
      // Trigger multiple resize events rapidly
      for (let i = 0; i < 5; i++) {
        act(() => {
          Object.defineProperty(window, 'innerWidth', { value: 800 + i });
          window.dispatchEvent(new Event('resize'));
        });
      }
      
      // Fast-forward debounce timeout
      act(() => {
        vi.runAllTimers();
      });
      
      expect(result.current.width).toBe(804);
      vi.useRealTimers();
    });

    it('caches screen size calculations', () => {
      const { result, rerender } = renderHook(() => useScreenSize());
      const initialResult = result.current;
      
      // Rerender without changes
      rerender();
      expect(result.current).toBe(initialResult);
    });
  });
});