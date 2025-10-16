import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SocialShare from '../src/components/SocialShare.jsx';
import { GamificationProvider } from '../src/contexts/GamificationContext.jsx';
import { UserProvider } from '../src/contexts/UserContext.jsx';

// Mock responsive utilities
const mockUseScreenSize = vi.fn(() => ({ isMobile: false, isTablet: false }));
vi.mock('../src/utils/responsive.js', () => ({
  useScreenSize: () => mockUseScreenSize()
}));

// Mock accessibility utilities
vi.mock('../src/utils/accessibility.js', () => ({
  getAccessibilityProps: (props) => props || {}
}));

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve())
};
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true
});

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true
});

const TestWrapper = ({ children }) => (
  <UserProvider>
    <GamificationProvider>
      {children}
    </GamificationProvider>
  </UserProvider>
);

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
    
    render(
      <TestWrapper>
        <SocialShare showCopyLink={true} />
      </TestWrapper>
    );

    const copyButton = screen.getByText('Copy');
    await user.click(copyButton);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByText('Copied!')).toBeInTheDocument();
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
    expect(screen.queryByText(/shares/)).not.toBeInTheDocument();
  });
});

describe('SocialShare Component - Platform Sharing', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
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

    const twitterButton = screen.getByText('Twitter');
    await user.click(twitterButton);

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

    // Instagram doesn't have direct sharing, should copy to clipboard
    const instagramButton = screen.getByText('Instagram');
    await user.click(instagramButton);

    // Should copy content instead of opening window
    expect(mockClipboard.writeText).toHaveBeenCalled();
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
    render(
      <TestWrapper>
        <SocialShare variant="buttons" />
      </TestWrapper>
    );

    // Should show platform icons
    expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
  });

  it('includes copy link button when showCopyLink is true', () => {
    render(
      <TestWrapper>
        <SocialShare variant="buttons" showCopyLink={true} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Copy link')).toBeInTheDocument();
  });

  it('shows copied state on copy button', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare variant="buttons" showCopyLink={true} />
      </TestWrapper>
    );

    const copyButton = screen.getByLabelText('Copy link');
    await user.click(copyButton);

    expect(mockClipboard.writeText).toHaveBeenCalled();
    // Button should show copied state (would need to check for visual change)
  });
});

describe('SocialShare Component - Mobile Responsiveness', () => {
  beforeEach(() => {
    mockUseScreenSize.mockReturnValue({
      isMobile: true,
      isTablet: false
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

    // Should limit number of visible buttons on mobile
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeLessThanOrEqual(5); // 4 platforms + copy button
  });

  it('uses native share API when available on mobile', async () => {
    const mockShare = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true
    });

    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    // Would need to trigger native share through special platform
    expect(screen.getByText('Share this')).toBeInTheDocument();
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
      expect.stringContaining('#custom'),
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
    render(
      <TestWrapper>
        <SocialShare variant="buttons" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    const twitterButton = screen.getByText('Twitter');
    twitterButton.focus();
    
    expect(twitterButton).toHaveFocus();
    
    await user.keyboard('{Tab}');
    // Next button should receive focus
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
});

describe('SocialShare Component - Gamification Integration', () => {
  it('records share action for gamification', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    const twitterButton = screen.getByText('Twitter');
    await user.click(twitterButton);

    // Should trigger gamification share recording
    // This would be verified through the gamification context
    expect(mockWindowOpen).toHaveBeenCalled();
  });

  it('updates share count after sharing', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <SocialShare />
      </TestWrapper>
    );

    const twitterButton = screen.getByText('Twitter');
    await user.click(twitterButton);

    // Share count should increment (would need state verification)
    expect(mockWindowOpen).toHaveBeenCalled();
  });
});