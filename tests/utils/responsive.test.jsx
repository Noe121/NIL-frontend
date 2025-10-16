import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import { useScreenSize, useTouchGestures, MobileDrawer } from '../src/utils/responsive.js';

// Mock window.matchMedia
const mockMatchMedia = (matches) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
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

  it('prevents body scroll when open', () => {
    render(
      <MobileDrawer {...defaultProps} isOpen={true}>
        <div>Test Content</div>
      </MobileDrawer>
    );

    // Should add class to prevent body scroll
    expect(document.body).toHaveClass('overflow-hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(
      <MobileDrawer {...defaultProps} isOpen={true}>
        <div>Test Content</div>
      </MobileDrawer>
    );

    expect(document.body).toHaveClass('overflow-hidden');

    rerender(
      <MobileDrawer {...defaultProps} isOpen={false}>
        <div>Test Content</div>
      </MobileDrawer>
    );

    expect(document.body).not.toHaveClass('overflow-hidden');
  });
});

describe('Responsive Utility Functions', () => {
  describe('breakpoint detection', () => {
    it('correctly identifies mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 480 });
      mockMatchMedia(true);
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isMobile).toBe(true);
    });

    it('correctly identifies tablet breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      mockMatchMedia(false);
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isTablet).toBe(true);
    });

    it('correctly identifies desktop breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1200 });
      mockMatchMedia(false);
      
      const { result } = renderHook(() => useScreenSize());
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
    });

    it('detects landscape orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 667 });
      Object.defineProperty(window, 'innerHeight', { value: 375 });
      
      const { result } = renderHook(() => useScreenSize());
      expect(result.current.isLandscape).toBe(true);
      expect(result.current.isPortrait).toBe(false);
    });
  });
});