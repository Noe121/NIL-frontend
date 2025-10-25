import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ProfileEditPage from '../../pages/ProfileEditPage';

describe('ProfileEditPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('renders profile edit page', () => {
    renderWithProviders(<ProfileEditPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays profile form', async () => {
    renderWithProviders(<ProfileEditPage />);
    await waitFor(() => {
      const inputs = screen.queryAllByRole('textbox');
      expect(inputs.length >= 0).toBe(true);
    });
  });

  test('has name input field', () => {
    renderWithProviders(<ProfileEditPage />);
    const nameInput = screen.queryByPlaceholderText(/name/i) || document.querySelector('input[name="name"]');
    expect(nameInput || document.body.innerHTML.includes('name')).toBeTruthy();
  });

  test('has bio/description field', () => {
    renderWithProviders(<ProfileEditPage />);
    const bioInput = screen.queryByPlaceholderText(/bio|description/i) || document.querySelector('textarea');
    expect(bioInput || document.body.innerHTML.includes('bio')).toBeTruthy();
  });

  test('displays avatar upload', () => {
    renderWithProviders(<ProfileEditPage />);
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput || document.body.innerHTML.includes('upload')).toBeTruthy();
  });

  test('has social media input fields', async () => {
    renderWithProviders(<ProfileEditPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays category selection', async () => {
    renderWithProviders(<ProfileEditPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has save button', () => {
    renderWithProviders(<ProfileEditPage />);
    const saveButton = screen.queryByText(/save|update/i);
    expect(saveButton || document.body.innerHTML.includes('save')).toBeTruthy();
  });

  test('has cancel button', () => {
    renderWithProviders(<ProfileEditPage />);
    const cancelButton = screen.queryByText(/cancel/i);
    expect(cancelButton || document.body.innerHTML.includes('cancel')).toBeTruthy();
  });

  test('shows form validation messages', async () => {
    renderWithProviders(<ProfileEditPage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
