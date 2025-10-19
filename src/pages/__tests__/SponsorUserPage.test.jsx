import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import SponsorUserPage from './SponsorUserPage.jsx';
import fetchMock from 'jest-fetch-mock';

// Mock dependencies
jest.mock('../utils/config.js', () => ({
  useConfig: () => ({
    API_URL: 'http://localhost:8000'
  })
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));

describe('SponsorUserPage', () => {
  const mockUser = {
    id: 1,
    name: 'Test Sponsor',
    role: 'sponsor',
    token: 'test-token',
    wallet_address: '0x123'
  };

  const mockAnalytics = {
    total_sponsorships: 10,
    active_deals: 5,
    total_spent: 25000,
    athlete_reach: '100K+'
  };

  const mockSponshorships = [
    {
      id: 1,
      athlete_name: 'John Athlete',
      amount: 5000,
      description: 'Social media promotion',
      start_date: '2025-10-17T00:00:00Z'
    }
  ];

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
    return render(
      <BrowserRouter>
        <UserContext.Provider 
          value={{ user: mockUser, ...providerProps }}
        >
          {ui}
        </UserContext.Provider>
      </BrowserRouter>,
      renderOptions
    );
  };

  it('renders loading state initially', () => {
    renderWithProviders(<SponsorUserPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('fetches and displays analytics data', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ analytics: mockAnalytics }), { status: 200 }],
      [JSON.stringify({ sponsorships: mockSponshorships }), { status: 200 }]
    );

    renderWithProviders(<SponsorUserPage />);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // total_sponsorships
      expect(screen.getByText('5')).toBeInTheDocument(); // active_deals
      expect(screen.getByText('$25,000')).toBeInTheDocument(); // total_spent
      expect(screen.getByText('100K+')).toBeInTheDocument(); // athlete_reach
    });
  });

  it('displays active sponsorships', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ analytics: mockAnalytics }), { status: 200 }],
      [JSON.stringify({ sponsorships: mockSponshorships }), { status: 200 }]
    );

    renderWithProviders(<SponsorUserPage />);

    await waitFor(() => {
      expect(screen.getByText('John Athlete')).toBeInTheDocument();
      expect(screen.getByText('$5,000')).toBeInTheDocument();
      expect(screen.getByText('Social media promotion')).toBeInTheDocument();
    });
  });

  it('handles athlete search', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ analytics: mockAnalytics }), { status: 200 }],
      [JSON.stringify({ sponsorships: mockSponshorships }), { status: 200 }]
    );

    renderWithProviders(<SponsorUserPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search for athletes to sponsor...');
      expect(searchInput).toBeInTheDocument();
    });

    // Test search functionality
    const searchInput = screen.getByPlaceholderText('Search for athletes to sponsor...');
    fireEvent.change(searchInput, { target: { value: 'athlete' } });

    // Mock search results
    fetchMock.mockResponseOnce(JSON.stringify({
      results: [
        { id: 1, name: 'Test Athlete', sport: 'Basketball' }
      ]
    }));

    await waitFor(() => {
      // Verify search results are displayed
      expect(screen.getByText('Test Athlete')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    fetchMock.mockReject(new Error('API Error'));

    renderWithProviders(<SponsorUserPage />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});