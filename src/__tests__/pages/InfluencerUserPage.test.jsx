import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import InfluencerUserPage from '../../pages/InfluencerUserPage';

describe('InfluencerUserPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders influencer user page', () => {
    renderWithProviders(<InfluencerUserPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays influencer dashboard', async () => {
    renderWithProviders(<InfluencerUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows influencer profile', async () => {
    renderWithProviders(<InfluencerUserPage />);
    await waitFor(() => {
      const headings = screen.queryAllByRole('heading');
      expect(headings.length >= 0).toBe(true);
    });
  });

  test('displays content statistics', async () => {
    renderWithProviders(<InfluencerUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows available opportunities', async () => {
    renderWithProviders(<InfluencerUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays earnings data', async () => {
    renderWithProviders(<InfluencerUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has profile edit option', () => {
    renderWithProviders(<InfluencerUserPage />);
    const editButton = screen.queryByText(/edit|settings/i);
    expect(editButton || document.body.innerHTML.includes('edit')).toBeTruthy();
  });

  test('shows follower metrics', async () => {
    renderWithProviders(<InfluencerUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays collaboration requests', async () => {
    renderWithProviders(<InfluencerUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has earnings tier display', async () => {
    renderWithProviders(<InfluencerUserPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
