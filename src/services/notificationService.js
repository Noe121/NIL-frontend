/**
 * notificationService.js
 * NILBx - Universal Notification Service for Frontend
 *
 * Handles web notifications and integrates with backend Notification Service (Port 8007)
 */

const NOTIFICATION_SERVICE_URL = 'http://localhost:8007';

/**
 * Notification Service
 * Provides methods for managing notifications in the web app
 */
class NotificationService {
  constructor() {
    this.unreadCount = 0;
    this.listeners = [];
    this.permissionGranted = false;
  }

  /**
   * Request notification permission from the browser
   * @returns {Promise<boolean>} Whether permission was granted
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    }

    return false;
  }

  /**
   * Show a browser notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {Object} options - Additional notification options
   */
  showBrowserNotification(title, body, options = {}) {
    if (!this.permissionGranted) {
      console.warn('Notification permission not granted');
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: '/logo192.png', // Replace with your app icon
      badge: '/badge.png',
      tag: options.tag || 'nilbx-notification',
      requireInteraction: options.requireInteraction || false,
      ...options
    });

    notification.onclick = () => {
      window.focus();
      if (options.onClick) {
        options.onClick();
      }
      notification.close();
    };

    return notification;
  }

  /**
   * Register service worker for push notifications (future enhancement)
   */
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Get notification history for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Notification history response
   */
  async getNotificationHistory(userId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      unreadOnly = false
    } = options;

    try {
      const url = `${NOTIFICATION_SERVICE_URL}/notifications/${userId}?limit=${limit}&offset=${offset}&unread_only=${unreadOnly}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const data = await response.json();

      // Update unread count
      this.unreadCount = data.unread_count;
      this.notifyListeners();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching notification history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>} Response
   */
  async markAsRead(notificationId) {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark as read: ${response.statusText}`);
      }

      const data = await response.json();

      // Decrease unread count
      if (this.unreadCount > 0) {
        this.unreadCount--;
        this.notifyListeners();
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Response
   */
  async markAllAsRead(userId) {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/notifications/${userId}/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark all as read: ${response.statusText}`);
      }

      const data = await response.json();

      // Reset unread count
      this.unreadCount = 0;
      this.notifyListeners();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send a notification (typically used by system/admin)
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Response
   */
  async sendNotification(notificationData) {
    const {
      userId,
      notificationType,
      title,
      message,
      channels = ['push'],
      metadata = null,
      scheduledFor = null
    } = notificationData;

    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          notification_type: notificationType,
          title,
          message,
          channels,
          metadata,
          scheduled_for: scheduledFor
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user notification preferences
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Notification preferences
   */
  async getNotificationPreferences(userId) {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/preferences/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch preferences: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update user notification preferences
   * @param {number} userId - User ID
   * @param {Object} preferences - Preferences to update
   * @returns {Promise<Object>} Updated preferences
   */
  async updateNotificationPreferences(userId, preferences) {
    const {
      emailNotifications,
      pushNotifications,
      smsNotifications,
      notificationTypes
    } = preferences;

    try {
      const body = {};
      if (emailNotifications !== undefined) body.email_notifications = emailNotifications;
      if (pushNotifications !== undefined) body.push_notifications = pushNotifications;
      if (smsNotifications !== undefined) body.sms_notifications = smsNotifications;
      if (notificationTypes !== undefined) body.notification_types = notificationTypes;

      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data.preferences
      };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Subscribe to unread count changes
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onUnreadCountChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of unread count change
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.unreadCount);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  /**
   * Start polling for new notifications
   * @param {number} userId - User ID
   * @param {number} intervalMs - Polling interval in milliseconds
   * @returns {Function} Stop polling function
   */
  startPolling(userId, intervalMs = 30000) {
    const pollInterval = setInterval(async () => {
      await this.getNotificationHistory(userId, { limit: 1 });
    }, intervalMs);

    return () => clearInterval(pollInterval);
  }

  /**
   * Get icon and color for notification type
   * @param {string} type - Notification type
   * @returns {Object} Icon and color info
   */
  getNotificationTypeInfo(type) {
    const typeMap = {
      deal_created: { icon: '🤝', color: '#4CAF50' },
      deal_accepted: { icon: '✅', color: '#4CAF50' },
      deal_completed: { icon: '🎉', color: '#4CAF50' },
      payment_received: { icon: '💰', color: '#2196F3' },
      deliverable_submitted: { icon: '📤', color: '#FF9800' },
      deliverable_approved: { icon: '✔️', color: '#4CAF50' },
      deliverable_rejected: { icon: '❌', color: '#F44336' },
      message_received: { icon: '💬', color: '#9C27B0' },
      checkin_reminder: { icon: '📍', color: '#FF9800' },
      content_scheduled: { icon: '📅', color: '#FF9800' },
      marketing_campaign_update: { icon: '📢', color: '#2196F3' },
      system_alert: { icon: '⚠️', color: '#FF5722' }
    };

    return typeMap[type] || { icon: '🔔', color: '#757575' };
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
      if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }
}

// Create and export singleton instance
const notificationService = new NotificationService();

export default notificationService;

// Export notification types as constants
export const NotificationTypes = {
  DEAL_CREATED: 'deal_created',
  DEAL_ACCEPTED: 'deal_accepted',
  DEAL_COMPLETED: 'deal_completed',
  PAYMENT_RECEIVED: 'payment_received',
  DELIVERABLE_SUBMITTED: 'deliverable_submitted',
  DELIVERABLE_APPROVED: 'deliverable_approved',
  DELIVERABLE_REJECTED: 'deliverable_rejected',
  MESSAGE_RECEIVED: 'message_received',
  CHECKIN_REMINDER: 'checkin_reminder',
  CONTENT_SCHEDULED: 'content_scheduled',
  MARKETING_CAMPAIGN_UPDATE: 'marketing_campaign_update',
  SYSTEM_ALERT: 'system_alert'
};
