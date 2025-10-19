import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Dropdown, { DropdownItem, DropdownDivider, DropdownHeader } from '../../src/components/Dropdown.jsx';
import * as accessibility from '../../src/utils/accessibility.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
    button: React.forwardRef(({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>)
  },
  AnimatePresence: ({ children }) => children || null
}));

// Mock responsive utilities
vi.mock('../../src/utils/responsive.jsx', () => ({
  useScreenSize: () => ({ isMobile: false, isTablet: false, isDesktop: true }),
  useTouchGestures: (ref, handlers) => {
    if (ref && ref.current) {
      const { onSwipeLeft, onSwipeRight, onSwipeUp } = handlers;
      ref.current.swipeLeft = onSwipeLeft;
      ref.current.swipeRight = onSwipeRight;
      ref.current.swipeUp = onSwipeUp;
    }
  }
}));

// Mock accessibility utilities
vi.mock('../../src/utils/accessibility.jsx', () => ({
  getAccessibilityProps: (props) => props,
  focusElement: vi.fn((element) => {
    if (element) {
      element.focus();
      // Mock the focus by setting a data attribute for testing
      element.setAttribute('data-focused', 'true');
    }
  })
}));

describe('Dropdown Component', () => {
  const mockTrigger = <button>Open Dropdown</button>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger element', () => {
    render(
      <Dropdown trigger={mockTrigger}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );

    expect(screen.getByText('Open Dropdown')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    render(
      <Dropdown trigger={mockTrigger}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );

    const trigger = screen.getByText('Open Dropdown');
    
    await act(async () => {
      fireEvent.click(trigger);
    });

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
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

    const items = screen.getAllByRole('menuitem');
    
    // Wait for focus to move to first item
    await waitFor(() => {
      expect(accessibility.focusElement).toHaveBeenCalledWith(items[0]);
    });

    // Navigate down
    await user.keyboard('{ArrowDown}');
    expect(accessibility.focusElement).toHaveBeenCalledWith(items[1]);

    // Navigate up
    await user.keyboard('{ArrowUp}');
    expect(accessibility.focusElement).toHaveBeenCalledWith(items[0]);

    // Wrap around to last item
    await user.keyboard('{ArrowUp}');
    expect(accessibility.focusElement).toHaveBeenCalledWith(items[2]);
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

  it('indicates destructive action', () => {
    render(
      <DropdownItem destructive>
        Delete Item
      </DropdownItem>
    );

    const item = screen.getByRole('menuitem');
    expect(item).toHaveAttribute('data-destructive', 'true');
  });

  it('supports keyboard activation', async () => {
    const onClick = vi.fn();
    
    render(
      <DropdownItem onClick={onClick}>
        Keyboard Item
      </DropdownItem>
    );

    const item = screen.getByText('Keyboard Item');
    item.focus();
    
    fireEvent.keyDown(item, { key: 'Enter', code: 'Enter' });
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
  const originalResponsiveModule = vi.importActual('../../src/utils/responsive.jsx');
  
  beforeEach(() => {
    vi.doMock('../../src/utils/responsive.jsx', () => ({
      ...originalResponsiveModule,
      useScreenSize: () => ({
        isMobile: true,
        isTablet: false,
        isDesktop: false
      })
    }));
  });

  afterEach(() => {
    vi.resetModules();
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

    const backdrop = screen.getByTestId('dropdown-backdrop');
    expect(backdrop).toBeInTheDocument();
    
    // Click backdrop should close dropdown
    await user.click(backdrop);
    await waitFor(() => {
      expect(screen.queryByText('Mobile Item')).not.toBeInTheDocument();
    });
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
    
    // Initially focus should be manageable on trigger
    await user.tab();
    expect(trigger).toHaveFocus();

    // Open dropdown
    await user.click(trigger);
    
    // Focus should move to first menuitem
    const firstItem = screen.getByRole('menuitem', { name: 'First Item' });
    await waitFor(() => {
      expect(accessibility.focusElement).toHaveBeenCalledWith(firstItem);
    });

    // Close dropdown with Escape
    await user.keyboard('{Escape}');
    
    // Focus should return to trigger
    await waitFor(() => {
      expect(accessibility.focusElement).toHaveBeenCalledWith(trigger);
    });
  });
});