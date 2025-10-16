import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../src/components/Pagination.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

// Mock responsive utilities
vi.mock('../src/utils/responsive.js', () => ({
  useScreenSize: () => ({ isMobile: false })
}));

// Mock accessibility utilities
vi.mock('../src/utils/accessibility.js', () => ({
  getAccessibilityProps: (props) => props
}));

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders with basic props', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when clicking page number', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page3Button = screen.getByText('3');
    await user.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking next button', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText('Next page');
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });

  it('calls onPageChange when clicking previous button', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByLabelText('Previous page');
    await user.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('highlights current page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('5');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('shows ellipsis for large page ranges', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('shows first and last pages', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('respects maxVisiblePages prop', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        maxVisiblePages={3}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show limited number of page buttons
    const pageButtons = screen.getAllByRole('button').filter(button => 
      /^\d+$/.test(button.textContent)
    );
    
    // Account for first, last, and visible pages
    expect(pageButtons.length).toBeLessThanOrEqual(7); // 3 visible + first + last + ellipsis handling
  });

  it('shows page info when showPageInfo is true', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        showPageInfo={true}
      />
    );

    expect(screen.getByText('Page 5 of 20')).toBeInTheDocument();
  });

  it('shows custom page info with totalItems', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
        showPageInfo={true}
      />
    );

    expect(screen.getByText('Showing 11-20 of 100 items')).toBeInTheDocument();
  });

  it('supports jump to first/last page', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        showFirstLast={true}
      />
    );

    const firstButton = screen.getByLabelText('First page');
    const lastButton = screen.getByLabelText('Last page');

    await user.click(firstButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    await user.click(lastButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(20);
  });

  it('supports page size selection', async () => {
    const mockOnPageSizeChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    const pageSizeSelect = screen.getByLabelText('Items per page');
    await user.selectOptions(pageSizeSelect, '20');

    expect(mockOnPageSizeChange).toHaveBeenCalledWith(20);
  });
});

describe('Pagination Keyboard Navigation', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page6Button = screen.getByText('6');
    page6Button.focus();
    
    expect(page6Button).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });

  it('supports space key for activation', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page7Button = screen.getByText('7');
    page7Button.focus();
    
    await user.keyboard(' ');
    expect(mockOnPageChange).toHaveBeenCalledWith(7);
  });

  it('supports arrow key navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page5Button = screen.getByText('5');
    page5Button.focus();
    
    await user.keyboard('{ArrowRight}');
    expect(mockOnPageChange).toHaveBeenCalledWith(6);

    await user.keyboard('{ArrowLeft}');
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('supports home and end keys', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page5Button = screen.getByText('5');
    page5Button.focus();
    
    await user.keyboard('{Home}');
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    await user.keyboard('{End}');
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });
});

describe('Pagination Mobile Responsiveness', () => {
  beforeEach(() => {
    vi.mocked(require('../src/utils/responsive.js').useScreenSize).mockReturnValue({
      isMobile: true
    });
  });

  const mockOnPageChange = vi.fn();

  it('shows compact pagination on mobile', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show minimal page numbers on mobile
    const pageButtons = screen.getAllByRole('button').filter(button => 
      /^\d+$/.test(button.textContent)
    );
    
    // Should be fewer buttons on mobile
    expect(pageButtons.length).toBeLessThan(10);
  });

  it('maintains essential navigation on mobile', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Current page
  });

  it('supports touch interactions', async () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText('Next page');
    
    fireEvent.touchStart(nextButton);
    fireEvent.touchEnd(nextButton);
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });
});

describe('Pagination Accessibility', () => {
  const mockOnPageChange = vi.fn();

  it('has proper ARIA labels', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByLabelText('Pagination Navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  it('marks current page with aria-current', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('5');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('has proper role attributes', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('provides descriptive button labels', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page6Button = screen.getByText('6');
    expect(page6Button).toHaveAttribute('aria-label', 'Go to page 6');
  });

  it('handles disabled states properly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('supports screen reader announcements', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        showPageInfo={true}
      />
    );

    expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
  });
});

describe('Pagination Edge Cases', () => {
  const mockOnPageChange = vi.fn();

  it('handles single page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('handles zero pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={0}
        onPageChange={mockOnPageChange}
      />
    );

    // Should handle gracefully
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('handles invalid current page', () => {
    render(
      <Pagination
        currentPage={15}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Should handle gracefully, potentially clamping to valid range
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles large page numbers', () => {
    render(
      <Pagination
        currentPage={500}
        totalPages={1000}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });
});