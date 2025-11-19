/**
 * NILBx CRM - Campaigns Dashboard
 * Main campaigns management interface with filtering and analytics
 */

import React, { useState } from 'react';
import { useCampaigns, useDeleteCampaign } from '../../hooks/crm';
import { Campaign, CampaignListParams } from '../../types/crm';
import CampaignCard from './CampaignCard';
import CampaignFilters from './CampaignFilters';
import CampaignForm from './CampaignForm';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';
import Button from '../Button';

const CampaignsDashboard: React.FC = () => {
  // State management
  const [filters, setFilters] = useState<CampaignListParams>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // API hooks
  const { data: campaignsResponse, isLoading, error } = useCampaigns(filters);
  const deleteCampaignMutation = useDeleteCampaign();

  // Extract data from AxiosResponse
  const campaigns = campaignsResponse?.data || [];
  const totalCampaigns = campaigns.length;

  // Filter handlers
  const handleFiltersChange = (newFilters: Partial<CampaignListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Action handlers
  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleDeleteCampaign = async (campaignId: number) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaignMutation.mutateAsync(campaignId);
      } catch (error) {
        console.error('Failed to delete campaign:', error);
        alert('Failed to delete campaign. Please try again.');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowCreateModal(false);
    setEditingCampaign(null);
  };

  const handleFormCancel = () => {
    setShowCreateModal(false);
    setEditingCampaign(null);
  };

  // Loading state
  if (isLoading && !campaigns.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading campaigns
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">
            Manage your email campaigns and marketing efforts ({totalCampaigns} total)
          </p>
        </div>
        <Button
          onClick={handleCreateCampaign}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <CampaignFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {Object.keys(filters).length > 0
              ? 'Try adjusting your filters.'
              : 'Get started by creating your first campaign.'}
          </p>
          {!Object.keys(filters).length && (
            <div className="mt-6">
              <Button
                onClick={handleCreateCampaign}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create Your First Campaign
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={() => handleEditCampaign(campaign)}
              onDelete={() => handleDeleteCampaign(campaign.id)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!editingCampaign}
        onClose={handleFormCancel}
        title={editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
        size="large"
      >
        <CampaignForm
          campaign={editingCampaign}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  );
};

export default CampaignsDashboard;
