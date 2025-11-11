import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  ArrowRight,
  FileText,
  User,
  Settings,
  Database,
  Shield,
  Clock,
  Calendar,
  X
} from 'lucide-react';
import { adminDashboardService } from '../../services/adminDashboardService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

/**
 * AuditLog - React Component
 *
 * CCPA-compliant audit trail viewer with search and filtering
 * Tracks all administrative actions with before/after change visualization
 */

const AuditLog = () => {
  // State management
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [error, setError] = useState(null);

  // Action and entity type filters
  const actionTypes = [
    { value: 'CREATE', label: 'Create', color: 'bg-green-100 text-green-800' },
    { value: 'UPDATE', label: 'Update', color: 'bg-blue-100 text-blue-800' },
    { value: 'DELETE', label: 'Delete', color: 'bg-red-100 text-red-800' },
    { value: 'LOGIN', label: 'Login', color: 'bg-purple-100 text-purple-800' },
    { value: 'EXPORT', label: 'Export', color: 'bg-orange-100 text-orange-800' }
  ];

  const entityTypes = [
    { value: 'USER', label: 'User', icon: User },
    { value: 'REPORT', label: 'Report', icon: FileText },
    { value: 'SCHEDULE', label: 'Schedule', icon: Calendar },
    { value: 'SETTING', label: 'Setting', icon: Settings },
    { value: 'DATA', label: 'Data', icon: Database },
    { value: 'SECURITY', label: 'Security', icon: Shield }
  ];

  // Load audit logs on mount
  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminDashboardService.getRecentAuditLogs(100);
      setAuditLogs(data);
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      searchText === '' ||
      log.action.toLowerCase().includes(searchText.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchText.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchesAction = !selectedAction || log.action === selectedAction;
    const matchesEntityType = !selectedEntityType || log.entityType === selectedEntityType;

    return matchesSearch && matchesAction && matchesEntityType;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchText('');
    setSelectedAction(null);
    setSelectedEntityType(null);
  };

  const hasActiveFilters = searchText !== '' || selectedAction !== null || selectedEntityType !== null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
              <p className="text-gray-600 mt-1">
                Track all administrative actions and changes
              </p>
            </div>
            <Button
              variant="outline"
              onClick={loadAuditLogs}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search audit logs..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="space-y-3">
                  {/* Action Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Actions:</span>
                    <Button
                      variant={!selectedAction ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedAction(null)}
                    >
                      All Actions
                    </Button>
                    {actionTypes.map(action => (
                      <Button
                        key={action.value}
                        variant={selectedAction === action.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSelectedAction(selectedAction === action.value ? null : action.value)
                        }
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>

                  {/* Entity Type Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Entity Types:</span>
                    <Button
                      variant={!selectedEntityType ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedEntityType(null)}
                    >
                      All Types
                    </Button>
                    {entityTypes.map(entity => {
                      const Icon = entity.icon;
                      return (
                        <Button
                          key={entity.value}
                          variant={selectedEntityType === entity.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() =>
                            setSelectedEntityType(
                              selectedEntityType === entity.value ? null : entity.value
                            )
                          }
                          className="flex items-center gap-1"
                        >
                          <Icon className="h-3 w-3" />
                          {entity.label}
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
                        Clear All Filters
                      </Button>
                      <span className="text-sm text-gray-600">
                        Showing {filteredLogs.length} of {auditLogs.length} logs
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <X className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audit Logs List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {auditLogs.length === 0 ? 'No Audit Logs' : 'No Logs Found'}
                </h3>
                <p className="text-gray-600">
                  {auditLogs.length === 0
                    ? 'No administrative actions have been logged yet'
                    : 'Try adjusting your search or filters'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map(log => (
              <AuditLogCard
                key={log.id}
                log={log}
                onClick={() => {
                  setSelectedLog(log);
                  setShowDetailDialog(true);
                }}
              />
            ))}
          </div>
        )}

        {/* CCPA Notice */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">CCPA Compliance</h4>
                <p className="text-sm text-blue-700">
                  All administrative actions are logged and retained for compliance purposes.
                  Audit logs track changes to personal data and system configurations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Detail Dialog */}
      {selectedLog && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Action Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4">
                    <DetailRow label="Action" value={selectedLog.action} />
                    <DetailRow label="Entity Type" value={selectedLog.entityType} />
                    <DetailRow label="Entity ID" value={selectedLog.entityId} />
                    <DetailRow label="User" value={selectedLog.userName || 'System'} />
                    <DetailRow label="User ID" value={selectedLog.userId} />
                    <DetailRow
                      label="Timestamp"
                      value={formatDateTime(selectedLog.timestamp)}
                    />
                    <DetailRow label="IP Address" value={selectedLog.ipAddress || 'N/A'} />
                    <DetailRow label="User Agent" value={selectedLog.userAgent || 'N/A'} />
                  </dl>
                  {selectedLog.description && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-900">{selectedLog.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Changes */}
              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Changes Made</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedLog.changes.map((change, index) => (
                        <ChangeCard key={index} change={change} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              {selectedLog.metadata && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Additional Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Audit Log Card Component
const AuditLogCard = ({ log, onClick }) => {
  const actionConfig = {
    CREATE: { color: 'bg-green-100 text-green-800', icon: 'text-green-600' },
    UPDATE: { color: 'bg-blue-100 text-blue-800', icon: 'text-blue-600' },
    DELETE: { color: 'bg-red-100 text-red-800', icon: 'text-red-600' },
    LOGIN: { color: 'bg-purple-100 text-purple-800', icon: 'text-purple-600' },
    EXPORT: { color: 'bg-orange-100 text-orange-800', icon: 'text-orange-600' }
  };

  const config = actionConfig[log.action] || actionConfig.CREATE;

  const entityIcons = {
    USER: User,
    REPORT: FileText,
    SCHEDULE: Calendar,
    SETTING: Settings,
    DATA: Database,
    SECURITY: Shield
  };

  const EntityIcon = entityIcons[log.entityType] || FileText;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-full bg-gray-100 ${config.icon}`}>
            <EntityIcon className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={config.color}>{log.action}</Badge>
                  <Badge variant="outline">{log.entityType}</Badge>
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {log.description || `${log.action} ${log.entityType}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {log.userName || 'System'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(log.timestamp)}
              </span>
              {log.changes && log.changes.length > 0 && (
                <>
                  <span>•</span>
                  <span>{log.changes.length} changes</span>
                </>
              )}
            </div>
          </div>

          <Eye className="h-5 w-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};

// Change Card Component
const ChangeCard = ({ change }) => {
  return (
    <Card className="bg-gray-50">
      <CardContent className="pt-4">
        <h4 className="font-medium text-gray-900 mb-3">{change.fieldName}</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Old Value */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-gray-700">Old Value</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <pre className="text-xs text-gray-900 whitespace-pre-wrap">
                {change.oldValue !== null && change.oldValue !== undefined
                  ? typeof change.oldValue === 'object'
                    ? JSON.stringify(change.oldValue, null, 2)
                    : String(change.oldValue)
                  : 'null'}
              </pre>
            </div>
          </div>

          {/* Arrow */}
          <div className="col-span-2 flex justify-center -my-2">
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>

          {/* New Value */}
          <div className="space-y-2 col-start-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-gray-700">New Value</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <pre className="text-xs text-gray-900 whitespace-pre-wrap">
                {change.newValue !== null && change.newValue !== undefined
                  ? typeof change.newValue === 'object'
                    ? JSON.stringify(change.newValue, null, 2)
                    : String(change.newValue)
                  : 'null'}
              </pre>
            </div>
          </div>
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

export default AuditLog;
