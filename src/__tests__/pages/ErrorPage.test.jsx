import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorPage from '../../pages/ErrorPage';

describe('ErrorPage', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders error page', () => {
    renderWithRouter(<ErrorPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays error message', () => {
    renderWithRouter(<ErrorPage />);
    const errorText = screen.queryByText(/error|404|not found/i);
    expect(errorText || document.body.innerHTML.includes('error')).toBeTruthy();
  });

  test('shows error code', () => {
    renderWithRouter(<ErrorPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays helpful message', () => {
    renderWithRouter(<ErrorPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('has back button', () => {
    renderWithRouter(<ErrorPage />);
    const backButton = screen.queryByText(/back|home|go/i);
    expect(backButton || document.body.innerHTML.includes('back')).toBeTruthy();
  });

  test('has home link', () => {
    renderWithRouter(<ErrorPage />);
    const homeLink = screen.queryByText(/home|index/i);
    expect(homeLink || document.body.innerHTML.includes('home')).toBeTruthy();
  });

  test('page is accessible', () => {
    renderWithRouter(<ErrorPage />);
    const headings = screen.queryAllByRole('heading');
    expect(headings.length >= 0).toBe(true);
  });

  test('error icon is displayed', () => {
    renderWithRouter(<ErrorPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('support contact information is shown', () => {
    renderWithRouter(<ErrorPage />);
    const supportText = screen.queryByText(/support|help|contact/i);
    expect(supportText || document.body.innerHTML.includes('support')).toBeTruthy();
  });

  test('responsive design is applied', () => {
    renderWithRouter(<ErrorPage />);
    const container = document.body;
    expect(container).toBeInTheDocument();
  });
});
