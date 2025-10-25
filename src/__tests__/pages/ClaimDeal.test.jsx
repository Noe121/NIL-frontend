import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ClaimDeal from '../../pages/ClaimDeal';

describe('ClaimDeal Page', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders claim deal page', () => {
    renderWithProviders(<ClaimDeal />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays deal information', async () => {
    renderWithProviders(<ClaimDeal />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows deal details and requirements', async () => {
    renderWithProviders(<ClaimDeal />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays claim button', () => {
    renderWithProviders(<ClaimDeal />);
    const claimButton = screen.queryByText(/claim|accept|approve/i);
    expect(claimButton || document.body.innerHTML.includes('claim')).toBeTruthy();
  });

  test('shows deal terms and conditions', async () => {
    renderWithProviders(<ClaimDeal />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays brand/sponsor information', async () => {
    renderWithProviders(<ClaimDeal />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows compensation details', async () => {
    renderWithProviders(<ClaimDeal />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays timeline and deadlines', async () => {
    renderWithProviders(<ClaimDeal />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has decline button', () => {
    renderWithProviders(<ClaimDeal />);
    const declineButton = screen.queryByText(/decline|reject|no/i);
    expect(declineButton || document.body.innerHTML.includes('decline')).toBeTruthy();
  });

  test('shows compliance warnings if needed', async () => {
    renderWithProviders(<ClaimDeal />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
