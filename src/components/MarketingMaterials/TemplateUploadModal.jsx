/**
 * Template Upload Modal Component
 */
import React, { useState } from 'react';
import { Button } from '../Button';
import { marketingMaterialsService } from '../../services/marketingMaterialsService';

const TemplateUploadModal = ({ companyId, onClose, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    template_name: '',
    material_type: 'postcard',
    provider: 'vistaprint',
    design_file: null
  });

  const handleFileChange = (e) => {
    setFormData({ ...formData, design_file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const data = new FormData();
      data.append('company_id', companyId);
      data.append('template_name', formData.template_name);
      data.append('material_type', formData.material_type);
      data.append('provider', formData.provider);
      data.append('design_file', formData.design_file);

      await marketingMaterialsService.uploadTemplate(companyId, data);
      onSuccess();
    } catch (error) {
      alert('Failed to upload template: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-2xl font-bold mb-4">Upload New Template</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                required
                value={formData.template_name}
                onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Welcome Kit Postcard"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Type
              </label>
              <select
                required
                value={formData.material_type}
                onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="postcard">Postcard</option>
                <option value="flyer">Flyer</option>
                <option value="business_card">Business Card</option>
                <option value="brochure">Brochure</option>
                <option value="banner">Banner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider
              </label>
              <select
                required
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="vistaprint">Vistaprint</option>
                <option value="staples">Staples</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design File (PDF, PNG, JPG)
              </label>
              <input
                type="file"
                required
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateUploadModal;
