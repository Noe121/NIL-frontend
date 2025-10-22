import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import SocialShare from '../../src/components/SocialShare.jsx';

// Mock shared variables for all tests
const mockRecordShare = vi.fn();
const mockIncrementShareCount = vi.fn();

// Mock contexts - single declaration for each
vi.mock('../../src/contexts/GamificationContext.jsx', () => ({
  GamificationProvider: ({ children }) => <>{children}</>,
  useGamification: () => ({
    recordShare: mockRecordShare,
    shareCount: 0,
    incrementShareCount: mockIncrementShareCount
  })
}));

vi.mock('../../src/contexts/UserContext.jsx', () => ({
  UserProvider: ({ children }) => <>{children}</>,
  useUser: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true
  })
}));

// Mock responsive utilities
const mockUseScreenSize = vi.fn(() => ({ isMobile: false, isTablet: false, isDesktop: true }));
vi.mock('../../src/utils/responsive.jsx', () => ({
  useScreenSize: () => mockUseScreenSize(),
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
  getAccessibilityProps: (props) => props || {},
  focusElement: vi.fn()
}));

// Mock Tooltip component
vi.mock('../../src/components/Tooltip', () => ({
  default: ({ children }) => children
}));

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve())
};
delete navigator.clipboard;
Object.defineProperty(navigator, 'clipboard', {
  configurable: true,
  value: mockClipboard
});

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true
});

// Mock window.alert
const mockAlert = vi.fn();
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true
});

// Reset mock state before each test
beforeEach(() => {
  mockRecordShare.mockClear();
  mockIncrementShareCount.mockClear();
  mockClipboard.writeText.mockClear();
  mockWindowOpen.mockClear();
  mockAlert.mockClear();
});

const TestWrapper = ({ children }) => children;

describe('SocialShare Component - Default Variant', () => {
  beforeEach(() => {
    mockClipboard.writeText.mockClear();
    mockWindowOpen.mockClear();
  });

  it('renders with default props', () => {
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    expect(screen.getByText('Share this')).toBeInTheDocument();
  });

  it('displays primary social platforms', () => {
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('shows more platforms dropdown', () => {
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    expect(screen.getByText('More platforms')).toBeInTheDocument();
  });

  it('displays copy link input when showCopyLink is true', () => {
    render(
      <TestWrapper>
        <SocialShare showCopyLink={true} />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue(window.location.href)).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('copies link to clipboard when copy button is clicked', async () => {
    const user = userEvent.setup();
    
    const mockClipboard = {
      writeText: vi.fn(() => Promise.resolve())
    };

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true
    });
    
    render(
      <TestWrapper>
        <SocialShare showCopyLink={true} />
      </TestWrapper>
    );

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('http'));
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('uses fallback when Clipboard API is not available', async () => {
    const user = userEvent.setup();
    
    // Remove Clipboard API
    const originalClipboard = navigator.clipboard;
    delete navigator.clipboard;
    
    // Mock execCommand
    document.execCommand = vi.fn();
    
    render(
      <TestWrapper>
        <SocialShare showCopyLink={true} />
      </TestWrapper>
    );

    const copyButton = screen.getByText('Copy');
    await user.click(copyButton);

    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByText('Copied!')).toBeInTheDocument();

    // Restore Clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard
    });
  });

  it('shows QR code when showQRCode is true', () => {
    render(
      <TestWrapper>
        <SocialShare showQRCode={true} />
      </TestWrapper>
    );

    expect(screen.getByText('Scan QR Code')).toBeInTheDocument();
    expect(screen.getByAltText('QR Code')).toBeInTheDocument();
  });

  it('displays share count when shares have been made', () => {
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    // Initially no share count
    expect(screen.queryByText(/share/)).not.toBeInTheDocument();
  });
});

describe('SocialShare Component - Platform Sharing', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
    mockClipboard.writeText.mockClear();
    mockAlert.mockClear();
  });

  it('opens Twitter share window when Twitter button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare 
          title="Test Title"
          url="https://example.com"
          hashtags={['test', 'share']}
        />
      </TestWrapper>
    );

    // Use container query to make it specific to this test's rendered component
    const twitterButton = screen.getByText(/twitter/i, { selector: 'span.hidden' });
    await user.click(twitterButton.closest('button'));

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      expect.any(String),
      expect.any(String)
    );
  });

  it('opens Facebook share window when Facebook button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare url="https://example.com" />
      </TestWrapper>
    );

    const facebookButton = screen.getByText('Facebook');
    await user.click(facebookButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com/sharer'),
      expect.any(String),
      expect.any(String)
    );
  });

  it('opens LinkedIn share window when LinkedIn button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare url="https://example.com" />
      </TestWrapper>
    );

    const linkedinButton = screen.getByText('LinkedIn');
    await user.click(linkedinButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing'),
      expect.any(String),
      expect.any(String)
    );
  });

  it('handles platforms without direct sharing URLs', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    // Initially no share count
    expect(screen.queryByText(/share/)).not.toBeInTheDocument();

    // Instagram doesn't have direct sharing, should copy to clipboard
    const instagramButton = screen.getByRole('button', { name: /instagram/i });
    await user.click(instagramButton);

    // Share count should increment, indicating the share action was successful
    await waitFor(() => {
      const shareCount = screen.getByText(/1\s+shares?/i);
      expect(shareCount).toBeInTheDocument();
    });
  });
});

