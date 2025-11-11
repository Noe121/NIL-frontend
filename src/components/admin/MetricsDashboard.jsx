import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Calendar,
  Clock,
  MoreVertical,
  Info
} from 'lucide-react';
import { adminDashboardService } from '../../services/adminDashboardService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

/**
 * MetricsDashboard - React Component
 *
 * KPI dashboard with trend indicators, period comparisons, and cache management
 * Real-time metrics visualization with Material Design 3 styling
 */

const MetricsDashboard = () => {
  // State management
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [dashboardMetrics, setDashboardMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [error, setError] = useState(null);

  // Metric types
  const metricTypes = [
    { value: 'USERS', label: 'Users', icon: Users },
    { value: 'DEALS', label: 'Deals', icon: BarChart3 },
    { value: 'REVENUE', label: 'Revenue', icon: DollarSign },
    { value: 'DISPUTES', label: 'Disputes', icon: AlertCircle },
    { value: 'COMPLETIONS', label: 'Completions', icon: CheckCircle }
  ];

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminDashboardService.getDashboardOverview();
      setDashboardSummary(data.summary);
      setDashboardMetrics(data.metrics ? Object.values(data.metrics) : []);
      setLastRefreshTime(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvalidateCache = async (metricType = null) => {
    try {
      await adminDashboardService.invalidateMetricsCache(metricType);
      if (metricType) {
        await adminDashboardService.getMetrics(metricType);
      } else {
        await loadDashboard();
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh metrics');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Key performance indicators and metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={loadDashboard}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              {/* Refresh Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleInvalidateCache(null)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All Metrics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {metricTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <DropdownMenuItem
                        key={type.value}
                        onClick={() => handleInvalidateCache(type.value)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        Refresh {type.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Overview */}
        {dashboardSummary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                icon={AlertCircle}
                iconColor="text-orange-600"
                bgColor="bg-orange-100"
                value={dashboardSummary.activeAlerts}
                label="Active Alerts"
              />
              <SummaryCard
                icon={BarChart3}
                iconColor="text-blue-600"
                bgColor="bg-blue-100"
                value={dashboardSummary.totalAuditLogs}
                label="Audit Logs"
              />
              <SummaryCard
                icon={Calendar}
                iconColor="text-green-600"
                bgColor="bg-green-100"
                value={dashboardSummary.activeReportSchedules}
                label="Report Schedules"
              />
              <SummaryCard
                icon={Clock}
                iconColor="text-purple-600"
                bgColor="bg-purple-100"
                value={formatTime(dashboardSummary.timestamp)}
                label="Last Updated"
              />
            </div>
          </div>
        )}

        {/* KPI Metrics */}
        {dashboardMetrics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Key Performance Indicators
            </h2>
            <div className="space-y-4">
              {dashboardMetrics.map(metric => (
                <MetricCard key={metric.metricType} metric={metric} />
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !dashboardSummary && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Last Refresh Info */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Last refreshed: {formatFullTime(lastRefreshTime)}
          </p>
          <p className="text-xs text-gray-500">
            Pull down to refresh or use the refresh menu
          </p>
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon: Icon, iconColor, bgColor, value, label }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Metric Card Component
const MetricCard = ({ metric }) => {
  const getMetricIcon = (type) => {
    const icons = {
      USERS: Users,
      DEALS: BarChart3,
      REVENUE: DollarSign,
      DISPUTES: AlertCircle,
      COMPLETIONS: CheckCircle
    };
    return icons[type] || BarChart3;
  };

  const getTrendIcon = (changePercent) => {
    if (changePercent > 0) return TrendingUp;
    if (changePercent < 0) return TrendingDown;
    return Minus;
  };

  const getChangeColor = (changePercent, metricType) => {
    // Disputes: down is good (green), up is bad (red)
    if (metricType === 'DISPUTES') {
      if (changePercent > 0) return 'text-red-600';
      if (changePercent < 0) return 'text-green-600';
      return 'text-gray-600';
    }

    // Other metrics: up is good (green), down is bad (red)
    if (changePercent > 0) return 'text-green-600';
    if (changePercent < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const Icon = getMetricIcon(metric.metricType);
  const TrendIcon = getTrendIcon(metric.changePercent);
  const changeColor = getChangeColor(metric.changePercent, metric.metricType);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-white shadow-sm">
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {formatMetricType(metric.metricType)}
                </h3>
                {metric.description && (
                  <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
                )}
              </div>
            </div>

            {/* Trend Indicator */}
            {metric.changePercent !== undefined && metric.changePercent !== null && (
              <div className="flex flex-col items-end">
                <TrendIcon className={`h-8 w-8 ${changeColor}`} />
                <span className={`text-sm font-bold ${changeColor}`}>
                  {formatChangePercent(metric.changePercent)}
                </span>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-300" />

          {/* Values */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatMetricValue(metric.currentValue, metric.metricType)}
              </p>
            </div>

            {metric.previousValue !== undefined && metric.previousValue !== null && (
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Previous</p>
                <p className="text-xl font-semibold text-gray-700">
                  {formatMetricValue(metric.previousValue, metric.metricType)}
                </p>
              </div>
            )}
          </div>

          {/* Period and Cache Status */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Period: {formatPeriod(metric.periodStart, metric.periodEnd)}
              </span>
            </div>

            {!metric.isCacheValid && (
              <div className="flex items-center gap-1 text-orange-600">
                <Info className="h-4 w-4" />
                <span className="text-xs">Cache Invalid</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper Functions

const formatMetricType = (type) => {
  return type.charAt(0) + type.slice(1).toLowerCase();
};

const formatMetricValue = (value, metricType) => {
  if (value === null || value === undefined) return 'N/A';

  switch (metricType) {
    case 'REVENUE':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);

    case 'USERS':
    case 'DEALS':
    case 'DISPUTES':
    case 'COMPLETIONS':
      return new Intl.NumberFormat('en-US').format(value);

    default:
      return value.toString();
  }
};

const formatChangePercent = (percent) => {
  if (percent === null || percent === undefined) return 'N/A';
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
};

const formatPeriod = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit'
  });
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
};

const formatTime = (date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d);
};

const formatFullTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export default MetricsDashboard;
