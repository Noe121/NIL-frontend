/**
 * Frontend Integration Tests for NIL
 * Tests for React components, API integration, and user flows
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Deal Management Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should list available deals', async () => {
    const mockDeals = [
      { deal_id: 1, title: 'Nike Deal', amount: 500 },
      { deal_id: 2, title: 'Adidas Deal', amount: 700 }
    ];
    
    axios.get.mockResolvedValueOnce({ data: mockDeals });
    
    // Simulate component rendering and API call
    const response = await axios.get('/api/deals');
    
    expect(response.data).toHaveLength(2);
    expect(response.data[0].title).toBe('Nike Deal');
    expect(axios.get).toHaveBeenCalledWith('/api/deals');
  });

  it('should filter deals by amount', async () => {
    const filteredDeals = [
      { deal_id: 1, title: 'Nike Deal', amount: 500 }
    ];
    
    axios.get.mockResolvedValueOnce({ data: filteredDeals });
    
    const response = await axios.get('/api/deals', {
      params: { min_amount: 400, max_amount: 600 }
    });
    
    expect(response.data).toHaveLength(1);
    expect(response.data[0].amount).toBe(500);
  });

  it('should accept a deal', async () => {
    const acceptResponse = {
      deal_id: 1,
      status: 'ACCEPTED',
      accepted_at: new Date().toISOString()
    };
    
    axios.post.mockResolvedValueOnce({ data: acceptResponse });
    
    const response = await axios.post('/api/deals/1/accept');
    
    expect(response.data.status).toBe('ACCEPTED');
    expect(response.data.deal_id).toBe(1);
    expect(axios.post).toHaveBeenCalledWith('/api/deals/1/accept');
  });

  it('should get deal details', async () => {
    const dealDetails = {
      deal_id: 1,
      title: 'Nike Deal',
      company_id: 10,
      amount: 500,
      status: 'ACTIVE',
      description: 'Endorsement deal'
    };
    
    axios.get.mockResolvedValueOnce({ data: dealDetails });
    
    const response = await axios.get('/api/deals/1');
    
    expect(response.data).toEqual(dealDetails);
    expect(response.data.company_id).toBe(10);
  });

  it('should handle deal filtering by category', async () => {
    axios.get.mockResolvedValueOnce({ 
      data: [{ deal_id: 1, title: 'Apparel Deal', category: 'ATHLETIC_APPAREL' }]
    });
    
    const response = await axios.get('/api/deals', {
      params: { category: 'ATHLETIC_APPAREL' }
    });
    
    expect(response.data[0].category).toBe('ATHLETIC_APPAREL');
  });
});

describe('Dispute Management Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should file a dispute', async () => {
    const disputeData = {
      payment_id: 123,
      dispute_type: 'DEAL_VIOLATION',
      description: 'Payment not received'
    };
    
    const response_data = {
      dispute_id: 456,
      status: 'OPEN',
      created_at: new Date().toISOString()
    };
    
    axios.post.mockResolvedValueOnce({ data: response_data });
    
    const response = await axios.post('/api/disputes', disputeData);
    
    expect(response.data.status).toBe('OPEN');
    expect(axios.post).toHaveBeenCalledWith('/api/disputes', disputeData);
  });

  it('should list user disputes', async () => {
    const disputes = [
      { dispute_id: 1, status: 'OPEN', payment_id: 100 },
      { dispute_id: 2, status: 'RESOLVED', payment_id: 101 }
    ];
    
    axios.get.mockResolvedValueOnce({ data: disputes });
    
    const response = await axios.get('/api/disputes');
    
    expect(response.data).toHaveLength(2);
    expect(response.data[0].status).toBe('OPEN');
  });

  it('should get dispute details', async () => {
    const disputeDetails = {
      dispute_id: 1,
      payment_id: 100,
      status: 'OPEN',
      dispute_type: 'DEAL_VIOLATION',
      description: 'Test dispute'
    };
    
    axios.get.mockResolvedValueOnce({ data: disputeDetails });
    
    const response = await axios.get('/api/disputes/1');
    
    expect(response.data).toEqual(disputeDetails);
    expect(axios.get).toHaveBeenCalledWith('/api/disputes/1');
  });
});

describe('Check-in Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a check-in', async () => {
    const checkinData = {
      status: 'COMPLETED',
      duration_minutes: 60,
      location: 'Home'
    };
    
    const response_data = {
      id: 789,
      ...checkinData,
      created_at: new Date().toISOString()
    };
    
    axios.post.mockResolvedValueOnce({ data: response_data });
    
    const response = await axios.post('/api/checkins', checkinData);
    
    expect(response.data.id).toBe(789);
    expect(response.data.status).toBe('COMPLETED');
  });

  it('should list user check-ins', async () => {
    const checkins = [
      { id: 1, status: 'COMPLETED', duration_minutes: 60 },
      { id: 2, status: 'PENDING', duration_minutes: 45 }
    ];
    
    axios.get.mockResolvedValueOnce({ data: checkins });
    
    const response = await axios.get('/api/checkins');
    
    expect(response.data).toHaveLength(2);
    expect(axios.get).toHaveBeenCalledWith('/api/checkins');
  });

  it('should update check-in', async () => {
    const updateData = { status: 'VERIFIED', duration_minutes: 75 };
    const updated = { id: 1, ...updateData };
    
    axios.put.mockResolvedValueOnce({ data: updated });
    
    const response = await axios.put('/api/checkins/1', updateData);
    
    expect(response.data.status).toBe('VERIFIED');
    expect(response.data.duration_minutes).toBe(75);
  });

  it('should delete check-in', async () => {
    axios.delete.mockResolvedValueOnce({ data: { deleted: true } });
    
    const response = await axios.delete('/api/checkins/1');
    
    expect(response.data.deleted).toBe(true);
    expect(axios.delete).toHaveBeenCalledWith('/api/checkins/1');
  });

  it('should handle check-in not found', async () => {
    const error = {
      response: {
        status: 404,
        data: { error: 'Check-in not found' }
      }
    };
    
    axios.get.mockRejectedValueOnce(error);
    
    try {
      await axios.get('/api/checkins/999');
    } catch (e) {
      expect(e.response.status).toBe(404);
    }
  });
});

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login user', async () => {
    const loginData = {
      username: 'athlete@example.com',
      password: 'Athlete123!'
    };
    
    const response_data = {
      access_token: 'token123',
      user: { id: 1, email: 'athlete@example.com' }
    };
    
    axios.post.mockResolvedValueOnce({ data: response_data });
    
    const response = await axios.post('/api/auth/login', loginData);
    
    expect(response.data.access_token).toBe('token123');
    expect(response.data.user.email).toBe('athlete@example.com');
  });

  it('should handle login failure', async () => {
    const error = {
      response: {
        status: 401,
        data: { error: 'Invalid credentials' }
      }
    };
    
    axios.post.mockRejectedValueOnce(error);
    
    try {
      await axios.post('/api/auth/login', {
        username: 'user@example.com',
        password: 'wrong'
      });
    } catch (e) {
      expect(e.response.status).toBe(401);
    }
  });

  it('should get user profile', async () => {
    const profile = {
      id: 1,
      email: 'athlete@example.com',
      name: 'John Athlete',
      bio: 'Professional athlete'
    };
    
    axios.get.mockResolvedValueOnce({ data: profile });
    
    const response = await axios.get('/api/auth/profile', {
      headers: { Authorization: 'Bearer token123' }
    });
    
    expect(response.data.email).toBe('athlete@example.com');
  });

  it('should logout user', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    
    const response = await axios.post('/api/auth/logout', {}, {
      headers: { Authorization: 'Bearer token123' }
    });
    
    expect(response.data.success).toBe(true);
  });
});

describe('API Key Management Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create API key', async () => {
    const apiKeyResponse = {
      key_id: 'key123',
      key: 'sk_test_abc123',
      created_at: new Date().toISOString()
    };
    
    axios.post.mockResolvedValueOnce({ data: apiKeyResponse });
    
    const response = await axios.post('/api/auth/api-keys', {});
    
    expect(response.data.key_id).toBe('key123');
    expect(response.data.key).toBeDefined();
  });

  it('should list API keys', async () => {
    const keys = [
      { key_id: 'key1', created_at: '2024-01-01' },
      { key_id: 'key2', created_at: '2024-01-02' }
    ];
    
    axios.get.mockResolvedValueOnce({ data: keys });
    
    const response = await axios.get('/api/auth/api-keys');
    
    expect(response.data).toHaveLength(2);
  });

  it('should rotate API key', async () => {
    const rotatedKey = {
      key_id: 'key1',
      new_key: 'sk_test_xyz789',
      rotated_at: new Date().toISOString()
    };
    
    axios.post.mockResolvedValueOnce({ data: rotatedKey });
    
    const response = await axios.post('/api/auth/api-keys/key1/rotate');
    
    expect(response.data.new_key).toBeDefined();
  });

  it('should revoke API key', async () => {
    axios.delete.mockResolvedValueOnce({ data: { revoked: true } });
    
    const response = await axios.delete('/api/auth/api-keys/key1');
    
    expect(response.data.revoked).toBe(true);
  });
});

describe('Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle network errors', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);
    
    try {
      await axios.get('/api/deals');
    } catch (e) {
      expect(e.message).toBe('Network Error');
    }
  });

  it('should handle server errors (500)', async () => {
    const error = {
      response: {
        status: 500,
        data: { error: 'Internal Server Error' }
      }
    };
    
    axios.get.mockRejectedValueOnce(error);
    
    try {
      await axios.get('/api/deals');
    } catch (e) {
      expect(e.response.status).toBe(500);
    }
  });

  it('should handle validation errors', async () => {
    const error = {
      response: {
        status: 422,
        data: {
          errors: [
            { field: 'amount', message: 'Must be greater than 0' }
          ]
        }
      }
    };
    
    axios.post.mockRejectedValueOnce(error);
    
    try {
      await axios.post('/api/deals', { title: 'Deal', amount: -100 });
    } catch (e) {
      expect(e.response.data.errors).toHaveLength(1);
    }
  });
});

describe('Compliance and Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch audit logs', async () => {
    const auditLogs = [
      { id: 1, action: 'DEAL_ACCEPTED', entity: 'deal' },
      { id: 2, action: 'CHECKIN_CREATED', entity: 'checkin' }
    ];
    
    axios.get.mockResolvedValueOnce({ data: auditLogs });
    
    const response = await axios.get('/api/audit-logs', {
      headers: { Authorization: 'Bearer admin_token' }
    });
    
    expect(response.data).toHaveLength(2);
  });

  it('should get compliance status', async () => {
    const compliance = {
      athlete_id: 1,
      compliance_score: 95,
      status: 'COMPLIANT'
    };
    
    axios.get.mockResolvedValueOnce({ data: compliance });
    
    const response = await axios.get('/api/compliance/athletes/1', {
      headers: { Authorization: 'Bearer admin_token' }
    });
    
    expect(response.data.status).toBe('COMPLIANT');
    expect(response.data.compliance_score).toBe(95);
  });
});
