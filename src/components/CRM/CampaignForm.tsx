/**
 * NILBx CRM - Campaign Form
 * Form for creating and editing campaigns
 */

import React, { useState, useEffect } from 'react';
import { Campaign, CampaignCreate } from '../../types/crm';
import { useCreateCampaign, useUpdateCampaign } from '../../hooks/crm';

interface CampaignFormProps {
  campaign?: Campaign | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  campaign,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CampaignCreate>({
    name: '',
    description: '',
    type: 'email',
    subject: '',
    content: '',
    target_audience: {},
    scheduled_at: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createCampaignMutation = useCreateCampaign();
  const updateCampaignMutation = useUpdateCampaign();

  const campaignTypes = [
    { value: 'email', label: 'Email Campaign' },
    { value: 'sms', label: 'SMS Campaign' },
    { value: 'social', label: 'Social Media Campaign' },
    { value: 'direct_mail', label: 'Direct Mail Campaign' },
  ];

  const stakeholderTypes = [
    { value: 'athlete', label: 'Athletes' },
    { value: 'influencer', label: 'Influencers' },
    { value: 'coach', label: 'Coaches' },
    { value: 'agent', label: 'Agents' },
    { value: 'recruiter', label: 'Recruiters' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description || '',
        type: campaign.type,
        subject: campaign.subject || '',
        content: campaign.content || '',
        target_audience: campaign.target_audience,
        scheduled_at: campaign.scheduled_at || '',
      });
    }
  }, [campaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      if (campaign) {
        await updateCampaignMutation.mutateAsync({
          id: campaign.id,
          data: formData,
        });
      } else {
        await createCampaignMutation.mutateAsync(formData);
      }
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.detail) {
        // Handle validation errors
        const validationErrors: Record<string, string> = {};
        if (Array.isArray(error.response.data.detail)) {
          error.response.data.detail.forEach((err: any) => {
            if (err.loc && err.loc.length > 1) {
              validationErrors[err.loc[1]] = err.msg;
            }
          });
        }
        setErrors(validationErrors);
      } else {
        setErrors({ general: 'Failed to save campaign. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTargetAudienceChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      target_audience: {
        ...prev.target_audience,
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {campaignTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief description of the campaign..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Email-specific fields */}
      {formData.type === 'email' && (
        <>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject *
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Email Content *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email content in HTML or plain text..."
              required
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>
        </>
      )}

      {/* Target Audience */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Target Audience</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stakeholder Types
            </label>
            <div className="space-y-2">
              {stakeholderTypes.map((type) => (
                <label key={type.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.target_audience.stakeholder_types?.includes(type.value as any) || false}
                    onChange={(e) => {
                      const current = formData.target_audience.stakeholder_types || [];
                      if (e.target.checked) {
                        handleTargetAudienceChange('stakeholder_types', [...current, type.value]);
                      } else {
                        handleTargetAudienceChange('stakeholder_types', current.filter(t => t !== type.value));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="lead_score_min" className="block text-sm font-medium text-gray-700 mb-1">
                Min Lead Score
              </label>
              <input
                type="number"
                id="lead_score_min"
                min="0"
                max="100"
                value={formData.target_audience.lead_score_min || ''}
                onChange={(e) => handleTargetAudienceChange('lead_score_min', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lead_score_max" className="block text-sm font-medium text-gray-700 mb-1">
                Max Lead Score
              </label>
              <input
                type="number"
                id="lead_score_max"
                min="0"
                max="100"
                value={formData.target_audience.lead_score_max || ''}
                onChange={(e) => handleTargetAudienceChange('lead_score_max', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduling</h3>

        <div>
          <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
            Schedule Send Time
          </label>
          <input
            type="datetime-local"
            id="scheduled_at"
            value={formData.scheduled_at}
            onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to send immediately after creation
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (campaign ? 'Update Campaign' : 'Create Campaign')}
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;
