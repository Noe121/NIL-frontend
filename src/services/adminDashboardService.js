/**
 * adminDashboardService.js
 * NILBx - Admin Dashboard Service Integration for Frontend
 *
 * Integrates with Admin Dashboard Service for audit logging, alerts, and metrics
 * Backend Port: 8005 (Admin Dashboard Service)
 */

const ADMIN_DASHBOARD_URL = 'http://localhost:8005';

// MARK: - Enums and Constants

export const AlertType = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    CRITICAL: 'critical'
};

export const AlertSeverity = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};

export const MetricType = {
    USERS: 'users',
    DEALS: 'deals',
    REVENUE: 'revenue',
    DISPUTES: 'disputes',
    COMPLETIONS: 'completions'
};

// MARK: - Admin Dashboard Service Class

class AdminDashboardService {
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
     * Get admin ID
     * @returns {number} Admin ID
     */
    getAdminId() {
        return parseInt(localStorage.getItem('adminId') || '0');
    }

    /**
     * Get authorization headers
     * @returns {Object} Headers with auth token and admin ID
     */
    getAuthHeaders() {
        const token = this.getAuthToken();
        return {
            'Content-Type': 'application/json',
            'admin_id': this.getAdminId().toString(),
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // MARK: - Dashboard Overview

    /**
     * Get dashboard overview
     * @returns {Promise<Object>} Dashboard summary
     */
    async getDashboardOverview() {
        const cacheKey = 'dashboard_overview';
        const cached = this.getCachedData(cacheKey);
        if (cached) return { success: true, data: cached };

        try {
            const response = await fetch(`${ADMIN_DASHBOARD_URL}/admin/dashboard`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch dashboard overview: ${response.statusText}`);
            }

            const data = await response.json();
            this.setCachedData(cacheKey, data);

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // MARK: - Audit Logs

    /**
     * Get audit logs
     * @param {Object} options - Filter options
     * @returns {Promise<Object>} Audit logs list
     */
    async getAuditLogs(options = {}) {
        try {
            const {
                adminId = null,
                action = null,
                entityType = null,
                limit = 100,
                offset = 0
            } = options;

            const queryParams = new URLSearchParams({
                skip: offset,
                limit
            });

            if (adminId !== null) queryParams.append('admin_id', adminId);
            if (action) queryParams.append('action', action);
            if (entityType) queryParams.append('entity_type', entityType);

            const url = `${ADMIN_DASHBOARD_URL}/admin/audit-logs?${queryParams}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create audit log
     * @param {Object} logData - Audit log data
     * @returns {Promise<Object>} Created audit log
     */
    async createAuditLog(logData) {
        try {
            const {
                action,
                entityType,
                entityId,
                changes = null,
                reason = null
            } = logData;

            const response = await fetch(`${ADMIN_DASHBOARD_URL}/admin/audit-logs`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    action,
                    entity_type: entityType,
                    entity_id: entityId,
                    changes,
                    reason
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Failed to create audit log: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error creating audit log:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // MARK: - System Alerts

    /**
     * Get alerts
     * @param {Object} options - Filter options
     * @returns {Promise<Object>} Alerts list
     */
    async getAlerts(options = {}) {
        try {
            const {
                onlyUnresolved = false,
                limit = 100,
                offset = 0
            } = options;

            const queryParams = new URLSearchParams({
                skip: offset,
                limit,
                only_unresolved: onlyUnresolved
            });

            const url = `${ADMIN_DASHBOARD_URL}/admin/alerts?${queryParams}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch alerts: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching alerts:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get active alerts
     * @returns {Promise<Object>} Active alerts list
     */
    async getActiveAlerts() {
        try {
            const response = await fetch(`${ADMIN_DASHBOARD_URL}/admin/alerts/active`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch active alerts: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching active alerts:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create alert
     * @param {Object} alertData - Alert data
     * @returns {Promise<Object>} Created alert
     */
    async createAlert(alertData) {
        try {
            const {
                alertType,
                message,
                severity,
                source,
                details = null
            } = alertData;

            const response = await fetch(`${ADMIN_DASHBOARD_URL}/admin/alerts`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    alert_type: alertType,
                    message,
                    severity,
                    source,
                    details
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Failed to create alert: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error creating alert:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Resolve alert
     * @param {number} alertId - Alert ID
     * @param {string} resolutionNotes - Resolution notes
     * @returns {Promise<Object>} Resolution result
     */
    async resolveAlert(alertId, resolutionNotes) {
        try {
            const response = await fetch(`${ADMIN_DASHBOARD_URL}/admin/alerts/${alertId}/resolve`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    resolution_notes: resolutionNotes
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to resolve alert: ${response.statusText}`);
            }

            return {
                success: true,
                message: 'Alert resolved successfully'
            };
        } catch (error) {
            console.error('Error resolving alert:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // MARK: - Dashboard Metrics

    /**
     * Get metrics by type
     * @param {string} metricType - Metric type
     * @param {number} limit - Number of metrics to fetch
     * @returns {Promise<Object>} Metrics list
     */
    async getMetrics(metricType, limit = 10) {
        try {
            const url = `${ADMIN_DASHBOARD_URL}/admin/metrics/${metricType}?limit=${limit}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch metrics: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching metrics:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create metric
     * @param {Object} metricData - Metric data
     * @returns {Promise<Object>} Created metric
     */
    async createMetric(metricData) {
        try {
            const {
                metricType,
                currentValue,
                periodStart,
                periodEnd,
                previousValue = null,
                description = null
            } = metricData;

            const response = await fetch(`${ADMIN_DASHBOARD_URL}/admin/metrics`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    metric_type: metricType,
                    current_value: currentValue,
                    period_start: new Date(periodStart).toISOString(),
                    period_end: new Date(periodEnd).toISOString(),
                    previous_value: previousValue,
                    description
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Failed to create metric: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error creating metric:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Invalidate metrics cache
     * @param {string|null} metricType - Optional metric type to invalidate
     * @returns {Promise<Object>} Invalidation result
     */
    async invalidateMetricsCache(metricType = null) {
        try {
            let url = `${ADMIN_DASHBOARD_URL}/admin/metrics/invalidate`;

            if (metricType) {
                url += `?metric_type=${metricType}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to invalidate cache: ${response.statusText}`);
            }

            // Clear local cache too
            this.clearCache('dashboard_');

            return {
                success: true,
                message: 'Cache invalidated successfully'
            };
        } catch (error) {
            console.error('Error invalidating cache:', error);
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
            const response = await fetch(`${ADMIN_DASHBOARD_URL}/health`, {
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
     * Get alert type display info
     * @param {string} alertType - Alert type
     * @returns {Object} Display info
     */
    getAlertTypeInfo(alertType) {
        const info = {
            [AlertType.ERROR]: { label: 'Error', icon: '❌', color: '#F44336' },
            [AlertType.WARNING]: { label: 'Warning', icon: '⚠️', color: '#FF9800' },
            [AlertType.INFO]: { label: 'Info', icon: 'ℹ️', color: '#2196F3' },
            [AlertType.CRITICAL]: { label: 'Critical', icon: '🚨', color: '#D32F2F' }
        };

        return info[alertType] || info[AlertType.INFO];
    }

    /**
     * Get alert severity display info
     * @param {string} severity - Alert severity
     * @returns {Object} Display info
     */
    getAlertSeverityInfo(severity) {
        const info = {
            [AlertSeverity.LOW]: { label: 'Low', color: '#2196F3' },
            [AlertSeverity.MEDIUM]: { label: 'Medium', color: '#FFC107' },
            [AlertSeverity.HIGH]: { label: 'High', color: '#FF9800' },
            [AlertSeverity.CRITICAL]: { label: 'Critical', color: '#F44336' }
        };

        return info[severity] || info[AlertSeverity.LOW];
    }

    /**
     * Get metric type display info
     * @param {string} metricType - Metric type
     * @returns {Object} Display info
     */
    getMetricTypeInfo(metricType) {
        const info = {
            [MetricType.USERS]: { label: 'Active Users', icon: '👥' },
            [MetricType.DEALS]: { label: 'Active Deals', icon: '💼' },
            [MetricType.REVENUE]: { label: 'Revenue', icon: '💰' },
            [MetricType.DISPUTES]: { label: 'Disputes', icon: '⚠️' },
            [MetricType.COMPLETIONS]: { label: 'Completions', icon: '✅' }
        };

        return info[metricType] || { label: metricType, icon: '📊' };
    }

    /**
     * Format metric value
     * @param {number} value - Metric value
     * @param {string} metricType - Metric type
     * @returns {string} Formatted value
     */
    formatMetricValue(value, metricType) {
        if (metricType === MetricType.REVENUE) {
            return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
        return Math.round(value).toString();
    }

    /**
     * Format change percent
     * @param {number|null} percent - Change percent
     * @returns {string} Formatted percent
     */
    formatChangePercent(percent) {
        if (percent === null || percent === undefined) return 'N/A';
        const sign = percent >= 0 ? '+' : '';
        return `${sign}${percent.toFixed(1)}%`;
    }

    /**
     * Get change color
     * @param {number|null} percent - Change percent
     * @param {string} metricType - Metric type
     * @returns {string} Color
     */
    getChangeColor(percent, metricType) {
        if (percent === null || percent === undefined) return '#9E9E9E';

        // For disputes, negative is good
        if (metricType === MetricType.DISPUTES) {
            return percent < 0 ? '#4CAF50' : '#F44336';
        }

        // For others, positive is good
        return percent >= 0 ? '#4CAF50' : '#F44336';
    }

    /**
     * Get trend indicator
     * @param {number|null} percent - Change percent
     * @returns {string} Trend indicator
     */
    getTrendIndicator(percent) {
        if (percent === null || percent === undefined) return '→';
        if (percent > 0) return '↗';
        if (percent < 0) return '↘';
        return '→';
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
const adminDashboardService = new AdminDashboardService();

export default adminDashboardService;
