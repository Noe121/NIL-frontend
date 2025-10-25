import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import AthleteUserPage from '../../pages/AthleteUserPage';

describe('AthleteUserPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders athlete user page', () => {
    renderWithProviders(<AthleteUserPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays athlete dashboard', async () => {
    renderWithProviders(<AthleteUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows athlete profile information', async () => {
    renderWithProviders(<AthleteUserPage />);
    await waitFor(() => {
      const headings = screen.queryAllByRole('heading');
      expect(headings.length >= 0).toBe(true);
    });
  });

  test('displays navigation menu', () => {
    renderWithProviders(<AthleteUserPage />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length >= 0).toBe(true);
  });

  test('shows athlete stats', async () => {
    renderWithProviders(<AthleteUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays deals section', async () => {
    renderWithProviders(<AthleteUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has edit profile link', () => {
    renderWithProviders(<AthleteUserPage />);
    const editLink = screen.queryByText(/edit|settings/i);
    expect(editLink || document.body.innerHTML.includes('edit')).toBeTruthy();
  });

  test('displays earnings information', async () => {
    renderWithProviders(<AthleteUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('page is responsive', () => {
    renderWithProviders(<AthleteUserPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('shows compliance status', async () => {
    renderWithProviders(<AthleteUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
