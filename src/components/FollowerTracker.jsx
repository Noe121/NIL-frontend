import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const FollowerTracker = ({ currentFollowers, currentTier, onUpdateFollowers }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newFollowerCount, setNewFollowerCount] = useState(currentFollowers);
  const [isLoading, setIsLoading] = useState(false);

  const tierThresholds = {
    starter: { min: 500, max: 999, next: 1000 },
    standard: { min: 1000, max: 4999, next: 5000 },
    professional: { min: 5000, max: 24999, next: 25000 },
    elite: { min: 25000, max: 99999, next: 100000 },
    mega: { min: 100000, max: Infinity }
  };

  const currentThreshold = tierThresholds[currentTier] || tierThresholds.starter;
  const followersToNextTier = currentThreshold.next ? currentThreshold.next - currentFollowers : 0;
  const progressPercentage = Math.min(
    ((currentFollowers - currentThreshold.min) / (currentThreshold.max - currentThreshold.min)) * 100,
    100
  );

  const handleUpdateFollowers = async () => {
    if (newFollowerCount < 500) {
      alert('Minimum 500 followers required');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateFollowers(newFollowerCount);
      setShowUpdateForm(false);
    } catch (error) {
      alert('Failed to update followers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Followers</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {currentFollowers.toLocaleString()}
          </p>
        </div>
        <TrendingUp className="w-12 h-12 text-blue-400 opacity-30" />
      </div>

      {/* Progress to next tier */}
      {followersToNextTier > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress to next tier</span>
            <span className="text-sm font-semibold text-blue-600">
              {followersToNextTier.toLocaleString()} more needed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Current progress: {Math.round(progressPercentage)}% through {currentTier} tier
          </p>
        </div>
      )}

      {followersToNextTier === 0 && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            🎉 You're at the max tier! Keep growing to maintain your status.
          </p>
        </div>
      )}

      {/* Update followers button */}
      <button
        onClick={() => setShowUpdateForm(!showUpdateForm)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {showUpdateForm ? 'Cancel' : 'Update Follower Count'}
      </button>

      {/* Update form */}
      {showUpdateForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Follower Count
          </label>
          <input
            type="number"
            value={newFollowerCount}
            onChange={(e) => setNewFollowerCount(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="Enter follower count"
          />

          {newFollowerCount < 500 && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Minimum 500 followers required for monetization
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleUpdateFollowers}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={() => setShowUpdateForm(false)}
              className="flex-1 py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowerTracker;
