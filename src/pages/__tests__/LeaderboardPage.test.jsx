import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import LeaderboardPage from '../LeaderboardPage.jsx';

// Mock dependencies
vi.mock('../../hooks/useApi.js', () => ({
  useApi: () => ({
    apiService: {
      get: vi.fn()
    }
  })
}));

vi.mock('../../components/AnalyticsChart.jsx', () => ({
  default: ({ data, type }) => (
    <div data-testid="analytics-chart" data-type={type}>
      Chart: {JSON.stringify(data)}
    </div>
  )
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('LeaderboardPage', () => {
  const mockApiService = {
    get: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(import('../../hooks/useApi.js')).useApi.mockReturnValue({
      apiService: mockApiService
    });
  });

  it('renders leaderboard page with title', () => {
    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /leaderboard/i })).toBeInTheDocument();
  });

  it('fetches and displays athlete rankings', async () => {
    const mockAthletes = [
      { id: 1, name: 'John Doe', score: 95, rank: 1 },
      { id: 2, name: 'Jane Smith', score: 88, rank: 2 },
      { id: 3, name: 'Bob Johnson', score: 82, rank: 3 }
    ];

    mockApiService.get.mockImplementation((endpoint) => {
      if (endpoint === '/leaderboard/athletes') {
        return Promise.resolve(mockAthletes);
      }
      return Promise.resolve([]);
    });

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockApiService.get).toHaveBeenCalledWith('/leaderboard/athletes');
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('95')).toBeInTheDocument();
      expect(screen.getByText('88')).toBeInTheDocument();
    });
  });

  it('fetches and displays sponsor rankings', async () => {
    const mockSponsors = [
      { id: 1, name: 'ABC Corp', investments: 150000, rank: 1 },
      { id: 2, name: 'XYZ Inc', investments: 120000, rank: 2 }
    ];

    mockApiService.get.mockImplementation((endpoint) => {
      if (endpoint === '/leaderboard/sponsors') {
        return Promise.resolve(mockSponsors);
      }
      return Promise.resolve([]);
    });

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('ABC Corp')).toBeInTheDocument();
      expect(screen.getByText('$150,000')).toBeInTheDocument();
    });
  });

  it('fetches and displays fan rankings', async () => {
    const mockFans = [
      { id: 1, name: 'Fan One', contributions: 5000, rank: 1 },
      { id: 2, name: 'Fan Two', contributions: 3200, rank: 2 }
    ];

    mockApiService.get.mockImplementation((endpoint) => {
      if (endpoint === '/leaderboard/fans') {
        return Promise.resolve(mockFans);
      }
      return Promise.resolve([]);
    });

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Fan One')).toBeInTheDocument();
      expect(screen.getByText('5,000')).toBeInTheDocument();
    });
  });

  it('displays badges and rewards for top performers', async () => {
    const mockAthletes = [
      { id: 1, name: 'Champion', score: 100, rank: 1, badges: ['champion', 'mvp'] }
    ];

    mockApiService.get.mockImplementation((endpoint) => {
      if (endpoint === '/leaderboard/athletes') {
        return Promise.resolve(mockAthletes);
      }
      return Promise.resolve([]);
    });

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('🏆 Champion')).toBeInTheDocument();
      expect(screen.getByText('🏅 MVP')).toBeInTheDocument();
    });
  });

  it('shows weekly and monthly ranking tabs', () => {
    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    expect(screen.getByRole('tab', { name: /weekly/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /monthly/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /all-time/i })).toBeInTheDocument();
  });

  it('allows switching between time periods', async () => {
    const { user } = render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    const monthlyTab = screen.getByRole('tab', { name: /monthly/i });
    await user.click(monthlyTab);

    expect(mockApiService.get).toHaveBeenCalledWith('/leaderboard/athletes?period=monthly');
  });

  it('displays analytics chart for rankings', async () => {
    const mockAthletes = [
      { id: 1, name: 'Test', score: 90, rank: 1 }
    ];

    mockApiService.get.mockResolvedValueOnce(mockAthletes);

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('analytics-chart')).toBeInTheDocument();
    });
  });

  it('shows loading state during data fetch', () => {
    mockApiService.get.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    expect(screen.getByText(/loading leaderboard/i)).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    mockApiService.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load leaderboard/i)).toBeInTheDocument();
    });
  });

  it('displays gamification elements', () => {
    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    expect(screen.getByText(/unlock achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/earn rewards/i)).toBeInTheDocument();
  });

  it('shows progress indicators for current user', async () => {
    // Mock current user context
    vi.mocked(import('../../hooks/useAuth.js')).useAuth.mockReturnValue({
      user: { id: 1, name: 'Current User' }
    });

    const mockAthletes = [
      { id: 1, name: 'Current User', score: 75, rank: 5, nextRankScore: 85 }
    ];

    mockApiService.get.mockResolvedValueOnce(mockAthletes);

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/10 points to next rank/i)).toBeInTheDocument();
    });
  });

  it('provides filtering by role type', () => {
    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    expect(screen.getByRole('combobox', { name: /filter by role/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /athletes/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /sponsors/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /fans/i })).toBeInTheDocument();
  });
});