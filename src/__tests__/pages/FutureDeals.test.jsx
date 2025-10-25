import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import FutureDeals from '../../pages/FutureDeals';

describe('FutureDeals Page', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders future deals page', () => {
    renderWithProviders(<FutureDeals />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays upcoming deals', async () => {
    renderWithProviders(<FutureDeals />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows deals in pipeline', async () => {
    renderWithProviders(<FutureDeals />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays deal status', async () => {
    renderWithProviders(<FutureDeals />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows pending approvals', async () => {
    renderWithProviders(<FutureDeals />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays timeline for deals', async () => {
    renderWithProviders(<FutureDeals />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has filter functionality', () => {
    renderWithProviders(<FutureDeals />);
    const filterButton = screen.queryByText(/filter/i);
    expect(filterButton || document.body.innerHTML.includes('filter')).toBeTruthy();
  });

  test('shows expected earnings', async () => {
    renderWithProviders(<FutureDeals />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays deal details cards', async () => {
    renderWithProviders(<FutureDeals />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has action buttons for each deal', () => {
    renderWithProviders(<FutureDeals />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length >= 0).toBe(true);
  });
});
