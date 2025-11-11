import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const PrivacySettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [consentSettings, setConsentSettings] = useState({
    marketing: false,
    analytics: false,
    data_processing: true, // Required for service
    third_party_sharing: false
  });

  useEffect(() => {
    // Load current consent settings
    loadConsentSettings();
  }, []);

  const loadConsentSettings = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // For now, we'll use default values
      setConsentSettings({
        marketing: false,
        analytics: true,
        data_processing: true,
        third_party_sharing: false
      });
    } catch (error) {
      console.error('Error loading consent settings:', error);
    }
  };

  const updateConsent = async (consentType, value) => {
    try {
      setLoading(true);
      const response = await api.put('/privacy/consent', {
        consent_type: consentType,
        consent_value: value
      });

      setConsentSettings(prev => ({
        ...prev,
        [consentType]: value
      }));

      setMessage('Consent settings updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating consent:', error);
      setMessage('Error updating consent settings');
    } finally {
      setLoading(false);
    }
  };

  const requestDataAccess = async () => {
    try {
      setLoading(true);
      const response = await api.get('/privacy/data-request');
      setMessage('Data access request submitted. You will receive an email with download instructions within 30 days.');
    } catch (error) {
      console.error('Error requesting data access:', error);
      setMessage('Error submitting data access request');
    } finally {
      setLoading(false);
    }
  };

  const requestDataDeletion = async () => {
    const reason = prompt('Please provide a reason for your data deletion request:');
    if (!reason) return;

    try {
      setLoading(true);
      const response = await api.delete('/privacy/data-erasure', {
        reason: reason
      });
      setMessage('Data deletion request submitted. You will receive confirmation within 30 days.');
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      setMessage('Error submitting data deletion request');
    } finally {
      setLoading(false);
    }
  };

  const requestDataPortability = async () => {
    try {
      setLoading(true);
      const response = await api.get('/privacy/data-portability');
      setMessage('Data portability request submitted. You will receive download instructions via email.');
    } catch (error) {
      console.error('Error requesting data portability:', error);
      setMessage('Error submitting data portability request');
    } finally {
      setLoading(false);
    }
  };

  const ccpaDataRequest = async () => {
    try {
      setLoading(true);
      const response = await api.get('/privacy/ccpa/data-request');
      setMessage('CCPA data request submitted. You will receive information within 45 days.');
    } catch (error) {
      console.error('Error submitting CCPA data request:', error);
      setMessage('Error submitting CCPA data request');
    } finally {
      setLoading(false);
    }
  };

  const ccpaDeleteRequest = async () => {
    const reason = prompt('Please provide a reason for your CCPA deletion request:');
    if (!reason) return;

    try {
      setLoading(true);
      const response = await api.delete('/privacy/ccpa/delete', {
        reason: reason
      });
      setMessage('CCPA deletion request submitted. Processing may take up to 45 days.');
    } catch (error) {
      console.error('Error submitting CCPA deletion request:', error);
      setMessage('Error submitting CCPA deletion request');
    } finally {
      setLoading(false);
    }
  };

  const ccpaOptOut = async (optOutType) => {
    try {
      setLoading(true);
      const response = await api.post('/privacy/ccpa/opt-out', {
        opt_out_type: optOutType
      });
      setMessage(`Successfully opted out of ${optOutType}`);
    } catch (error) {
      console.error('Error submitting CCPA opt-out:', error);
      setMessage('Error submitting CCPA opt-out request');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'consent', label: 'Consent Settings', icon: '✅' },
    { id: 'gdpr', label: 'GDPR Rights', icon: '🇪🇺' },
    { id: 'ccpa', label: 'CCPA Rights', icon: '🇺🇸' },
    { id: 'data', label: 'Data Management', icon: '💾' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Settings</h1>
          <p className="text-gray-600">Manage your privacy preferences and exercise your data rights</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Privacy Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Your Privacy Rights</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Access your personal data</li>
                    <li>• Request data deletion</li>
                    <li>• Data portability</li>
                    <li>• Withdraw consent</li>
                    <li>• Object to processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Data We Collect</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Profile information</li>
                    <li>• Social media data</li>
                    <li>• Usage analytics</li>
                    <li>• Payment information</li>
                    <li>• Location data (optional)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'consent' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Consent Management</h2>
              <p className="text-gray-600 mb-6">
                Control how we use your data. Some settings are required for platform functionality.
              </p>

              <div className="space-y-4">
                {Object.entries(consentSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium capitalize">{key.replace('_', ' ')}</h3>
                      <p className="text-sm text-gray-600">
                        {key === 'data_processing' && 'Required for platform functionality'}
                        {key === 'marketing' && 'Receive promotional emails and offers'}
                        {key === 'analytics' && 'Help improve our services'}
                        {key === 'third_party_sharing' && 'Share data with business partners'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        disabled={key === 'data_processing'} // Can't disable required processing
                        onChange={(e) => updateConsent(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gdpr' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">GDPR Data Subject Rights</h2>
              <p className="text-gray-600 mb-6">
                As a user in the European Union, you have specific rights under GDPR.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={requestDataAccess}
                  disabled={loading}
                  className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 transition-colors text-left"
                >
                  <h3 className="font-medium text-blue-900">Right of Access</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Request a copy of your personal data
                  </p>
                </button>

                <button
                  onClick={requestDataDeletion}
                  disabled={loading}
                  className="p-4 border-2 border-red-200 rounded-lg hover:border-red-300 transition-colors text-left"
                >
                  <h3 className="font-medium text-red-900">Right to Erasure</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Request deletion of your data
                  </p>
                </button>

                <button
                  onClick={requestDataPortability}
                  disabled={loading}
                  className="p-4 border-2 border-green-200 rounded-lg hover:border-green-300 transition-colors text-left"
                >
                  <h3 className="font-medium text-green-900">Data Portability</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Export your data in machine-readable format
                  </p>
                </button>

                <button
                  onClick={() => updateConsent('marketing', false)}
                  disabled={loading}
                  className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 transition-colors text-left"
                >
                  <h3 className="font-medium text-purple-900">Withdraw Consent</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Opt-out of non-essential processing
                  </p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ccpa' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">CCPA Privacy Rights</h2>
              <p className="text-gray-600 mb-6">
                As a California resident, you have rights under the CCPA.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={ccpaDataRequest}
                  disabled={loading}
                  className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 transition-colors text-left"
                >
                  <h3 className="font-medium text-blue-900">Right to Know</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Information about data collection and use
                  </p>
                </button>

                <button
                  onClick={ccpaDeleteRequest}
                  disabled={loading}
                  className="p-4 border-2 border-red-200 rounded-lg hover:border-red-300 transition-colors text-left"
                >
                  <h3 className="font-medium text-red-900">Right to Delete</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Request deletion of personal information
                  </p>
                </button>

                <button
                  onClick={() => ccpaOptOut('sale')}
                  disabled={loading}
                  className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-300 transition-colors text-left"
                >
                  <h3 className="font-medium text-orange-900">Opt-Out of Sale</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Stop sale of personal information
                  </p>
                </button>

                <button
                  onClick={() => ccpaOptOut('share')}
                  disabled={loading}
                  className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 transition-colors text-left"
                >
                  <h3 className="font-medium text-purple-900">Opt-Out of Sharing</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Stop sharing for cross-context behavioral advertising
                  </p>
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> NILBx does not sell personal information to third parties for monetary compensation.
                  The opt-out options above ensure we honor your preferences for any future sharing arrangements.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Data Management</h2>
              <p className="text-gray-600 mb-6">
                View and manage your data stored on our platform.
              </p>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Data Retention</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Account data: Retained while account is active</li>
                    <li>• Transaction data: 7 years for tax compliance</li>
                    <li>• Analytics data: 2 years for service improvement</li>
                    <li>• Deleted data: 30 days soft-delete period</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Data Locations</h3>
                  <p className="text-sm text-gray-600">
                    Your data is primarily stored in AWS data centers in the US East region.
                    Some analytics data may be processed in the EU for compliance purposes.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Data Security</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• End-to-end encryption in transit and at rest</li>
                    <li>• Multi-factor authentication required</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Access controls and employee training</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsPage;