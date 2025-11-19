/**
 * NILBx CRM - Contact Card
 * Individual contact display component with actions
 */

import React from 'react';
import { Contact } from '../../types/crm';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: number) => void;
  onEnrich: (contactId: number) => void;
  isEnriching?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
  onEnrich,
  isEnriching = false,
}) => {
  const getStakeholderTypeColor = (type: Contact['stakeholder_type']) => {
    switch (type) {
      case 'athlete':
        return 'bg-blue-100 text-blue-800';
      case 'influencer':
        return 'bg-purple-100 text-purple-800';
      case 'coach':
        return 'bg-green-100 text-green-800';
      case 'agent':
        return 'bg-orange-100 text-orange-800';
      case 'recruiter':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {contact.first_name} {contact.last_name}
          </h3>
          <p className="text-gray-600">{contact.title}</p>
          {contact.organization && (
            <p className="text-sm text-gray-500">{contact.organization}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStakeholderTypeColor(contact.stakeholder_type)}`}>
            {contact.stakeholder_type}
          </span>
          {contact.lead_score && (
            <span className={`text-sm font-medium ${getLeadScoreColor(contact.lead_score)}`}>
              {contact.lead_score}
            </span>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {contact.email && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {contact.email}
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {contact.phone}
          </div>
        )}
        {contact.location && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {contact.location}
          </div>
        )}
      </div>

      {/* Pipeline Stage */}
      {contact.pipeline_stage && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Pipeline Stage</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {contact.pipeline_stage}
            </span>
          </div>
        </div>
      )}

      {/* Enrichment Data */}
      {contact.enrichment_data && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700">Enriched Data Available</span>
            <span className="text-xs text-blue-600">
              {formatDate(contact.enrichment_data.enriched_at)}
            </span>
          </div>
        </div>
      )}

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {contact.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{contact.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Updated {formatDate(contact.updated_at)}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEnrich(contact.id)}
            disabled={isEnriching}
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEnriching ? 'Enriching...' : 'Enrich'}
          </button>
          <button
            onClick={() => onEdit(contact)}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(contact.id)}
            className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
