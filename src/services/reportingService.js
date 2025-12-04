/**
 * reportingService.js
 * NILBx - Reporting Service Integration for Frontend
 *
 * Integrates with Reporting Service for PDF generation, scheduling, and exports
 * Backend Port: 8000 (Reporting Service)
 */

const REPORTING_SERVICE_URL = import.meta.env.VITE_REPORTING_SERVICE_URL || 'http://localhost:8000';

// MARK: - Enums and Constants

export const ReportStatus = {
    DRAFT: 'draft',
    GENERATING: 'generating',
    READY: 'ready',
    FAILED: 'failed',
    ARCHIVED: 'archived'
};

export const ReportType = {
    SALES: 'sales',
    ANALYTICS: 'analytics',
    FINANCIAL: 'financial',
    PERFORMANCE: 'performance',
    COMPLIANCE: 'compliance'
};

export const ScheduleFrequency = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly'
};

export const ExportFormat = {
    PDF: 'pdf',
    CSV: 'csv',
    XLSX: 'xlsx',
    JSON: 'json',
    HTML: 'html'
};

// MARK: - Reporting Service Class

class ReportingService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Get authentication token
     * @returns {string|null} JWT token
     */
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Get authorization headers
     * @returns {Object} Headers with auth token
     */
    getAuthHeaders() {
        const token = this.getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // MARK: - Report Templates

    /**
     * Get all report templates
     * @returns {Promise<Object>} Templates list
     */
    async getTemplates() {
        const cacheKey = 'templates_all';
        const cached = this.getCachedData(cacheKey);
        if (cached) return { success: true, data: cached };

        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/templates`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch templates: ${response.statusText}`);
            }

            const data = await response.json();
            this.setCachedData(cacheKey, data);

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching templates:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get template by ID
     * @param {number} templateId - Template ID
     * @returns {Promise<Object>} Template details
     */
    async getTemplate(templateId) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/templates/${templateId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch template: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching template:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get templates by type
     * @param {string} type - Report type
     * @returns {Promise<Object>} Filtered templates
     */
    async getTemplatesByType(type) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/templates/type/${type}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch templates by type: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching templates by type:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create new report template
     * @param {Object} templateData - Template configuration
     * @returns {Promise<Object>} Created template
     */
    async createTemplate(templateData) {
        try {
            const {
                name,
                type,
                description = null,
                sections = [],
                exportFormats = [ExportFormat.PDF, ExportFormat.CSV]
            } = templateData;

            const response = await fetch(`${REPORTING_SERVICE_URL}/templates`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    template_name: name,
                    template_type: type,
                    description,
                    sections,
                    export_formats: exportFormats
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Failed to create template: ${response.statusText}`);
            }

            const data = await response.json();

            // Clear templates cache
            this.clearCache('templates_');

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error creating template:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // MARK: - Reports

    /**
     * Get user reports
     * @param {number} userId - User ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Reports list
     */
    async getUserReports(userId, options = {}) {
        const { limit = 50, offset = 0 } = options;

        try {
            const queryParams = new URLSearchParams({
                limit,
                offset
            });

            const url = `${REPORTING_SERVICE_URL}/reports/user/${userId}?${queryParams}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user reports: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching user reports:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get report by ID
     * @param {number} reportId - Report ID
     * @returns {Promise<Object>} Report details
     */
    async getReport(reportId) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/reports/${reportId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch report: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching report:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create new report
     * @param {Object} reportData - Report configuration
     * @returns {Promise<Object>} Created report
     */
    async createReport(reportData) {
        try {
            const {
                userId,
                templateId,
                reportName,
                reportType,
                dateRangeStart,
                dateRangeEnd,
                filters = null
            } = reportData;

            const response = await fetch(`${REPORTING_SERVICE_URL}/reports`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    user_id: userId,
                    template_id: templateId,
                    report_name: reportName,
                    report_type: reportType,
                    date_range_start: new Date(dateRangeStart).toISOString(),
                    date_range_end: new Date(dateRangeEnd).toISOString(),
                    filters
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Failed to create report: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error creating report:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update report status
     * @param {number} reportId - Report ID
     * @param {string} status - New status
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Update result
     */
    async updateReportStatus(reportId, status, options = {}) {
        try {
            const { progressPercent = null, errorMessage = null } = options;

            const body = { status };
            if (progressPercent !== null) body.progress_percent = progressPercent;
            if (errorMessage !== null) body.error_message = errorMessage;

            const response = await fetch(`${REPORTING_SERVICE_URL}/reports/${reportId}/status`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`Failed to update report status: ${response.statusText}`);
            }

            return {
                success: true,
                message: 'Report status updated successfully'
            };
        } catch (error) {
            console.error('Error updating report status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete report
     * @param {number} reportId - Report ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteReport(reportId) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/reports/${reportId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to delete report: ${response.statusText}`);
            }

            return {
                success: true,
                message: 'Report deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting report:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // MARK: - Report Schedules

    /**
     * Get user schedules
     * @param {number} userId - User ID
     * @returns {Promise<Object>} Schedules list
     */
    async getUserSchedules(userId) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/schedules/user/${userId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user schedules: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching user schedules:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create report schedule
     * @param {Object} scheduleData - Schedule configuration
     * @returns {Promise<Object>} Created schedule
     */
    async createSchedule(scheduleData) {
        try {
            const {
                userId,
                templateId,
                scheduleName,
                frequency,
                timeOfDay,
                timezone = 'UTC',
                recipients,
                deliveryMethod = 'email'
            } = scheduleData;

            const response = await fetch(`${REPORTING_SERVICE_URL}/schedules`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    user_id: userId,
                    template_id: templateId,
                    schedule_name: scheduleName,
                    frequency,
                    time_of_day: timeOfDay,
                    timezone,
                    recipients,
                    delivery_method: deliveryMethod
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Failed to create schedule: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error creating schedule:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update schedule
     * @param {number} scheduleId - Schedule ID
     * @param {Object} updates - Schedule updates
     * @returns {Promise<Object>} Updated schedule
     */
    async updateSchedule(scheduleId, updates) {
        try {
            const body = {};

            if ('isActive' in updates) body.is_active = updates.isActive;
            if ('frequency' in updates) body.frequency = updates.frequency;
            if ('timeOfDay' in updates) body.time_of_day = updates.timeOfDay;
            if ('recipients' in updates) body.recipients = updates.recipients;

            const response = await fetch(`${REPORTING_SERVICE_URL}/schedules/${scheduleId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`Failed to update schedule: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error updating schedule:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete schedule
     * @param {number} scheduleId - Schedule ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteSchedule(scheduleId) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/schedules/${scheduleId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to delete schedule: ${response.statusText}`);
            }

            return {
                success: true,
                message: 'Schedule deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting schedule:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // MARK: - Report Exports

    /**
     * Get report exports
     * @param {number} reportId - Report ID
     * @returns {Promise<Object>} Exports list
     */
    async getReportExports(reportId) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/exports/report/${reportId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch report exports: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching report exports:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create export
     * @param {number} reportId - Report ID
     * @param {string} format - Export format
     * @returns {Promise<Object>} Created export
     */
    async createExport(reportId, format) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/exports`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    report_id: reportId,
                    export_format: format,
                    file_path: `/exports/report_${reportId}.${format}`
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Failed to create export: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error creating export:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Download export
     * @param {Object} exportData - Export details
     * @returns {Promise<Object>} Download result
     */
    async downloadExport(exportData) {
        try {
            const url = `${REPORTING_SERVICE_URL}${exportData.file_path}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to download export: ${response.statusText}`);
            }

            // Record download
            await this.recordDownload(exportData.id);

            // Get blob and create download link
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `report_${exportData.report_id}.${exportData.export_format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return {
                success: true,
                message: 'Export downloaded successfully'
            };
        } catch (error) {
            console.error('Error downloading export:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Record download
     * @param {number} exportId - Export ID
     * @returns {Promise<Object>} Record result
     */
    async recordDownload(exportId) {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/exports/${exportId}/download`, {
                method: 'PATCH',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to record download: ${response.statusText}`);
            }

            return {
                success: true
            };
        } catch (error) {
            console.error('Error recording download:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // MARK: - Health Check

    /**
     * Check service health
     * @returns {Promise<boolean>} Health status
     */
    async checkHealth() {
        try {
            const response = await fetch(`${REPORTING_SERVICE_URL}/health`, {
                method: 'GET'
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.status === 'healthy';
        } catch (error) {
            console.error('Error checking health:', error);
            return false;
        }
    }

    // MARK: - Helper Methods

    /**
     * Get status display info
     * @param {string} status - Report status
     * @returns {Object} Status display properties
     */
    getStatusInfo(status) {
        const info = {
            [ReportStatus.DRAFT]: { label: 'Draft', color: '#9E9E9E', icon: '📄' },
            [ReportStatus.GENERATING]: { label: 'Generating', color: '#2196F3', icon: '⏳' },
            [ReportStatus.READY]: { label: 'Ready', color: '#4CAF50', icon: '✅' },
            [ReportStatus.FAILED]: { label: 'Failed', color: '#F44336', icon: '⚠️' },
            [ReportStatus.ARCHIVED]: { label: 'Archived', color: '#FF9800', icon: '📦' }
        };

        return info[status] || info[ReportStatus.DRAFT];
    }

    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        const kb = bytes / 1024;
        const mb = kb / 1024;

        if (mb >= 1.0) {
            return `${mb.toFixed(2)} MB`;
        } else {
            return `${kb.toFixed(2)} KB`;
        }
    }

    /**
     * Format duration
     * @param {number} seconds - Duration in seconds
     * @returns {string} Formatted duration
     */
    formatDuration(seconds) {
        if (seconds < 60) {
            return `${seconds.toFixed(1)} sec`;
        } else {
            const minutes = seconds / 60;
            return `${minutes.toFixed(1)} min`;
        }
    }

    /**
     * Get export format details
     * @param {string} format - Export format
     * @returns {Object} Format details
     */
    getFormatDetails(format) {
        const formats = {
            [ExportFormat.PDF]: { label: 'PDF', extension: '.pdf', mimeType: 'application/pdf', icon: '📄' },
            [ExportFormat.CSV]: { label: 'CSV', extension: '.csv', mimeType: 'text/csv', icon: '📊' },
            [ExportFormat.XLSX]: { label: 'Excel', extension: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: '📗' },
            [ExportFormat.JSON]: { label: 'JSON', extension: '.json', mimeType: 'application/json', icon: '{ }' },
            [ExportFormat.HTML]: { label: 'HTML', extension: '.html', mimeType: 'text/html', icon: '🌐' }
        };

        return formats[format] || formats[ExportFormat.PDF];
    }

    // MARK: - Cache Management

    /**
     * Get cached data
     * @param {string} key - Cache key
     * @returns {any|null} Cached data
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    /**
     * Set cached data
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     */
    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Clear cache
     * @param {string} pattern - Optional pattern to match keys
     */
    clearCache(pattern = null) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }
}

// Create and export singleton instance
const reportingService = new ReportingService();

export default reportingService;
