import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import HelpCenterPage from '../HelpCenterPage.jsx';

// Mock dependencies
vi.mock('../../hooks/useApi.js', () => ({
  useApi: () => ({
    apiService: {
      get: vi.fn(),
      post: vi.fn()
    }
  })
}));

vi.mock('../../components/LoadingSpinner.jsx', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>
}));

vi.mock('../../components/Tooltip.jsx', () => ({
  default: ({ children, content }) => (
    <div data-testid="tooltip" data-content={content}>
      {children}
    </div>
  )
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('HelpCenterPage', () => {
  const user = userEvent.setup();
  const mockApiService = {
    get: vi.fn(),
    post: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(import('../../hooks/useApi.js')).useApi.mockReturnValue({
      apiService: mockApiService
    });
  });

  it('renders help center page with title', () => {
    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /help center/i })).toBeInTheDocument();
  });

  it('fetches and displays FAQ data on mount', async () => {
    const mockFAQs = [
      {
        id: 1,
        question: 'How do I create an account?',
        answer: 'Click the register button and fill out the form.',
        category: 'account'
      },
      {
        id: 2,
        question: 'How do I reset my password?',
        answer: 'Use the forgot password link on the login page.',
        category: 'account'
      }
    ];

    mockApiService.get.mockResolvedValueOnce(mockFAQs);

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockApiService.get).toHaveBeenCalledWith('/help/faq');
    });

    await waitFor(() => {
      expect(screen.getByText('How do I create an account?')).toBeInTheDocument();
      expect(screen.getByText('How do I reset my password?')).toBeInTheDocument();
    });
  });

  it('displays FAQ in accordion format', async () => {
    const mockFAQs = [
      {
        id: 1,
        question: 'Test Question',
        answer: 'Test Answer',
        category: 'general'
      }
    ];

    mockApiService.get.mockResolvedValueOnce(mockFAQs);

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const accordionButton = screen.getByRole('button', { name: /test question/i });
      expect(accordionButton).toBeInTheDocument();
    });
  });

  it('expands and collapses FAQ answers', async () => {
    const mockFAQs = [
      {
        id: 1,
        question: 'Test Question',
        answer: 'Test Answer',
        category: 'general'
      }
    ];

    mockApiService.get.mockResolvedValueOnce(mockFAQs);

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const accordionButton = screen.getByRole('button', { name: /test question/i });
      expect(screen.queryByText('Test Answer')).not.toBeInTheDocument();

      user.click(accordionButton);
      expect(screen.getByText('Test Answer')).toBeInTheDocument();
    });
  });

  it('filters FAQs by category', async () => {
    const mockFAQs = [
      { id: 1, question: 'Account FAQ', answer: 'Answer', category: 'account' },
      { id: 2, question: 'Payment FAQ', answer: 'Answer', category: 'payment' }
    ];

    mockApiService.get.mockResolvedValueOnce(mockFAQs);

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Account FAQ')).toBeInTheDocument();
      expect(screen.getByText('Payment FAQ')).toBeInTheDocument();
    });

    const categoryFilter = screen.getByRole('combobox', { name: /filter by category/i });
    await user.selectOptions(categoryFilter, 'account');

    expect(screen.getByText('Account FAQ')).toBeInTheDocument();
    expect(screen.queryByText('Payment FAQ')).not.toBeInTheDocument();
  });

  it('provides contact form for support requests', () => {
    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /subject/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('submits contact form successfully', async () => {
    mockApiService.post.mockResolvedValueOnce({ success: true });

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const subjectInput = screen.getByRole('textbox', { name: /subject/i });
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(subjectInput, 'Test Subject');
    await user.type(messageInput, 'Test message content');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.post).toHaveBeenCalledWith('/help/contact', {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      });
    });

    expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
  });

  it('validates contact form fields', async () => {
    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
  });

  it('displays service health status', async () => {
    const mockHealthStatus = {
      'api-service': 'healthy',
      'auth-service': 'healthy',
      'blockchain-service': 'degraded'
    };

    // Mock the health check API
    mockApiService.get.mockImplementation((endpoint) => {
      if (endpoint === '/health') {
        return Promise.resolve(mockHealthStatus);
      }
      return Promise.resolve([]);
    });

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/api-service: healthy/i)).toBeInTheDocument();
      expect(screen.getByText(/auth-service: healthy/i)).toBeInTheDocument();
      expect(screen.getByText(/blockchain-service: degraded/i)).toBeInTheDocument();
    });
  });

  it('shows tooltips for inline help', () => {
    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    const tooltips = screen.getAllByTestId('tooltip');
    expect(tooltips.length).toBeGreaterThan(0);
  });

  it('handles FAQ fetch errors gracefully', async () => {
    mockApiService.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load faq/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during FAQ fetch', () => {
    mockApiService.get.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('provides search functionality for FAQs', async () => {
    const mockFAQs = [
      { id: 1, question: 'How to login', answer: 'Click login', category: 'account' },
      { id: 2, question: 'How to pay', answer: 'Use card', category: 'payment' }
    ];

    mockApiService.get.mockResolvedValueOnce(mockFAQs);

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('How to login')).toBeInTheDocument();
      expect(screen.getByText('How to pay')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /search faq/i });
    await user.type(searchInput, 'login');

    expect(screen.getByText('How to login')).toBeInTheDocument();
    expect(screen.queryByText('How to pay')).not.toBeInTheDocument();
  });

  it('handles contact form submission errors', async () => {
    mockApiService.post.mockRejectedValueOnce(new Error('Submission failed'));

    render(
      <TestWrapper>
        <HelpCenterPage />
      </TestWrapper>
    );

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
  });
});