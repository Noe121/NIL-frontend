import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import FanUserPage from './FanUserPage.jsx';
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

describe('FanUserPage', () => {
  const mockUser = {
    id: 1,
    name: 'Test Fan',
    role: 'fan',
    token: 'test-token'
  };

  const mockFavoriteAthletes = [
    {
      id: 1,
      name: 'John Athlete',
      sport: 'Basketball',
      profile_picture: null,
      recent_activity: 'Posted a new video'
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      message: 'John Athlete posted a new update',
      created_at: '2025-10-17T00:00:00Z',
      read: false
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
    renderWithProviders(<FanUserPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('fetches and displays favorite athletes', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ fan: { favorite_athletes: mockFavoriteAthletes } }), { status: 200 }],
      [JSON.stringify({ notifications: mockNotifications }), { status: 200 }]
    );

    renderWithProviders(<FanUserPage />);

    await waitFor(() => {
      expect(screen.getByText('John Athlete')).toBeInTheDocument();
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.getByText('Recent: Posted a new video')).toBeInTheDocument();
    });
  });

  it('displays notifications', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ fan: { favorite_athletes: mockFavoriteAthletes } }), { status: 200 }],
      [JSON.stringify({ notifications: mockNotifications }), { status: 200 }]
    );

    renderWithProviders(<FanUserPage />);

    await waitFor(() => {
      expect(screen.getByText('John Athlete posted a new update')).toBeInTheDocument();
      expect(screen.getByText('Mark as read')).toBeInTheDocument();
    });
  });

  it('handles marking notifications as read', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ fan: { favorite_athletes: mockFavoriteAthletes } }), { status: 200 }],
      [JSON.stringify({ notifications: mockNotifications }), { status: 200 }]
    );

    renderWithProviders(<FanUserPage />);

    await waitFor(() => {
      expect(screen.getByText('Mark as read')).toBeInTheDocument();
    });

    // Set up mock for marking notification as read
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    // Click mark as read button
    fireEvent.click(screen.getByText('Mark as read'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/fans/1/notifications/1/read',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });
  });

  it('handles athlete search', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ fan: { favorite_athletes: mockFavoriteAthletes } }), { status: 200 }],
      [JSON.stringify({ notifications: mockNotifications }), { status: 200 }]
    );

    renderWithProviders(<FanUserPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search for athletes to follow...');
      expect(searchInput).toBeInTheDocument();
    });

    // Test search functionality
    const searchInput = screen.getByPlaceholderText('Search for athletes to follow...');
    fireEvent.change(searchInput, { target: { value: 'athlete' } });

    // Mock search results
    fetchMock.mockResponseOnce(JSON.stringify({
      results: [
        { id: 2, name: 'Test Athlete', sport: 'Football' }
      ]
    }));

    await waitFor(() => {
      // Verify search results are displayed
      expect(screen.getByText('Test Athlete')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    fetchMock.mockReject(new Error('API Error'));

    renderWithProviders(<FanUserPage />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no favorite athletes', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ fan: { favorite_athletes: [] } }), { status: 200 }],
      [JSON.stringify({ notifications: [] }), { status: 200 }]
    );

    renderWithProviders(<FanUserPage />);

    await waitFor(() => {
      expect(screen.getByText("You haven't added any favorite athletes yet.")).toBeInTheDocument();
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });
  });
});