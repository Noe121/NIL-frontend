import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'athlete',
      title: 'Student Athlete',
      icon: '🏃‍♂️',
      description: 'High school, college, and amateur athletes looking for NIL opportunities',
      features: ['NIL Deal Creation', 'Compliance Management', 'State-Specific Rules', 'Deal Tracking'],
      route: '/register/athlete'
    },
    {
      id: 'sponsor',
      title: 'Brand Partner',
      icon: '🏢',
      description: 'Companies and brands looking to sponsor athletes',
      features: ['Deal Creation', 'Athlete Discovery', 'Contract Management', 'Analytics Dashboard'],
      route: '/register/sponsor'
    },
    {
      id: 'fan',
      title: 'Sports Fan',
      icon: '⭐',
      description: 'Sports enthusiasts supporting their favorite athletes',
      features: ['Follow Athletes', 'Community Access', 'Exclusive Content', 'Fan Rewards'],
      route: '/register/fan'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Navigate to role-specific registration after a brief delay for visual feedback
    setTimeout(() => {
      navigate(role.route);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Join the NIL Community
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Choose your role to get started with personalized features and tools
          </motion.p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                bg-white rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 border-2
                ${selectedRole?.id === role.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                }
              `}
              onClick={() => handleRoleSelect(role)}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{role.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600">{role.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                {role.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-500 mb-4">
            Already have an account?
            <button
              onClick={() => navigate('/auth')}
              className="text-blue-600 hover:text-blue-800 font-medium ml-1"
            >
              Sign in here
            </button>
          </p>
          <p className="text-sm text-gray-400">
            By joining, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;