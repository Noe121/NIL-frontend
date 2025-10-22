import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ProfileEditPage from '../ProfileEditPage.jsx';

// Mock dependencies
vi.mock('../../hooks/useApi.js', () => ({
  useApi: () => ({
    apiService: {
      put: vi.fn(),
      get: vi.fn()
    }
  })
}));

vi.mock('../../hooks/useAuth.js', () => ({
  useAuth: () => ({
    user: { id: 1, role: 'athlete', email: 'test@example.com' },
    login: vi.fn()
  })
}));

vi.mock('../../components/FileUpload.jsx', () => ({
  default: ({ onFileSelect }) => (
    <input
      type="file"
      data-testid="file-upload"
      onChange={(e) => onFileSelect && onFileSelect(e.target.files[0])}
    />
  )
}));

vi.mock('../../components/SocialShare.jsx', () => ({
  default: ({ url, title }) => (
    <div data-testid="social-share" data-url={url} data-title={title}>
      Share Profile
    </div>
  )
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('ProfileEditPage', () => {
  const user = userEvent.setup();
  const mockApiService = {
    put: vi.fn(),
    get: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(import('../../hooks/useApi.js')).useApi.mockReturnValue({
      apiService: mockApiService
    });
  });

  it('renders profile edit page with title', () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /edit profile/i })).toBeInTheDocument();
  });

  it('displays common profile fields for all users', () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /bio/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /social links/i })).toBeInTheDocument();
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });

  it('shows athlete-specific fields for athletes', () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /sport/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /position/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /height/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /weight/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /school/i })).toBeInTheDocument();
  });

  it('shows sponsor-specific fields for sponsors', () => {
    vi.mocked(import('../../hooks/useAuth.js')).useAuth.mockReturnValue({
      user: { id: 1, role: 'sponsor', email: 'sponsor@example.com' },
      login: vi.fn()
    });

    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /company name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /industry/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /budget/i })).toBeInTheDocument();
  });

  it('shows fan-specific fields for fans', () => {
    vi.mocked(import('../../hooks/useAuth.js')).useAuth.mockReturnValue({
      user: { id: 1, role: 'fan', email: 'fan@example.com' },
      login: vi.fn()
    });

    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /favorite teams/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /favorite athletes/i })).toBeInTheDocument();
  });

  it('loads existing profile data on mount', async () => {
    const mockProfile = {
      bio: 'Test bio',
      sport: 'Basketball',
      position: 'Guard',
      socialLinks: 'twitter.com/test'
    };

    mockApiService.get.mockResolvedValueOnce(mockProfile);

    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockApiService.get).toHaveBeenCalledWith('/athletes/1');
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Basketball')).toBeInTheDocument();
    });
  });

  it('provides real-time preview of profile changes', async () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    const bioInput = screen.getByRole('textbox', { name: /bio/i });
    await user.type(bioInput, 'New bio content');

    expect(screen.getByText('New bio content')).toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(submitButton);

    expect(screen.getByText(/bio is required/i)).toBeInTheDocument();
  });

  it('saves athlete profile successfully', async () => {
    mockApiService.put.mockResolvedValueOnce({ success: true });

    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    const bioInput = screen.getByRole('textbox', { name: /bio/i });
    const sportInput = screen.getByRole('textbox', { name: /sport/i });
    const submitButton = screen.getByRole('button', { name: /save profile/i });

    await user.type(bioInput, 'Test bio');
    await user.type(sportInput, 'Basketball');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.put).toHaveBeenCalledWith('/athletes/1', {
        bio: 'Test bio',
        sport: 'Basketball',
        position: '',
        height: '',
        weight: '',
        school: '',
        socialLinks: ''
      });
    });

    expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
  });

  it('saves sponsor profile successfully', async () => {
    vi.mocked(import('../../hooks/useAuth.js')).useAuth.mockReturnValue({
      user: { id: 1, role: 'sponsor', email: 'sponsor@example.com' },
      login: vi.fn()
    });

    mockApiService.put.mockResolvedValueOnce({ success: true });

    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    const bioInput = screen.getByRole('textbox', { name: /bio/i });
    const companyInput = screen.getByRole('textbox', { name: /company name/i });
    const submitButton = screen.getByRole('button', { name: /save profile/i });

    await user.type(bioInput, 'Company bio');
    await user.type(companyInput, 'Test Company');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.put).toHaveBeenCalledWith('/sponsors/1', {
        bio: 'Company bio',
        companyName: 'Test Company',
        industry: '',
        budget: 0,
        socialLinks: ''
      });
    });
  });

  it('handles file upload for profile photos', async () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    const fileInput = screen.getByTestId('file-upload');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await user.upload(fileInput, file);

    expect(screen.getByText(/photo uploaded successfully/i)).toBeInTheDocument();
  });

  it('shows social share options for profile', () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('social-share')).toBeInTheDocument();
  });

  it('handles profile update errors gracefully', async () => {
    mockApiService.put.mockRejectedValueOnce(new Error('Update failed'));

    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    const bioInput = screen.getByRole('textbox', { name: /bio/i });
    const submitButton = screen.getByRole('button', { name: /save profile/i });

    await user.type(bioInput, 'Test bio');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during profile save', async () => {
    mockApiService.put.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    const bioInput = screen.getByRole('textbox', { name: /bio/i });
    const submitButton = screen.getByRole('button', { name: /save profile/i });

    await user.type(bioInput, 'Test bio');
    await user.click(submitButton);

    expect(screen.getByText(/saving profile/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('validates social links format', async () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    const socialInput = screen.getByRole('textbox', { name: /social links/i });
    await user.type(socialInput, 'invalid-link');

    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(submitButton);

    expect(screen.getByText(/invalid social link format/i)).toBeInTheDocument();
  });
});