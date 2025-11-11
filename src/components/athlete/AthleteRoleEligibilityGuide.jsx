import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * AthleteRoleEligibilityGuide Component
 *
 * Displays comprehensive eligibility information for different student-athlete roles
 * Based on NCAA 2024-2025 rules, House v. NCAA settlement, and state NIL laws
 *
 * Shows:
 * - 13+ student-athlete role types
 * - NIL deal viability for each role
 * - Contract workflow requirements
 * - Restrictions and special considerations
 */
export default function AthleteRoleEligibilityGuide({ currentRole, compact = false }) {
  const [expandedRole, setExpandedRole] = useState(currentRole || null);

  const athleteRoles = [
    {
      key: 'prospective',
      label: 'Prospective Student-Athlete/Recruit',
      subtitle: 'Pre-enrollment, no written commitment',
      nilAllowed: true,
      marketability: 'High for blue-chip recruits',
      restrictions: [
        'Cannot use school marks/logos until enrolled',
        'No school involvement in deals',
        'State laws may require disclosure if deal influences school choice'
      ],
      workflowNotes: [
        'Disclose all pre-existing deals within 30 days of enrollment',
        'No NCAA certification needed for agents pre-enrollment',
        'Platform upload (Opendorse) required upon enrollment'
      ],
      valuationRange: '$500K - $2M+ for 5-star recruits'
    },
    {
      key: 'verbally_committed',
      label: 'Verbally Committed Recruit',
      subtitle: 'Non-binding oral pledge to a school',
      nilAllowed: true,
      marketability: 'Peak marketability; valuations spike post-verbal commitment',
      restrictions: [
        'Deals cannot be inducements (prohibited pay-for-play)',
        'School-affiliated collective offering money pre-NLI violates NCAA rules',
        'Must avoid conflicts with future school'
      ],
      workflowNotes: [
        'Informal consultation with verbal school (recommended)',
        'Same workflow as prospective recruit',
        'High-profile verbals can command $1M+ deals'
      ],
      valuationRange: '$1M+ for top football/basketball recruits'
    },
    {
      key: 'signed_committed',
      label: 'Signed/Committed (via NLI)',
      subtitle: 'National Letter of Intent signed',
      nilAllowed: true,
      marketability: 'Strong; NLI signing events often include NIL announcements',
      restrictions: [
        'NLI includes NIL disclosure clause',
        'Deals must not conflict with scholarship terms',
        'Recruiting period has ended'
      ],
      workflowNotes: [
        'School provides NIL policy packet post-NLI',
        'Disclose intended deals to compliance pre-signing if >$500',
        'Contract review by school advised',
        'Report within 14-30 days of enrollment'
      ],
      valuationRange: 'Varies by sport and profile'
    },
    {
      key: 'enrolled_student_athlete',
      label: 'Enrolled Student-Athlete (General)',
      subtitle: 'Full-time student + team member',
      nilAllowed: true,
      marketability: 'Varies by sport and follower count',
      restrictions: [
        'Must maintain eligibility (2.0 GPA, progress-toward-degree)',
        'No class conflicts with NIL activities',
        'Cannot represent school during official team activities without approval'
      ],
      workflowNotes: [
        'Standard workflow: Opportunity → Disclosure → Review → Approval → Sign → Upload',
        'Compliance checks take 1-3 days',
        'Agent fees capped at 3-5% for NIL-only representation'
      ],
      valuationRange: '$0 - $3.5M+ (LSU\'s Livvy Dunne example)'
    },
    {
      key: 'scholarship_athlete',
      label: 'Scholarship Athlete',
      subtitle: 'Receives athletically related aid',
      nilAllowed: true,
      marketability: 'High; visibility from starting roles',
      restrictions: [
        'NIL cannot replace or supplement scholarship (no double-dipping)',
        'Must report all NIL earnings',
        'Cannot lose scholarship due to NIL activity'
      ],
      workflowNotes: [
        'Standard workflow plus scholarship agreement addendum',
        'NIL income is independent of athletic aid',
        'Examples: Alabama QB with $2M+ NIL on full scholarship'
      ],
      valuationRange: '$0 - $2M+ depending on visibility'
    },
    {
      key: 'walk_on',
      label: 'Walk-On (Preferred or Unrecruited)',
      subtitle: 'No athletic aid; roster spot via tryout',
      nilAllowed: true,
      marketability: 'Lower unless viral content (TikTok walk-on kickers, etc.)',
      restrictions: [
        'Same eligibility rules as scholarship athletes',
        'No aid means higher financial need scrutiny',
        'Must maintain academic eligibility'
      ],
      workflowNotes: [
        'Standard workflow',
        'Many use micro-deals (<$5K) via campus platforms',
        'Local deals often fund expenses'
      ],
      valuationRange: '$0 - $50K typical; viral moments higher'
    },
    {
      key: 'qualifier',
      label: 'Qualifier',
      subtitle: 'Meets initial eligibility (GPA/core courses/test scores)',
      nilAllowed: true,
      marketability: 'Immediate eligibility; full NIL access',
      restrictions: [
        'Standard NCAA eligibility requirements',
        'Must maintain progress toward degree'
      ],
      workflowNotes: [
        'NIL deals allowed from Day 1',
        'No delays in deal approval',
        'Full practice and competition eligibility'
      ],
      valuationRange: 'Same as enrolled student-athlete'
    },
    {
      key: 'nonqualifier',
      label: 'Nonqualifier/Academic Redshirt',
      subtitle: 'Partial eligibility; practice only Year 1',
      nilAllowed: true,
      marketability: 'Moderate; focus on development content',
      restrictions: [
        'Cannot compete Year 1 (practice only)',
        'Academic probation may limit time for NIL activities',
        'Must improve academic standing'
      ],
      workflowNotes: [
        'NIL allowed even during redshirt year',
        'Example: LSU\'s Flau\'jae Johnson earned $1M+ as freshman redshirt',
        'Disclose academic improvement plan to compliance'
      ],
      valuationRange: '$0 - $1M+ for high-profile redshirts'
    },
    {
      key: 'transfer_portal_entry',
      label: 'Transfer Portal Entry',
      subtitle: 'In database; explorable by other schools',
      nilAllowed: true,
      marketability: 'High volatility; portal stars retain value',
      restrictions: [
        'Cannot represent current school during portal period',
        'Current school deals pause automatically',
        'No new deals using current school IP',
        'Collectives may court with future promises (legal post-2024)'
      ],
      workflowNotes: [
        'Enter portal → auto-notification to compliance',
        'Pause active contracts (addendum required)',
        'New deals: Disclose to both schools if overlapping',
        'Exit portal: Resume/renegotiate existing deals'
      ],
      valuationRange: 'Maintained for proven players (Travis Hunter example)'
    },
    {
      key: 'transfer_student_athlete',
      label: 'Transfer Student-Athlete',
      subtitle: 'Enrolled at new school',
      nilAllowed: true,
      marketability: 'Proven stats boost value; \"portal NIL\" tracked by On3',
      restrictions: [
        '30-day dead period post-transfer for deal finalization',
        'Must comply with new school\'s NIL policies',
        'Immediate eligibility if academically eligible (2024 rules)'
      ],
      workflowNotes: [
        'Standard workflow at new school',
        'Transfer prior deals (portable across schools)',
        'Multi-transfer common for QB portal hoppers'
      ],
      valuationRange: 'Higher for proven performers'
    },
    {
      key: 'redshirt',
      label: 'Redshirt',
      subtitle: 'Practices but no competition; preserves eligibility year',
      nilAllowed: true,
      marketability: 'Fully allowed; \"future star\" branding',
      restrictions: [
        'Cannot compete in games',
        'Must maintain practice participation',
        'Standard academic requirements'
      ],
      workflowNotes: [
        'Standard workflow',
        'Example: Michigan\'s Blake Corum redshirt year with local car dealership',
        'Emphasize development and future potential in branding'
      ],
      valuationRange: 'Varies by profile and future potential'
    },
    {
      key: 'graduate_student_athlete',
      label: 'Graduate Student-Athlete',
      subtitle: 'Post-undergrad; extra eligibility year',
      nilAllowed: true,
      marketability: 'Professional polish; higher endorsement rates',
      restrictions: [
        'Graduate aid rules apply',
        'International visa limits (F-1: 20 hrs/week)',
        'May need CPT/OPT for paid work'
      ],
      workflowNotes: [
        'Standard workflow',
        'Add graduate assistantship conflict check',
        'Examples: Stanford grads in Olympics with NIL deals'
      ],
      valuationRange: 'Premium for mature, established brand'
    },
    {
      key: 'team_captain',
      label: 'Team Captain',
      subtitle: 'Leadership role on team',
      nilAllowed: true,
      marketability: 'Premium; leadership = brand safety for sponsors',
      restrictions: [
        'All standard student-athlete restrictions apply',
        'Leadership responsibilities may limit availability'
      ],
      workflowNotes: [
        'Standard workflow',
        'Often school-vetted for image/reputation',
        'Preferred by family brands (State Farm ads example)'
      ],
      valuationRange: 'Premium due to leadership appeal'
    },
    {
      key: 'professional_athlete',
      label: 'Professional Athlete',
      subtitle: 'No longer NCAA eligible',
      nilAllowed: true,
      marketability: 'High; professional endorsements',
      restrictions: [
        'NCAA eligibility forfeited',
        'No NCAA compliance requirements',
        'Professional league rules apply instead'
      ],
      workflowNotes: [
        'No NCAA workflow required',
        'Standard professional endorsement contracts',
        'May have union/league restrictions (NFLPA, NBPA)'
      ],
      valuationRange: '$0 - Multi-million (league-dependent)'
    }
  ];

  const toggleRole = (roleKey) => {
    setExpandedRole(expandedRole === roleKey ? null : roleKey);
  };

  if (compact) {
    const role = athleteRoles.find(r => r.key === currentRole) || athleteRoles[3]; // Default to enrolled

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{role.label}</h4>
            <p className="text-xs text-gray-500 mt-1">{role.subtitle}</p>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            role.nilAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {role.nilAllowed ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                NIL Allowed
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Not Eligible
              </>
            )}
          </span>
        </div>
        <p className="text-xs text-gray-600">
          <strong>Marketability:</strong> {role.marketability}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Student-Athlete Eligibility Guide</h3>
          <p className="text-sm text-gray-500 mt-1">
            NIL eligibility rules by athlete role type (NCAA 2024-2025)
          </p>
        </div>
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
      </div>

      {/* Current Role Highlight */}
      {currentRole && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            Your Current Role: <strong>{athleteRoles.find(r => r.key === currentRole)?.label || 'Unknown'}</strong>
          </p>
        </div>
      )}

      {/* Roles Accordion */}
      <div className="space-y-3">
        {athleteRoles.map((role) => {
          const isExpanded = expandedRole === role.key;
          const isCurrent = currentRole === role.key;

          return (
            <div
              key={role.key}
              className={`border rounded-lg transition-all ${
                isCurrent ? 'border-blue-300 ring-1 ring-blue-200' : 'border-gray-200'
              }`}
            >
              {/* Role Header */}
              <button
                onClick={() => toggleRole(role.key)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  {role.nilAllowed ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{role.label}</h4>
                    <p className="text-xs text-gray-500">{role.subtitle}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                  {/* NIL Status */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      {role.nilAllowed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm font-semibold text-gray-900">
                        NIL Deals: {role.nilAllowed ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">
                      <strong>Marketability:</strong> {role.marketability}
                    </p>
                    {role.valuationRange && (
                      <p className="text-xs text-gray-600 ml-6 mt-1">
                        <strong>Typical Range:</strong> {role.valuationRange}
                      </p>
                    )}
                  </div>

                  {/* Restrictions */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                      Restrictions
                    </h5>
                    <ul className="space-y-1 ml-4">
                      {role.restrictions.map((restriction, idx) => (
                        <li key={idx} className="text-xs text-gray-600 list-disc">
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Workflow Notes */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900 mb-2">Contract Workflow</h5>
                    <ul className="space-y-1 ml-4">
                      {role.workflowNotes.map((note, idx) => (
                        <li key={idx} className="text-xs text-gray-600 list-disc">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Note:</strong> Eligibility rules based on NCAA 2024-2025 Division I Manual, House v. NCAA settlement provisions, and state NIL laws. Always consult your school's compliance office before signing any NIL deal.
        </p>
      </div>
    </div>
  );
}
