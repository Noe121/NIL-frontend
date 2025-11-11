/**
 * NotificationsPanel.jsx
 * NILBx - Notifications UI Component
 *
 * Displays notification history with Material-UI design
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Handshake,
  CheckCircle,
  AttachMoney,
  Send,
  Done,
  Message,
  LocationOn,
  Schedule,
  Campaign
} from '@mui/icons-material';
import notificationService from '../services/notificationService';

const NotificationsPanel = ({ userId, open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);

  // Load notifications when panel opens
  useEffect(() => {
    if (open && userId) {
      loadNotifications();
    }
  }, [open, userId]);

  // Subscribe to unread count changes
  useEffect(() => {
    const unsubscribe = notificationService.onUnreadCountChange((count) => {
      setUnreadCount(count);
    });

    return unsubscribe;
  }, []);

  // Start polling for new notifications
  useEffect(() => {
    if (userId) {
      const stopPolling = notificationService.startPolling(userId, 30000); // Poll every 30 seconds
      return stopPolling;
    }
  }, [userId]);

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);

    const result = await notificationService.getNotificationHistory(userId, {
      limit: 100
    });

    if (result.success) {
      setNotifications(result.data.notifications);
      setUnreadCount(result.data.unread_count);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    await notificationService.markAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(userId);
    loadNotifications();
  };

  const getIconForType = (type) => {
    const iconMap = {
      deal_created: <Handshake />,
      deal_accepted: <CheckCircle />,
      deal_completed: <CheckCircle />,
      payment_received: <AttachMoney />,
      deliverable_submitted: <Send />,
      deliverable_approved: <Done />,
      deliverable_rejected: <CloseIcon />,
      message_received: <Message />,
      checkin_reminder: <LocationOn />,
      content_scheduled: <Schedule />,
      marketing_campaign_update: <Campaign />,
    };

    return iconMap[type] || <NotificationsIcon />;
  };

  const getColorForType = (type) => {
    const colorMap = {
      deal_created: '#4CAF50',
      deal_accepted: '#4CAF50',
      deal_completed: '#4CAF50',
      payment_received: '#2196F3',
      deliverable_submitted: '#FF9800',
      deliverable_approved: '#4CAF50',
      deliverable_rejected: '#F44336',
      message_received: '#9C27B0',
      checkin_reminder: '#FF9800',
      content_scheduled: '#FF9800',
      marketing_campaign_update: '#2196F3',
    };

    return colorMap[type] || '#757575';
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">Notifications</Typography>
                {unreadCount > 0 && (
                  <Typography variant="caption" color="primary">
                    {unreadCount} unread
                  </Typography>
                )}
              </Box>
              <Box>
                <IconButton onClick={() => setShowPreferences(true)} size="small">
                  <SettingsIcon />
                </IconButton>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{ mt: 1 }}
              >
                Mark All as Read
              </Button>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {isLoading && notifications.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ p: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
                <Button onClick={loadNotifications} variant="outlined">
                  Retry
                </Button>
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <NotificationsNone sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No notifications yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You'll see updates about deals, payments, and deliverables here
                </Typography>
              </Box>
            ) : (
              <List>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      disablePadding
                      sx={{
                        bgcolor: notification.read_at ? 'transparent' : 'action.hover'
                      }}
                    >
                      <ListItemButton
                        onClick={() => {
                          if (!notification.read_at) {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: getColorForType(notification.notification_type) + '20',
                              color: getColorForType(notification.notification_type)
                            }}
                          >
                            {getIconForType(notification.notification_type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: notification.read_at ? 'normal' : 'bold',
                                  flex: 1
                                }}
                              >
                                {notification.title}
                              </Typography>
                              {!notification.read_at && (
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    ml: 1
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: 'block', mb: 0.5 }}
                              >
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {notificationService.formatDate(notification.created_at)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Preferences Dialog */}
      {showPreferences && (
        <NotificationPreferencesDialog
          userId={userId}
          open={showPreferences}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </>
  );
};

const NotificationPreferencesDialog = ({ userId, open, onClose }) => {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [dealNotifications, setDealNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [deliverableNotifications, setDeliverableNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(true);

  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open]);

  const loadPreferences = async () => {
    setIsLoading(true);
    setError(null);

    const result = await notificationService.getNotificationPreferences(userId);

    if (result.success) {
      const prefs = result.data;
      setPreferences(prefs);
      setEmailEnabled(prefs.email_notifications);
      setPushEnabled(prefs.push_notifications);
      setSmsEnabled(prefs.sms_notifications);

      const types = prefs.notification_types || {};
      setDealNotifications(types.deal_updates !== false);
      setPaymentNotifications(types.payment_updates !== false);
      setDeliverableNotifications(types.deliverable_updates !== false);
      setMessageNotifications(types.messages !== false);
      setMarketingNotifications(types.marketing_updates !== false);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const result = await notificationService.updateNotificationPreferences(userId, {
      emailNotifications: emailEnabled,
      pushNotifications: pushEnabled,
      smsNotifications: smsEnabled,
      notificationTypes: {
        deal_updates: dealNotifications,
        payment_updates: paymentNotifications,
        deliverable_updates: deliverableNotifications,
        messages: messageNotifications,
        marketing_updates: marketingNotifications
      }
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }

    setIsSaving(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Notification Settings</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Delivery Methods
            </Typography>
            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />}
                label="Email Notifications"
              />
              <FormControlLabel
                control={<Switch checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />}
                label="Push Notifications"
              />
              <FormControlLabel
                control={<Switch checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} />}
                label="SMS Notifications"
              />
            </FormGroup>

            <Typography variant="subtitle2" gutterBottom>
              Notification Types
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={dealNotifications} onChange={(e) => setDealNotifications(e.target.checked)} />}
                label="Deal Updates"
              />
              <FormControlLabel
                control={<Switch checked={paymentNotifications} onChange={(e) => setPaymentNotifications(e.target.checked)} />}
                label="Payment Updates"
              />
              <FormControlLabel
                control={<Switch checked={deliverableNotifications} onChange={(e) => setDeliverableNotifications(e.target.checked)} />}
                label="Deliverable Updates"
              />
              <FormControlLabel
                control={<Switch checked={messageNotifications} onChange={(e) => setMessageNotifications(e.target.checked)} />}
                label="Messages"
              />
              <FormControlLabel
                control={<Switch checked={marketingNotifications} onChange={(e) => setMarketingNotifications(e.target.checked)} />}
                label="Marketing Updates"
              />
            </FormGroup>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaving || isLoading}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Export notification icon button component for easy use in navbar
export const NotificationIconButton = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = notificationService.onUnreadCountChange((count) => {
      setUnreadCount(count);
    });

    // Initial load
    if (userId) {
      notificationService.getNotificationHistory(userId, { limit: 1 });
    }

    return unsubscribe;
  }, [userId]);

  // Request notification permission on first render
  useEffect(() => {
    notificationService.requestPermission();
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <NotificationsPanel
        userId={userId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default NotificationsPanel;
