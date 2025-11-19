/**
 * NILBx CRM - Campaign Filters
 * Filtering component for campaigns
 */

import React from 'react';
import { CampaignListParams } from '../../types/crm';

interface CampaignFiltersProps {
  filters: CampaignListParams;
  onFiltersChange: (filters: Partial<CampaignListParams>) => void;
}

const CampaignFilters: React.FC<CampaignFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const campaignTypes = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'social', label: 'Social Media' },
    { value: 'direct_mail', label: 'Direct Mail' },
  ];

  const campaignStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'sending', label: 'Sending' },
    { value: 'sent', label: 'Sent' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({
              search: e.target.value || undefined
            })}
            placeholder="Search campaigns by name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={filters.type || ''}
            onChange={(e) => onFiltersChange({
              type: e.target.value as any || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {campaignTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({
              status: e.target.value as any || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {campaignStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Scheduled After */}
        <div>
          <label htmlFor="scheduled_after" className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled After
          </label>
          <input
            type="date"
            id="scheduled_after"
            value={filters.scheduled_after || ''}
            onChange={(e) => onFiltersChange({
              scheduled_after: e.target.value || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Scheduled Before */}
        <div>
          <label htmlFor="scheduled_before" className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Before
          </label>
          <input
            type="date"
            id="scheduled_before"
            value={filters.scheduled_before || ''}
            onChange={(e) => onFiltersChange({
              scheduled_before: e.target.value || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sent After */}
        <div>
          <label htmlFor="sent_after" className="block text-sm font-medium text-gray-700 mb-1">
            Sent After
          </label>
          <input
            type="date"
            id="sent_after"
            value={filters.sent_after || ''}
            onChange={(e) => onFiltersChange({
              sent_after: e.target.value || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sent Before */}
        <div>
          <label htmlFor="sent_before" className="block text-sm font-medium text-gray-700 mb-1">
            Sent Before
          </label>
          <input
            type="date"
            id="sent_before"
            value={filters.sent_before || ''}
            onChange={(e) => onFiltersChange({
              sent_before: e.target.value || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onFiltersChange({})}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default CampaignFilters;
