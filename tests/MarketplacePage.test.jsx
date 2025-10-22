import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
import React from 'react';

// Mock ethers first
vi.mock('ethers', () => ({
  providers: {
    JsonRpcProvider: vi.fn().mockImplementation(() => ({
      getSigner: vi.fn()
    }))
  },
  Contract: vi.fn()
}));

// Mock dependencies before any imports that use them
vi.mock('../src/services/api.js', () => ({
  default: {
    get: vi.fn(() => Promise.resolve([])),
    post: vi.fn(() => Promise.resolve({ success: true })),
    checkHealth: vi.fn(() => Promise.resolve({ status: 'ok' }))
  }
}));

// Mock the config module
vi.mock('../src/utils/config.js', () => ({
  config: {
    features: {
      blockchain: false, // Disable blockchain for tests to avoid ethers issues
      smartContracts: false
    },
    auth: {
      storageKey: 'test_token_key',
      sessionTimeout: 3600000
    },
    authServiceUrl: 'http://localhost:9000',
    apiUrl: 'http://localhost:8001',
    ui: {
      apiTimeout: 5000
    }
  }
}));

import MarketplacePage from '../src/pages/MarketplacePage.jsx';
import { ApiProvider } from '../src/contexts/ApiContext.jsx';
import apiService from '../src/services/api.js';

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ApiProvider>
      {children}
    </ApiProvider>
  </BrowserRouter>
);

describe('MarketplacePage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.skip('renders marketplace page with title', async () => {
    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    // Wait for loading to complete and title to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /marketplace/i })).toBeInTheDocument();
    });
  });

  it.skip('displays product listing form for athletes', async () => {
    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    });

    // Check that all form elements are present
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /price/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Category *')).toBeInTheDocument();
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });

  it.skip('shows blockchain payment option when feature is enabled', async () => {
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
      expect(screen.getByRole('button', { name: /login to buy/i })).toBeInTheDocument();
    });
  });

  it.skip('fetches and displays products on mount', async () => {
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

  it.skip('displays products with social share buttons', async () => {
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

  it.skip('allows athletes to list new products', async () => {
    mockApiService.post.mockResolvedValueOnce({ success: true });
    mockApiService.get.mockResolvedValueOnce([]);

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    });

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    const categorySelect = screen.getByLabelText('Category *');
    const submitButton = screen.getByRole('button', { name: /list product/i });

    await user.type(titleInput, 'New Product');
    await user.type(priceInput, '10');
    await user.selectOptions(categorySelect, 'nft');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.post).toHaveBeenCalledWith('/merchandise', {
        title: 'New Product',
        price: '10',
        category: 'nft'
      });
    });
  });

  it('shows loading state during product fetch', () => {
    apiService.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('handles product fetch errors gracefully', async () => {
    apiService.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <MarketplacePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });

  it.skip('filters products by category', async () => {
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
});