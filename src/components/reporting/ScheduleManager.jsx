import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Mail,
  Users,
  CalendarDays,
  Power,
  PowerOff,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { reportingService } from '../../services/reportingService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

/**
 * ScheduleManager - React Component
 *
 * Report schedule management with enable/disable, create, edit, and delete functionality
 * Material UI-inspired design with Tailwind CSS
 */

const ScheduleManager = () => {
  // State management
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState(null);

  // Create/Edit form state
  const [formData, setFormData] = useState({
    scheduleName: '',
    templateId: 1,
    frequency: 'WEEKLY',
    timeOfDay: '09:00',
    timezone: 'America/New_York',
    recipients: [''],
    deliveryMethod: 'email',
    isEnabled: true
  });

  // Schedule frequencies
  const frequencies = [
    { value: 'DAILY', label: 'Daily', icon: Calendar },
    { value: 'WEEKLY', label: 'Weekly', icon: CalendarDays },
    { value: 'MONTHLY', label: 'Monthly', icon: Calendar },
    { value: 'QUARTERLY', label: 'Quarterly', icon: Calendar },
    { value: 'YEARLY', label: 'Yearly', icon: Calendar }
  ];

  // Load schedules on mount
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const data = await reportingService.getUserSchedules(userId);
      setSchedules(data);
    } catch (err) {
      setError(err.message || 'Failed to load schedules');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggle schedule
  const handleToggleSchedule = async (schedule) => {
    try {
      await reportingService.updateSchedule(schedule.id, {
        isEnabled: !schedule.isEnabled
      });
      await loadSchedules();
    } catch (err) {
      setError(err.message || 'Failed to update schedule');
    }
  };

  // Handle create schedule
  const handleCreateSchedule = async () => {
    try {
      const userId = getUserId();
      await reportingService.createSchedule({
        ...formData,
        userId,
        recipients: formData.recipients.filter(r => r.trim() !== '')
      });
      setShowCreateDialog(false);
      resetForm();
      await loadSchedules();
    } catch (err) {
      setError(err.message || 'Failed to create schedule');
    }
  };

  // Handle delete schedule
  const handleDeleteSchedule = async () => {
    try {
      await reportingService.deleteSchedule(selectedSchedule.id);
      setShowDeleteDialog(false);
      setShowDetailDialog(false);
      setSelectedSchedule(null);
      await loadSchedules();
    } catch (err) {
      setError(err.message || 'Failed to delete schedule');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      scheduleName: '',
      templateId: 1,
      frequency: 'WEEKLY',
      timeOfDay: '09:00',
      timezone: 'America/New_York',
      recipients: [''],
      deliveryMethod: 'email',
      isEnabled: true
    });
  };

  // Add/Remove recipient
  const addRecipient = () => {
    setFormData({
      ...formData,
      recipients: [...formData.recipients, '']
    });
  };

  const removeRecipient = (index) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter((_, i) => i !== index)
    });
  };

  const updateRecipient = (index, value) => {
    const newRecipients = [...formData.recipients];
    newRecipients[index] = value;
    setFormData({
      ...formData,
      recipients: newRecipients
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report Schedules</h1>
              <p className="text-gray-600 mt-1">
                Manage automated report schedules
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={loadSchedules}
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
                Create Schedule
              </Button>
            </div>
          </div>
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

        {/* Schedules List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : schedules.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <CalendarDays className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Schedules Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create automated report schedules to receive reports regularly
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map(schedule => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onToggle={() => handleToggleSchedule(schedule)}
                onClick={() => {
                  setSelectedSchedule(schedule);
                  setShowDetailDialog(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Schedule Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Report Schedule</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Schedule Name
              </label>
              <Input
                type="text"
                placeholder="Monthly Revenue Report"
                value={formData.scheduleName}
                onChange={(e) => setFormData({ ...formData, scheduleName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Template
                </label>
                <Select
                  value={formData.templateId.toString()}
                  onValueChange={(val) => setFormData({ ...formData, templateId: parseInt(val) })}
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

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Frequency
                </label>
                <Select
                  value={formData.frequency}
                  onValueChange={(val) => setFormData({ ...formData, frequency: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Time of Day
                </label>
                <Input
                  type="time"
                  value={formData.timeOfDay}
                  onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Timezone
                </label>
                <Select
                  value={formData.timezone}
                  onValueChange={(val) => setFormData({ ...formData, timezone: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Recipients
              </label>
              <div className="space-y-2">
                {formData.recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={recipient}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.recipients.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRecipient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRecipient}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Recipient
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Enable Schedule</label>
                <p className="text-xs text-gray-600">
                  Start schedule immediately after creation
                </p>
              </div>
              <Switch
                checked={formData.isEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSchedule}
              disabled={
                !formData.scheduleName ||
                formData.recipients.filter(r => r.trim() !== '').length === 0
              }
            >
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Detail Dialog */}
      {selectedSchedule && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    <DetailRow label="Name" value={selectedSchedule.scheduleName} />
                    <DetailRow label="Frequency" value={selectedSchedule.frequency} />
                    <DetailRow label="Time" value={selectedSchedule.timeOfDay} />
                    <DetailRow label="Timezone" value={selectedSchedule.timezone} />
                    <DetailRow
                      label="Delivery Method"
                      value={selectedSchedule.deliveryMethod.toUpperCase()}
                    />
                    <DetailRow
                      label="Status"
                      value={
                        <Badge
                          className={
                            selectedSchedule.isEnabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {selectedSchedule.isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      }
                    />
                  </dl>
                </CardContent>
              </Card>

              {/* Recipients */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Recipients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedSchedule.recipients.map((recipient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <Mail className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{recipient}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Execution History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Execution History</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    <DetailRow label="Total Runs" value={selectedSchedule.runCount} />
                    <DetailRow label="Successful" value={selectedSchedule.successCount} />
                    <DetailRow label="Failed" value={selectedSchedule.failureCount} />
                    {selectedSchedule.lastRunAt && (
                      <DetailRow
                        label="Last Run"
                        value={formatDateTime(selectedSchedule.lastRunAt)}
                      />
                    )}
                    {selectedSchedule.nextRunAt && (
                      <DetailRow
                        label="Next Run"
                        value={formatDateTime(selectedSchedule.nextRunAt)}
                      />
                    )}
                  </dl>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(true);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button onClick={() => setShowDetailDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this schedule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Warning</h4>
                  <p className="text-sm text-red-700">
                    This will permanently delete the schedule and stop all future report generation.
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
              onClick={handleDeleteSchedule}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Schedule Card Component
const ScheduleCard = ({ schedule, onToggle, onClick }) => {
  const getFrequencyIcon = (frequency) => {
    const icons = {
      DAILY: Calendar,
      WEEKLY: CalendarDays,
      MONTHLY: Calendar,
      QUARTERLY: Calendar,
      YEARLY: Calendar
    };
    return icons[frequency] || Calendar;
  };

  const FrequencyIcon = getFrequencyIcon(schedule.frequency);

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-shadow ${
        !schedule.isEnabled ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`p-3 rounded-full ${
              schedule.isEnabled
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <FrequencyIcon className="h-6 w-6" />
          </div>

          {/* Schedule Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {schedule.scheduleName}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {schedule.frequency}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {schedule.timeOfDay}
              </span>
              <span>•</span>
              <span>{schedule.timezone}</span>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              {schedule.nextRunAt && (
                <div>Next run: {formatDateTime(schedule.nextRunAt)}</div>
              )}
              {schedule.runCount > 0 && (
                <div className="flex items-center gap-2">
                  <span>{schedule.runCount} total runs</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    {schedule.successCount}
                  </span>
                  {schedule.failureCount > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-3 w-3" />
                        {schedule.failureCount}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Toggle Switch */}
          <div onClick={(e) => e.stopPropagation()}>
            <Switch checked={schedule.isEnabled} onCheckedChange={onToggle} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Supporting Components
const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between">
    <dt className="text-sm font-medium text-gray-700">{label}</dt>
    <dd className="text-sm text-gray-900 text-right">{value}</dd>
  </div>
);

// Helper Functions
const getUserId = () => {
  // Replace with actual auth logic
  return 1;
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

export default ScheduleManager;
