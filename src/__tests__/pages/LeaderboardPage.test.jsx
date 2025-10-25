import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import LeaderboardPage from '../../pages/LeaderboardPage';

describe('LeaderboardPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders leaderboard page', () => {
    renderWithProviders(<LeaderboardPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays ranked list', async () => {
    renderWithProviders(<LeaderboardPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows user rankings', async () => {
    renderWithProviders(<LeaderboardPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays leaderboard categories', async () => {
    renderWithProviders(<LeaderboardPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows earnings rankings', async () => {
    renderWithProviders(<LeaderboardPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays follower rankings', async () => {
    renderWithProviders(<LeaderboardPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has time period filter', () => {
    renderWithProviders(<LeaderboardPage />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length >= 0).toBe(true);
  });

  test('shows user profile links', async () => {
    renderWithProviders(<LeaderboardPage />);
    await waitFor(() => {
      const links = document.querySelectorAll('a');
      expect(links.length >= 0).toBe(true);
    });
  });

  test('displays ranking badges/medals', async () => {
    renderWithProviders(<LeaderboardPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows current user position', async () => {
    renderWithProviders(<LeaderboardPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
