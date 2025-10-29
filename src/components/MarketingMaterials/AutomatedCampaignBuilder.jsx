/**
 * Automated Campaign Builder Component
 * Create automation triggers for sending marketing materials
 */
import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { marketingMaterialsService } from '../../services/marketingMaterialsService';

const AutomatedCampaignBuilder = ({ companyId, templates, campaigns, onCampaignCreated }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    campaign_name: '',
    template_id: '',
    trigger_type: 'deal_signed',
    trigger_config: {}
  });

  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    try {
      await marketingMaterialsService.createCampaign({
        company_id: companyId,
        ...formData,
        is_active: true
      });
      alert('Automated campaign created successfully!');
      setShowCreateForm(false);
      setFormData({
        campaign_name: '',
        template_id: '',
        trigger_type: 'deal_signed',
        trigger_config: {}
      });
      onCampaignCreated();
    } catch (error) {
      alert('Failed to create campaign: ' + error.message);
    }
  };

  const handleToggleCampaign = async (campaignId) => {
    try {
      await marketingMaterialsService.toggleCampaign(campaignId);
      onCampaignCreated();
    } catch (error) {
      alert('Failed to toggle campaign: ' + error.message);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await marketingMaterialsService.deleteCampaign(campaignId);
      onCampaignCreated();
    } catch (error) {
      alert('Failed to delete campaign: ' + error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automated Campaigns</h2>
          <p className="text-gray-600 mt-1">
            Automatically send materials when events occur
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
          size="lg"
        >
          + Create Automation
        </Button>
      </div>

      {/* Existing Campaigns */}
      <div className="space-y-4 mb-6">
        {campaigns.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No automated campaigns yet</p>
          </Card>
        ) : (
          campaigns.map(campaign => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{campaign.campaign_name}</h3>
                    {campaign.is_active ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Trigger: <span className="font-medium capitalize">{campaign.trigger_type.replace('_', ' ')}</span>
                  </p>
                  <div className="flex space-x-6 text-sm">
                    <div>
                      <span className="text-gray-500">Materials Sent:</span>
                      <span className="ml-2 font-medium">{campaign.total_sent}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Cost:</span>
                      <span className="ml-2 font-medium">${parseFloat(campaign.total_cost).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleToggleCampaign(campaign.id)}
                    variant="outline"
                    size="sm"
                  >
                    {campaign.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-lg w-full mx-4 p-6">
            <h3 className="text-xl font-bold mb-4">Create Automated Campaign</h3>

            <form onSubmit={handleCreateCampaign}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.campaign_name}
                    onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Welcome Kit Automation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    required
                    value={formData.template_id}
                    onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a template</option>
                    {templates.filter(t => t.is_active).map(template => (
                      <option key={template.id} value={template.id}>
                        {template.template_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger Event
                  </label>
                  <select
                    required
                    value={formData.trigger_type}
                    onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="deal_signed">When Athlete Signs Deal</option>
                    <option value="monthly_checkin">Monthly Check-in Milestone</option>
                    <option value="milestone_reached">Performance Milestone Reached</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Create Campaign
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AutomatedCampaignBuilder;
