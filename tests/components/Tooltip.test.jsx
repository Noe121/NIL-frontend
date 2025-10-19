import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Tooltip from '../../src/components/Tooltip.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, variants, initial, animate, exit, role, className, ...props }, ref) => (
      <div 
        ref={ref} 
        {...props}
        role={role}
        className={className}
        data-testid={props['data-testid']}
      >
        {children}
      </div>
    ))
  },
  AnimatePresence: ({ children, mode }) => children
}));

  // Mock responsive utilities
const mockIsMobile = { isMobile: false };
vi.mock('../../src/utils/responsive.jsx', () => ({
  useScreenSize: () => ({ ...mockIsMobile })
}));// Mock accessibility utilities
vi.mock('../../src/utils/accessibility.jsx', () => ({
  getAccessibilityProps: (props) => props
}));

describe('Tooltip Component', () => {
  const content = 'This is a tooltip';
  const trigger = <button>Hover me</button>;

  it('renders trigger element', () => {
    render(<Tooltip content={content}>{trigger}</Tooltip>);
    const button = screen.getByRole('button', { name: 'Hover me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    await user.hover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(content);
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });

  it('hides tooltip on unhover', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.unhover(button);
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    render(<Tooltip content={content} trigger="focus">{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    await act(async () => {
      button.focus();
    });

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(content);
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });

  it('hides tooltip on blur', async () => {
    render(
      <div>
        <Tooltip content={content} trigger="focus">{trigger}</Tooltip>
        <button>Other button</button>
      </div>
    );

    const button = screen.getByRole('button', { name: 'Hover me' });
    const otherButton = screen.getByRole('button', { name: 'Other button' });
    
    await act(async () => {
      button.focus();
    });

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    });

    await act(async () => {
      otherButton.focus();
    });

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('positions tooltip correctly', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} position="top">{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    await user.hover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('class', expect.stringContaining('absolute'));
      expect(tooltip).toHaveAttribute('class', expect.stringContaining('bottom-full'));
      expect(tooltip).toHaveAttribute('class', expect.stringContaining('left-1/2'));
      expect(tooltip).toHaveAttribute('class', expect.stringContaining('transform'));
      expect(tooltip).toHaveAttribute('class', expect.stringContaining('-translate-x-1/2'));
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
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
        expect(button).toHaveAttribute('aria-expanded', 'true');
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-describedby', tooltip.id);
      });

      unmount();
    }
  });

  it('respects show prop for controlled display', async () => {
    const { rerender } = render(
      <Tooltip content={content} show={true}>{trigger}</Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover me' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);

    // Should hide when show is false
    rerender(
      <Tooltip content={content} show={false}>{trigger}</Tooltip>
    );
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    // Should show again when show is true
    rerender(
      <Tooltip content={content} show={true}>{trigger}</Tooltip>
    );
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const newTooltip = screen.getByRole('tooltip');
      expect(newTooltip).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-describedby', newTooltip.id);
    });
  });

  it('respects delay prop', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} delay={100}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    
    await user.hover(button);

    // Should not show immediately
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Should show after delay
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    }, { timeout: 200 });
  });

  it('supports custom arrow styling', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} arrow={true}>{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    await user.hover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });

  it('supports dark theme', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} theme="dark">{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    await user.hover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });

  it('supports light theme', async () => {
    const user = userEvent.setup();
    
    render(<Tooltip content={content} theme="light">{trigger}</Tooltip>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    await user.hover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });
});

describe('Tooltip Touch Interactions', () => {
  const content = 'Touch tooltip';
  const trigger = <button>Touch me</button>;

  it('shows tooltip on touch start', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content={content} trigger="click">
        {trigger}
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Touch me' });
    
    // Use act for the click to ensure all updates are processed
    await act(async () => {
      await user.click(button);
    });

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(content);
  });

  it('hides tooltip on touch end', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content={content} trigger="click">
        {trigger}
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Touch me' });
    
    // Show tooltip
    await act(async () => {
      await user.click(button);
    });

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    // Hide tooltip
    await act(async () => {
      await user.click(button);
    });

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('handles touch outside to close', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content={content} trigger="click">
          {trigger}
        </Tooltip>
        <button>Outside area</button>
      </div>
    );

    const button = screen.getByRole('button', { name: 'Touch me' });
    const outside = screen.getByRole('button', { name: 'Outside area' });
    
    // Show tooltip
    await act(async () => {
      await user.click(button);
    });

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    // Click outside
    await act(async () => {
      await user.click(outside);
    });

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});

