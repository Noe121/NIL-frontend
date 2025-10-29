/**
 * Marketing Materials Service
 * API client for marketing materials endpoints
 */

const API_BASE_URL = import.meta.env.VITE_MARKETING_MATERIALS_API_URL || 'http://localhost:8004';

class MarketingMaterialsService {
  async getTemplates(companyId) {
    const response = await fetch(`${API_BASE_URL}/templates/company/${companyId}`);
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  }

  async uploadTemplate(companyId, formData) {
    const response = await fetch(`${API_BASE_URL}/templates/create`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload template');
    return response.json();
  }

  async deleteTemplate(templateId) {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete template');
    return response.json();
  }

  async deactivateTemplate(templateId) {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}/deactivate`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to deactivate template');
    return response.json();
  }

  async getOrders(companyId) {
    const response = await fetch(`${API_BASE_URL}/orders/company/${companyId}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }

  async createOrder(orderData) {
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  }

  async getPricingEstimate(estimateData) {
    const response = await fetch(`${API_BASE_URL}/orders/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(estimateData)
    });
    if (!response.ok) throw new Error('Failed to get pricing estimate');
    return response.json();
  }

  async getCampaigns(companyId) {
    const response = await fetch(`${API_BASE_URL}/campaigns/company/${companyId}`);
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return response.json();
  }

  async createCampaign(campaignData) {
    const response = await fetch(`${API_BASE_URL}/campaigns/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campaignData)
    });
    if (!response.ok) throw new Error('Failed to create campaign');
    return response.json();
  }

  async toggleCampaign(campaignId) {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/toggle`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to toggle campaign');
    return response.json();
  }

  async deleteCampaign(campaignId) {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete campaign');
    return response.json();
  }
}

export const marketingMaterialsService = new MarketingMaterialsService();
