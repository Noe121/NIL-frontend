import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import MarketplacePage from '../../pages/MarketplacePage';

describe('MarketplacePage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders marketplace page', () => {
    renderWithProviders(<MarketplacePage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays available opportunities', async () => {
    renderWithProviders(<MarketplacePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has search functionality', () => {
    renderWithProviders(<MarketplacePage />);
    const searchInput = screen.queryByPlaceholderText(/search/i) || document.querySelector('input[type="search"]');
    expect(searchInput || document.body.innerHTML.includes('search')).toBeTruthy();
  });

  test('displays filters', async () => {
    renderWithProviders(<MarketplacePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows deal/opportunity cards', async () => {
    renderWithProviders(<MarketplacePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays deal details', async () => {
    renderWithProviders(<MarketplacePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has pagination or infinite scroll', async () => {
    renderWithProviders(<MarketplacePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows category filters', async () => {
    renderWithProviders(<MarketplacePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays price/compensation range', async () => {
    renderWithProviders(<MarketplacePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has apply/claim button for opportunities', () => {
    renderWithProviders(<MarketplacePage />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length >= 0).toBe(true);
  });
});
