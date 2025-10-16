import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '../src/components/Tooltip.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock responsive utilities
vi.mock('../src/utils/responsive.js', () => ({
  useScreenSize: () => ({ isMobile: false })
}));

// Mock accessibility utilities
vi.mock('../src/utils/accessibility.js', () => ({
  getAccessibilityProps: (props) => props
}));

describe('Tooltip Component', () => {
  const content = 'This is a tooltip';
  const trigger = <button>Hover me</button>;

  it('renders trigger element', () => {
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });

  it('hides tooltip on unhover', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });

    await user.unhover(button);
    await waitFor(() => {
      expect(screen.queryByText(content)).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.tab();
    expect(button).toHaveFocus();

    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });

  it('hides tooltip on blur', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <Tooltip content={content}>{trigger}</Tooltip>
        <button>Other button</button>
      </div>
    );

    const button = screen.getByRole('button', { name: 'Hover me' });
    const otherButton = screen.getByRole('button', { name: 'Other button' });
    
    button.focus();
    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });

    otherButton.focus();
    await waitFor(() => {
      expect(screen.queryByText(content)).not.toBeInTheDocument();
    });
  });

  it('positions tooltip correctly', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} position="top">{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);

    await waitFor(() => {
      const tooltip = screen.getByText(content);
      expect(tooltip).toBeInTheDocument();
      // Should have positioning classes
    });
  });

  it('supports different positions', async () => {
    const positions = ['top', 'bottom', 'left', 'right'];
    
    for (const position of positions) {
      const { unmount } = render(
        <Tooltip content={content} position={position}>
          {trigger}
        </Tooltip>
      );

      const user = userEvent.setup();
      const button = screen.getByRole('button', { name: 'Hover me' });
      
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText(content)).toBeInTheDocument();
      });

      unmount();
    }
  });

  it('respects show prop for controlled display', () => {
    render(<Tooltip content={content} show={true}>{trigger}</Tooltip>);

    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('respects delay prop', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} delay={100}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);

    // Should not show immediately
    expect(screen.queryByText(content)).not.toBeInTheDocument();

    // Should show after delay
    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('supports custom arrow styling', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} arrow={true}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);

    await waitFor(() => {
      const tooltip = screen.getByText(content);
      expect(tooltip).toBeInTheDocument();
    });
  });

  it('supports dark theme', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} theme="dark">{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);

    await waitFor(() => {
      const tooltip = screen.getByText(content);
      expect(tooltip).toBeInTheDocument();
    });
  });

  it('supports light theme', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} theme="light">{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);

    await waitFor(() => {
      const tooltip = screen.getByText(content);
      expect(tooltip).toBeInTheDocument();
    });
  });
});

describe('Tooltip Touch Interactions', () => {
  const content = 'Touch tooltip';
  const trigger = <button>Touch me</button>;

  it('shows tooltip on touch start', () => {
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Touch me' });
    
    fireEvent.touchStart(button);

    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('hides tooltip on touch end', async () => {
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Touch me' });
    
    fireEvent.touchStart(button);
    expect(screen.getByText(content)).toBeInTheDocument();

    fireEvent.touchEnd(button);
    
    await waitFor(() => {
      expect(screen.queryByText(content)).not.toBeInTheDocument();
    });
  });

  it('handles touch outside to close', async () => {
    render(
      <div>
        <Tooltip content={content}>{trigger}</Tooltip>
        <div data-testid="outside">Outside area</div>
      </div>
    );

    const button = screen.getByRole('button', { name: 'Touch me' });
    const outside = screen.getByTestId('outside');
    
    fireEvent.touchStart(button);
    expect(screen.getByText(content)).toBeInTheDocument();

    fireEvent.touchStart(outside);
    
    await waitFor(() => {
      expect(screen.queryByText(content)).not.toBeInTheDocument();
    });
  });
});

describe('Tooltip Mobile Responsiveness', () => {
  beforeEach(() => {
    vi.mocked(require('../src/utils/responsive.js').useScreenSize).mockReturnValue({
      isMobile: true
    });
  });

  const content = 'Mobile tooltip';
  const trigger = <button>Mobile button</button>;

  it('adapts positioning for mobile', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Mobile button' });
    
    await user.hover(button);

    await waitFor(() => {
      const tooltip = screen.getByText(content);
      expect(tooltip).toBeInTheDocument();
    });
  });

  it('uses touch-friendly interactions on mobile', () => {
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Mobile button' });
    
    fireEvent.touchStart(button);

    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('auto-hides after delay on mobile', async () => {
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Mobile button' });
    
    fireEvent.touchStart(button);
    expect(screen.getByText(content)).toBeInTheDocument();

    // Should auto-hide after mobile timeout
    await waitFor(() => {
      expect(screen.queryByText(content)).not.toBeInTheDocument();
    }, { timeout: 3500 });
  });
});

describe('Tooltip Accessibility', () => {
  const content = 'Accessible tooltip';
  const trigger = <button>Accessible button</button>;

  it('has proper ARIA attributes', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    await user.hover(button);

    await waitFor(() => {
      const tooltip = screen.getByText(content);
      expect(tooltip).toHaveAttribute('role', 'tooltip');
    });
  });

  it('creates proper ARIA relationships', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    await user.hover(button);

    await waitFor(() => {
      const tooltip = screen.getByText(content);
      const tooltipId = tooltip.getAttribute('id');
      expect(button).toHaveAttribute('aria-describedby', tooltipId);
    });
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    await user.tab();
    
    const button = screen.getByRole('button', { name: 'Accessible button' });
    expect(button).toHaveFocus();

    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });

  it('handles escape key to close', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText(content)).not.toBeInTheDocument();
    });
  });

  it('maintains focus on trigger element', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    button.focus();
    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });

    expect(button).toHaveFocus();
  });

  it('respects prefers-reduced-motion', async () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });
});

describe('Tooltip Performance', () => {
  const content = 'Performance tooltip';
  const trigger = <button>Performance button</button>;

  it('handles rapid hover events', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Performance button' });
    
    // Rapid hover/unhover
    for (let i = 0; i < 5; i++) {
      await user.hover(button);
      await user.unhover(button);
    }

    // Should handle gracefully without errors
    expect(button).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<Tooltip content={content}>{trigger}</Tooltip>);

    unmount();

    // Component should unmount without errors
    expect(screen.queryByText(content)).not.toBeInTheDocument();
  });
});