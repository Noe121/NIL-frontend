import { config, utils, createApiRequest } from '../utils/config';
import axios from 'axios';
import { authService } from './authService';
import { createBlockchainService } from './blockchainService';

// Create axios instances for different services
const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.ui.apiTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

const authClient = axios.create({
  baseURL: config.authServiceUrl,
  timeout: config.ui.apiTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

const companyClient = axios.create({
  baseURL: config.companyApiUrl,
  timeout: config.ui.apiTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
const addAuthToken = (config) => {
  const token = utils.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Apply interceptors to all clients
[apiClient, authClient, companyClient].forEach(client => {
  client.interceptors.request.use(addAuthToken);
  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Don't redirect if we're on public pages that should work without auth
        const currentPath = window.location.pathname;
        const publicPaths = ['/', '/help', '/leaderboard', '/marketplace', '/community'];
        const isPublicProfile = currentPath.startsWith('/athletes/');
        
        if (!publicPaths.includes(currentPath) && !isPublicProfile) {
          utils.clearAuthToken();
          window.location.href = '/auth';
        }
        // For public pages, just reject the promise without redirecting
      }
      return Promise.reject(error);
    }
  );
});

// Blockchain service setup
let provider = null;
let signer = null;

if (config.features.blockchain) {
  provider = new ethers.providers.JsonRpcProvider(config.blockchain.rpcUrl);
  
  // Initialize contracts
  const contracts = {
    playerLegacyNFT: new ethers.Contract(
      config.blockchain.contracts.playerLegacyNFT,
      // Add ABI here
      [],
      provider
    ),
    sponsorshipContract: new ethers.Contract(
      config.blockchain.contracts.sponsorshipContract,
      // Add ABI here
      [],
      provider
    )
  };
}

// API Service class
class ApiService {
  constructor() {
    this.apiClient = apiClient;
    this.authClient = authClient;
    this.companyClient = companyClient;
    this.authService = authService;
    this.blockchainService = null; // Initialize later with web3 context
    this.endpoints = {
      athletes: '/athletes',
      sponsors: '/sponsors',
      fans: '/fans',
    };
  }

  // Initialize blockchain service with web3 context (only if feature is enabled)
  initializeBlockchainService(web3Context) {
    if (!config.features.blockchain) {
      console.warn('Blockchain integration is not enabled, skipping initialization');
      return;
    }
    this.blockchainService = createBlockchainService(web3Context);
  }

  // User Management
  async getUserProfile() {
    const response = await this.authClient.get('/me');
    return response.data;
  }

  async updateUserProfile(data, role) {
    const endpoint = this.endpoints[`${role}s`];
    if (!endpoint) {
      throw new Error('Invalid role');
    }

    if (data.id) {
      const response = await this.apiClient.put(`${endpoint}/${data.id}`, data);
      return response.data;
    } else {
      const response = await this.apiClient.post(endpoint, data);
      return response.data;
    }
  }

  // Athletes Management
  async listAthletes(filters = {}) {
    const params = new URLSearchParams();
    if (filters.sport) params.append('sport', filters.sport);
    if (filters.name) params.append('name', filters.name);
    if (filters.available) params.append('available', filters.available);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const queryString = params.toString();
    const url = queryString ? `${this.endpoints.athletes}?${queryString}` : this.endpoints.athletes;
    const response = await this.apiClient.get(url);
    return response.data.athletes;
  }

  async searchAthletes(query) {
    const response = await this.apiClient.get(`${this.endpoints.athletes}/search?q=${encodeURIComponent(query)}`);
    return response.data.athletes;
  }

  async getAthlete(id) {
    const response = await this.apiClient.get(`${this.endpoints.athletes}/${id}`);
    return response.data.athlete;
  }

  async createAthlete(data) {
    const response = await this.apiClient.post(this.endpoints.athletes, data);
    return response.data.athlete;
  }

  async updateAthlete(id, data) {
    const response = await this.apiClient.put(`${this.endpoints.athletes}/${id}`, data);
    return response.data.athlete;
  }

  async deleteAthlete(id) {
    const response = await this.apiClient.delete(`${this.endpoints.athletes}/${id}`);
    return response.data;
  }

  // Sponsors Management
  async listSponsors() {
    const response = await this.apiClient.get(this.endpoints.sponsors);
    return response.data.sponsors;
  }

  async getSponsor(id) {
    const response = await this.apiClient.get(`${this.endpoints.sponsors}/${id}`);
    return response.data.sponsor;
  }

  async createSponsor(data) {
    const response = await this.apiClient.post(this.endpoints.sponsors, data);
    return response.data.sponsor;
  }

  async updateSponsor(id, data) {
    const response = await this.apiClient.put(`${this.endpoints.sponsors}/${id}`, data);
    return response.data.sponsor;
  }

  async deleteSponsor(id) {
    const response = await this.apiClient.delete(`${this.endpoints.sponsors}/${id}`);
    return response.data;
  }

  // Fans Management
  async listFans() {
    const response = await this.apiClient.get(this.endpoints.fans);
    return response.data.fans;
  }

  async getFan(id) {
    const response = await this.apiClient.get(`${this.endpoints.fans}/${id}`);
    return response.data.fan;
  }

  async createFan(data) {
    const response = await this.apiClient.post(this.endpoints.fans, data);
    return response.data.fan;
  }

  async updateFan(id, data) {
    const response = await this.apiClient.put(`${this.endpoints.fans}/${id}`, data);
    return response.data.fan;
  }

  async deleteFan(id) {
    const response = await this.apiClient.delete(`${this.endpoints.fans}/${id}`);
    return response.data;
  }

  // Sponsorship Management
  async listSponsorships(filters = {}) {
    const params = new URLSearchParams();
    if (filters.sponsorId) params.append('sponsor_id', filters.sponsorId);
    if (filters.athleteId) params.append('athlete_id', filters.athleteId);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const queryString = params.toString();
    const url = queryString ? `/sponsorships?${queryString}` : '/sponsorships';
    const response = await this.apiClient.get(url);
    return response.data.sponsorships;
  }

  async createSponsorship(data) {
    const response = await this.apiClient.post('/sponsorships', data);
    return response.data.sponsorship;
  }

  async updateSponsorshipStatus(id, status) {
    const response = await this.apiClient.patch(`/sponsorships/${id}/status`, { status });
    return response.data.sponsorship;
  }

  async getSponsorshipDetails(id) {
    const response = await this.apiClient.get(`/sponsorships/${id}`);
    return response.data.sponsorship;
  }

  // Analytics
  async getAthleteAnalytics(athleteId, timeframe = '30d') {
    const response = await this.apiClient.get(`/athletes/${athleteId}/analytics?timeframe=${timeframe}`);
    return response.data.analytics;
  }

  async getSponsorAnalytics(sponsorId, timeframe = '30d') {
    const response = await this.apiClient.get(`/sponsors/${sponsorId}/analytics?timeframe=${timeframe}`);
    return response.data.analytics;
  }

  // Social Media Integration
  async updateSocialLinks(userId, role, links) {
    const endpoint = this.endpoints[`${role}s`];
    if (!endpoint) {
      throw new Error('Invalid role');
    }
    const response = await this.apiClient.put(`${endpoint}/${userId}/social-links`, { links });
    return response.data;
  }

  async getSocialMetrics(userId, role) {
    const endpoint = this.endpoints[`${role}s`];
    if (!endpoint) {
      throw new Error('Invalid role');
    }
    const response = await this.apiClient.get(`${endpoint}/${userId}/social-metrics`);
    return response.data.metrics;
  }

  // Content Management
  async uploadContent(userId, role, content) {
    const formData = new FormData();
    if (content.file) {
      formData.append('file', content.file);
    }
    if (content.metadata) {
      formData.append('metadata', JSON.stringify(content.metadata));
    }

    const endpoint = this.endpoints[`${role}s`];
    if (!endpoint) {
      throw new Error('Invalid role');
    }

    const response = await this.apiClient.post(`${endpoint}/${userId}/content`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.content;
  }

  async listContent(userId, role, filters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const queryString = params.toString();
    const endpoint = this.endpoints[`${role}s`];
    if (!endpoint) {
      throw new Error('Invalid role');
    }

    const url = queryString 
      ? `${endpoint}/${userId}/content?${queryString}` 
      : `${endpoint}/${userId}/content`;
    
    const response = await this.apiClient.get(url);
    return response.data.content;
  }

  // Notifications
  async getNotifications(userId, role) {
    const endpoint = this.endpoints[`${role}s`];
    if (!endpoint) {
      throw new Error('Invalid role');
    }
    const response = await this.apiClient.get(`${endpoint}/${userId}/notifications`);
    return response.data.notifications;
  }

  async markNotificationAsRead(userId, role, notificationId) {
    const endpoint = this.endpoints[`${role}s`];
    if (!endpoint) {
      throw new Error('Invalid role');
    }
    const response = await this.apiClient.put(`${endpoint}/${userId}/notifications/${notificationId}/read`);
    return response.data;
  }

  async updateNotificationPreferences(userId, role, preferences) {
    const endpoint = this.endpoints[`${role}s`];
    if (!endpoint) {
      throw new Error('Invalid role');
    }
    const response = await this.apiClient.put(`${endpoint}/${userId}/notification-preferences`, preferences);
    return response.data;
  }

  // Company API
  async getCompanyData() {
    const response = await this.companyClient.get('/company/data');
    return response.data;
  }

  async updateCompanyData(data) {
    const response = await this.companyClient.put('/company/data', data);
    return response.data;
  }

  // Blockchain Integration (only when feature is enabled)
  async connectWallet() {
    if (!config.features.blockchain) {
      throw new Error('Blockchain integration is not enabled');
    }
    if (!this.blockchainService) {
      throw new Error('Blockchain service not initialized');
    }
    return await this.blockchainService.connectWallet();
  }

  async mintNFT(tokenURI) {
    if (!config.features.blockchain) {
      throw new Error('Blockchain integration is not enabled');
    }
    if (!this.blockchainService) {
      throw new Error('Blockchain service not initialized');
    }
    return await this.blockchainService.mintNFT(tokenURI);
  }

  async createSponsorship(athleteAddress, amount) {
    if (!config.features.blockchain) {
      throw new Error('Blockchain integration is not enabled');
    }
    if (!this.blockchainService) {
      throw new Error('Blockchain service not initialized');
    }
    return await this.blockchainService.createSponsorship(athleteAddress, amount);
  }

  async getTokenURI(tokenId) {
    if (!config.features.blockchain) {
      throw new Error('Blockchain integration is not enabled');
    }
    if (!this.blockchainService) {
      throw new Error('Blockchain service not initialized');
    }
    return await this.blockchainService.getTokenURI(tokenId);
  }

  async getSponsorshipDetails(sponsorshipId) {
    if (!config.features.blockchain) {
      throw new Error('Blockchain integration is not enabled');
    }
    if (!this.blockchainService) {
      throw new Error('Blockchain service not initialized');
    }
    return await this.blockchainService.getSponsorshipDetails(sponsorshipId);
  }

  // Health checks
  async checkHealth() {
    const checks = await Promise.allSettled([
      utils.checkServiceHealth('API', config.apiUrl),
      utils.checkServiceHealth('Auth', config.authServiceUrl),
      utils.checkServiceHealth('Company', config.companyApiUrl)
    ]);

    if (config.features.blockchain) {
      const blockchainHealth = await this.checkBlockchainHealth();
      checks.push(blockchainHealth);
    }

    return checks;
  }

  async checkBlockchainHealth() {
    if (!config.features.blockchain) return null;

    try {
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      return {
        status: 'healthy',
        data: { network, blockNumber }
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;