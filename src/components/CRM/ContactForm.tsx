/**
 * NILBx CRM - Contact Form
 * Form for creating and editing contacts
 */

import React, { useState, useEffect } from 'react';
import { Contact, ContactCreate } from '../../types/crm';

interface ContactFormProps {
  contact?: Contact | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ContactCreate>({
    first_name: '',
    last_name: '',
    email: '',
    stakeholder_type: 'other',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stakeholderTypes = [
    { value: 'athlete', label: 'Athlete' },
    { value: 'influencer', label: 'Influencer' },
    { value: 'coach', label: 'Coach' },
    { value: 'agent', label: 'Agent' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'other', label: 'Other' },
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (contact) {
      setFormData({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        stakeholder_type: contact.stakeholder_type,
        organization: contact.organization,
        title: contact.title,
        location: contact.location,
        linkedin_url: contact.linkedin_url,
        twitter_handle: contact.twitter_handle,
        instagram_handle: contact.instagram_handle,
        website: contact.website,
        bio: contact.bio,
        interests: contact.interests,
        tags: contact.tags,
        custom_fields: contact.custom_fields,
      });
    }
  }, [contact]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would call the API
      // For now, just simulate success
      console.log('Submitting contact:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      onSuccess();
    } catch (error) {
      console.error('Failed to save contact:', error);
      setErrors({ submit: 'Failed to save contact. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            value={formData.first_name || ''}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.first_name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="last_name"
            value={formData.last_name || ''}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.last_name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="stakeholder_type" className="block text-sm font-medium text-gray-700 mb-1">
            Stakeholder Type *
          </label>
          <select
            id="stakeholder_type"
            value={formData.stakeholder_type}
            onChange={(e) => handleInputChange('stakeholder_type', e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {stakeholderTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
            Organization
          </label>
          <input
            type="text"
            id="organization"
            value={formData.organization || ''}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin_url"
            value={formData.linkedin_url || ''}
            onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="twitter_handle" className="block text-sm font-medium text-gray-700 mb-1">
            Twitter Handle
          </label>
          <input
            type="text"
            id="twitter_handle"
            value={formData.twitter_handle || ''}
            onChange={(e) => handleInputChange('twitter_handle', e.target.value)}
            placeholder="@username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="instagram_handle" className="block text-sm font-medium text-gray-700 mb-1">
            Instagram Handle
          </label>
          <input
            type="text"
            id="instagram_handle"
            value={formData.instagram_handle || ''}
            onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
            placeholder="@username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Website and Bio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            id="website"
            value={formData.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-1">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            value={formData.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : (contact ? 'Update Contact' : 'Create Contact')}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
