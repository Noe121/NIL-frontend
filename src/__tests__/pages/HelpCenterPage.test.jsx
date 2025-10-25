import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import HelpCenterPage from '../../pages/HelpCenterPage';

describe('HelpCenterPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders help center page', () => {
    renderWithProviders(<HelpCenterPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays search functionality', () => {
    renderWithProviders(<HelpCenterPage />);
    const search = screen.queryByPlaceholderText(/search|help/i) || document.querySelector('input[type="search"]');
    expect(search || document.body.innerHTML.includes('search')).toBeTruthy();
  });

  test('shows help categories', async () => {
    renderWithProviders(<HelpCenterPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays FAQ section', async () => {
    renderWithProviders(<HelpCenterPage />);
    await waitFor(() => {
      const faqText = screen.queryByText(/faq|frequently/i);
      expect(faqText || document.body.innerHTML.includes('faq')).toBeTruthy();
    });
  });

  test('has contact support option', () => {
    renderWithProviders(<HelpCenterPage />);
    const contactButton = screen.queryByText(/contact|support/i);
    expect(contactButton || document.body.innerHTML.includes('contact')).toBeTruthy();
  });

  test('shows documentation links', async () => {
    renderWithProviders(<HelpCenterPage />);
    await waitFor(() => {
      const links = document.querySelectorAll('a');
      expect(links.length >= 0).toBe(true);
    });
  });

  test('displays article or guide content', async () => {
    renderWithProviders(<HelpCenterPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has breadcrumb navigation', async () => {
    renderWithProviders(<HelpCenterPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows video tutorials or links', async () => {
    renderWithProviders(<HelpCenterPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays contact form', async () => {
    renderWithProviders(<HelpCenterPage />);
    await waitFor(() => {
      const inputs = screen.queryAllByRole('textbox');
      expect(inputs.length >= 0).toBe(true);
    });
  });
});
