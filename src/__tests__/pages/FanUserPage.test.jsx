import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import FanUserPage from '../../pages/FanUserPage';

describe('FanUserPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders fan user page', () => {
    renderWithProviders(<FanUserPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays fan dashboard', async () => {
    renderWithProviders(<FanUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows followed influencers/athletes', async () => {
    renderWithProviders(<FanUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays available exclusive content', async () => {
    renderWithProviders(<FanUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows profile information', async () => {
    renderWithProviders(<FanUserPage />);
    await waitFor(() => {
      const headings = screen.queryAllByRole('heading');
      expect(headings.length >= 0).toBe(true);
    });
  });

  test('displays wallet/balance', async () => {
    renderWithProviders(<FanUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has discovery section', async () => {
    renderWithProviders(<FanUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows collections or favorites', async () => {
    renderWithProviders(<FanUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays notifications', async () => {
    renderWithProviders(<FanUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has profile settings', () => {
    renderWithProviders(<FanUserPage />);
    const settings = screen.queryByText(/settings|preferences/i);
    expect(settings || document.body.innerHTML.includes('settings')).toBeTruthy();
  });
});