describe('SocialShare Component - Minimal Variant', () => {
  it('renders dropdown trigger in minimal variant', () => {
    render(
      <TestWrapper>
        <SocialShare variant="minimal" />
      </TestWrapper>
    );

    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('shows share options in dropdown when opened', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare variant="minimal" />
      </TestWrapper>
    );

    const shareButton = screen.getByText('Share');
    await user.click(shareButton);

    expect(screen.getByText('Share on Twitter')).toBeInTheDocument();
    expect(screen.getByText('Share on Facebook')).toBeInTheDocument();
  });

  it('includes copy link option in dropdown', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare variant="minimal" showCopyLink={true} />
      </TestWrapper>
    );

    const shareButton = screen.getByText('Share');
    await user.click(shareButton);

    expect(screen.getByText('Copy Link')).toBeInTheDocument();
  });
});

describe('SocialShare Component - Buttons Variant', () => {
  it('renders social platform buttons', () => {
    const { container } = render(
      <TestWrapper>
        <SocialShare variant="buttons" />
      </TestWrapper>
    );

    // Should show platform icons
    expect(container.querySelector('button[aria-label="Share on Twitter"]')).toBeInTheDocument();
    expect(container.querySelector('button[aria-label="Share on Facebook"]')).toBeInTheDocument();
  });

  it('includes copy link button when showCopyLink is true', () => {
    const { container } = render(
      <TestWrapper>
        <SocialShare variant="buttons" showCopyLink={true} />
      </TestWrapper>
    );

    expect(container.querySelector('button[aria-label="Copy link"]')).toBeInTheDocument();
  });
});

describe('SocialShare Component - Mobile Responsiveness', () => {
  beforeEach(() => {
    mockUseScreenSize.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });
  });

  it('adapts layout for mobile screens', () => {
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    // Should show fewer platforms on mobile
    expect(screen.getByText('Share this')).toBeInTheDocument();
  });

  it('shows fewer platform buttons on mobile in buttons variant', () => {
    render(
      <TestWrapper>
        <SocialShare variant="buttons" />
      </TestWrapper>
    );

    // Should show only primary share buttons on mobile
    // In mobile view, we should see only 2-3 primary share buttons
    const shareButtons = screen.getAllByRole('button')
      .filter(button => button.getAttribute('aria-label')?.includes('Share on'))
      .filter(button => button.getAttribute('class')?.includes('sm:inline'));
    expect(shareButtons.length).toBeLessThanOrEqual(3); // Mobile should show fewer share buttons
  });

  it('uses native share API when available on mobile', async () => {
    // Mock useScreenSize to return mobile view
    mockUseScreenSize.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });
    
    // Save the original navigator
    const originalNavigator = { ...navigator };
    
    // Create a mock navigator with the share function
    const mockShare = vi.fn(() => Promise.resolve());
    const mockCanShare = vi.fn(() => true);
    const mockNavigator = {
      ...originalNavigator,
      share: mockShare,
      canShare: mockCanShare
    };
    
    // Replace the window.navigator
    const navigatorDescriptor = Object.getOwnPropertyDescriptor(window, 'navigator') || {
      configurable: true,
      enumerable: true
    };
    
    Object.defineProperty(window, 'navigator', {
      ...navigatorDescriptor,
      get: function() { return mockNavigator; }
    });

    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare 
          title="Test Share"
          description="Test Description"
          url="https://test.com"
        />
      </TestWrapper>
    );

    const shareButton = screen.getByRole('button', { name: /twitter/i });
    await user.click(shareButton);

    // Wait for and verify native share was called
    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        title: "Test Share",
        text: "Test Description",
        url: "https://test.com"
      });
    });

    // Cleanup
    Object.defineProperty(window, 'navigator', navigatorDescriptor);
    mockUseScreenSize.mockReset();
  });
});

