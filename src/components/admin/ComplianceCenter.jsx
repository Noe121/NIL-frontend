import React, { useState, useEffect } from 'react';

/**
 * Compliance Center Component
 * Manages compliance flagging and audit logging
 */
const ComplianceCenter = ({ schoolId, userRole, schoolType }) => {
  const [flags, setFlags] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flags');

  useEffect(() => {
    loadComplianceData();
  }, [schoolId]);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      
      // Load flagged deals
      const flagsRes = await fetch(
        `${baseUrl}/api/school/${schoolId}/deals?status=flagged`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (flagsRes.ok) {
        const data = await flagsRes.json();
        setFlags(data.deals || []);
      }

      // Load audit logs
      const auditRes = await fetch(
        `${baseUrl}/api/school/${schoolId}/audit-log`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (auditRes.ok) {
        const data = await auditRes.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading compliance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('flags')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'flags'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Flagged Deals ({flags.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* Flagged Deals */}
      {activeTab === 'flags' && (
        <div className="space-y-4">
          {flags.length > 0 ? (
            flags.map((flag) => (
              <div key={flag.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{flag.brand} Deal</h3>
                    <p className="text-sm text-slate-600 mt-1">Athlete: {flag.athlete_name}</p>
                    <p className="text-sm text-slate-600">Amount: ${flag.amount?.toLocaleString() || 0}</p>
                    {flag.flag_reason && (
                      <p className="text-sm text-red-700 mt-2 font-medium">Reason: {flag.flag_reason}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                      Flagged
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-600">
              <p className="text-lg">✅</p>
              <p className="font-medium">No flagged deals</p>
              <p className="text-sm">All deals are in compliance</p>
            </div>
          )}
        </div>
      )}

      {/* Audit Log */}
      {activeTab === 'audit' && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Deal/Athlete</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {auditLogs.length > 0 ? (
                  auditLogs.slice(0, 50).map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">{log.user_id}</td>
                      <td className="px-6 py-3 text-sm">
                        <ActionBadge action={log.action} />
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">{log.deal_id || log.athlete_id || '—'}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{log.details || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-600">
                      No audit logs
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Compliance Info</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• School Type: {schoolType === 'university' ? 'University (NCAA)' : 'High School'}</li>
          <li>• Your Role: {userRole.replace('_', ' ')}</li>
          <li>• Flagged Deals: {flags.length}</li>
          <li>• Total Audit Entries: {auditLogs.length}</li>
          {schoolType === 'high_school' && (
            <li>• Parent Approval: Required for all high school deals</li>
          )}
        </ul>
      </div>
    </div>
  );
};

/**
 * Action Badge
 */
const ActionBadge = ({ action }) => {
  const config = {
    approve: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    flag: { bg: 'bg-red-100', text: 'text-red-700', label: 'Flagged' },
    reject: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Rejected' },
    view: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Viewed' },
    create: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Created' },
  };

  const c = config[action] || { bg: 'bg-gray-100', text: 'text-gray-700', label: action };
  return <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
};

export default ComplianceCenter;
