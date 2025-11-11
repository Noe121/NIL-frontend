import React from 'react';
import { CheckCircle, Circle, Clock, XCircle, AlertCircle, FileText, UserPlus, Edit, Send, Shield, Check, DollarSign, FileCheck, RefreshCw } from 'lucide-react';

/**
 * NILContractWorkflow Component
 *
 * Displays the step-by-step NIL contract workflow for student-athletes
 * Based on NCAA compliance requirements and standard NIL deal processes
 *
 * Workflow Steps:
 * 1. Opportunity Identified
 * 2. Advisor Hired (Optional)
 * 3. Contract Negotiation
 * 4. Compliance Disclosure
 * 5. Compliance Review
 * 6. Compliance Approved/Rejected
 * 7. Contract Signed
 * 8. Platform Upload (Opendorse/INFLCR)
 * 9. Services Execution
 * 10. Payment Processing
 * 11. Annual Reporting (1099)
 * 12. Renewal Disclosure
 *
 * @param {Object} deal - Deal data with workflow information
 * @param {Array} workflowHistory - Array of workflow step history
 * @param {boolean} compact - Show compact version
 */
export default function NILContractWorkflow({ deal, workflowHistory = [], compact = false }) {
  const workflowSteps = [
    {
      key: 'opportunity_identified',
      label: 'Opportunity Identified',
      description: 'NIL deal opportunity found via platform, agent, or direct outreach',
      icon: FileText,
      optional: false
    },
    {
      key: 'advisor_hired',
      label: 'Advisor/Agent Hired',
      description: 'Optional: Engage certified NIL advisor (3-5% commission)',
      icon: UserPlus,
      optional: true
    },
    {
      key: 'contract_negotiation',
      label: 'Contract Negotiation',
      description: 'Negotiate terms, services, compensation, and deliverables',
      icon: Edit,
      optional: false
    },
    {
      key: 'compliance_disclosure',
      label: 'School Disclosure',
      description: 'Disclose deal to school compliance office (required within 30 days)',
      icon: Send,
      optional: false
    },
    {
      key: 'compliance_review',
      label: 'Compliance Review',
      description: 'School compliance office reviews for NCAA violations',
      icon: Shield,
      optional: false
    },
    {
      key: 'compliance_approved',
      label: 'Compliance Approved',
      description: 'School approves deal; athlete can proceed',
      icon: Check,
      optional: false,
      successStep: true
    },
    {
      key: 'contract_signed',
      label: 'Contract Signed',
      description: 'Both parties sign the NIL agreement',
      icon: FileCheck,
      optional: false
    },
    {
      key: 'platform_upload',
      label: 'Platform Upload',
      description: 'Upload signed contract to tracking platform (Opendorse, INFLCR)',
      icon: FileCheck,
      optional: false
    },
    {
      key: 'services_execution',
      label: 'Perform Services',
      description: 'Athlete completes required deliverables (posts, appearances, etc.)',
      icon: CheckCircle,
      optional: false
    },
    {
      key: 'payment_processing',
      label: 'Payment Disbursed',
      description: 'Athlete receives payment (minus platform/agent fees)',
      icon: DollarSign,
      optional: false
    },
    {
      key: 'annual_reporting',
      label: 'Tax Reporting',
      description: 'File 1099 tax form if earnings exceed $600',
      icon: FileText,
      optional: false
    },
    {
      key: 'renewal_disclosure',
      label: 'Renewal/Update',
      description: 'Re-disclose if deal is renewed or modified',
      icon: RefreshCw,
      optional: true
    }
  ];

  const getStepStatus = (stepKey) => {
    if (!deal) return 'pending';

    const historyItem = workflowHistory.find(h => h.workflow_step === stepKey);
    if (historyItem) {
      return historyItem.status;
    }

    // Check if current step
    if (deal.current_workflow_step === stepKey) {
      return 'in_progress';
    }

    // Check if step is before current step (completed)
    const currentIndex = workflowSteps.findIndex(s => s.key === deal.current_workflow_step);
    const stepIndex = workflowSteps.findIndex(s => s.key === stepKey);

    if (currentIndex > stepIndex) {
      return 'completed';
    }

    // Special case: compliance_rejected
    if (stepKey === 'compliance_rejected' && deal.current_workflow_step === 'compliance_rejected') {
      return 'failed';
    }

    return 'pending';
  };

  const getStepIcon = (step, status) => {
    const Icon = step.icon;

    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (status === 'in_progress') {
      return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
    }
    if (status === 'failed') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (status === 'skipped') {
      return <Circle className="w-5 h-5 text-gray-300" />;
    }

    return <Icon className="w-5 h-5 text-gray-400" />;
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'skipped':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getProgressPercentage = () => {
    const totalSteps = workflowSteps.filter(s => !s.optional).length;
    const completedSteps = workflowSteps.filter(s => {
      if (s.optional) return false;
      return getStepStatus(s.key) === 'completed';
    }).length;

    return Math.round((completedSteps / totalSteps) * 100);
  };

  if (!deal) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600">No active deal workflow</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900">Workflow Progress</h4>
          <span className="text-sm font-medium text-gray-600">{getProgressPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          Current Step: {workflowSteps.find(s => s.key === deal.current_workflow_step)?.label || 'Unknown'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">NIL Contract Workflow</h3>
          <p className="text-sm text-gray-500 mt-1">Track your deal from opportunity to payment</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{getProgressPercentage()}%</div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Workflow Steps */}
      <div className="space-y-3">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(step.key);
          const historyItem = workflowHistory.find(h => h.workflow_step === step.key);

          return (
            <div
              key={step.key}
              className={`relative border rounded-lg p-4 transition-all ${getStepColor(status)} ${
                status === 'in_progress' ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
              }`}
            >
              {/* Connector Line */}
              {index < workflowSteps.length - 1 && (
                <div className="absolute left-6 top-full w-0.5 h-3 bg-gray-200" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getStepIcon(step, status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">{step.label}</h4>
                      {step.optional && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          Optional
                        </span>
                      )}
                    </div>
                    {status === 'completed' && historyItem?.completed_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(historyItem.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mb-2">{step.description}</p>

                  {/* Additional Info from History */}
                  {historyItem && historyItem.notes && (
                    <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                      <p className="text-xs text-gray-700">{historyItem.notes}</p>
                    </div>
                  )}

                  {/* Time to Complete */}
                  {historyItem?.days_to_complete && status === 'completed' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Completed in {historyItem.days_to_complete} {historyItem.days_to_complete === 1 ? 'day' : 'days'}
                    </p>
                  )}

                  {/* Document Link */}
                  {historyItem?.document_url && (
                    <a
                      href={historyItem.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
                    >
                      <FileText className="w-3 h-3" />
                      View Document
                    </a>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'completed' ? 'bg-green-100 text-green-800' :
                    status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    status === 'failed' ? 'bg-red-100 text-red-800' :
                    status === 'skipped' ? 'bg-gray-100 text-gray-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {status === 'in_progress' ? 'In Progress' :
                     status === 'completed' ? 'Done' :
                     status === 'failed' ? 'Failed' :
                     status === 'skipped' ? 'Skipped' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Rejected Special Case */}
      {deal.current_workflow_step === 'compliance_rejected' && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-red-900">Compliance Rejected</h4>
              <p className="text-xs text-red-700 mt-1">
                Your deal was not approved by the school compliance office. Please review feedback and make necessary modifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Metadata */}
      {deal.workflow_started_at && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Started:</span>
              <span className="ml-2">{new Date(deal.workflow_started_at).toLocaleDateString()}</span>
            </div>
            {deal.workflow_completed_at && (
              <div>
                <span className="font-medium">Completed:</span>
                <span className="ml-2">{new Date(deal.workflow_completed_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
