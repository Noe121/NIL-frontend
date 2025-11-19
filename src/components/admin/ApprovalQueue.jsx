import React, { useState, useEffect } from 'react';

/**
 * Approval Queue Component
 * Displays pending deals requiring approval
 * School-type aware: University (1-step), High School (2-step with parent approval)
 */
const ApprovalQueue = ({ schoolId, userRole, schoolType, onRefresh }) => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadApprovals();
  }, [schoolId]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      const response = await fetch(
        `${baseUrl}/api/school/${schoolId}/deals?status=pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to load approvals');
      const data = await response.json();
      setApprovals(data.deals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (dealId, requiresParentApproval = false) => {
    setActionLoading(dealId);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      const response = await fetch(
        `${baseUrl}/api/deals/${dealId}/${requiresParentApproval ? 'parent-approve' : 'approve'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            reason: `Approved by ${userRole}`,
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to approve deal');
      
      // Reload and notify parent
      await loadApprovals();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFlag = async (dealId, reason) => {
    setActionLoading(`flag-${dealId}`);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      const response = await fetch(
        `${baseUrl}/api/deals/${dealId}/flag`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ reason }),
        }
      );
      if (!response.ok) throw new Error('Failed to flag deal');
      
      await loadApprovals();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading approval queue...</div>;
  }

  if (approvals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl">✅</p>
        <p className="text-slate-600 font-medium">No pending approvals</p>
        <p className="text-sm text-slate-500">All deals are processed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Pending Approvals ({approvals.length})
        </h2>
        <button
          onClick={loadApprovals}
          className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium transition"
        >
          🔄 Refresh
        </button>
      </div>

      {schoolType === 'high_school' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>ℹ️ High School Approvals:</strong> Deals require both admin approval and parent/guardian approval
          </p>
        </div>
      )}

      {approvals.map((deal) => (
        <ApprovalCard
          key={deal.id}
          deal={deal}
          schoolType={schoolType}
          isExpanded={expandedId === deal.id}
          onToggle={() => setExpandedId(expandedId === deal.id ? null : deal.id)}
          onApprove={handleApprove}
          onFlag={handleFlag}
          isLoading={actionLoading}
        />
      ))}
    </div>
  );
};

/**
 * Individual Approval Card
 */
const ApprovalCard = ({ deal, schoolType, isExpanded, onToggle, onApprove, onFlag, isLoading }) => {
  const needsParentApproval = schoolType === 'high_school' && deal.parent_approval_by === null;
  const isFullyApproved = deal.school_approval_by && (!needsParentApproval || deal.parent_approval_by);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition">
      {/* Header */}
      <div
        onClick={onToggle}
        className="bg-slate-50 p-4 cursor-pointer hover:bg-slate-100 transition flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700">
            {deal.athlete_name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{deal.title || `${deal.brand} Deal`}</h3>
            <p className="text-sm text-slate-600">
              Athlete: {deal.athlete_name} • Amount: ${deal.amount?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Status Badge */}
          <div className="text-right">
            {schoolType === 'high_school' ? (
              <div className="space-y-1">
                <div className={`text-xs px-2 py-1 rounded ${deal.school_approval_by ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Admin: {deal.school_approval_by ? '✓' : 'Pending'}
                </div>
                <div className={`text-xs px-2 py-1 rounded ${deal.parent_approval_by ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Parent: {deal.parent_approval_by ? '✓' : 'Pending'}
                </div>
              </div>
            ) : (
              <div className={`text-xs px-2 py-1 rounded ${deal.school_approval_by ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {deal.school_approval_by ? 'Approved ✓' : 'Pending'}
              </div>
            )}
          </div>

          <span className={`transform transition ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="bg-white border-t border-slate-200 p-6 space-y-6">
          {/* Deal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">Athlete</label>
              <p className="text-slate-900 font-medium">{deal.athlete_name}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">Brand</label>
              <p className="text-slate-900 font-medium">{deal.brand}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">Amount</label>
              <p className="text-slate-900 font-medium text-lg">${deal.amount?.toLocaleString() || 0}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">Sport</label>
              <p className="text-slate-900 font-medium">{deal.sport || 'N/A'}</p>
            </div>
          </div>

          {/* Approval Steps */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-3">Approval Status</h4>
            
            {schoolType === 'high_school' ? (
              <div className="space-y-3">
                {/* Step 1: Admin Approval */}
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${deal.school_approval_by ? 'bg-green-600' : 'bg-slate-300'}`}>
                    {deal.school_approval_by ? '✓' : '1'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Admin Approval</p>
                    <p className="text-sm text-slate-600">School administrator reviews the deal</p>
                  </div>
                </div>

                {/* Step 2: Parent Approval */}
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${deal.parent_approval_by ? 'bg-green-600' : 'bg-slate-300'}`}>
                    {deal.parent_approval_by ? '✓' : '2'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Parent/Guardian Approval</p>
                    <p className="text-sm text-slate-600">Parent/guardian must approve the deal</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${deal.school_approval_by ? 'bg-green-600' : 'bg-slate-300'}`}>
                  {deal.school_approval_by ? '✓' : '1'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">School Admin Approval</p>
                  <p className="text-sm text-slate-600">NCAA compliance review complete</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            {!deal.school_approval_by && (
              <button
                onClick={() => onApprove(deal.id, false)}
                disabled={isLoading === deal.id}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading === deal.id ? '⏳ Processing...' : '✓ Approve Deal'}
              </button>
            )}

            {deal.school_approval_by && schoolType === 'high_school' && !deal.parent_approval_by && (
              <button
                onClick={() => onApprove(deal.id, true)}
                disabled={isLoading === deal.id}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading === deal.id ? '⏳ Processing...' : '✓ Parent Approved'}
              </button>
            )}

            <button
              onClick={() => {
                const reason = prompt('Reason for flagging:');
                if (reason) onFlag(deal.id, reason);
              }}
              disabled={isLoading === `flag-${deal.id}`}
              className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === `flag-${deal.id}` ? '⏳ Flagging...' : '🚩 Flag for Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;
