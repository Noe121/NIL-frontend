import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Bell,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Shield,
  TrendingDown,
  Database,
  Server,
  Users,
  Clock,
  Eye,
  Check,
  X
} from 'lucide-react';
import { adminDashboardService } from '../../services/adminDashboardService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';

/**
 * AlertsPanel - React Component
 *
 * System alerts management with severity-based filtering and resolution
 * Real-time monitoring and notification center
 */

const AlertsPanel = () => {
  // State management
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [error, setError] = useState(null);

  // Alert severities
  const severities = [
    { value: 'LOW', label: 'Low', color: 'bg-blue-100 text-blue-800', icon: Info },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
    { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  // Alert types
  const alertTypes = [
    { value: 'SYSTEM', label: 'System', icon: Server },
    { value: 'SECURITY', label: 'Security', icon: Shield },
    { value: 'PERFORMANCE', label: 'Performance', icon: TrendingDown },
    { value: 'DATA', label: 'Data', icon: Database },
    { value: 'USER', label: 'User', icon: Users }
  ];

  // Load alerts on mount
  useEffect(() => {
    loadAlerts();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminDashboardService.getActiveAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesResolved = !showOnlyUnresolved || !alert.isResolved;
    const matchesSeverity = !selectedSeverity || alert.severity === selectedSeverity;
    const matchesType = !selectedType || alert.alertType === selectedType;
    return matchesResolved && matchesSeverity && matchesType;
  });

  // Resolve alert
  const handleResolveAlert = async (notes) => {
    try {
      await adminDashboardService.resolveAlert(selectedAlert.id, notes);
      setShowResolveDialog(false);
      setShowDetailDialog(false);
      setSelectedAlert(null);
      await loadAlerts();
    } catch (err) {
      setError(err.message || 'Failed to resolve alert');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setShowOnlyUnresolved(true);
    setSelectedSeverity(null);
    setSelectedType(null);
  };

  const hasActiveFilters = !showOnlyUnresolved || selectedSeverity !== null || selectedType !== null;

  // Count alerts by severity
  const alertCounts = {
    total: alerts.length,
    unresolved: alerts.filter(a => !a.isResolved).length,
    critical: alerts.filter(a => a.severity === 'CRITICAL' && !a.isResolved).length,
    high: alerts.filter(a => a.severity === 'HIGH' && !a.isResolved).length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">System Alerts</h1>
                {alertCounts.unresolved > 0 && (
                  <Badge className="bg-red-100 text-red-800 text-lg px-3 py-1">
                    {alertCounts.unresolved} Active
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">
                Monitor and manage system alerts and notifications
              </p>
            </div>
            <Button
              variant="outline"
              onClick={loadAlerts}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              icon={Bell}
              label="Total Alerts"
              value={alertCounts.total}
              color="text-blue-600"
              bgColor="bg-blue-100"
            />
            <SummaryCard
              icon={AlertCircle}
              label="Unresolved"
              value={alertCounts.unresolved}
              color="text-orange-600"
              bgColor="bg-orange-100"
            />
            <SummaryCard
              icon={AlertTriangle}
              label="High Priority"
              value={alertCounts.high}
              color="text-yellow-600"
              bgColor="bg-yellow-100"
            />
            <SummaryCard
              icon={XCircle}
              label="Critical"
              value={alertCounts.critical}
              color="text-red-600"
              bgColor="bg-red-100"
            />
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Resolved Toggle */}
                <div className="flex items-center gap-4">
                  <Button
                    variant={showOnlyUnresolved ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowOnlyUnresolved(!showOnlyUnresolved)}
                    className="flex items-center gap-2"
                  >
                    {showOnlyUnresolved ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showOnlyUnresolved ? 'Unresolved Only' : 'Show All'}
                  </Button>
                </div>

                {/* Severity Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Severity:</span>
                  <Button
                    variant={!selectedSeverity ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSeverity(null)}
                  >
                    All Severities
                  </Button>
                  {severities.map(severity => {
                    const Icon = severity.icon;
                    return (
                      <Button
                        key={severity.value}
                        variant={selectedSeverity === severity.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSelectedSeverity(
                            selectedSeverity === severity.value ? null : severity.value
                          )
                        }
                        className="flex items-center gap-1"
                      >
                        <Icon className="h-3 w-3" />
                        {severity.label}
                      </Button>
                    );
                  })}
                </div>

                {/* Type Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Type:</span>
                  <Button
                    variant={!selectedType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(null)}
                  >
                    All Types
                  </Button>
                  {alertTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={selectedType === type.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSelectedType(selectedType === type.value ? null : type.value)
                        }
                        className="flex items-center gap-1"
                      >
                        <Icon className="h-3 w-3" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Reset Filters
                    </Button>
                    <span className="text-sm text-gray-600">
                      Showing {filteredAlerts.length} of {alerts.length} alerts
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {alerts.length === 0 ? 'No Alerts' : 'No Alerts Found'}
                </h3>
                <p className="text-gray-600">
                  {alerts.length === 0
                    ? 'All systems are operating normally'
                    : 'Try adjusting your filters'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onClick={() => {
                  setSelectedAlert(alert);
                  setShowDetailDialog(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Alert Detail Dialog */}
      {selectedAlert && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Alert Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Alert Header */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    getSeverityConfig(selectedAlert.severity).bgColor
                  }`}
                >
                  {React.createElement(getSeverityConfig(selectedAlert.severity).icon, {
                    className: `h-6 w-6 ${getSeverityConfig(selectedAlert.severity).iconColor}`
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getSeverityConfig(selectedAlert.severity).badgeColor}>
                      {selectedAlert.severity}
                    </Badge>
                    <Badge variant="outline">{selectedAlert.alertType}</Badge>
                    {selectedAlert.isResolved ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedAlert.title}
                  </h3>
                  <p className="text-gray-700">{selectedAlert.message}</p>
                </div>
              </div>

              {/* Alert Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Alert Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4">
                    <DetailRow label="Alert ID" value={selectedAlert.id} />
                    <DetailRow label="Source" value={selectedAlert.source || 'System'} />
                    <DetailRow
                      label="Created At"
                      value={formatDateTime(selectedAlert.createdAt)}
                    />
                    {selectedAlert.acknowledgedAt && (
                      <DetailRow
                        label="Acknowledged At"
                        value={formatDateTime(selectedAlert.acknowledgedAt)}
                      />
                    )}
                    {selectedAlert.resolvedAt && (
                      <DetailRow
                        label="Resolved At"
                        value={formatDateTime(selectedAlert.resolvedAt)}
                      />
                    )}
                    {selectedAlert.resolvedBy && (
                      <DetailRow label="Resolved By" value={selectedAlert.resolvedBy} />
                    )}
                  </dl>
                </CardContent>
              </Card>

              {/* Resolution Notes */}
              {selectedAlert.resolutionNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resolution Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{selectedAlert.resolutionNotes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              {selectedAlert.metadata && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(selectedAlert.metadata, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              {!selectedAlert.isResolved && (
                <Button
                  onClick={() => setShowResolveDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Resolve Alert
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Resolve Alert Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Add notes about how this alert was resolved (optional)
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <textarea
              id="resolutionNotes"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe how the issue was resolved..."
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const notes = document.getElementById('resolutionNotes').value;
                handleResolveAlert(notes);
              }}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Alert Card Component
const AlertCard = ({ alert, onClick }) => {
  const config = getSeverityConfig(alert.severity);
  const Icon = config.icon;
  const TypeIcon = getTypeIcon(alert.alertType);

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        alert.isResolved ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Severity Icon */}
          <div className={`p-3 rounded-full ${config.bgColor}`}>
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>

          {/* Alert Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={config.badgeColor}>{alert.severity}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TypeIcon className="h-3 w-3" />
                {alert.alertType}
              </Badge>
              {alert.isResolved && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>

            <h3 className="text-base font-semibold text-gray-900 mb-1">{alert.title}</h3>
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{alert.message}</p>

            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(alert.createdAt)}
              </span>
              {alert.source && (
                <>
                  <span>•</span>
                  <span>{alert.source}</span>
                </>
              )}
            </div>
          </div>

          <Eye className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
};

// Supporting Components
const DetailRow = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-700 mb-1">{label}</dt>
    <dd className="text-sm text-gray-900">{value}</dd>
  </div>
);

// Helper Functions
const getSeverityConfig = (severity) => {
  const configs = {
    LOW: {
      icon: Info,
      badgeColor: 'bg-blue-100 text-blue-800',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    MEDIUM: {
      icon: AlertCircle,
      badgeColor: 'bg-yellow-100 text-yellow-800',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    HIGH: {
      icon: AlertTriangle,
      badgeColor: 'bg-orange-100 text-orange-800',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    CRITICAL: {
      icon: XCircle,
      badgeColor: 'bg-red-100 text-red-800',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  };
  return configs[severity] || configs.MEDIUM;
};

const getTypeIcon = (type) => {
  const icons = {
    SYSTEM: Server,
    SECURITY: Shield,
    PERFORMANCE: TrendingDown,
    DATA: Database,
    USER: Users
  };
  return icons[type] || AlertCircle;
};

const formatDateTime = (date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d);
};

const formatRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDateTime(date);
};

export default AlertsPanel;
