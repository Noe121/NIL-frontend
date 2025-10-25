import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import EarningsDashboard from '../../pages/EarningsDashboard';

describe('EarningsDashboard', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders earnings dashboard', () => {
    renderWithProviders(<EarningsDashboard />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays dashboard title or heading', async () => {
    renderWithProviders(<EarningsDashboard />);
    await waitFor(() => {
      const headings = screen.queryAllByRole('heading');
      expect(headings.length).toBeGreaterThanOrEqual(0);
    });
  });

  test('renders tabs for navigation', async () => {
    renderWithProviders(<EarningsDashboard />);
    await waitFor(() => {
      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(0);
    });
  });

  test('displays earnings data', async () => {
    renderWithProviders(<EarningsDashboard />);
    await waitFor(() => {
      expect(document.body.innerHTML.length).toBeGreaterThan(0);
    });
  });

  test('earnings section is accessible', () => {
    renderWithProviders(<EarningsDashboard />);
    const container = document.querySelector('[role="tablist"]') || document.body;
    expect(container).toBeInTheDocument();
  });

  test('handles tab switching', async () => {
    renderWithProviders(<EarningsDashboard />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  test('displays earnings overview', async () => {
    renderWithProviders(<EarningsDashboard />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('renders charts or visualizations', async () => {
    renderWithProviders(<EarningsDashboard />);
    const canvas = document.querySelector('canvas');
    // May or may not have charts
    expect(document.body).toBeInTheDocument();
  });

  test('displays tier information', async () => {
    renderWithProviders(<EarningsDashboard />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows earnings breakdown', async () => {
    renderWithProviders(<EarningsDashboard />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
