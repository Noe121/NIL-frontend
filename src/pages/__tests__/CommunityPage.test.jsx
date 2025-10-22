import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import CommunityPage from '../CommunityPage.jsx';

// Mock dependencies
vi.mock('../../hooks/useApi.js', () => ({
  useApi: () => ({
    apiService: {
      get: vi.fn(),
      post: vi.fn()
    }
  })
}));

vi.mock('../../components/NotificationToast.jsx', () => ({
  default: ({ message, type }) => (
    <div data-testid="notification-toast" data-message={message} data-type={type}>
      {message}
    </div>
  )
}));

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  send: vi.fn(),
  close: vi.fn()
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('CommunityPage', () => {
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

  it('renders community page with title', () => {
    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /community/i })).toBeInTheDocument();
  });

  it('fetches and displays discussion threads on mount', async () => {
    const mockThreads = [
      { id: 1, title: 'Basketball Discussion', category: 'basketball', replies: 15 },
      { id: 2, title: 'Football Recruiting', category: 'football', replies: 8 }
    ];

    mockApiService.get.mockResolvedValueOnce(mockThreads);

    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockApiService.get).toHaveBeenCalledWith('/community/threads');
    });

    await waitFor(() => {
      expect(screen.getByText('Basketball Discussion')).toBeInTheDocument();
      expect(screen.getByText('Football Recruiting')).toBeInTheDocument();
    });
  });

  it('displays thread categories and reply counts', async () => {
    const mockThreads = [
      { id: 1, title: 'Test Thread', category: 'basketball', replies: 5 }
    ];

    mockApiService.get.mockResolvedValueOnce(mockThreads);

    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('basketball')).toBeInTheDocument();
      expect(screen.getByText('5 replies')).toBeInTheDocument();
    });
  });

  it('allows filtering threads by category', async () => {
    const mockThreads = [
      { id: 1, title: 'Basketball Thread', category: 'basketball', replies: 5 },
      { id: 2, title: 'Football Thread', category: 'football', replies: 3 }
    ];

    mockApiService.get.mockResolvedValueOnce(mockThreads);

    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Basketball Thread')).toBeInTheDocument();
      expect(screen.getByText('Football Thread')).toBeInTheDocument();
    });

    const categoryFilter = screen.getByRole('combobox', { name: /filter by sport/i });
    await user.selectOptions(categoryFilter, 'basketball');

    expect(screen.getByText('Basketball Thread')).toBeInTheDocument();
    expect(screen.queryByText('Football Thread')).not.toBeInTheDocument();
  });

  it('provides form to create new discussion threads', () => {
    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /thread title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create thread/i })).toBeInTheDocument();
  });

  it('creates new discussion thread', async () => {
    mockApiService.post.mockResolvedValueOnce({ success: true });
    mockApiService.get.mockResolvedValueOnce([]);

    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    const titleInput = screen.getByRole('textbox', { name: /thread title/i });
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    const submitButton = screen.getByRole('button', { name: /create thread/i });

    await user.type(titleInput, 'New Discussion');
    await user.type(messageInput, 'This is a test message');
    await user.selectOptions(categorySelect, 'basketball');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.post).toHaveBeenCalledWith('/community/post', {
        title: 'New Discussion',
        message: 'This is a test message',
        category: 'basketball'
      });
    });
  });

  it('shows real-time chat interface when WebSocket is available', () => {
    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /chat message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('displays chat messages in real-time', () => {
    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    // Mock WebSocket message
    const mockWebSocket = global.WebSocket.mock.results[0].value;
    const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )[1];

    // Simulate receiving a message
    messageHandler({
      data: JSON.stringify({
        type: 'message',
        user: 'TestUser',
        message: 'Hello everyone!',
        timestamp: new Date().toISOString()
      })
    });

    expect(screen.getByText('TestUser: Hello everyone!')).toBeInTheDocument();
  });

  it('sends chat messages via WebSocket', async () => {
    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    const chatInput = screen.getByRole('textbox', { name: /chat message/i });
    const sendButton = screen.getByRole('button', { name: /send/i });

    await user.type(chatInput, 'Test message');
    await user.click(sendButton);

    const mockWebSocket = global.WebSocket.mock.results[0].value;
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'message',
        message: 'Test message'
      })
    );
  });

  it('shows moderation tools for admins', () => {
    // Mock admin role
    vi.mocked(import('../../hooks/useAuth.js')).useAuth.mockReturnValue({
      user: { role: 'admin' }
    });

    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /moderate/i })).toBeInTheDocument();
  });

  it('handles thread fetch errors gracefully', async () => {
    mockApiService.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load threads/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during thread fetch', () => {
    mockApiService.get.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    expect(screen.getByText(/loading discussions/i)).toBeInTheDocument();
  });

  it('notifies users of new messages', () => {
    render(
      <TestWrapper>
        <CommunityPage />
      </TestWrapper>
    );

    // Mock WebSocket message
    const mockWebSocket = global.WebSocket.mock.results[0].value;
    const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )[1];

    messageHandler({
      data: JSON.stringify({
        type: 'notification',
        message: 'New reply to your thread'
      })
    });

    expect(screen.getByTestId('notification-toast')).toHaveAttribute('data-message', 'New reply to your thread');
  });
});