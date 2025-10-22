import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import LeaderboardPage from '../src/pages/LeaderboardPage.jsx';

// Mock dependencies
const mockApiService = {
  get: vi.fn(() => Promise.resolve([])),
  post: vi.fn(() => Promise.resolve({ success: true }))
};

vi.mock('../src/hooks/useApi.js', () => ({
  useApi: () => ({
    apiService: mockApiService
  })
}));

vi.mock('../src/components/AnalyticsChart.jsx', () => ({
  default: ({ data, title }) => (
    <div data-testid="analytics-chart" data-title={title}>
      Chart: {title}
    </div>
  )
}));

vi.mock('../src/components/SocialShare.jsx', () => ({
  default: ({ url, title }) => (
    <div data-testid="social-share" data-url={url} data-title={title}>
      Share: {title}
    </div>
  )
}));

vi.mock('../src/utils/config.js', () => ({
  config: {
    auth: {
      storageKey: 'nilbx-auth-token'
    },
    ui: {
      apiTimeout: 10000
    },
    features: {
      advancedAnalytics: true,
      blockchain: true
    }
  }
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('LeaderboardPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.skip('renders leaderboard page with title', async () => {
    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /leaderboard/i })).toBeInTheDocument();
    });
  });

  it.skip('displays athlete rankings by default', async () => {
    const mockRankings = [
      { id: 1, name: 'Athlete One', points: 1500, rank: 1, badge: 'Gold' },
      { id: 2, name: 'Athlete Two', points: 1200, rank: 2, badge: 'Silver' }
    ];

    mockApiService.get.mockResolvedValueOnce(mockRankings);

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Athlete One')).toBeInTheDocument();
      expect(screen.getByText('1,500')).toBeInTheDocument(); // Formatted with comma
      expect(screen.getByText('Gold')).toBeInTheDocument();
    });
  });

  it.skip('allows switching between athlete, sponsor, and fan leaderboards', async () => {
    const athleteRankings = [
      { id: 1, name: 'Athlete One', points: 1500, rank: 1 }
    ];
    const sponsorRankings = [
      { id: 1, name: 'Sponsor Corp', points: 5000, rank: 1 }
    ];

    // Mock API to return different data based on category
    mockApiService.get.mockImplementation((url) => {
      if (url.includes('/leaderboard/athletes')) {
        return Promise.resolve(athleteRankings);
      }
      if (url.includes('/leaderboard/sponsors')) {
        return Promise.resolve(sponsorRankings);
      }
      return Promise.resolve([]);
    });

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Athlete One')).toBeInTheDocument();
    });

    // Switch to sponsor leaderboard
    const sponsorTab = screen.getByRole('button', { name: /sponsors/i });
    await user.click(sponsorTab);

    await waitFor(() => {
      expect(screen.getByText('Sponsor Corp')).toBeInTheDocument();
    });
  });

  it.skip('shows analytics charts when advanced analytics is enabled', async () => {
    const mockRankings = [
      { id: 1, name: 'Athlete One', points: 1500, rank: 1 }
    ];

    mockApiService.get.mockResolvedValueOnce(mockRankings);

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('analytics-chart')).toBeInTheDocument();
      expect(screen.getByTestId('analytics-chart')).toHaveAttribute('data-title', 'Points Distribution');
    });
  });

  it.skip('displays gamification badges and achievements', async () => {
    const mockRankings = [
      { id: 1, name: 'Athlete One', points: 1500, rank: 1, badges: ['Champion', 'Consistent'] }
    ];

    mockApiService.get.mockResolvedValueOnce(mockRankings);

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Champion')).toBeInTheDocument();
      expect(screen.getByText('Consistent')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it.skip('filters rankings by time period', async () => {
    const weeklyRankings = [
      { id: 1, name: 'Weekly Champion', points: 500, rank: 1 }
    ];

    mockApiService.get.mockResolvedValueOnce([]);

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Athlete Rankings')).toBeInTheDocument();
    });

    // Select weekly filter
    const timeFilter = screen.getByLabelText('Time Period');
    await user.selectOptions(timeFilter, 'weekly');

    mockApiService.get.mockResolvedValueOnce(weeklyRankings);

    await waitFor(() => {
      expect(screen.getByText('Weekly Champion')).toBeInTheDocument();
    });
  });

  it('shows loading state during rankings fetch', () => {
    mockApiService.get.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    expect(screen.getByText(/loading leaderboard/i)).toBeInTheDocument();
  });

  it('handles ranking fetch errors gracefully', async () => {
    mockApiService.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load rankings/i)).toBeInTheDocument();
    });
  });

  it('displays user position and progress', async () => {
    const mockRankings = [
      { id: 1, name: 'Current User', points: 800, rank: 5, isCurrentUser: true }
    ];

    mockApiService.get.mockResolvedValueOnce(mockRankings);

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Your Rank: 5')).toBeInTheDocument();
      expect(screen.getByText('800 points')).toBeInTheDocument();
    });
  });

  it('provides social sharing for rankings', async () => {
    const mockRankings = [
      { id: 1, name: 'Athlete One', points: 1500, rank: 1 }
    ];

    mockApiService.get.mockResolvedValueOnce(mockRankings);

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('social-share')).toBeInTheDocument();
    });
  });
});