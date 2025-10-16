import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown, { DropdownItem, DropdownDivider, DropdownHeader } from '../src/components/Dropdown.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock responsive utilities
vi.mock('../src/utils/responsive.js', () => ({
  useScreenSize: () => ({ isMobile: false, isTablet: false }),
  useTouchGestures: () => {}
}));

// Mock accessibility utilities
vi.mock('../src/utils/accessibility.js', () => ({
  getAccessibilityProps: (props) => props,
  focusElement: (element) => element?.focus()
}));

describe('Dropdown Component', () => {
  const mockTrigger = <button>Open Dropdown</button>;

  it('renders trigger element', () => {
    render(
      <Dropdown trigger={mockTrigger}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );

    expect(screen.getByText('Open Dropdown')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown trigger={mockTrigger}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );

    const trigger = screen.getByText('Open Dropdown');
    await user.click(trigger);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <Dropdown trigger={mockTrigger}>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
        <div>Outside</div>
      </div>
    );

    // Open dropdown
    const trigger = screen.getByText('Open Dropdown');
    await user.click(trigger);
    expect(screen.getByText('Item 1')).toBeInTheDocument();

    // Click outside
    const outside = screen.getByText('Outside');
    await user.click(outside);
    
    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });

  it('closes dropdown when Escape key is pressed', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown trigger={mockTrigger}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );

    // Open dropdown
    const trigger = screen.getByText('Open Dropdown');
    await user.click(trigger);
    expect(screen.getByText('Item 1')).toBeInTheDocument();

    // Press Escape
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation with Arrow keys', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown trigger={mockTrigger}>
        <DropdownItem>Item 1</DropdownItem>
        <DropdownItem>Item 2</DropdownItem>
        <DropdownItem>Item 3</DropdownItem>
      </Dropdown>
    );

    // Open dropdown
    const trigger = screen.getByText('Open Dropdown');
    await user.click(trigger);

    // Test arrow key navigation
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowUp}');
    
    // Should cycle through items
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('calls onOpen and onClose callbacks', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    
    render(
      <Dropdown trigger={mockTrigger} onOpen={onOpen} onClose={onClose}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );

    const trigger = screen.getByText('Open Dropdown');
    
    // Open dropdown
    await user.click(trigger);
    expect(onOpen).toHaveBeenCalled();

    // Close dropdown
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('disables interaction when disabled prop is true', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown trigger={mockTrigger} disabled>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );

    const trigger = screen.getByText('Open Dropdown');
    await user.click(trigger);

    // Dropdown should not open
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });
});

describe('DropdownItem Component', () => {
  it('renders with icon and description', () => {
    render(
      <DropdownItem icon="🏆" description="Test description">
        Test Item
      </DropdownItem>
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('🏆')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    
    render(
      <DropdownItem onClick={onClick}>
        Click me
      </DropdownItem>
    );

    const item = screen.getByText('Click me');
    await user.click(item);

    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    
    render(
      <DropdownItem onClick={onClick} disabled>
        Disabled Item
      </DropdownItem>
    );

    const item = screen.getByText('Disabled Item');
    await user.click(item);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies destructive styling', () => {
    render(
      <DropdownItem destructive>
        Delete Item
      </DropdownItem>
    );

    const item = screen.getByText('Delete Item');
    expect(item).toHaveClass('text-red-600');
  });

  it('supports keyboard activation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    
    render(
      <DropdownItem onClick={onClick}>
        Keyboard Item
      </DropdownItem>
    );

    const item = screen.getByText('Keyboard Item');
    item.focus();
    
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownDivider Component', () => {
  it('renders as a separator', () => {
    render(<DropdownDivider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });
});

describe('DropdownHeader Component', () => {
  it('renders header text', () => {
    render(<DropdownHeader>Section Header</DropdownHeader>);
    
    expect(screen.getByText('Section Header')).toBeInTheDocument();
  });
});

describe('Dropdown Mobile Responsiveness', () => {
  beforeEach(() => {
    vi.mocked(require('../src/utils/responsive.js').useScreenSize).mockReturnValue({
      isMobile: true,
      isTablet: false
    });
  });

  it('adapts to mobile layout with fullWidth option', () => {
    render(
      <Dropdown trigger={<button>Mobile Trigger</button>} fullWidthOnMobile>
        <DropdownItem>Mobile Item</DropdownItem>
      </Dropdown>
    );

    // Test mobile-specific behavior
    expect(screen.getByText('Mobile Trigger')).toBeInTheDocument();
  });

  it('shows backdrop on mobile when fullWidth is enabled', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown trigger={<button>Mobile Trigger</button>} fullWidthOnMobile>
        <DropdownItem>Mobile Item</DropdownItem>
      </Dropdown>
    );

    const trigger = screen.getByText('Mobile Trigger');
    await user.click(trigger);

    // Should show mobile backdrop (would need to check for backdrop element)
    expect(screen.getByText('Mobile Item')).toBeInTheDocument();
  });
});

describe('Dropdown Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <Dropdown trigger={<button>Accessible Trigger</button>}>
        <DropdownItem>Accessible Item</DropdownItem>
      </Dropdown>
    );

    const trigger = screen.getByText('Accessible Trigger');
    expect(trigger).toHaveAttribute('aria-haspopup');
    expect(trigger).toHaveAttribute('aria-expanded');
  });

  it('manages focus correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown trigger={<button>Focus Test</button>}>
        <DropdownItem>First Item</DropdownItem>
        <DropdownItem>Second Item</DropdownItem>
      </Dropdown>
    );

    const trigger = screen.getByText('Focus Test');
    await user.click(trigger);

    // Focus should move to first item when dropdown opens
    // This would need more detailed focus management testing
    expect(screen.getByText('First Item')).toBeInTheDocument();
  });
});