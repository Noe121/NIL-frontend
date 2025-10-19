import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Enhanced button component with proper accessibility and error handling
const SimpleButton = ({ 
  label, 
  onClick, 
  disabled = false, 
  ariaLabel, 
  variant = 'primary',
  loading = false,
  testId
}) => {
  const handleClick = (event) => {
    if (loading || disabled) return;
    
    try {
      onClick?.(event);
    } catch (error) {
      console.error('Button click error:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || label}
      aria-disabled={disabled}
      aria-busy={loading}
      data-testid={testId}
      className={`btn btn-${variant} ${loading ? 'loading' : ''}`}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
};

describe('Basic Component Testing Suite', () => {
  describe('SimpleButton Component', () => {
    const mockClick = vi.fn();
    
    beforeEach(() => {
      mockClick.mockClear();
    });

    it('renders with default props', () => {
      render(<SimpleButton label="Test Button" />);
      const button = screen.getByText('Test Button');
      
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn', 'btn-primary');
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'false');
    });

    it('handles clicks correctly', async () => {
      const user = userEvent.setup();
      render(<SimpleButton label="Click Me" onClick={mockClick} />);
      
      await user.click(screen.getByText('Click Me'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('supports disabled state', async () => {
      const user = userEvent.setup();
      render(<SimpleButton label="Disabled" onClick={mockClick} disabled />);
      
      const button = screen.getByText('Disabled');
      await user.click(button);
      
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('handles loading state', () => {
      render(<SimpleButton label="Submit" loading />);
      
      const button = screen.getByText('Loading...');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('loading');
    });

    it('supports custom variants', () => {
      render(<SimpleButton label="Custom" variant="secondary" />);
      
      expect(screen.getByText('Custom')).toHaveClass('btn-secondary');
    });

    it('handles error in click handler gracefully', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const errorClick = () => { throw new Error('Test error'); };
      
      const user = userEvent.setup();
      render(<SimpleButton label="Error" onClick={errorClick} />);
      
      await user.click(screen.getByText('Error'));
      expect(errorSpy).toHaveBeenCalled();
      
      errorSpy.mockRestore();
    });
  });

  describe('Accessibility Testing', () => {
    it('provides proper aria-label', () => {
      render(<SimpleButton label="×" ariaLabel="Close dialog" />);
      
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('maintains focus states', async () => {
      const user = userEvent.setup();
      render(
        <>
          <SimpleButton label="First" />
          <SimpleButton label="Second" />
        </>
      );

      const firstButton = screen.getByText('First');
      const secondButton = screen.getByText('Second');

      await user.tab();
      expect(firstButton).toHaveFocus();

      await user.tab();
      expect(secondButton).toHaveFocus();
    });

    it('supports keyboard interaction', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      
      render(<SimpleButton label="Keyboard" onClick={mockClick} />);
      
      const button = screen.getByText('Keyboard');
      button.focus();
      
      await user.keyboard('[Enter]');
      expect(mockClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard('[Space]');
      expect(mockClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component Best Practices', () => {
    it('supports data-testid for testing', () => {
      render(<SimpleButton label="Test" testId="test-button" />);
      
      expect(screen.getByTestId('test-button')).toBeInTheDocument();
    });

    it('preserves user interaction when loading state changes', async () => {
      const { rerender } = render(<SimpleButton label="Submit" />);
      const button = screen.getByText('Submit');
      
      expect(button).not.toHaveClass('loading');
      
      rerender(<SimpleButton label="Submit" loading />);
      
      expect(screen.getByText('Loading...')).toHaveClass('loading');
    });

    it('handles rapid state changes', async () => {
      const { rerender } = render(<SimpleButton label="Action" />);
      
      // Simulate rapid state changes
      rerender(<SimpleButton label="Action" loading />);
      rerender(<SimpleButton label="Action" loading={false} />);
      rerender(<SimpleButton label="Action" disabled />);
      
      const button = screen.getByText('Action');
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });
});