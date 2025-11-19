/**
 * NILBx CRM - Contact Filters
 * Filtering and search component for contacts
 */

import React from 'react';
import { ContactListParams } from '../../types/crm';

interface ContactFiltersProps {
  filters: ContactListParams;
  searchTerm: string;
  onFiltersChange: (filters: Partial<ContactListParams>) => void;
  onSearchChange: (search: string) => void;
}

const ContactFilters: React.FC<ContactFiltersProps> = ({
  filters,
  searchTerm,
  onFiltersChange,
  onSearchChange,
}) => {
  const stakeholderTypes = [
    { value: 'athlete', label: 'Athlete' },
    { value: 'influencer', label: 'Influencer' },
    { value: 'coach', label: 'Coach' },
    { value: 'agent', label: 'Agent' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'other', label: 'Other' },
  ];

  const pipelineStages = [
    'prospect',
    'contacted',
    'qualified',
    'proposal',
    'negotiation',
    'closed_won',
    'closed_lost',
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
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or organization..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Stakeholder Type */}
        <div>
          <label htmlFor="stakeholder_type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="stakeholder_type"
            value={filters.stakeholder_type || ''}
            onChange={(e) => onFiltersChange({
              stakeholder_type: e.target.value as any || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {stakeholderTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pipeline Stage */}
        <div>
          <label htmlFor="pipeline_stage" className="block text-sm font-medium text-gray-700 mb-1">
            Pipeline Stage
          </label>
          <select
            id="pipeline_stage"
            value={filters.pipeline_stage || ''}
            onChange={(e) => onFiltersChange({
              pipeline_stage: e.target.value || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Stages</option>
            {pipelineStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Score Range */}
        <div>
          <label htmlFor="lead_score_min" className="block text-sm font-medium text-gray-700 mb-1">
            Min Lead Score
          </label>
          <input
            type="number"
            id="lead_score_min"
            min="0"
            max="100"
            value={filters.lead_score_min || ''}
            onChange={(e) => onFiltersChange({
              lead_score_min: e.target.value ? parseInt(e.target.value) : undefined
            })}
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
            value={filters.lead_score_max || ''}
            onChange={(e) => onFiltersChange({
              lead_score_max: e.target.value ? parseInt(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
            Organization
          </label>
          <input
            type="text"
            id="organization"
            value={filters.organization || ''}
            onChange={(e) => onFiltersChange({
              organization: e.target.value || undefined
            })}
            placeholder="Filter by organization..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={filters.location || ''}
            onChange={(e) => onFiltersChange({
              location: e.target.value || undefined
            })}
            placeholder="Filter by location..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            onFiltersChange({});
            onSearchChange('');
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ContactFilters;
