import React, { useState } from 'react';
import { useDataManagement } from '../contexts/DataManagementContext';

const DemoFeedbackWidget = ({ dataType, className = '' }) => {
  const { recordFeedback } = useDataManagement();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    helpful: null,
    confusing: false,
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();

    recordFeedback(dataType, feedback);

    setSubmitted(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSubmitted(false);
      setFeedback({ helpful: null, confusing: false, comments: '' });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
        <p className="text-green-800 text-sm">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!showFeedback ? (
        <button
          onClick={() => setShowFeedback(true)}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Feedback on demo content
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Help us improve: {dataType.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </h4>

          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Was this demo content helpful?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="helpful"
                    value="true"
                    onChange={(e) => setFeedback(prev => ({
                      ...prev,
                      helpful: e.target.value === 'true'
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="helpful"
                    value="false"
                    onChange={(e) => setFeedback(prev => ({
                      ...prev,
                      helpful: e.target.value === 'true'
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={feedback.confusing}
                  onChange={(e) => setFeedback(prev => ({
                    ...prev,
                    confusing: e.target.checked
                  }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">This demo content was confusing</span>
              </label>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Additional comments (optional)
              </label>
              <textarea
                value={feedback.comments}
                onChange={(e) => setFeedback(prev => ({
                  ...prev,
                  comments: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows="2"
                placeholder="Tell us how we can improve..."
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowFeedback(false)}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DemoFeedbackWidget;