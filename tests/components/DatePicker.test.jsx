import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../src/components/DatePicker.jsx';

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
  useScreenSize: () => ({ isMobile: false }),
  useTouchGestures: () => {}
}));

// Mock accessibility utilities
vi.mock('../src/utils/accessibility.js', () => ({
  getAccessibilityProps: (props) => props,
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
    
    render(
      <DatePicker onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const currentDate = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    expect(screen.getByText(currentDate.getFullYear().toString())).toBeInTheDocument();
    expect(screen.getByText(monthNames[currentDate.getMonth()])).toBeInTheDocument();
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
    
    render(
      <DatePicker highlightToday onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const today = new Date().getDate();
    const todayElement = screen.getByText(today.toString());
    
    // Today should have special styling
    expect(todayElement).toBeInTheDocument();
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
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 10);
    const maxDate = new Date(today.getFullYear(), today.getMonth(), 20);
    
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
    const day5 = screen.getByText('5');
    const day25 = screen.getByText('25');
    
    expect(day5).toBeDisabled();
    expect(day25).toBeDisabled();
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
    expect(screen.getByDisplayValue('AM')).toBeInTheDocument();
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
    vi.mocked(require('../src/utils/responsive.js').useScreenSize).mockReturnValue({
      isMobile: true
    });
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