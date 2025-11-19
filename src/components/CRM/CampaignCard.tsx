/**
 * NILBx CRM - Campaign Card
 * Individual campaign display component with actions and metrics
 */

import React from 'react';
import { Campaign } from '../../types/crm';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: number) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {campaign.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {campaign.subject}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
          {campaign.status}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {campaign.analytics?.sent_count || 0}
          </div>
          <div className="text-xs text-gray-500">Sent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {campaign.analytics?.opened_count || 0}
          </div>
          <div className="text-xs text-gray-500">Opens</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {campaign.analytics?.clicked_count || 0}
          </div>
          <div className="text-xs text-gray-500">Clicks</div>
        </div>
      </div>

      {/* Dates */}
      <div className="text-sm text-gray-500 mb-4">
        {campaign.scheduled_at && (
          <div>Scheduled: {formatDate(campaign.scheduled_at)}</div>
        )}
        {campaign.sent_at && (
          <div>Sent: {formatDate(campaign.sent_at)}</div>
        )}
        <div>Created: {formatDate(campaign.created_at)}</div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(campaign)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          {campaign.status === 'draft' && (
            <button
              onClick={() => {/* TODO: Implement send campaign */}}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Send
            </button>
          )}
        </div>
        <button
          onClick={() => onDelete(campaign.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;
