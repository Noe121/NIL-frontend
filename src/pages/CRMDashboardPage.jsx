import React from 'react';
import ContactsDashboard from '../components/CRM/ContactsDashboard';

/**
 * NILBx CRM Dashboard Page
 * Main entry point for CRM functionality
 */
export default function CRMDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your contacts, campaigns, and customer relationships
          </p>
        </div>

        <ContactsDashboard />
      </div>
    </div>
  );
}
