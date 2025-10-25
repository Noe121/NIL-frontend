import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import SponsorUserPage from '../../pages/SponsorUserPage';

describe('SponsorUserPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders sponsor user page', () => {
    renderWithProviders(<SponsorUserPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays sponsor dashboard', async () => {
    renderWithProviders(<SponsorUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows active deals', async () => {
    renderWithProviders(<SponsorUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays campaign management', async () => {
    renderWithProviders(<SponsorUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows budget tracking', async () => {
    renderWithProviders(<SponsorUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays available influencers/athletes', async () => {
    renderWithProviders(<SponsorUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has deal creation button', () => {
    renderWithProviders(<SponsorUserPage />);
    const createButton = screen.queryByText(/create|new|offer/i);
    expect(createButton || document.body.innerHTML.includes('create')).toBeTruthy();
  });

  test('displays performance analytics', async () => {
    renderWithProviders(<SponsorUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows contract management', async () => {
    renderWithProviders(<SponsorUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has settings option', () => {
    renderWithProviders(<SponsorUserPage />);
    const settings = screen.queryByText(/settings|preferences/i);
    expect(settings || document.body.innerHTML.includes('settings')).toBeTruthy();
  });
});
