/**
 * Template Gallery Component
 * Display and manage marketing material templates
 */
import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import TemplateUploadModal from './TemplateUploadModal';
import { marketingMaterialsService } from '../../services/marketingMaterialsService';

const TemplateGallery = ({ companyId, templates, onTemplateUploaded }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await marketingMaterialsService.deleteTemplate(templateId);
      onTemplateUploaded(); // Refresh list
    } catch (error) {
      alert('Failed to delete template: ' + error.message);
    }
  };

  const handleDeactivateTemplate = async (templateId) => {
    try {
      await marketingMaterialsService.deactivateTemplate(templateId);
      onTemplateUploaded(); // Refresh list
    } catch (error) {
      alert('Failed to deactivate template: ' + error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Library</h2>
          <p className="text-gray-600 mt-1">
            Upload and manage reusable marketing material templates
          </p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          variant="primary"
          size="lg"
        >
          + Upload New Template
        </Button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No templates yet
          </h3>
          <p className="text-gray-500 mb-6">
            Upload your first marketing template to get started
          </p>
          <Button onClick={() => setShowUploadModal(true)} variant="primary">
            Upload Template
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Template Preview */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                {template.design_file_url ? (
                  <img
                    src={template.design_file_url}
                    alt={template.template_name}
                    className="max-h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.template_name}</h3>
                  {template.is_active ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p className="capitalize">{template.material_type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Provider: {template.provider.charAt(0).toUpperCase() + template.provider.slice(1)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setSelectedTemplate(template)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleDeactivateTemplate(template.id)}
                    variant="ghost"
                    size="sm"
                  >
                    {template.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteTemplate(template.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <TemplateUploadModal
          companyId={companyId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            onTemplateUploaded();
          }}
        />
      )}

      {/* Template Details Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedTemplate.template_name}</h2>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Preview */}
              {selectedTemplate.design_file_url && (
                <div className="mb-4">
                  <img
                    src={selectedTemplate.design_file_url}
                    alt={selectedTemplate.template_name}
                    className="w-full rounded border"
                  />
                </div>
              )}

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Material Type</p>
                  <p className="font-medium capitalize">
                    {selectedTemplate.material_type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium capitalize">{selectedTemplate.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Provider Template ID</p>
                  <p className="font-mono text-sm">{selectedTemplate.provider_template_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(selectedTemplate.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Button
                  onClick={() => setSelectedTemplate(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <a
                  href={selectedTemplate.design_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="primary" className="w-full">
                    Download Template
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
