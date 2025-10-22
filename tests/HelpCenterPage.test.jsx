import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
import React from 'react';
import HelpCenterPage from '../src/pages/HelpCenterPage.jsx';
import { ToastProvider } from '../src/components/NotificationToast.jsx';

// Mock window.matchMedia for accessibility utils
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock dependencies
const mockApiService = {
  get: vi.fn(),
  post: vi.fn()
};

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
};

vi.mock('../src/hooks/useApi.js', () => ({
  useApi: () => ({
    apiService: mockApiService
  })
}));

vi.mock('../src/components/NotificationToast.jsx', () => ({
  ToastProvider: ({ children }) => children,
  useToast: vi.fn(() => mockToast)
}));

vi.mock('../src/utils/config.js', () => ({
  config: {
    auth: {
      storageKey: 'nilbx-auth-token'
    },
    ui: {
      apiTimeout: 10000
    },
    features: {
      blockchain: true,
      advancedAnalytics: true
    }
  }
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ToastProvider>
      {children}
    </ToastProvider>
  </BrowserRouter>
);

describe('HelpCenterPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.success.mockClear();
    mockToast.error.mockClear();
    mockToast.warning.mockClear();
    mockToast.info.mockClear();
    // Default mocks for all tests
    mockApiService.get.mockImplementation((url) => {
      if (url === '/faqs') return Promise.resolve([]);
      if (url === '/health/status') return Promise.resolve({
        api: 'healthy',
        database: 'healthy',
        blockchain: 'healthy'
      });
      return Promise.resolve(null);
    });
    mockApiService.post.mockResolvedValue({ success: true });
  });

  it.skip('renders help center page with title', async () => {
    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading help center...')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: /help center/i })).toBeInTheDocument();
  });

  it.skip('displays FAQ accordion with questions and answers', async () => {
    const mockFaqs = [
      { id: 1, question: 'How do I create an account?', answer: 'Click the sign up button...' },
      { id: 2, question: 'How do I reset my password?', answer: 'Go to the login page...' }
    ];

    // Override the default mock for this test
    mockApiService.get.mockImplementation((url) => {
      console.log('Mock API called with URL:', url);
      if (url === '/faqs') {
        console.log('Returning mock FAQs:', mockFaqs);
        return Promise.resolve(mockFaqs);
      }
      if (url === '/health/status') {
        const healthStatus = {
          api: 'healthy',
          database: 'healthy',
          blockchain: 'healthy'
        };
        console.log('Returning health status:', healthStatus);
        return Promise.resolve(healthStatus);
      }
      console.log('Returning null for URL:', url);
      return Promise.resolve(null);
    });

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('How do I create an account?')).toBeInTheDocument();
      expect(screen.getByText('How do I reset my password?')).toBeInTheDocument();
    });
  });

  it.skip('allows expanding and collapsing FAQ items', async () => {
    const mockFaqs = [
      { id: 1, question: 'How do I create an account?', answer: 'Click the sign up button and fill out the form.' }
    ];

    mockApiService.get.mockImplementation((url) => {
      if (url === '/faqs') return Promise.resolve(mockFaqs);
      if (url === '/health/status') return Promise.resolve({
        api: 'healthy',
        database: 'healthy',
        blockchain: 'healthy'
      });
      return Promise.resolve(null);
    });

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('How do I create an account?')).toBeInTheDocument();
    });

    // Initially answer should not be visible
    expect(screen.queryByText('Click the sign up button and fill out the form.')).not.toBeInTheDocument();

    // Click to expand
    const questionButton = screen.getByText('How do I create an account?');
    await user.click(questionButton);

    expect(screen.getByText('Click the sign up button and fill out the form.')).toBeInTheDocument();
  });

  it.skip('provides contact form for support requests', async () => {
    mockApiService.get.mockImplementation((url) => {
      if (url === '/faqs') return Promise.resolve([]);
      if (url === '/health/status') return Promise.resolve({
        api: 'healthy',
        database: 'healthy',
        blockchain: 'healthy'
      });
      return Promise.resolve(null);
    });

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it.skip('submits contact form successfully', async () => {
    mockApiService.get.mockImplementation((url) => {
      if (url === '/faqs') return Promise.resolve([]);
      if (url === '/health/status') return Promise.resolve({
        api: 'healthy',
        database: 'healthy',
        blockchain: 'healthy'
      });
      return Promise.resolve(null);
    });
    mockApiService.post.mockResolvedValueOnce({ success: true });

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    });

    const subjectInput = screen.getByLabelText(/subject/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(subjectInput, 'Account Issue');
    await user.type(messageTextarea, 'I cannot access my account');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.post).toHaveBeenCalledWith('/support/contact', {
        subject: 'Account Issue',
        message: 'I cannot access my account'
      });
    });
  });

  it.skip('shows service health status', async () => {
    const mockHealthStatus = {
      api: 'healthy',
      database: 'healthy',
      blockchain: 'degraded'
    };

    mockApiService.get.mockImplementation((url) => {
      if (url === '/faqs') return Promise.resolve([]);
      if (url === '/health/status') return Promise.resolve(mockHealthStatus);
      return Promise.resolve(null);
    });

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('API')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getByText('Blockchain')).toBeInTheDocument();
    });

    // Check that we have the correct status texts
    const healthyElements = screen.getAllByText('Healthy');
    const degradedElements = screen.getAllByText('Degraded');
    
    expect(healthyElements).toHaveLength(2); // API and Database
    expect(degradedElements).toHaveLength(1); // Blockchain
  });

  it.skip('provides search functionality for FAQs', async () => {
    // Mock API to fail so demo FAQs load
    mockApiService.get.mockRejectedValueOnce(new Error('API failed'));

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    // Wait for the demo FAQs to load
    await waitFor(() => {
      expect(screen.getByText('What is NILbx?')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Check that search input exists
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();

    // Type in search to filter FAQs
    await user.type(searchInput, 'NFT');

    // Should show NFT-related FAQ and hide others
    expect(screen.getByText('How do NFTs work on the platform?')).toBeInTheDocument();
    expect(screen.queryByText('What is NILbx?')).not.toBeInTheDocument();
  });

  it.skip('handles contact form submission errors', async () => {
    mockApiService.get.mockImplementation((url) => {
      if (url === '/faqs') return Promise.resolve([]);
      if (url === '/health/status') return Promise.resolve({
        api: 'healthy',
        database: 'healthy',
        blockchain: 'healthy'
      });
      return Promise.resolve(null);
    });
    mockApiService.post.mockRejectedValueOnce(new Error('Submission failed'));

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading help center...')).not.toBeInTheDocument();
    });

    // Now wait for the form to be available
    await waitFor(() => {
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    });

    const subjectInput = screen.getByLabelText(/subject/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(subjectInput, 'Test Issue');
    await user.type(messageTextarea, 'Test message');

    await user.click(submitButton);

    // The component shows success message even on API failure for demo purposes
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Thank you for your message! In a real implementation, this would be sent to our support team.');
    });
  });

  it('shows loading state during FAQ fetch', () => {
    mockApiService.get.mockImplementation(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    expect(screen.getByText('Loading help center...')).toBeInTheDocument();
  });

  it('displays different support categories', async () => {
    mockApiService.get.mockImplementation((url) => {
      if (url === '/faqs') return Promise.resolve([]);
      if (url === '/health/status') return Promise.resolve({
        api: 'healthy',
        database: 'healthy',
        blockchain: 'healthy'
      });
      return Promise.resolve(null);
    });

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Account & Login')).toBeInTheDocument();
      expect(screen.getByText('Payments & Billing')).toBeInTheDocument();
      expect(screen.getByText('Technical Support')).toBeInTheDocument();
    });
  });
});