describe('Tooltip Mobile Responsiveness', () => {
  const content = 'Mobile tooltip';
  const trigger = <button type="button">Mobile button</button>;

  it('adapts positioning for mobile', async () => {
    vi.useFakeTimers();
    Object.assign(mockIsMobile, { isMobile: true });
    const content = 'Mobile tooltip';
    const trigger = <button type="button">Mobile button</button>;
    render(
      <Tooltip content={content} trigger="click">
        {trigger}
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Mobile button' });
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    vi.advanceTimersByTime(100);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const tooltipContent = screen.getByTestId('tooltip-content');
    expect(tooltipContent.className).toContain('text-base');
    expect(tooltipContent.className).toContain('px-4');
    expect(tooltipContent.className).toContain('py-3');
    
    Object.assign(mockIsMobile, { isMobile: false });
    vi.useRealTimers();
  });

  it('uses touch-friendly interactions on mobile', async () => {
    vi.useFakeTimers();
    
    render(
      <Tooltip content={content} trigger="click">
        <button type="button">Mobile button</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Mobile button' });
    
    // First click to show
    fireEvent.click(button);
    vi.advanceTimersByTime(100);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    // Second click to hide
    fireEvent.click(button);
    vi.advanceTimersByTime(100);

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Should show again on next click
    fireEvent.click(button);
    vi.advanceTimersByTime(100);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('auto-hides after delay on mobile', async () => {
    vi.useFakeTimers();
    const hideDelay = 1000;
    Object.assign(mockIsMobile, { isMobile: true });
    
    render(
      <Tooltip content={content} trigger="click" hideDelay={hideDelay}>
        {trigger}
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Mobile button' });
    expect(button).toBeInTheDocument();
    
    // Show tooltip
    fireEvent.click(button);
    vi.advanceTimersByTime(100);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    // Advance timer for auto-hide delay
    act(() => {
      vi.runAllTimers();
    });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    
    Object.assign(mockIsMobile, { isMobile: false });
    vi.useRealTimers();
  });
});

describe('Tooltip Accessibility', () => {
  const content = 'Accessible tooltip';
  
  it('has proper ARIA attributes', async () => {
    render(
      <Tooltip content={content} trigger="click" show={true}>
        <button type="button">Accessible button</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Accessible button' });
    expect(button).toBeInTheDocument();

    const tooltipElement = screen.getByRole('tooltip');
    expect(tooltipElement).toBeInTheDocument();
    expect(tooltipElement).toHaveTextContent(content);

    // Each tooltip should have a unique ID
    const tooltipId = tooltipElement.getAttribute('id');
    expect(tooltipId).toMatch(/^tooltip-\d+$/);
    expect(button).toHaveAttribute('aria-describedby', tooltipId);
  });

  it('creates proper ARIA relationships', async () => {
    render(
      <Tooltip content={content} trigger="click" show={true}>
        <button type="button">Accessible button</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Accessible button' });
    const tooltip = screen.getByRole('tooltip');
    
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports keyboard navigation', async () => {
    vi.useFakeTimers();
    
    render(
      <Tooltip content={content} trigger="focus">
        <button type="button">Accessible button</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    act(() => {
      button.focus();
      fireEvent.focus(button);
    });
    vi.advanceTimersByTime(100);

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    const tooltipContainer = screen.getByRole('tooltip');
    expect(tooltipContainer).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('handles escape key to close', async () => {
    vi.useFakeTimers();
    
    render(
      <Tooltip content={content} trigger="click">
        <button type="button">Accessible button</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    fireEvent.click(button);
    vi.advanceTimersByTime(100);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    fireEvent.keyDown(button, { key: 'Escape' });
    vi.advanceTimersByTime(100);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');

    vi.useRealTimers();
  });

  it('maintains focus on trigger element', async () => {
    vi.useFakeTimers();
    
    render(
      <Tooltip content={content} trigger="focus">
        <button type="button">Accessible button</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    act(() => {
      button.focus();
      fireEvent.focus(button);
    });
    vi.advanceTimersByTime(100);
    
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    expect(button).toHaveFocus();

    vi.useRealTimers();
  });

  it('respects prefers-reduced-motion', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip content={content}>
        <button type="button">Accessible button</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Accessible button' });
    
    await user.hover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(content);
    });
  });
});

describe('Tooltip Performance', () => {
  const content = 'Performance tooltip';
  const trigger = <button>Performance button</button>;

  it('handles rapid hover events', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip content={content}>
        {trigger}
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Performance button' });
    
    // Initial hover to show tooltip
    await user.hover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    });

    // Unhover to hide tooltip
    await user.unhover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<Tooltip content={content}>{trigger}</Tooltip>);
    const button = screen.getByRole('button', { name: 'Performance button' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    unmount();

    // Component should unmount without errors
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 100,
  height: 50,
  top: 100,
  left: 100,
  bottom: 150,
  right: 200,
  x: 100,
  y: 100,
  toJSON: () => ({})
}));

describe('Debug', () => {
  it('renders something', () => {
    const { container } = render(<Tooltip content="test"><button>Test</button></Tooltip>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('exact copy of failing test with fake timers and mobile', async () => {
    vi.useFakeTimers();
    Object.assign(mockIsMobile, { isMobile: true });
    const content = 'Touch tooltip';
    const trigger = <button type="button">Touch me</button>;
    render(
      <Tooltip content={content} trigger="click">
        {trigger}
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Touch me' });
    expect(button).toBeInTheDocument();
    vi.useRealTimers();
    Object.assign(mockIsMobile, { isMobile: false });
  });
});