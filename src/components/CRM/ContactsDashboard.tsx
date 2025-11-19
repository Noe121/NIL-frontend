/**
 * NILBx CRM - Contacts Dashboard
 * Main contacts management interface with filtering, search, and pagination
 */

import React, { useState } from 'react';
import { useContacts, useDeleteContact, useEnrichContact } from '../../hooks/crm';
import { Contact, ContactListParams } from '../../types/crm';
import ContactCard from './ContactCard';
import ContactFilters from './ContactFilters';
import ContactForm from './ContactForm';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';
import Button from '../Button';

const ContactsDashboard: React.FC = () => {
  // State management
  const [filters, setFilters] = useState<ContactListParams>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // API hooks
  const { data: contactsResponse, isLoading, error } = useContacts({
    ...filters,
    search: searchTerm || undefined,
  });

  const deleteContactMutation = useDeleteContact();
  const enrichContactMutation = useEnrichContact();

  // Extract data from AxiosResponse
  const contacts = contactsResponse?.data || [];
  const totalContacts = contacts.length;

  // Filter handlers
  const handleFiltersChange = (newFilters: Partial<ContactListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  // Action handlers
  const handleCreateContact = () => {
    setShowCreateModal(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleDeleteContact = async (contactId: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContactMutation.mutateAsync(contactId);
      } catch (error) {
        console.error('Failed to delete contact:', error);
        alert('Failed to delete contact. Please try again.');
      }
    }
  };

  const handleEnrichContact = async (contactId: number) => {
    try {
      await enrichContactMutation.mutateAsync(contactId);
      alert('Contact enrichment started. This may take a few moments.');
    } catch (error) {
      console.error('Failed to enrich contact:', error);
      alert('Failed to enrich contact. Please try again.');
    }
  };

  const handleFormSuccess = () => {
    setShowCreateModal(false);
    setEditingContact(null);
  };

  const handleFormCancel = () => {
    setShowCreateModal(false);
    setEditingContact(null);
  };

  // Loading state
  if (isLoading && !contacts.length) {
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
              Error loading contacts
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
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">
            Manage your contacts and leads ({totalContacts} total)
          </p>
        </div>
        <Button
          onClick={handleCreateContact}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <ContactFilters
        filters={filters}
        searchTerm={searchTerm}
        onFiltersChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
      />

      {/* Contacts Grid */}
      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.keys(filters).length > 0
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding your first contact.'}
          </p>
          {!searchTerm && Object.keys(filters).length === 0 && (
            <div className="mt-6">
              <Button
                onClick={handleCreateContact}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Your First Contact
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={() => handleEditContact(contact)}
              onDelete={() => handleDeleteContact(contact.id)}
              onEnrich={() => handleEnrichContact(contact.id)}
              isEnriching={enrichContactMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!editingContact}
        onClose={handleFormCancel}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
      >
        <ContactForm
          contact={editingContact}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  );
};

export default ContactsDashboard;
