import React, { useState, useEffect } from 'react';

/**
 * Deal List Component
 * Displays all deals with filtering and status tracking
 */
const DealList = ({ schoolId, userRole }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadDeals();
  }, [schoolId, filterStatus]);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      const statusParam = filterStatus === 'all' ? '' : `?status=${filterStatus}`;
      const response = await fetch(
        `${baseUrl}/api/school/${schoolId}/deals${statusParam}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to load deals');
      const data = await response.json();
      setDeals(data.deals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['pending', 'approved', 'flagged', 'rejected'];
  const filteredDeals = filterStatus === 'all' 
    ? deals 
    : deals.filter(d => d.status === filterStatus);

  const statusCount = {
    pending: deals.filter(d => d.status === 'pending').length,
    approved: deals.filter(d => d.status === 'approved').length,
    flagged: deals.filter(d => d.status === 'flagged').length,
    rejected: deals.filter(d => d.status === 'rejected').length,
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading deals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          All ({deals.length})
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition capitalize ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {status} ({statusCount[status] || 0})
          </button>
        ))}
      </div>

      {/* Deals Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Athlete</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Brand</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Approval</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">{deal.athlete_name}</td>
                    <td className="px-6 py-3 text-sm text-slate-900">{deal.brand}</td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-slate-900">
                      ${deal.amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <StatusBadge status={deal.status} />
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="space-y-1">
                        <div className="text-xs">
                          Admin: {deal.school_approval_by ? '✓' : '○'}
                        </div>
                        {deal.parent_approval_by !== undefined && (
                          <div className="text-xs">
                            Parent: {deal.parent_approval_by ? '✓' : '○'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => setExpandedId(expandedId === deal.id ? null : deal.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-600">
                    No deals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Status Badge
 */
const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    flagged: { bg: 'bg-red-100', text: 'text-red-700', label: 'Flagged' },
    rejected: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Rejected' },
  };

  const c = config[status] || config.pending;
  return <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
};

export default DealList;
