import React, { useState } from 'react';

/**
 * Admin Settings Component
 * School admin configuration and preferences
 */
const AdminSettings = ({ schoolId }) => {
  const [settings, setSettings] = useState({
    approvalRequired: true,
    emailNotifications: true,
    autoApprovalThreshold: 10000,
    requiresParentApproval: true,
    defaultApprovalDeadline: 7,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      const response = await fetch(
        `${baseUrl}/api/school/${schoolId}/settings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(settings),
        }
      );
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 font-medium">✓ Settings saved successfully</p>
        </div>
      )}

      {/* Approval Settings */}
      <div className="border border-slate-200 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Approval Workflow</h3>

          {/* Approval Required */}
          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div>
              <p className="font-medium text-slate-900">Require Approval for All Deals</p>
              <p className="text-sm text-slate-600">All NIL deals must go through approval</p>
            </div>
            <input
              type="checkbox"
              checked={settings.approvalRequired}
              onChange={(e) => handleChange('approvalRequired', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* Auto Approval Threshold */}
          <div className="py-3 border-b border-slate-200">
            <label className="font-medium text-slate-900 block mb-2">
              Auto-Approval Threshold (USD)
            </label>
            <p className="text-sm text-slate-600 mb-2">Deals below this amount auto-approve</p>
            <input
              type="number"
              value={settings.autoApprovalThreshold}
              onChange={(e) => handleChange('autoApprovalThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Parent Approval */}
          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div>
              <p className="font-medium text-slate-900">Require Parent Approval (HS)</p>
              <p className="text-sm text-slate-600">High school deals need parent/guardian approval</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requiresParentApproval}
              onChange={(e) => handleChange('requiresParentApproval', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* Approval Deadline */}
          <div className="py-3">
            <label className="font-medium text-slate-900 block mb-2">
              Approval Deadline (Days)
            </label>
            <p className="text-sm text-slate-600 mb-2">Days before deal auto-rejects if not approved</p>
            <input
              type="number"
              value={settings.defaultApprovalDeadline}
              onChange={(e) => handleChange('defaultApprovalDeadline', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="border border-slate-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Email Notifications</p>
            <p className="text-sm text-slate-600">Get email alerts for approvals, flags, and updates</p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleChange('emailNotifications', e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resources</h3>
        <div className="space-y-2">
          <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
            📘 NCAA Compliance Guide
          </a>
          <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
            📋 State NIL Laws
          </a>
          <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
            ⚖️ Legal Templates
          </a>
          <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
            📞 Support Contact
          </a>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          💾 Save Settings
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">About These Settings</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Changes apply immediately to new deals</li>
          <li>• Existing approvals not affected</li>
          <li>• School admins can override settings per deal</li>
          <li>• All changes logged for audit</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSettings;
