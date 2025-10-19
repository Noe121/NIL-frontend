import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination, { PaginationWithPageSize } from '../../src/components/Pagination.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

// Mock responsive utilities
vi.mock('../../src/utils/responsive.jsx', () => ({
  useScreenSize: () => ({ isMobile: false, isTablet: false })
}));

// Mock accessibility utilities
vi.mock('../../src/utils/accessibility.jsx', () => ({
  getAccessibilityProps: (props) => {
    const result = {};
    if (props.ariaLabel) result['aria-label'] = props.ariaLabel;
    if (props.ariaModal !== undefined) result['aria-modal'] = props.ariaModal;
    if (props.ariaExpanded !== undefined) result['aria-expanded'] = props.ariaExpanded;
    if (props.ariaSelected !== undefined) result['aria-selected'] = props.ariaSelected;
    if (props.ariaCurrent) result['aria-current'] = props.ariaCurrent;
    if (props.ariaDisabled !== undefined) result['aria-disabled'] = props.ariaDisabled;
    if (props.role) result.role = props.role;
    return result;
  }
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

    const currentPageButton = screen.getByRole('link', { name: 'Go to page 5' });
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

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
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
    const pageButtons = screen.getAllByRole('link').filter(button => 
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
      <PaginationWithPageSize
        currentPage={1}
        totalItems={100}
        pageSize={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Showing 1 to 10 of 100 items')).toBeInTheDocument();
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

    const firstButton = screen.getByRole('link', { name: 'Go to page 1' });
    const lastButton = screen.getByRole('link', { name: 'Go to page 20' });

    await user.click(firstButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    await user.click(lastButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(20);
  });

  it('supports page size selection', async () => {
    const mockOnPageSizeChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <PaginationWithPageSize
        currentPage={1}
        totalItems={100}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    const pageSizeSelect = screen.getByLabelText('Items per page:');
    await user.selectOptions(pageSizeSelect, '20');

    expect(mockOnPageSizeChange).toHaveBeenCalledWith(20);
  });
});

describe('Pagination Keyboard Navigation', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('supports comprehensive keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Get all interactive elements
    const nav = screen.getByRole('navigation');
    const prevButton = screen.getByRole('link', { name: 'Previous page' });
    const nextButton = screen.getByRole('link', { name: 'Next page' });
    const page5Button = screen.getByRole('link', { name: 'Go to page 5' });
    
    // Test tab navigation
    await user.tab(); // Focus first interactive element
    expect(screen.getByRole('link', { name: 'Go to page 1' })).toHaveFocus();
    
    // Test Enter key activation
    await user.keyboard('{Enter}');
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
    mockOnPageChange.mockClear();    // Test Space key activation
    const page3Button = screen.getByRole('link', { name: 'Go to page 3' });
    page3Button.focus();
    await user.keyboard(' ');
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
    mockOnPageChange.mockClear();

    // Test arrow key navigation
    page5Button.focus();
    await user.keyboard('{ArrowRight}');
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
    mockOnPageChange.mockClear();

    await user.keyboard('{ArrowLeft}');
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
    mockOnPageChange.mockClear();

    // Test Home/End keys
    await user.keyboard('{Home}');
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
    mockOnPageChange.mockClear();

    await user.keyboard('{End}');
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
    mockOnPageChange.mockClear();
  });

  it('maintains focus when navigating disabled buttons', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Focus previous button (disabled)
    const prevButton = screen.getByRole('link', { name: 'Previous page' });
    prevButton.focus();
    expect(prevButton).toHaveFocus();

    // Try to navigate left
    await user.keyboard('{ArrowLeft}');
    expect(prevButton).toHaveFocus();
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation through page size options', async () => {
    const user = userEvent.setup();
    const mockOnPageSizeChange = vi.fn();
    
    render(
      <PaginationWithPageSize
        currentPage={1}
        totalItems={100}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    const pageSizeSelect = screen.getByRole('combobox', { name: 'Select number of items per page' });
    
    // Navigate to select
    await user.tab(); // Page 2 (Page 1 is current, skipped)
    await user.tab(); // Page 3
    await user.tab(); // Page 4
    await user.tab(); // Page 5
    await user.tab(); // Next button
    await user.tab(); // Last button
    await user.tab(); // Select
    expect(pageSizeSelect).toHaveFocus();

    // Change value with keyboard simulation
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    expect(mockOnPageSizeChange).toHaveBeenCalledWith(20);
  });
});

describe('Pagination Mobile Responsiveness', () => {
  beforeEach(() => {
    vi.doMock('../../src/utils/responsive.jsx', () => ({
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
    const pageButtons = screen.getAllByRole('link').filter(button => 
      button.getAttribute('aria-label')?.startsWith('Go to page')
    );
    
    // Mobile should show current and neighbors
    expect(pageButtons.length).toBeGreaterThan(1);
    
    // Verify correct pages are shown
    expect(screen.getByRole('link', { name: 'Go to page 5' })).toBeInTheDocument();
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
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Test next page touch interaction
    const nextButton = screen.getByRole('link', { name: 'Next page' });
    await user.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
    
    // Test previous page touch interaction
    mockOnPageChange.mockClear();
    const prevButton = screen.getByRole('link', { name: 'Previous page' });
    await user.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
    
    // Test direct page selection
    mockOnPageChange.mockClear();
    const pageButton = screen.getByRole('link', { name: 'Go to page 6' });
    await user.click(pageButton);
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

    const currentPageButton = screen.getByRole('link', { name: 'Go to page 5' });
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

    const page6Button = screen.getByRole('link', { name: 'Go to page 6' });
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

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('handles boundary conditions', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    // Verify single page display
    const pageButton = screen.getByRole('link', { name: 'Go to page 1' });
    expect(pageButton).toHaveAttribute('aria-current', 'page');
    
    // Single page has no prev/next buttons
    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
  });

  it('handles zero or negative pages', () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={0}
        onPageChange={mockOnPageChange}
      />
    );

    // Zero pages should show fallback state
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination Navigation');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    // Test negative pages
    rerender(
      <Pagination
        currentPage={1}
        totalPages={-5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination Navigation');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('handles invalid current page values', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Pagination
        currentPage={15}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Should clamp to last page
    expect(screen.getByRole('link', { name: 'Go to page 10' })).toBeInTheDocument();

    // Test negative current page
    rerender(
      <Pagination
        currentPage={-5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Should clamp to first page
    expect(screen.getByRole('link', { name: 'Go to page 1' })).toBeInTheDocument();

    // Test zero current page
    rerender(
      <Pagination
        currentPage={0}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Should clamp to first page
    expect(screen.getByRole('link', { name: 'Go to page 1' })).toBeInTheDocument();
  });

  it('handles large page numbers and maintains accessibility', () => {
    render(
      <Pagination
        currentPage={500}
        totalPages={1000}
        onPageChange={mockOnPageChange}
      />
    );

    // Verify current page is accessible
    const currentPage = screen.getByRole('link', { name: 'Go to page 500' });
    expect(currentPage).toHaveAttribute('aria-current', 'page');

    // Verify ellipsis regions are properly labeled
    const ellipses = screen.getAllByText('...');
    ellipses.forEach(ellipsis => {
      expect(ellipsis).toHaveAttribute('aria-label', 'More pages available');
    });
  });
});