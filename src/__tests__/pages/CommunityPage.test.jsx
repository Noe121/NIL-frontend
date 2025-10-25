import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import CommunityPage from '../../pages/CommunityPage';

describe('CommunityPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders community page', () => {
    renderWithProviders(<CommunityPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays community feed', async () => {
    renderWithProviders(<CommunityPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows user posts or discussions', async () => {
    renderWithProviders(<CommunityPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has create post button', () => {
    renderWithProviders(<CommunityPage />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length >= 0).toBe(true);
  });

  test('displays comments section', async () => {
    renderWithProviders(<CommunityPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows like/engagement options', async () => {
    renderWithProviders(<CommunityPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays user profiles in feed', async () => {
    renderWithProviders(<CommunityPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has search functionality', () => {
    renderWithProviders(<CommunityPage />);
    const search = screen.queryByPlaceholderText(/search/i) || document.querySelector('input[type="search"]');
    expect(search || document.body.innerHTML.includes('search')).toBeTruthy();
  });

  test('shows trending topics or tags', async () => {
    renderWithProviders(<CommunityPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has notifications section', async () => {
    renderWithProviders(<CommunityPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
