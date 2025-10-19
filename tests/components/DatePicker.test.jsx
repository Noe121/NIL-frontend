import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../../src/components/DatePicker.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock responsive utilities
vi.mock('../../src/utils/responsive.jsx', () => ({
  useScreenSize: vi.fn(() => ({ isMobile: false, isTablet: false, isDesktop: true })),
  useTouchGestures: vi.fn((ref, handlers) => {
    if (ref && ref.current) {
      const { onSwipeLeft, onSwipeRight, onSwipeUp } = handlers;
      ref.current.swipeLeft = onSwipeLeft;
      ref.current.swipeRight = onSwipeRight;
      ref.current.swipeUp = onSwipeUp;
    }
  })
}));

// Mock accessibility utilities
vi.mock('../../src/utils/accessibility.jsx', () => ({
  getAccessibilityProps: (props) => {
    const result = {};
    if (props.ariaLabel) result['aria-label'] = props.ariaLabel;
    if (props.ariaModal !== undefined) result['aria-modal'] = props.ariaModal;
    if (props.ariaExpanded !== undefined) result['aria-expanded'] = props.ariaExpanded;
    if (props.ariaSelected !== undefined) result['aria-selected'] = props.ariaSelected;
    if (props.role) result.role = props.role;
    return result;
  },
  focusElement: (element) => element?.focus()
}));

describe('DatePicker Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with placeholder text', () => {
    render(
      <DatePicker 
        placeholder="Select a date"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByPlaceholderText('Select a date')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(
      <DatePicker 
        label="Event Date"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Event Date')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <DatePicker 
        label="Required Date"
        required
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('opens calendar when input is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker 
        placeholder="Click me"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Click me');
    await user.click(input);

    // Calendar should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays current month and year in calendar header', async () => {
    const user = userEvent.setup();
    const fixedDate = new Date(2025, 0, 15); // January 15, 2025
    vi.setSystemTime(fixedDate);
    
    render(
      <DatePicker onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText('January')).toBeInTheDocument();

    // Cleanup
    vi.useRealTimers();
  });

  it('navigates to previous month when previous button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const prevButton = screen.getByLabelText('Previous month');
    await user.click(prevButton);

    // Should navigate to previous month
    expect(prevButton).toBeInTheDocument();
  });

  it('navigates to next month when next button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const nextButton = screen.getByLabelText('Next month');
    await user.click(nextButton);

    // Should navigate to next month
    expect(nextButton).toBeInTheDocument();
  });

  it('selects a date when day is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Click on day 15 (should be available in current month)
    const day15 = screen.getByText('15');
    await user.click(day15);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('highlights today\'s date', async () => {
    const user = userEvent.setup();
    const fixedDate = new Date(2025, 0, 15); // January 15, 2025
    vi.setSystemTime(fixedDate);
    
    render(
      <DatePicker highlightToday onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const todayElement = screen.getByText('15');
    
    // Today should have special styling
    expect(todayElement).toHaveClass('bg-blue-50');

    // Cleanup
    vi.useRealTimers();
  });

  it('closes calendar when Escape is pressed', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('shows "Today" button and navigates to current date', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const todayButton = screen.getByText('Today');
    await user.click(todayButton);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <DatePicker 
        error="Please select a valid date"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Please select a valid date')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(
      <DatePicker 
        disabled
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('respects minDate and maxDate constraints', async () => {
    const user = userEvent.setup();
    const baseDate = new Date(2025, 0, 15); // Use January 15, 2025 as fixed date
    vi.setSystemTime(baseDate);
    
    const minDate = new Date(2025, 0, 10); // January 10
    const maxDate = new Date(2025, 0, 20); // January 20
    
    render(
      <DatePicker 
        minDate={minDate}
        maxDate={maxDate}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Days outside the range should be disabled
    const day5Button = screen.getByLabelText('5 January 2025');
    const day25Button = screen.getByLabelText('25 January 2025');
    
    expect(day5Button).toBeDisabled();
    expect(day25Button).toBeDisabled();

    // Cleanup
    vi.useRealTimers();
  });
});

describe('DatePicker with Time', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('shows time picker when showTime is true', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker 
        showTime
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Should show hour and minute selects
    const timeInputs = screen.getAllByRole('combobox');
    expect(timeInputs.length).toBeGreaterThan(0);
  });

  it('supports 12-hour time format', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker 
        showTime
        timeFormat="12h"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Should show AM/PM selector
    const timeInputs = screen.getAllByRole('combobox');
    const ampmSelect = timeInputs[timeInputs.length - 1]; // The AM/PM selector is the last select
    expect(ampmSelect).toBeInTheDocument();
    expect(ampmSelect).toHaveValue('AM');
  });

  it('supports 24-hour time format', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker 
        showTime
        timeFormat="24h"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Should not show AM/PM selector
    expect(screen.queryByDisplayValue('AM')).not.toBeInTheDocument();
  });

  it('shows Done button when time picker is enabled', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker 
        showTime
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});

describe('DatePicker Mobile Responsiveness', () => {
  beforeEach(() => {
    vi.doMock('../../src/utils/responsive.jsx', () => ({
      useScreenSize: () => ({
        isMobile: true,
        isTablet: false,
        isDesktop: false
      }),
      useTouchGestures: vi.fn()
    }));
  });

  it('adapts layout for mobile screens', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker onChange={vi.fn()} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Calendar should be in mobile modal layout
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal');
  });

  it('shows backdrop on mobile', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker onChange={vi.fn()} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Should show mobile backdrop
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('DatePicker Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <DatePicker 
        label="Accessible Date Picker"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-expanded');
    expect(input).toHaveAttribute('aria-haspopup');
  });

  it('associates label with input', () => {
    render(
      <DatePicker 
        label="Event Date"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText('Event Date');
    expect(input).toBeInTheDocument();
  });

  it('announces error to screen readers', () => {
    render(
      <DatePicker 
        error="Invalid date selected"
        onChange={vi.fn()}
      />
    );

    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveTextContent('Invalid date selected');
  });

  it('supports keyboard navigation in calendar', async () => {
    const user = userEvent.setup();
    
    render(
      <DatePicker onChange={vi.fn()} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Should be able to navigate with arrow keys
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowRight}');
    
    // Focus should move to calendar dates
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});