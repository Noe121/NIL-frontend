import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle, Camera, MapPin, Upload } from 'lucide-react';

/**
 * Deliverable Checklist Component
 * Displays and manages campaign deliverables for influencers
 */
const DeliverableChecklist = ({ dealId }) => {
  const [deliverables, setDeliverables] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dealId) {
      fetchDeliverables();
      fetchProgress();
    }
  }, [dealId]);

  const fetchDeliverables = async () => {
    try {
      const response = await fetch(`http://localhost:8007/api/deliverables/campaigns/${dealId}`);
      if (!response.ok) throw new Error('Failed to fetch deliverables');
      const data = await response.json();
      setDeliverables(data.deliverables || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch(`http://localhost:8007/api/deliverables/campaigns/${dealId}/progress`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data = await response.json();
      setProgress(data);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <Check className="w-6 h-6 text-green-500" />;
      case 'under_review':
      case 'uploaded':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'border-green-500';
      case 'under_review':
      case 'uploaded':
        return 'border-yellow-500';
      case 'rejected':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  const getDeliverableIcon = (typeName) => {
    switch (typeName) {
      case 'location_checkin':
        return <MapPin className="w-5 h-5" />;
      case 'photo_upload':
      case 'video_upload':
        return <Camera className="w-5 h-5" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading deliverables: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {progress && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Campaign Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress.completion_percentage || 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>
              {progress.completed}/{progress.total_deliverables} completed
            </span>
            <span className="font-semibold text-green-600">
              {progress.payout_earned}% payout earned
            </span>
          </div>
        </div>
      )}

      {/* Deliverable List */}
      <div className="space-y-4">
        {deliverables.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            No deliverables found for this campaign
          </div>
        ) : (
          deliverables.map((deliverable) => (
            <DeliverableCard
              key={deliverable.id}
              deliverable={deliverable}
              onUpdate={fetchDeliverables}
            />
          ))
        )}
      </div>
    </div>
  );
};

const DeliverableCard = ({ deliverable, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', color: 'bg-gray-100 text-gray-700' },
      uploaded: { text: 'Uploaded', color: 'bg-blue-100 text-blue-700' },
      under_review: { text: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
      approved: { text: 'Approved', color: 'bg-green-100 text-green-700' },
      rejected: { text: 'Rejected', color: 'bg-red-100 text-red-700' },
      revision_requested: { text: 'Revision Needed', color: 'bg-orange-100 text-orange-700' },
    };

    const badge = badges[deliverable.submission_status] || badges.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getDeliverableIcon = (typeName) => {
    switch (typeName) {
      case 'location_checkin':
        return <MapPin className="w-5 h-5 text-blue-600" />;
      case 'photo_upload':
      case 'video_upload':
        return <Camera className="w-5 h-5 text-purple-600" />;
      default:
        return <Upload className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <>
      <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${getStatusColor(deliverable.submission_status)}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Icon */}
            <div className="flex-shrink-0">
              {getDeliverableIcon(deliverable.type_name)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">{deliverable.title}</h4>
              {deliverable.description && (
                <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
              )}

              {/* Status Badge */}
              <div className="mt-2">{getStatusBadge(deliverable.submission_status)}</div>

              {/* Requirements */}
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                {deliverable.location_name && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location: {deliverable.location_name}</span>
                  </div>
                )}
                {deliverable.deadline && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Due: {new Date(deliverable.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payout & Action */}
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-green-600">
              {deliverable.payout_percentage}%
            </div>
            <p className="text-xs text-gray-500">of payout</p>

            {(!deliverable.submission_status ||
              deliverable.submission_status === 'pending' ||
              deliverable.submission_status === 'rejected' ||
              deliverable.submission_status === 'revision_requested') && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                {deliverable.submission_status === 'revision_requested' ? 'Resubmit' : 'Complete'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <DeliverableUploadModal
          deliverable={deliverable}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
};

const DeliverableUploadModal = ({ deliverable, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    location_lat: '',
    location_lng: '',
    social_post_url: '',
    submission_notes: '',
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Submit deliverable
      const response = await fetch(`http://localhost:8007/api/deliverables/${deliverable.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_deliverable_id: deliverable.id,
          influencer_id: 1, // TODO: Get from auth context
          location_lat: formData.location_lat ? parseFloat(formData.location_lat) : null,
          location_lng: formData.location_lng ? parseFloat(formData.location_lng) : null,
          social_post_url: formData.social_post_url || null,
          submission_notes: formData.submission_notes || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit deliverable');

      const result = await response.json();

      // Upload media files if any
      if (files.length > 0 && result.submission_id) {
        await uploadMedia(result.submission_id);
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadMedia = async (submissionId) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('deliverable_submission_id', submissionId);

    await fetch('http://localhost:8008/api/media/upload-multiple', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{deliverable.title}</h2>
          <p className="text-gray-600 mt-1">Complete this deliverable</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Location Fields */}
          {deliverable.requires_location && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData.location_lat}
                  onChange={(e) => setFormData({ ...formData, location_lat: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={deliverable.requires_location}
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData.location_lng}
                  onChange={(e) => setFormData({ ...formData, location_lng: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={deliverable.requires_location}
                />
              </div>
            </div>
          )}

          {/* Media Upload */}
          {deliverable.requires_media && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Upload Media {deliverable.media_requirements?.min_photos &&
                  `(Min ${deliverable.media_requirements.min_photos} photos)`}
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required={deliverable.requires_media}
              />
              {files.length > 0 && (
                <p className="text-sm text-gray-600">{files.length} file(s) selected</p>
              )}
            </div>
          )}

          {/* Social Post URL */}
          {deliverable.requires_social_link && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Social Media Post URL
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/p/..."
                value={formData.social_post_url}
                onChange={(e) => setFormData({ ...formData, social_post_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={deliverable.requires_social_link}
              />
              {deliverable.required_hashtags && deliverable.required_hashtags.length > 0 && (
                <p className="text-sm text-gray-500">
                  Required hashtags: {deliverable.required_hashtags.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Add any notes about your submission..."
              value={formData.submission_notes}
              onChange={(e) => setFormData({ ...formData, submission_notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliverableChecklist;
