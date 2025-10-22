import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import MarketplacePage from '../MarketplacePage.jsx';

// Mock dependencies
vi.mock('../../hooks/useApi.js', () => ({
  useApi: () => ({
    apiService: {
      get: vi.fn(),
      post: vi.fn()
    }
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
      Share: {title}
    </div>
  )
}));

vi.mock('../../utils/config.js', () => ({
  config: {
    features: {
      blockchain: true,
      smartContracts: true
    }
  }
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('MarketplacePage', () => {
  const user = userEvent.setup();
  const mockApiService = {
    get: vi.fn(),
    post: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock useApi hook
    vi.mocked(import('../../hooks/useApi.js')).useApi.mockReturnValue({
      apiService: mockApiService
    });
  });

  it('renders marketplace page with title', () => {
    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /marketplace/i })).toBeInTheDocument();
  });

  it('displays product listing form for athletes', () => {
    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /price/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });

  it('shows blockchain payment option when feature is enabled', () => {
    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    expect(screen.getByText(/blockchain payment/i)).toBeInTheDocument();
  });

  it('hides blockchain features when feature flag is disabled', () => {
    vi.mocked(import('../../utils/config.js')).config.features.blockchain = false;

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    expect(screen.queryByText(/blockchain payment/i)).not.toBeInTheDocument();

    // Reset
    vi.mocked(import('../../utils/config.js')).config.features.blockchain = true;
  });

  it('fetches and displays products on mount', async () => {
    const mockProducts = [
      { token_id: '1', metadata: { name: 'Test NFT' }, price: '0.5' },
      { token_id: '2', metadata: { name: 'Test Merch' }, price: '25' }
    ];

    mockApiService.get.mockResolvedValueOnce(mockProducts);

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockApiService.get).toHaveBeenCalledWith('/athlete-nfts');
    });

    await waitFor(() => {
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.getByText('Test Merch')).toBeInTheDocument();
    });
  });

  it('displays products with social share buttons', async () => {
    const mockProducts = [
      { token_id: '1', metadata: { name: 'Test NFT' }, price: '0.5' }
    ];

    mockApiService.get.mockResolvedValueOnce(mockProducts);

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('social-share')).toBeInTheDocument();
      expect(screen.getByTestId('social-share')).toHaveAttribute('data-title', 'Test NFT');
    });
  });

  it('allows athletes to list new products', async () => {
    mockApiService.post.mockResolvedValueOnce({ success: true });
    mockApiService.get.mockResolvedValueOnce([]);

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    const submitButton = screen.getByRole('button', { name: /list product/i });

    await user.type(titleInput, 'New Product');
    await user.type(priceInput, '10');
    await user.selectOptions(categorySelect, 'nft');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.post).toHaveBeenCalledWith('/merchandise', {
        title: 'New Product',
        price: 10,
        category: 'nft'
      });
    });
  });

  it('shows loading state during product fetch', () => {
    mockApiService.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('handles product fetch errors gracefully', async () => {
    mockApiService.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });

  it('filters products by category', async () => {
    const mockProducts = [
      { token_id: '1', metadata: { name: 'NFT Item' }, price: '0.5', category: 'nft' },
      { token_id: '2', metadata: { name: 'T-Shirt' }, price: '25', category: 'merch' }
    ];

    mockApiService.get.mockResolvedValueOnce(mockProducts);

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('NFT Item')).toBeInTheDocument();
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    });

    // Filter by NFT
    const filterSelect = screen.getByRole('combobox', { name: /filter by category/i });
    await user.selectOptions(filterSelect, 'nft');

    expect(screen.getByText('NFT Item')).toBeInTheDocument();
    expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
  });

  it('initiates blockchain purchase for NFT products', async () => {
    const mockProducts = [
      { token_id: '1', metadata: { name: 'Test NFT' }, price: '0.5', category: 'nft' }
    ];

    mockApiService.get.mockResolvedValueOnce(mockProducts);

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
    });

    const buyButton = screen.getByRole('button', { name: /buy with blockchain/i });
    await user.click(buyButton);

    await waitFor(() => {
      expect(mockApiService.post).toHaveBeenCalledWith('/nfts/buy', {
        token_id: '1',
        price: '0.5'
      });
    });
  });
});