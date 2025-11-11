import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WORKFLOW_TEST_DATA, WORKFLOW_TYPES } from '../test-data/workflows.js';
import { toast } from 'react-toastify';

const WorkflowTemplates = ({ workflowType = 'all' }) => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter workflows based on type
  const getFilteredWorkflows = () => {
    const allWorkflows = Object.values(WORKFLOW_TEST_DATA);

    if (workflowType === 'athlete') {
      // Athlete workflows (exclude influencer-specific ones)
      return allWorkflows.filter(workflow =>
        !['influencer_content_creation', 'influencer_affiliate', 'influencer_ambassador',
          'influencer_event_activation', 'influencer_co_creation', 'influencer_marketplace_gig'].includes(workflow.type)
      );
    } else if (workflowType === 'influencer') {
      // Influencer workflows only
      return allWorkflows.filter(workflow =>
        ['influencer_content_creation', 'influencer_affiliate', 'influencer_ambassador',
         'influencer_event_activation', 'influencer_co_creation', 'influencer_marketplace_gig'].includes(workflow.type)
      );
    }

    return allWorkflows;
  };

  const workflowTemplates = getFilteredWorkflows();

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowDetails(true);
  };

  const handleCreateContract = (template) => {
    // Navigate to contract creation page with template data
    navigate('/create-deal', {
      state: {
        template: template,
        workflowType: template.type
      }
    });
    toast.success(`Starting ${template.title} contract creation`);
  };

  const getWorkflowIcon = (type) => {
    const icons = {
      brand_to_athlete: '🏆',
      brand_to_influencer: '📱',
      team_sponsorship: '👥',
      athlete_to_brand: '🎯',
      marketplace_open: '🛒',
      event_appearance: '🎪',
      brand_ambassador: '⭐',
      performance_based: '📈',
      content_licensing: '📄',
      multi_brand_campaign: '🔗',
      tiered_milestone: '🏔️',
      charity_cause: '❤️',
      // Influencer workflow icons
      influencer_content_creation: '🎨',
      influencer_affiliate: '💰',
      influencer_ambassador: '👑',
      influencer_event_activation: '🎉',
      influencer_co_creation: '🤝',
      influencer_marketplace_gig: '⚡'
    };
    return icons[type] || '📋';
  };

  const getWorkflowColor = (type) => {
    const colors = {
      brand_to_athlete: 'bg-blue-50 border-blue-200',
      brand_to_influencer: 'bg-purple-50 border-purple-200',
      team_sponsorship: 'bg-green-50 border-green-200',
      athlete_to_brand: 'bg-orange-50 border-orange-200',
      marketplace_open: 'bg-yellow-50 border-yellow-200',
      event_appearance: 'bg-pink-50 border-pink-200',
      brand_ambassador: 'bg-indigo-50 border-indigo-200',
      performance_based: 'bg-teal-50 border-teal-200',
      content_licensing: 'bg-gray-50 border-gray-200',
      multi_brand_campaign: 'bg-red-50 border-red-200',
      tiered_milestone: 'bg-cyan-50 border-cyan-200',
      charity_cause: 'bg-rose-50 border-rose-200',
      // Influencer workflow colors
      influencer_content_creation: 'bg-emerald-50 border-emerald-200',
      influencer_affiliate: 'bg-amber-50 border-amber-200',
      influencer_ambassador: 'bg-violet-50 border-violet-200',
      influencer_event_activation: 'bg-rose-50 border-rose-200',
      influencer_co_creation: 'bg-slate-50 border-slate-200',
      influencer_marketplace_gig: 'bg-lime-50 border-lime-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  if (showDetails && selectedTemplate) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getWorkflowIcon(selectedTemplate.type)}</span>
            <div>
              <h2 className="text-2xl font-bold">{selectedTemplate.title}</h2>
              <p className="text-gray-600">{selectedTemplate.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Participants */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Participants</h3>
            <div className="space-y-2">
              {Object.entries(selectedTemplate.participants).map(([key, participant]) => (
                <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <span className="font-medium capitalize">{key}:</span>
                  <span>{participant.name}</span>
                  {participant.type && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {participant.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contract Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contract Overview</h3>
            {selectedTemplate.contract && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Compensation:</span>
                  <span className="font-semibold">
                    ${selectedTemplate.contract.compensation?.toLocaleString() ||
                      selectedTemplate.contract.compensation_per_athlete?.toLocaleString() ||
                      'Variable'}
                  </span>
                </div>
                {selectedTemplate.contract.timeline && (
                  <div className="flex justify-between">
                    <span>Timeline:</span>
                    <span>{selectedTemplate.contract.timeline}</span>
                  </div>
                )}
                {selectedTemplate.contract.term && (
                  <div className="flex justify-between">
                    <span>Term:</span>
                    <span>{selectedTemplate.contract.term}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Deliverables Preview */}
        {selectedTemplate.contract?.deliverables && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Key Deliverables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedTemplate.contract.deliverables.slice(0, 4).map((deliverable, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                  <div className="font-medium capitalize">{deliverable.type?.replace('_', ' ') || 'Task'}</div>
                  {deliverable.platform && <div className="text-gray-600">Platform: {deliverable.platform}</div>}
                  {deliverable.due_date && <div className="text-gray-600">Due: {deliverable.due_date}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => setShowDetails(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Templates
          </button>
          <button
            onClick={() => handleCreateContract(selectedTemplate)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Create Contract from Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {workflowType === 'influencer' ? 'Influencer Workflow Templates' : 'Athlete Workflow Templates'}
        </h2>
        <p className="text-gray-600">
          {workflowType === 'influencer'
            ? 'Choose from our collection of influencer partnership templates for authentic brand storytelling and content creation.'
            : 'Choose from our comprehensive collection of NIL deal templates to quickly create contracts with athletes, influencers, and teams.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowTemplates.map((template) => (
          <div
            key={template.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-blue-300 ${getWorkflowColor(template.type)}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{getWorkflowIcon(template.type)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{template.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="capitalize font-medium">{template.type.replace('_', ' ')}</span>
              </div>

              {template.contract?.compensation && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Compensation:</span>
                  <span className="font-semibold text-green-600">
                    ${template.contract.compensation.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Participants:</span>
                <span className="font-medium">{Object.keys(template.participants).length}</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateContract(template);
                }}
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-gray-500">
        <p>Click on any template to view details, or click "Use Template" to start creating a contract.</p>
      </div>
    </div>
  );
};

export default WorkflowTemplates;