import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Share2,
  Trash2
} from 'lucide-react';
import { reportingService } from '../../services/reportingService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

/**
 * ReportDetail - React Component
 *
 * Detailed report view with CCPA-compliant data export functionality
 * Supports multiple export formats and secure download handling
 */

const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // State management
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  // Load report on mount
  useEffect(() => {
    loadReport();
    const interval = setInterval(() => {
      if (report && (report.status === 'PENDING' || report.status === 'PROCESSING')) {
        loadReport();
      }
    }, 5000); // Poll every 5 seconds for status updates

    return () => clearInterval(interval);
  }, [reportId]);

  const loadReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportingService.getReport(parseInt(reportId));
      setReport(data);
    } catch (err) {
      setError(err.message || 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      // CCPA Compliance: User exercising right to access personal data
      const exportData = await reportingService.exportReport(
        parseInt(reportId),
        exportFormat
      );

      // Create and trigger download
      const blob = new Blob([exportData], { type: getMimeType(exportFormat) });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.reportName}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setShowExportDialog(false);
    } catch (err) {
      setError(err.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await reportingService.deleteReport(parseInt(reportId));
      navigate('/reports');
    } catch (err) {
      setError(err.message || 'Failed to delete report');
      setShowDeleteDialog(false);
    }
  };

  // Status configuration
  const statusConfig = {
    PENDING: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
      description: 'Report is queued for processing'
    },
    PROCESSING: {
      color: 'bg-blue-100 text-blue-800',
      icon: RefreshCw,
      description: 'Report is being generated'
    },
    COMPLETED: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
      description: 'Report is ready for download'
    },
    FAILED: {
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle,
      description: 'Report generation failed'
    }
  };

  if (isLoading && !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const config = statusConfig[report.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;
  const canExport = report.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/reports')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {report.reportName}
              </h1>
              <div className="flex items-center gap-3 text-gray-600">
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
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={loadReport}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowExportDialog(true)}
                disabled={!canExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              Report Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${config.color} text-sm px-3 py-1`}>
                  {report.status}
                </Badge>
                <span className="text-sm text-gray-600">
                  {config.description}
                </span>
              </div>

              {report.status === 'PROCESSING' && report.progress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{report.progress}%</span>
                  </div>
                  <Progress value={report.progress} className="h-2" />
                </div>
              )}

              {report.status === 'FAILED' && report.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">Error Details</h4>
                      <p className="text-sm text-red-700">{report.errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Details */}
        <Tabs defaultValue="details" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <DetailRow label="Report Name" value={report.reportName} />
                  <DetailRow label="Report Type" value={formatReportType(report.reportType)} />
                  <DetailRow
                    label="Period"
                    value={formatPeriod(report.periodStart, report.periodEnd)}
                  />
                  <DetailRow label="Format" value={report.format.toUpperCase()} />
                  <DetailRow
                    label="Created At"
                    value={formatDateTime(report.createdAt)}
                  />
                  {report.completedAt && (
                    <DetailRow
                      label="Completed At"
                      value={formatDateTime(report.completedAt)}
                    />
                  )}
                  {report.fileSize && (
                    <DetailRow label="File Size" value={formatFileSize(report.fileSize)} />
                  )}
                  <DetailRow label="Status" value={report.status} />
                </dl>
              </CardContent>
            </Card>

            {/* Report Preview */}
            {canExport && report.preview && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(report.preview, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <DetailRow label="Report ID" value={report.id} />
                  <DetailRow label="User ID" value={report.userId} />
                  <DetailRow label="Template ID" value={report.templateId} />
                  {report.scheduleId && (
                    <DetailRow label="Schedule ID" value={report.scheduleId} />
                  )}
                  {report.generatedBy && (
                    <DetailRow label="Generated By" value={report.generatedBy} />
                  )}
                  {report.parameters && (
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-gray-700 mb-2">Parameters</dt>
                      <dd className="bg-gray-50 rounded-lg p-3">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(report.parameters, null, 2)}
                        </pre>
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generation Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <TimelineItem
                    icon={FileText}
                    title="Report Created"
                    timestamp={report.createdAt}
                    color="text-blue-600"
                  />
                  {report.startedAt && (
                    <TimelineItem
                      icon={RefreshCw}
                      title="Processing Started"
                      timestamp={report.startedAt}
                      color="text-blue-600"
                    />
                  )}
                  {report.completedAt && (
                    <TimelineItem
                      icon={CheckCircle}
                      title="Processing Completed"
                      timestamp={report.completedAt}
                      color="text-green-600"
                    />
                  )}
                  {report.status === 'FAILED' && report.failedAt && (
                    <TimelineItem
                      icon={AlertCircle}
                      title="Processing Failed"
                      timestamp={report.failedAt}
                      color="text-red-600"
                      description={report.errorMessage}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CCPA Notice */}
        {canExport && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">CCPA Data Export</h4>
                  <p className="text-sm text-blue-700">
                    You can export this report in multiple formats. All exports comply with CCPA
                    regulations and include your personal data that you have the right to access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>
              Choose the format for your report export. All exports are CCPA-compliant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Export Format
              </label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF - Portable Document Format</SelectItem>
                  <SelectItem value="csv">CSV - Comma Separated Values</SelectItem>
                  <SelectItem value="xlsx">Excel - Microsoft Excel Format</SelectItem>
                  <SelectItem value="json">JSON - JavaScript Object Notation</SelectItem>
                  <SelectItem value="html">HTML - Web Page Format</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Export Details</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Report:</dt>
                  <dd className="font-medium text-gray-900">{report.reportName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Format:</dt>
                  <dd className="font-medium text-gray-900">{exportFormat.toUpperCase()}</dd>
                </div>
                {report.fileSize && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Size:</dt>
                    <dd className="font-medium text-gray-900">
                      {formatFileSize(report.fileSize)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Warning</h4>
                  <p className="text-sm text-red-700">
                    Deleting this report will permanently remove all associated data and files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Supporting Components

const DetailRow = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-700 mb-1">{label}</dt>
    <dd className="text-sm text-gray-900">{value}</dd>
  </div>
);

const TimelineItem = ({ icon: Icon, title, timestamp, color, description }) => (
  <div className="flex items-start gap-3">
    <div className={`${color} mt-1`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{formatDateTime(timestamp)}</p>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
  </div>
);

// Helper Functions

const getMimeType = (format) => {
  const mimeTypes = {
    pdf: 'application/pdf',
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    json: 'application/json',
    html: 'text/html'
  };
  return mimeTypes[format] || 'application/octet-stream';
};

const formatPeriod = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
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

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatReportType = (type) => {
  return type
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export default ReportDetail;
