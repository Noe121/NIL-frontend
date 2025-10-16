import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScreenSize } from '../utils/responsive.jsx';
import { getAccessibilityProps } from '../utils/accessibility.jsx';
import Button from './Button.jsx';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = '',
  size = 'medium',
  variant = 'default',
  disabled = false,
  showPageInfo = true,
  showJumpToPage = false,
  compact = false,
  ...props
}) => {
  const { isMobile, isTablet } = useScreenSize();

  // Adjust settings for mobile
  const mobileMaxPages = isMobile ? 3 : isTablet ? 4 : maxVisiblePages;
  const shouldShowFirstLast = !isMobile && showFirstLast;
  const shouldShowPageInfo = !compact && showPageInfo;
  const shouldShowJumpToPage = !isMobile && !compact && showJumpToPage;

  // Calculate visible page numbers
  const visiblePages = useMemo(() => {
    const pages = [];
    const halfWindow = Math.floor(mobileMaxPages / 2);
    
    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, startPage + mobileMaxPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < mobileMaxPages) {
      startPage = Math.max(1, endPage - mobileMaxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages, mobileMaxPages]);

  // Handle page change
  const handlePageChange = (page) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  // Jump to page functionality
  const handleJumpToPage = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const page = parseInt(formData.get('jumpPage'), 10);
    if (!isNaN(page)) {
      handlePageChange(page);
    }
  };

  // Page button component
  const PageButton = ({ page, isActive = false, children, ...buttonProps }) => (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <Button
        variant={isActive ? 'primary' : 'ghost'}
        size={isMobile ? 'small' : size}
        onClick={() => handlePageChange(page)}
        disabled={disabled}
        className={`
          min-w-[44px] min-h-[44px] 
          ${isMobile ? 'text-sm px-2' : ''}
          ${isActive ? 'pointer-events-none' : ''}
        `}
        {...getAccessibilityProps({
          ariaCurrent: isActive ? 'page' : undefined,
          ariaLabel: `Go to page ${page}`
        })}
        {...buttonProps}
      >
        {children || page}
      </Button>
    </motion.div>
  );

  // Navigation button component
  const NavButton = ({ direction, children, targetPage, icon, ...buttonProps }) => (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <Button
        variant="ghost"
        size={isMobile ? 'small' : size}
        onClick={() => handlePageChange(targetPage)}
        disabled={disabled || targetPage < 1 || targetPage > totalPages}
        className={`
          min-w-[44px] min-h-[44px]
          ${isMobile ? 'px-2' : ''}
        `}
        icon={icon}
        {...getAccessibilityProps({
          ariaLabel: `Go to ${direction} page`
        })}
        {...buttonProps}
      >
        {!isMobile && children}
      </Button>
    </motion.div>
  );

  // Return null if no pagination needed
  if (totalPages <= 1) return null;

  return (
    <div 
      className={`flex flex-col space-y-4 ${className}`}
      {...getAccessibilityProps({ role: 'navigation', ariaLabel: 'Pagination' })}
      {...props}
    >
      {/* Page Info */}
      {shouldShowPageInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-600"
        >
          Page {currentPage} of {totalPages}
        </motion.div>
      )}

      {/* Main Pagination */}
      <div className={`
        flex items-center justify-center space-x-1
        ${isMobile ? 'space-x-1' : 'space-x-2'}
      `}>
        {/* First Page Button */}
        {shouldShowFirstLast && currentPage > 2 && (
          <>
            <PageButton page={1} icon="⏮️">
              {!isMobile && 'First'}
            </PageButton>
            {currentPage > 3 && (
              <span className="px-2 text-gray-400">...</span>
            )}
          </>
        )}

        {/* Previous Button */}
        {showPrevNext && (
          <NavButton
            direction="previous"
            targetPage={currentPage - 1}
            icon={isMobile ? '‹' : '←'}
          >
            Previous
          </NavButton>
        )}

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map(page => (
            <PageButton
              key={page}
              page={page}
              isActive={page === currentPage}
            />
          ))}
        </div>

        {/* Next Button */}
        {showPrevNext && (
          <NavButton
            direction="next"
            targetPage={currentPage + 1}
            icon={isMobile ? '›' : '→'}
          >
            Next
          </NavButton>
        )}

        {/* Last Page Button */}
        {shouldShowFirstLast && currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            <PageButton page={totalPages} icon="⏭️">
              {!isMobile && 'Last'}
            </PageButton>
          </>
        )}
      </div>

      {/* Jump to Page */}
      {shouldShowJumpToPage && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleJumpToPage}
          className="flex items-center justify-center space-x-2 text-sm"
        >
          <label htmlFor="jumpPage" className="text-gray-600">
            Go to page:
          </label>
          <input
            type="number"
            name="jumpPage"
            id="jumpPage"
            min="1"
            max={totalPages}
            className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...getAccessibilityProps({
              ariaLabel: `Jump to page, enter a number between 1 and ${totalPages}`
            })}
          />
          <Button
            type="submit"
            size="small"
            variant="outline"
            disabled={disabled}
          >
            Go
          </Button>
        </motion.form>
      )}

      {/* Compact Info for Mobile */}
      {isMobile && compact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-gray-500"
        >
          {currentPage} / {totalPages}
        </motion.div>
      )}
    </div>
  );
};

// Pagination with items per page selector
export const PaginationWithPageSize = ({
  currentPage,
  totalItems,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  ...paginationProps
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col space-y-4">
      {/* Items Info */}
      <div className="text-center text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        {...paginationProps}
      />

      {/* Page Size Selector */}
      {showPageSizeSelector && (
        <div className="flex items-center justify-center space-x-2 text-sm">
          <label htmlFor="pageSize" className="text-gray-600">
            Items per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;