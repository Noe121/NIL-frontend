/**
 * NCAAComplianceWarning - Warning component for student-athlete deals
 * Displays NCAA compliance information
 * Date: October 26, 2025
 */

import React from 'react';

export default function NCAAComplianceWarning() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            NCAA Compliance Required
          </h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>
              This deal will be reviewed for NCAA Rule 12.4.1 compliance (no pay-for-play).
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Deal cannot be contingent on athletic performance</li>
              <li>No school logos in sponsored content (varies by school)</li>
              <li>Must disclose paid partnership on social media</li>
              <li>Processing may take 24-48 hours for compliance review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
