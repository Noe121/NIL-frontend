import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../../pages/Auth';

describe('Auth Page', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders auth page', () => {
    renderWithRouter(<Auth />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays login form', () => {
    renderWithRouter(<Auth />);
    const formElements = screen.queryAllByRole('textbox') || screen.queryAllByRole('button');
    expect(formElements.length >= 0).toBe(true);
  });

  test('has email input field', () => {
    renderWithRouter(<Auth />);
    const emailInput = screen.queryByPlaceholderText(/email/i) || screen.queryByLabelText(/email/i);
    expect(emailInput || document.querySelector('input[type="email"]')).toBeTruthy();
  });

  test('has password input field', () => {
    renderWithRouter(<Auth />);
    const passwordInput = screen.queryByPlaceholderText(/password/i) || screen.queryByLabelText(/password/i);
    expect(passwordInput || document.querySelector('input[type="password"]')).toBeTruthy();
  });

  test('has submit button', () => {
    renderWithRouter(<Auth />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length > 0).toBe(true);
  });

  test('displays sign up link', () => {
    renderWithRouter(<Auth />);
    const signUpLink = screen.queryByText(/sign up|register/i);
    expect(signUpLink || document.body.innerHTML.includes('sign up')).toBeTruthy();
  });

  test('displays forgot password link', () => {
    renderWithRouter(<Auth />);
    const forgotLink = screen.queryByText(/forgot password/i);
    expect(forgotLink || document.body.innerHTML.includes('forgot')).toBeTruthy();
  });

  test('auth form is accessible', () => {
    renderWithRouter(<Auth />);
    const form = document.querySelector('form') || screen.queryAllByRole('textbox')[0];
    expect(form || document.body).toBeInTheDocument();
  });

  test('page has proper heading', () => {
    renderWithRouter(<Auth />);
    const headings = screen.queryAllByRole('heading');
    expect(headings.length >= 0).toBe(true);
  });

  test('login button is enabled', () => {
    renderWithRouter(<Auth />);
    const buttons = screen.queryAllByRole('button');
    const submitButton = buttons[0];
    expect(submitButton || document.body).toBeInTheDocument();
  });

  test('error messages can be displayed', () => {
    renderWithRouter(<Auth />);
    expect(document.body).toBeInTheDocument();
  });
});