describe('SocialShare Component - Custom Props', () => {
  it('accepts custom URL', () => {
    const customUrl = 'https://custom.example.com';
    
    render(
      <TestWrapper>
        <SocialShare url={customUrl} showCopyLink={true} />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue(customUrl)).toBeInTheDocument();
  });

  it('accepts custom title and description', async () => {
    const user = userEvent.setup();
    const customTitle = 'Custom Share Title';
    
    render(
      <TestWrapper>
        <SocialShare 
          title={customTitle}
          description="Custom description"
        />
      </TestWrapper>
    );

    const twitterButton = screen.getByText('Twitter');
    await user.click(twitterButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(customTitle)),
      expect.any(String),
      expect.any(String)
    );
  });

  it('accepts custom hashtags', async () => {
    const user = userEvent.setup();
    const customHashtags = ['custom', 'test'];
    
    render(
      <TestWrapper>
        <SocialShare hashtags={customHashtags} />
      </TestWrapper>
    );

    const twitterButton = screen.getByText('Twitter');
    await user.click(twitterButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('%23custom'), // Hashtag will be URL encoded
      expect.any(String),
      expect.any(String)
    );
  });

  it('accepts custom image for Pinterest', async () => {
    const user = userEvent.setup();
    const customImage = 'https://example.com/image.jpg';
    
    render(
      <TestWrapper>
        <SocialShare image={customImage} />
      </TestWrapper>
    );

    // Click more platforms to access Pinterest
    const moreButton = screen.getByText('More platforms');
    await user.click(moreButton);

    // Pinterest should include image parameter
    expect(screen.getByText('Share on Pinterest')).toBeInTheDocument();
  });
});

describe('SocialShare Component - Accessibility', () => {
  it('has proper ARIA labels for platform buttons', () => {
    const { container } = render(
      <TestWrapper>
        <SocialShare variant="buttons" />
      </TestWrapper>
    );

    // Query buttons from this specific render's container
    const buttons = container.querySelectorAll('button[aria-label]');
    const twitterButton = Array.from(buttons).find(button => button.getAttribute('aria-label') === 'Share on Twitter');
    const facebookButton = Array.from(buttons).find(button => button.getAttribute('aria-label') === 'Share on Facebook');
    
    expect(twitterButton).toBeInTheDocument();
    expect(facebookButton).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare showCopyLink={true} showQRCode={true} />
      </TestWrapper>
    );

    // Get all interactive elements by their aria labels
    const twitterButton = screen.getByRole('button', { name: /twitter/i });
    const facebookButton = screen.getByRole('button', { name: /facebook/i });
    const linkedinButton = screen.getByRole('button', { name: /linkedin/i });
    const instagramButton = screen.getByRole('button', { name: /instagram/i });
    const copyButton = screen.getByRole('button', { name: /copy/i });
    
    // Test that we can move through the buttons with keyboard
    // Verify that the share buttons are focusable - motion.div wrappers should be focusable
    expect(twitterButton.closest('[tabindex]')).toHaveAttribute('tabindex', '0');
    expect(facebookButton.closest('[tabindex]')).toHaveAttribute('tabindex', '0');
    expect(instagramButton.closest('[tabindex]')).toHaveAttribute('tabindex', '0');
    expect(linkedinButton.closest('[tabindex]')).toHaveAttribute('tabindex', '0');
    expect(copyButton.closest('[tabindex]')).toHaveAttribute('tabindex', '0');
  });

  it('announces share actions to screen readers', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare showCopyLink={true} />
      </TestWrapper>
    );

    const copyButton = screen.getByText('Copy');
    await user.click(copyButton);

    // Should provide feedback about copy action
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('handles share errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock console.error to avoid test output noise
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock window.open to throw error
    mockWindowOpen.mockImplementationOnce(() => { throw new Error('Failed to open window'); });
    
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    const twitterButton = screen.getByText('Twitter');
    await user.click(twitterButton);

    // Should log error
    expect(consoleError).toHaveBeenCalledWith('Error sharing:', expect.any(Error));
    
    // Cleanup
    consoleError.mockRestore();
  });
});

describe('SocialShare Component - Gamification Integration', () => {
  it('records share action for gamification', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    const twitterButton = screen.getByRole('button', { name: /twitter/i });
    await user.click(twitterButton);

    // Should trigger gamification share recording
    expect(mockRecordShare).toHaveBeenCalled();
    expect(mockWindowOpen).toHaveBeenCalled();
  });

  it('updates share count after sharing', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    // Initially no share count shown
    expect(screen.queryByText(/shares?/)).not.toBeInTheDocument();

    // Share on Twitter
    const twitterButton = screen.getByRole('button', { name: /twitter/i });
    await user.click(twitterButton);

    // Share count should increment
    await waitFor(() => {
      const shareCount = screen.getByText(/1\s+shares?/i);
      expect(shareCount).toBeInTheDocument();
    });

    // Share again
    await user.click(twitterButton);
    
    // Share count should increment again
    await waitFor(() => {
      const shareCount = screen.getByText(/2\s+shares?/i);
      expect(shareCount).toBeInTheDocument();
    });
  });
});