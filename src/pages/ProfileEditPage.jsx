import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { config } from '../utils/config.js';
import FileUpload from '../components/FileUpload.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function ProfileEditPage() {
  const { apiService } = useApi();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    // Role-specific fields
    sport: '',
    achievements: '',
    company: '',
    sponsorships: '',
    fanInterests: '',
    favoriteTeams: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/profile');
      setFormData(prev => ({
        ...prev,
        ...response
      }));
      setError('');
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (file) => {
    // Handle profile picture upload
    console.log('Profile picture uploaded:', file);
    // In a real implementation, you'd upload the file and get back a URL
    setFormData(prev => ({
      ...prev,
      profilePicture: URL.createObjectURL(file)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    // Add more validation as needed
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await apiService.put('/profile', formData);

      // Update the user context if needed
      updateUser({ ...user, name: formData.name, email: formData.email });

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (user?.role) {
      case 'athlete':
        return (
          <>
            <div>
              <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-1">
                Sport *
              </label>
              <select
                id="sport"
                name="sport"
                value={formData.sport}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Sport</option>
                <option value="basketball">Basketball</option>
                <option value="football">Football</option>
                <option value="soccer">Soccer</option>
                <option value="baseball">Baseball</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 mb-1">
                Achievements
              </label>
              <textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="List your achievements, awards, and accomplishments..."
              />
            </div>
          </>
        );

      case 'sponsor':
        return (
          <>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your company name"
                required
              />
            </div>

            <div>
              <label htmlFor="sponsorships" className="block text-sm font-medium text-gray-700 mb-1">
                Sponsorship Interests
              </label>
              <textarea
                id="sponsorships"
                name="sponsorships"
                value={formData.sponsorships}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe your sponsorship interests and target demographics..."
              />
            </div>
          </>
        );

      case 'fan':
        return (
          <>
            <div>
              <label htmlFor="fanInterests" className="block text-sm font-medium text-gray-700 mb-1">
                Fan Interests
              </label>
              <textarea
                id="fanInterests"
                name="fanInterests"
                value={formData.fanInterests}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="What sports/teams are you most passionate about?"
              />
            </div>

            <div>
              <label htmlFor="favoriteTeams" className="block text-sm font-medium text-gray-700 mb-1">
                Favorite Teams
              </label>
              <input
                type="text"
                id="favoriteTeams"
                name="favoriteTeams"
                value={formData.favoriteTeams}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your favorite teams (comma-separated)"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <FileUpload
                onFileSelect={handleFileUpload}
                accept="image/*"
              />
              {formData.profilePicture && (
                <div className="mt-2">
                  <img
                    src={formData.profilePicture}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Role-specific fields */}
            {renderRoleSpecificFields()}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="border border-gray-200 rounded p-4">
            <div className="flex items-center space-x-4">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {formData.name.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{formData.name || 'Your Name'}</h3>
                <p className="text-sm text-gray-600">{formData.email || 'your.email@example.com'}</p>
                {formData.bio && (
                  <p className="text-sm text-gray-700 mt-1">{formData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}