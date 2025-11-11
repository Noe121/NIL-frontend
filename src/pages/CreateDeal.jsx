import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { dealService } from '../services/dealService.js';
import { featureFlags } from '../services/featureFlagService.js';
import { config } from '../utils/config.js';

export default function CreateDeal() {
  const location = useLocation();
  const templateData = location.state?.template;
  const workflowType = location.state?.workflowType;

  const [form, setForm] = useState({
    athlete_id: '',
    amount: '',
    hotspot_name: '',
    requirement: '',
    workflow_type: workflowType || '',
    template_id: templateData?.id || ''
  });
  const [loading, setLoading] = useState(false);
  const [complianceValidation, setComplianceValidation] = useState(null);
  const [showComplianceDialog, setShowComplianceDialog] = useState(false);

  // Get current user for compliance validation
  const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}');

  const validateDealCompliance = async () => {
    if (!currentUser.state || !currentUser.age || !currentUser.role) {
      return true; // Skip validation if user data is incomplete
    }

    try {
      const response = await fetch(`${config.apiUrl}/compliance/validate-deal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          state: currentUser.state,
          deal_type: 'traditional',
          deal_amount: parseFloat(form.amount),
          user_age: currentUser.age,
          user_type: currentUser.role,
          school_approved: false
        })
      });

      if (response.ok) {
        const result = await response.json();
        setComplianceValidation(result);
        return result.is_valid;
      }
    } catch (error) {
      console.error('Compliance validation failed:', error);
    }
    return true; // Allow deal creation if validation fails
  };

  // Populate form with template data
  useEffect(() => {
    if (templateData) {
      const contract = templateData.contract || {};
      const participants = templateData.participants || {};

      // Find athlete ID from participants
      const athlete = Object.values(participants).find(p => p.type === 'athlete' || p.type === 'student_athlete');
      const athleteId = athlete?.id || '';

      // Build requirements from deliverables
      let requirements = '';
      if (contract.deliverables && contract.deliverables.length > 0) {
        requirements = contract.deliverables.map(del => {
          let req = `${del.type.replace('_', ' ')}`;
          if (del.platform) req += ` on ${del.platform}`;
          if (del.due_date) req += ` by ${del.due_date}`;
          if (del.required_hashtags) req += ` with hashtags: ${del.required_hashtags.join(', ')}`;
          if (del.required_mentions) req += ` mentioning: ${del.required_mentions.join(', ')}`;
          return req;
        }).join('\n• ');
        requirements = `• ${requirements}`;
      }

      setForm({
        athlete_id: athleteId.toString(),
        amount: contract.compensation?.toString() || contract.compensation_per_athlete?.toString() || '',
        hotspot_name: contract.event_details?.location || 'NILBx Platform',
        requirement: requirements || `Complete deliverables for ${templateData.title}`,
        workflow_type: workflowType || templateData.type || '',
        template_id: templateData.id || ''
      });
    }
  }, [templateData, workflowType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate compliance first
      const isCompliant = await validateDealCompliance();
      if (!isCompliant) {
        setShowComplianceDialog(true);
        setLoading(false);
        return;
      }

      // Get current user ID from localStorage or context
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const sponsorId = userData.id || 1; // Default for demo

      const dealData = {
        ...form,
        sponsor_id: sponsorId,
        amount: parseFloat(form.amount),
        workflow_type: form.workflow_type,
        template_id: form.template_id,
        template_data: templateData // Include full template data for backend processing
      };

      const payment = await dealService.createDeal(dealData);

      // Redirect to Stripe checkout
      window.location.href = payment.checkout_url;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!featureFlags.isEnabled('enable_deal_creation')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-12 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-4">Deal Creation Unavailable</h2>
          <p className="text-gray-600">This feature is temporarily disabled. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {templateData ? `Create ${templateData.title}` : 'Create NIL Deal'}
          </h1>
          <p className="text-lg text-gray-600">
            {templateData
              ? `Using ${templateData.description} template`
              : 'Connect athletes with sponsors through Name, Image & Likeness opportunities'
            }
          </p>
        </div>

        {templateData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <h3 className="font-semibold text-blue-900">Template: {templateData.title}</h3>
              </div>
              <button
                onClick={() => {
                  setTemplateData(null);
                  // Reset form to empty state
                  setFormData({
                    athleteName: '',
                    athleteSport: '',
                    athleteSchool: '',
                    sponsorName: '',
                    sponsorCompany: '',
                    dealValue: '',
                    dealType: '',
                    dealDescription: '',
                    startDate: '',
                    endDate: '',
                    terms: '',
                    paymentSchedule: '',
                    deliverables: '',
                    exclusivity: '',
                    terminationClauses: '',
                    governingLaw: '',
                    signatures: ''
                  });
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear Template
              </button>
            </div>
            <p className="text-blue-800 text-sm">{templateData.description}</p>
            <div className="mt-2 text-xs text-blue-700">
              Workflow Type: {templateData.type.replace('_', ' ')}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Athlete ID
                </label>
                <input
                  name="athlete_id"
                  type="number"
                  placeholder="123"
                  value={form.athlete_id}
                  onChange={(e) => setForm({ ...form, athlete_id: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Amount ($)
                </label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="500.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotspot Name
              </label>
              <input
                name="hotspot_name"
                placeholder="Downtown Grill & Bar"
                value={form.hotspot_name}
                onChange={(e) => setForm({ ...form, hotspot_name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                name="requirement"
                placeholder="1 Instagram post per week + tag @NILBx + story highlight featuring the hotspot"
                value={form.requirement}
                onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Pay with Card → Create Deal'
              )}
            </button>

            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>💰 NILBx Service Fee: 9% (${(parseFloat(form.amount || 0) * 0.09).toFixed(2)})</p>
              <p>🏆 Athlete Receives: 91% (${(parseFloat(form.amount || 0) * 0.91).toFixed(2)})</p>
            </div>
          </form>
        </div>
      </div>

      {/* Compliance Validation Dialog */}
      {showComplianceDialog && complianceValidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Compliance Check Failed</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Deal cannot be created due to compliance issues:</p>
              
              {complianceValidation.errors && complianceValidation.errors.length > 0 && (
                <div className="mb-3">
                  <p className="font-medium text-red-700">Errors:</p>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {complianceValidation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {complianceValidation.warnings && complianceValidation.warnings.length > 0 && (
                <div className="mb-3">
                  <p className="font-medium text-yellow-700">Warnings:</p>
                  <ul className="list-disc list-inside text-sm text-yellow-600">
                    {complianceValidation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowComplianceDialog(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}