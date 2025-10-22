import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ProfileEditPage from '../src/pages/ProfileEditPage.jsx';

// Mock dependencies
const mockApiService = {
  get: vi.fn(() => Promise.resolve({})),
  post: vi.fn(() => Promise.resolve({ success: true })),
  put: vi.fn(() => Promise.resolve({ success: true }))
};

vi.mock('../src/hooks/useApi.js', () => ({
  useApi: () => ({
    apiService: mockApiService
  })
}));

vi.mock('../src/hooks/useAuth.js', () => ({
  useAuth: () => ({
    user: { role: 'athlete', id: 1 },
    updateUser: vi.fn()
  })
}));

vi.mock('../src/components/FileUpload.jsx', () => ({
  default: ({ onFileSelect }) => (
    <input
      type="file"
      data-testid="file-upload"
      onChange={(e) => onFileSelect && onFileSelect(e.target.files[0])}
    />
  )
}));

vi.mock('../src/utils/config.js', () => ({
  config: {
    features: {
      blockchain: true,
      advancedAnalytics: true
    }
  }
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('ProfileEditPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.skip('renders profile edit page with title', async () => {
    render(
      <TestWrapper>
        <ProfileEditPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /edit profile/i })).toBeInTheDocument();
    });
  });
});