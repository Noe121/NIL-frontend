import React, { useState, useEffect } from 'react';
import ApprovalQueue from './ApprovalQueue';
import AthleteRoster from './AthleteRoster';
import RevenueShare from './RevenueShare';
import DealList from './DealList';
import ComplianceCenter from './ComplianceCenter';
import AdminSettings from './AdminSettings';

/**
 * School Admin Dashboard
 * School-type-aware (University vs High School) dashboard
 * Handles all 9 roles with dynamic UI rendering
 */
const SchoolAdminDashboard = ({ userRole, schoolType, schoolId, userId }) => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    totalAthletes: 0,
    activeDeals: 0,
    complianceFlags: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, [schoolId, userRole]);

  const loadDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      const response = await fetch(
        `${baseUrl}/api/dashboard/${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to load dashboard stats');
      const data = await response.json();
      setStats(data.stats || stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'approvals', label: 'Approval Queue', icon: '📋' },
    { id: 'athletes', label: 'Athlete Roster', icon: '👥' },
    { id: 'revenue', label: 'Revenue Share', icon: '💰' },
    { id: 'deals', label: 'All Deals', icon: '📊' },
    { id: 'compliance', label: 'Compliance', icon: '⚖️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  // Filter tabs by role and school type
  const visibleTabs = tabs.filter((tab) => {
    // All roles can see approvals and deals
    if (['approvals', 'deals'].includes(tab.id)) return true;
    
    // Only school admins see athlete roster and revenue share
    if (['athletes', 'revenue'].includes(tab.id)) {
      return userRole === 'school_admin';
    }
    
    // Only compliance officers see compliance
    if (tab.id === 'compliance') {
      return ['school_admin', 'compliance_officer'].includes(userRole);
    }
    
    // Only school admins see settings
    if (tab.id === 'settings') {
      return userRole === 'school_admin';
    }
    
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {schoolType === 'university' ? '🏫' : '🎓'} School Admin Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                {schoolType === 'university'
                  ? 'University NIL Management - NCAA Compliance'
                  : 'High School NIL Management - Parent Approvals Required'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">Role: {userRole.replace('_', ' ')}</p>
              <button
                onClick={loadDashboardStats}
                className="text-xs text-blue-600 hover:text-blue-700 mt-1 underline"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Pending Approvals"
            value={stats.pendingApprovals}
            icon="⏳"
            color="bg-yellow-50 border-yellow-200"
          />
          <StatCard
            label={schoolType === 'university' ? 'Athletes' : 'High School Athletes'}
            value={stats.totalAthletes}
            icon="👥"
            color="bg-blue-50 border-blue-200"
          />
          <StatCard
            label="Active Deals"
            value={stats.activeDeals}
            icon="📊"
            color="bg-green-50 border-green-200"
          />
          <StatCard
            label="Compliance Flags"
            value={stats.complianceFlags}
            icon="⚠️"
            color="bg-red-50 border-red-200"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm font-medium">Error: {error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-lg border border-b-0 border-slate-200 px-6 overflow-x-auto">
          <div className="flex space-x-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-slate-600">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'approvals' && (
                <ApprovalQueue
                  schoolId={schoolId}
                  userRole={userRole}
                  schoolType={schoolType}
                  onRefresh={loadDashboardStats}
                />
              )}
              {activeTab === 'athletes' && <AthleteRoster schoolId={schoolId} schoolType={schoolType} />}
              {activeTab === 'revenue' && <RevenueShare schoolId={schoolId} schoolType={schoolType} />}
              {activeTab === 'deals' && <DealList schoolId={schoolId} userRole={userRole} />}
              {activeTab === 'compliance' && (
                <ComplianceCenter schoolId={schoolId} userRole={userRole} schoolType={schoolType} />
              )}
              {activeTab === 'settings' && <AdminSettings schoolId={schoolId} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Stat Card Component
 */
const StatCard = ({ label, value, icon, color }) => (
  <div className={`${color} border rounded-lg p-4`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default SchoolAdminDashboard;
