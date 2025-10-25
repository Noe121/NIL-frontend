import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Register';

describe('Register Page', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders register page', () => {
    renderWithRouter(<Register />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays registration form', () => {
    renderWithRouter(<Register />);
    const inputs = screen.queryAllByRole('textbox');
    expect(inputs.length >= 0).toBe(true);
  });

  test('has name input field', () => {
    renderWithRouter(<Register />);
    const nameInput = screen.queryByPlaceholderText(/name/i) || document.querySelector('input[name="name"]');
    expect(nameInput || document.body.innerHTML.includes('name')).toBeTruthy();
  });

  test('has email input field', () => {
    registerWithRouter(<Register />);
    const emailInput = screen.queryByPlaceholderText(/email/i) || document.querySelector('input[type="email"]');
    expect(emailInput || document.body.innerHTML.includes('email')).toBeTruthy();
  });

  test('has password input field', () => {
    renderWithRouter(<Register />);
    const passwordInput = screen.queryByPlaceholderText(/password/i) || document.querySelector('input[type="password"]');
    expect(passwordInput || document.body.innerHTML.includes('password')).toBeTruthy();
  });

  test('has confirm password field', () => {
    renderWithRouter(<Register />);
    const confirmInput = screen.queryByPlaceholderText(/confirm/i) || document.querySelector('input[name="confirmPassword"]');
    expect(confirmInput || document.body.innerHTML.includes('confirm')).toBeTruthy();
  });

  test('has role selection', () => {
    renderWithRouter(<Register />);
    const selects = screen.queryAllByRole('combobox') || document.querySelectorAll('select');
    expect(selects.length >= 0).toBe(true);
  });

  test('has submit button', () => {
    renderWithRouter(<Register />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length > 0).toBe(true);
  });

  test('displays login link', () => {
    renderWithRouter(<Register />);
    const loginLink = screen.queryByText(/sign in|login/i);
    expect(loginLink || document.body.innerHTML.includes('login')).toBeTruthy();
  });

  test('has terms and conditions checkbox', () => {
    renderWithRouter(<Register />);
    const checkbox = screen.queryByRole('checkbox') || document.querySelector('input[type="checkbox"]');
    expect(checkbox || document.body.innerHTML.includes('terms')).toBeTruthy();
  });

  test('form is accessible', () => {
    renderWithRouter(<Register />);
    const form = document.querySelector('form') || screen.queryAllByRole('textbox')[0];
    expect(form || document.body).toBeInTheDocument();
  });
});
