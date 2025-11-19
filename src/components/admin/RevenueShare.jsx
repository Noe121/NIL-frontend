import React, { useState, useEffect } from 'react';

/**
 * Revenue Share Component
 * Displays NIL revenue tracking and contract details
 */
const RevenueShare = ({ schoolId, schoolType }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [dateRange, setDateRange] = useState('month'); // month, quarter, year, all

  useEffect(() => {
    loadRevenueData();
  }, [schoolId, dateRange]);

  const loadRevenueData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      const response = await fetch(
        `${baseUrl}/api/school/${schoolId}/deals?status=approved`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to load revenue data');
      const data = await response.json();
      setDeals(data.deals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalRevenue = deals.reduce((sum, d) => sum + (d.amount || 0), 0);
    const averageDeal = deals.length > 0 ? totalRevenue / deals.length : 0;
    const largestDeal = Math.max(...deals.map((d) => d.amount || 0), 0);
    
    return { totalRevenue, averageDeal, largestDeal, dealCount: deals.length };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading revenue data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="bg-green-50 border-green-200"
          trend="+12%"
        />
        <MetricCard
          label="Active Contracts"
          value={metrics.dealCount}
          icon="📋"
          color="bg-blue-50 border-blue-200"
        />
        <MetricCard
          label="Average Deal"
          value={`$${Math.round(metrics.averageDeal).toLocaleString()}`}
          icon="📊"
          color="bg-purple-50 border-purple-200"
        />
        <MetricCard
          label="Largest Deal"
          value={`$${metrics.largestDeal.toLocaleString()}`}
          icon="🏆"
          color="bg-yellow-50 border-yellow-200"
        />
      </div>

      {/* Date Range Selector */}
      <div className="bg-slate-50 p-4 rounded-lg flex space-x-2">
        {['month', 'quarter', 'year', 'all'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              dateRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {range === 'month' && 'This Month'}
            {range === 'quarter' && 'This Quarter'}
            {range === 'year' && 'This Year'}
            {range === 'all' && 'All Time'}
          </button>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deals List */}
        <div className="lg:col-span-2 border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-4">
            <h3 className="font-semibold text-slate-900">Contracts by Revenue</h3>
          </div>
          <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
            {deals.length > 0 ? (
              deals
                .sort((a, b) => (b.amount || 0) - (a.amount || 0))
                .map((deal, idx) => (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="p-4 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="font-semibold text-slate-900 w-6 text-right">{idx + 1}.</div>
                      <div>
                        <p className="font-medium text-slate-900">{deal.brand}</p>
                        <p className="text-sm text-slate-600">{deal.athlete_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">${deal.amount?.toLocaleString() || 0}</p>
                      <p className="text-xs text-slate-600">{deal.status}</p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-6 text-center text-slate-600">No approved deals yet</div>
            )}
          </div>
        </div>

        {/* Deal Details */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-4">
            <h3 className="font-semibold text-slate-900">Contract Details</h3>
          </div>
          {selectedDeal ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Brand</label>
                <p className="text-slate-900 font-medium">{selectedDeal.brand}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Athlete</label>
                <p className="text-slate-900 font-medium">{selectedDeal.athlete_name}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Amount</label>
                <p className="text-slate-900 font-medium text-lg">${selectedDeal.amount?.toLocaleString() || 0}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Status</label>
                <p className="text-slate-900 font-medium">{selectedDeal.status}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Approved By</label>
                <p className="text-slate-900 font-medium">{selectedDeal.school_approval_by ? 'School Admin' : 'Pending'}</p>
              </div>
              {schoolType === 'high_school' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase">Parent Approval</label>
                  <p className="text-slate-900 font-medium">{selectedDeal.parent_approval_by ? 'Approved' : 'Pending'}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-600">Select a contract to view details</div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">Revenue Summary by Brand</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Brand</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700">Contracts</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700">Total Amount</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(() => {
                const brandSummary = {};
                deals.forEach((deal) => {
                  if (!brandSummary[deal.brand]) {
                    brandSummary[deal.brand] = { count: 0, total: 0 };
                  }
                  brandSummary[deal.brand].count += 1;
                  brandSummary[deal.brand].total += deal.amount || 0;
                });

                return Object.entries(brandSummary)
                  .sort(([, a], [, b]) => b.total - a.total)
                  .map(([brand, data]) => (
                    <tr key={brand} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm font-medium text-slate-900">{brand}</td>
                      <td className="px-6 py-3 text-sm text-right text-slate-900">{data.count}</td>
                      <td className="px-6 py-3 text-sm text-right font-medium text-slate-900">
                        ${data.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-right text-slate-900">
                        {metrics.totalRevenue > 0 ? ((data.total / metrics.totalRevenue) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Metric Card
 */
const MetricCard = ({ label, value, icon, color, trend }) => (
  <div className={`${color} border rounded-lg p-4`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default RevenueShare;
