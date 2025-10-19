import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import AthleteUserPage from './AthleteUserPage.jsx';
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

describe('AthleteUserPage', () => {
  const mockUser = {
    id: 1,
    name: 'Test Athlete',
    role: 'athlete',
    token: 'test-token',
    wallet_address: '0x123'
  };

  const mockAnalytics = {
    total_views: 1000,
    engagement_rate: '15%',
    total_earnings: 5000
  };

  const mockContent = [
    {
      id: 1,
      title: 'Training Video',
      description: 'My latest workout routine',
      createdAt: '2025-10-17T00:00:00Z',
      status: 'published'
    }
  ];

  const mockMetrics = {
    instagram: {
      followers: 10000,
      engagement: '5%'
    },
    twitter: {
      followers: 5000,
      engagement: '3%'
    }
  };

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
    renderWithProviders(<AthleteUserPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('fetches and displays analytics data', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ analytics: mockAnalytics }), { status: 200 }],
      [JSON.stringify({ content: mockContent }), { status: 200 }],
      [JSON.stringify({ metrics: mockMetrics }), { status: 200 }]
    );

    renderWithProviders(<AthleteUserPage />);

    await waitFor(() => {
      expect(screen.getByText('1,000')).toBeInTheDocument(); // total_views
      expect(screen.getByText('15%')).toBeInTheDocument(); // engagement_rate
      expect(screen.getByText('5,000')).toBeInTheDocument(); // total_earnings
    });
  });

  it('displays content items', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ analytics: mockAnalytics }), { status: 200 }],
      [JSON.stringify({ content: mockContent }), { status: 200 }],
      [JSON.stringify({ metrics: mockMetrics }), { status: 200 }]
    );

    renderWithProviders(<AthleteUserPage />);

    await waitFor(() => {
      expect(screen.getByText('Training Video')).toBeInTheDocument();
      expect(screen.getByText('My latest workout routine')).toBeInTheDocument();
    });
  });

  it('displays social metrics', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ analytics: mockAnalytics }), { status: 200 }],
      [JSON.stringify({ content: mockContent }), { status: 200 }],
      [JSON.stringify({ metrics: mockMetrics }), { status: 200 }]
    );

    renderWithProviders(<AthleteUserPage />);

    await waitFor(() => {
      expect(screen.getByText('10,000')).toBeInTheDocument(); // Instagram followers
      expect(screen.getByText('5,000')).toBeInTheDocument(); // Twitter followers
    });
  });

  it('handles API errors gracefully', async () => {
    fetchMock.mockReject(new Error('API Error'));

    renderWithProviders(<AthleteUserPage />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});