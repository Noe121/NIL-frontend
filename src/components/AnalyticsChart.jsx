import React from 'react';

const AnalyticsChart = ({ data, type = 'line', title, className = '' }) => {
  // Simple chart implementation - in a real app, you'd use a library like Chart.js or Recharts
  const maxValue = Math.max(...data.map(item => item.value || 0));

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-gray-500">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No data available
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;