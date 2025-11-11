import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Plus,
  Download,
  Filter,
  X,
  Search,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { reportingService } from '../../services/reportingService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

/**
 * ReportList - React Component
 *
 * Main report listing interface with filtering, search, and create functionality
 * Tailwind CSS + shadcn/ui components
 */

const ReportList = () => {
  const navigate = useNavigate();

  // State management
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [error, setError] = useState(null);

  // Create dialog state
  const [newReport, setNewReport] = useState({
    reportName: '',
    templateId: 1,
    periodStart: '',
    periodEnd: '',
    format: 'pdf'
  });

  // Report types and statuses
  const reportTypes = [
    { value: 'REVENUE', label: 'Revenue Analysis', icon: TrendingUp },
    { value: 'USER_ACTIVITY', label: 'User Activity', icon: FileText },
    { value: 'DISPUTES', label: 'Disputes Summary', icon: AlertCircle },
    { value: 'COMPLETION', label: 'Deal Completions', icon: CheckCircle }
  ];

  const reportStatuses = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PROCESSING', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'FAILED', label: 'Failed', color: 'bg-red-100 text-red-800' }
  ];

  // Load reports on mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = getUserId(); // Helper function to get current user ID
      const data = await reportingService.getUserReports(userId);
      setReports(data);
      setLastRefreshTime(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchText === '' ||
      report.reportName.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !selectedType || report.reportType === selectedType;
    const matchesStatus = !selectedStatus || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle create report
  const handleCreateReport = async () => {
    try {
      const userId = getUserId();
      await reportingService.generateReport({
        ...newReport,
        userId,
        periodStart: new Date(newReport.periodStart),
        periodEnd: new Date(newReport.periodEnd)
      });
      setShowCreateDialog(false);
      setNewReport({
        reportName: '',
        templateId: 1,
        periodStart: '',
        periodEnd: '',
        format: 'pdf'
      });
      await loadReports();
    } catch (err) {
      setError(err.message || 'Failed to create report');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText('');
    setSelectedType(null);
    setSelectedStatus(null);
  };

  const hasActiveFilters = searchText !== '' || selectedType !== null || selectedStatus !== null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-1">
                Generate and manage your data reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={loadReports}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Report
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Filters:</span>

                  {/* Type Filter */}
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>All Types</SelectItem>
                      {reportTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>All Statuses</SelectItem>
                      {reportStatuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Clear Filters
                    </Button>
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
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredReports.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {reports.length === 0 ? 'No Reports Yet' : 'No Reports Found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {reports.length === 0
                    ? 'Create your first report to get started'
                    : 'Try adjusting your search or filters'}
                </p>
                {reports.length === 0 && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => navigate(`/reports/${report.id}`)}
              />
            ))}
          </div>
        )}

        {/* Last Refresh Time */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Last refreshed: {formatFullTime(lastRefreshTime)}
        </div>
      </div>

      {/* Create Report Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Report Name
              </label>
              <Input
                type="text"
                placeholder="Monthly Revenue Report"
                value={newReport.reportName}
                onChange={(e) => setNewReport({ ...newReport, reportName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Template
              </label>
              <Select
                value={newReport.templateId.toString()}
                onValueChange={(val) => setNewReport({ ...newReport, templateId: parseInt(val) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Revenue Analysis</SelectItem>
                  <SelectItem value="2">User Activity</SelectItem>
                  <SelectItem value="3">Disputes Summary</SelectItem>
                  <SelectItem value="4">Deal Completions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={newReport.periodStart}
                  onChange={(e) => setNewReport({ ...newReport, periodStart: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  End Date
                </label>
                <Input
                  type="date"
                  value={newReport.periodEnd}
                  onChange={(e) => setNewReport({ ...newReport, periodEnd: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Format
              </label>
              <Select
                value={newReport.format}
                onValueChange={(val) => setNewReport({ ...newReport, format: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateReport}
              disabled={!newReport.reportName || !newReport.periodStart || !newReport.periodEnd}
            >
              Create Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Report Card Component
const ReportCard = ({ report, onClick }) => {
  const statusConfig = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
    COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    FAILED: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
  };

  const config = statusConfig[report.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {report.reportName}
              </h3>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatPeriod(report.periodStart, report.periodEnd)}
              </span>
              <span>•</span>
              <span>{report.format.toUpperCase()}</span>
              {report.fileSize && (
                <>
                  <span>•</span>
                  <span>{formatFileSize(report.fileSize)}</span>
                </>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Created: {formatDateTime(report.createdAt)}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge className={config.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {report.status}
            </Badge>
            {report.status === 'PROCESSING' && report.progress && (
              <div className="text-xs text-gray-600">
                {report.progress}% complete
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper Functions
const getUserId = () => {
  // Replace with actual auth logic
  return 1;
};

const formatPeriod = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
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

const formatFullTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default ReportList;
