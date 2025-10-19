import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { UserContext } from '../src/contexts/UserContext';
import { Web3Context } from '../src/contexts/Web3Context';
import { ToastContainer } from 'react-toastify';
import { vi } from 'vitest';

// Common test data
export const TEST_DATA = {
  EMAIL: 'test@example.com',
  PASSWORD: 'StrongPass123!',
  TOKEN: 'test-jwt-token',
  USER_ID: '123',
  WALLET_ADDRESS: '0x1234567890abcdef1234567890abcdef12345678'
};

// Mock navigate function
export const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock contexts
export const mockUserContext = {
  user: null,
  setUser: vi.fn(),
  role: null,
  setRole: vi.fn(),
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
  setLoading: vi.fn()
};

export const mockConfigContext = {
  apiUrl: 'http://localhost:8000',
  blockchainEnabled: false,
  features: {
    nftMarketplace: false,
    smartContracts: false
  },
  environment: 'test'
};

export const mockWeb3Context = {
  account: null,
  chainId: null,
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: false,
  provider: null
};

// Network mock utilities
export const mockFetch = (response = {}, options = {}) => {
  const { delay = 0, error = false } = options;
  
  if (error) {
    return vi.fn().mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network Error')), delay)
      )
    );
  }

  return vi.fn().mockImplementation(() =>
    new Promise((resolve) =>
      setTimeout(() => resolve({
        ok: true,
        json: async () => response,
        ...response
      }), delay)
    )
  );
};

// Toast mock
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  },
  ToastContainer: () => null
}));

// Custom render function with all providers
function render(
  ui,
  {
    route = '/',
    userContext = mockUserContext,
    configContext = mockConfigContext,
    web3Context = mockWeb3Context,
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <UserContext.Provider value={userContext}>
          <Web3Context.Provider value={web3Context}>
            <ToastContainer />
            {children}
          </Web3Context.Provider>
        </UserContext.Provider>
      </MemoryRouter>
    );
  }

  const user = userEvent.setup();
  const result = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
  
  return {
    user,
    ...result
  };
}

// Custom queries
const customQueries = {
  queryByDataTestId: (container, id) =>
    container.querySelector(`[data-testid="${id}"]`),
  queryAllByDataTestId: (container, id) =>
    Array.from(container.querySelectorAll(`[data-testid="${id}"]`)),
  getByDataTestId: (container, id) => {
    const element = customQueries.queryByDataTestId(container, id);
    if (!element) {
      throw new Error(`Unable to find element by data-testid: ${id}`);
    }
    return element;
  },
  getAllByDataTestId: (container, id) => {
    const elements = customQueries.queryAllByDataTestId(container, id);
    if (!elements.length) {
      throw new Error(`Unable to find elements by data-testid: ${id}`);
    }
    return elements;
  },
};

// Test setup helpers
export const setupAuthenticatedTest = (userProps = {}) => {
  const authenticatedContext = {
    ...mockUserContext,
    user: {
      id: TEST_DATA.USER_ID,
      email: TEST_DATA.EMAIL,
      ...userProps
    },
    isAuthenticated: true,
    role: 'user'
  };

  return {
    userContext: authenticatedContext
  };
};

export const setupBlockchainTest = (web3Props = {}) => {
  const blockchainContext = {
    ...mockWeb3Context,
    account: TEST_DATA.WALLET_ADDRESS,
    isConnected: true,
    ...web3Props
  };

  const blockchainConfig = {
    ...mockConfigContext,
    blockchainEnabled: true,
    features: {
      ...mockConfigContext.features,
      nftMarketplace: true,
      smartContracts: true
    }
  };

  return {
    web3Context: blockchainContext,
    configContext: blockchainConfig
  };
};

// Common test utilities
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    const loader = screen.queryByRole('progressbar');
    if (loader) {
      throw new Error('Still loading');
    }
  });
};

// Re-export testing library utilities
export * from '@testing-library/react';
export { render, customQueries };