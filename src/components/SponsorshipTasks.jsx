/**
 * SponsorshipTasks Component - Interface for managing sponsorship tasks
 * Handles task creation, submission, approval, and payment workflows
 */

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context.jsx';
import { createBlockchainService } from '../services/blockchainService.js';
import { TaskStatus, TaskStatusLabels } from '../contracts/abis.js';
import { config } from '../utils/config.js';

export function SponsorshipTasks({
  userRole = 'athlete', // 'athlete', 'sponsor', 'viewer'
  userAddress = '',
  onTaskCreated = null,
  onTaskUpdated = null,
  className = ''
}) {
  const web3 = useWeb3();
  const [blockchainService, setBlockchainService] = useState(null);

  // State management
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Task creation form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    athleteAddress: '',
    description: '',
    amount: ''
  });

  // Task submission form
  const [submitForm, setSubmitForm] = useState({
    taskId: '',
    deliverable: '',
    isSubmitting: false
  });

  // UI state
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Initialize blockchain service
  useEffect(() => {
    if (web3.isConnected) {
      setBlockchainService(createBlockchainService(web3));
    }
  }, [web3.isConnected]);

  // Load tasks when service is ready
  useEffect(() => {
    if (blockchainService && web3.account) {
      loadTasks();
    }
  }, [blockchainService, web3.account, userRole]);

  // Load tasks based on user role
  const loadTasks = async () => {
    if (!blockchainService || !web3.account) return;

    try {
      setIsLoading(true);
      setError('');

      const address = userAddress || web3.account;
      let loadedTasks = [];

      if (userRole === 'athlete') {
        loadedTasks = await blockchainService.getAthleteTasks(address);
      } else if (userRole === 'sponsor') {
        loadedTasks = await blockchainService.getSponsorTasks(address);
      } else {
        // For viewer role, try to load both if possible
        const [athleteTasks, sponsorTasks] = await Promise.allSettled([
          blockchainService.getAthleteTasks(address),
          blockchainService.getSponsorTasks(address)
        ]);
        
        loadedTasks = [
          ...(athleteTasks.status === 'fulfilled' ? athleteTasks.value : []),
          ...(sponsorTasks.status === 'fulfilled' ? sponsorTasks.value : [])
        ];
      }

      setTasks(loadedTasks);
      
      if (config.ui.debugMode) {
        console.log(`📋 Loaded ${loadedTasks.length} tasks for ${userRole}:`, loadedTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setError(`Failed to load tasks: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh tasks
  const refreshTasks = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  // Handle create form changes
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new task
  const handleCreateTask = async () => {
    if (!blockchainService) {
      setError('Blockchain service not available');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Validate form
      if (!createForm.athleteAddress.trim()) {
        throw new Error('Athlete address is required');
      }
      if (!createForm.description.trim()) {
        throw new Error('Task description is required');
      }
      if (!createForm.amount || parseFloat(createForm.amount) <= 0) {
        throw new Error('Valid amount is required');
      }

      console.log('📋 Creating sponsorship task:', createForm);

      const result = await blockchainService.createSponsorshipTask(
        createForm.athleteAddress,
        createForm.description,
        createForm.amount
      );

      setSuccess(`Task created successfully! Task ID: ${result.taskId || 'Unknown'}`);
      
      // Reset form
      setCreateForm({
        athleteAddress: '',
        description: '',
        amount: ''
      });
      setShowCreateForm(false);

      // Refresh tasks
      await loadTasks();

      if (onTaskCreated) {
        onTaskCreated(result);
      }

    } catch (error) {
      const errorMessage = error.message || 'Failed to create task';
      setError(errorMessage);
      console.error('❌ Task creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Accept task
  const handleAcceptTask = async (taskId) => {
    try {
      setError('');
      setSuccess('');

      console.log('✋ Accepting task:', taskId);

      const result = await blockchainService.acceptTask(taskId);
      setSuccess('Task accepted successfully!');
      
      await loadTasks();
      
      if (onTaskUpdated) {
        onTaskUpdated({ taskId, action: 'accepted', result });
      }
    } catch (error) {
      setError(`Failed to accept task: ${error.message}`);
    }
  };

  // Submit deliverable
  const handleSubmitDeliverable = async (taskId) => {
    try {
      setError('');
      setSuccess('');

      if (!submitForm.deliverable.trim()) {
        throw new Error('Deliverable content is required');
      }

      // Create hash of deliverable
      const deliverableHash = blockchainService.createDeliverableHash(submitForm.deliverable);

      console.log('📤 Submitting deliverable for task:', taskId);

      const result = await blockchainService.submitDeliverable(taskId, deliverableHash);
      setSuccess('Deliverable submitted successfully!');
      
      // Reset submit form
      setSubmitForm({ taskId: '', deliverable: '', isSubmitting: false });
      
      await loadTasks();
      
      if (onTaskUpdated) {
        onTaskUpdated({ taskId, action: 'submitted', result });
      }
    } catch (error) {
      setError(`Failed to submit deliverable: ${error.message}`);
    }
  };

  // Approve task
  const handleApproveTask = async (taskId) => {
    try {
      setError('');
      setSuccess('');

      console.log('✅ Approving task:', taskId);

      const result = await blockchainService.approveTask(taskId);
      setSuccess('Task approved and payment released!');
      
      await loadTasks();
      
      if (onTaskUpdated) {
        onTaskUpdated({ taskId, action: 'approved', result });
      }
    } catch (error) {
      setError(`Failed to approve task: ${error.message}`);
    }
  };

  // Cancel task
  const handleCancelTask = async (taskId) => {
    try {
      setError('');
      setSuccess('');

      if (!confirm('Are you sure you want to cancel this task? This action cannot be undone.')) {
        return;
      }

      console.log('❌ Cancelling task:', taskId);

      const result = await blockchainService.cancelTask(taskId);
      setSuccess('Task cancelled successfully!');
      
      await loadTasks();
      
      if (onTaskUpdated) {
        onTaskUpdated({ taskId, action: 'cancelled', result });
      }
    } catch (error) {
      setError(`Failed to cancel task: ${error.message}`);
    }
  };

  // Filter tasks by status
  const getFilteredTasks = () => {
    if (activeTab === 'all') return tasks;
    
    const statusMap = {
      'created': TaskStatus.Created,
      'assigned': TaskStatus.Assigned,
      'submitted': TaskStatus.Submitted,
      'completed': TaskStatus.Completed,
      'paid': TaskStatus.Paid,
      'cancelled': TaskStatus.Cancelled
    };
    
    return tasks.filter(task => task.status === statusMap[activeTab]);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const colors = {
      [TaskStatus.Created]: 'bg-gray-100 text-gray-800',
      [TaskStatus.Assigned]: 'bg-blue-100 text-blue-800',
      [TaskStatus.Submitted]: 'bg-yellow-100 text-yellow-800',
      [TaskStatus.Completed]: 'bg-green-100 text-green-800',
      [TaskStatus.Paid]: 'bg-purple-100 text-purple-800',
      [TaskStatus.Cancelled]: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Check if blockchain is enabled
  const isBlockchainEnabled = config.features?.blockchain || false;

  // Don't render if blockchain is disabled
  if (!isBlockchainEnabled) {
    return (
      <div className={`sponsorship-tasks-disabled ${className}`}>
        <div className="bg-gray-100 border border-gray-300 text-gray-600 p-4 rounded">
          <p>Sponsorship tasks are not available in standalone mode.</p>
          <p className="text-sm mt-1">Switch to centralized mode to access blockchain features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`sponsorship-tasks ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sponsorship Tasks
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {userRole === 'sponsor' ? 'Create and manage sponsorship opportunities' : 
                 userRole === 'athlete' ? 'View and complete assigned tasks' :
                 'View all sponsorship activities'}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={refreshTasks}
                disabled={refreshing}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              {userRole === 'sponsor' && (
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  {showCreateForm ? 'Cancel' : 'Create Task'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Create Task Form */}
          {showCreateForm && userRole === 'sponsor' && (
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Create New Task</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Athlete Address *
                  </label>
                  <input
                    type="text"
                    name="athleteAddress"
                    value={createForm.athleteAddress}
                    onChange={handleCreateFormChange}
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Description *
                  </label>
                  <textarea
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateFormChange}
                    rows={3}
                    placeholder="Describe the marketing deliverable or task..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Amount (ETH) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={createForm.amount}
                    onChange={handleCreateFormChange}
                    step="0.001"
                    min="0"
                    placeholder="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTask}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded transition-colors"
                  >
                    {isLoading ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Filter Tabs */}
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['all', 'created', 'assigned', 'submitted', 'completed', 'paid'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tasks List */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading tasks...</p>
            </div>
          ) : getFilteredTasks().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No tasks found</p>
              {userRole === 'sponsor' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Create Your First Task
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredTasks().map((task) => (
                <div key={task.taskId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="font-medium text-gray-900">
                          Task #{task.taskId}
                        </h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(task.status)}`}>
                          {task.statusLabel}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Amount:</strong> {task.amount} ETH</div>
                        <div><strong>Sponsor:</strong> {blockchainService?.formatAddress(task.sponsor)}</div>
                        <div><strong>Athlete:</strong> {blockchainService?.formatAddress(task.athlete)}</div>
                        <div><strong>Created:</strong> {task.createdAt.toLocaleDateString()}</div>
                        {task.completedAt && (
                          <div><strong>Completed:</strong> {task.completedAt.toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>

                    {/* Task Actions */}
                    <div className="ml-4 flex flex-col space-y-2">
                      {/* Athlete Actions */}
                      {userRole === 'athlete' && task.athlete.toLowerCase() === web3.account?.toLowerCase() && (
                        <>
                          {task.status === TaskStatus.Created && (
                            <button
                              onClick={() => handleAcceptTask(task.taskId)}
                              className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                            >
                              Accept
                            </button>
                          )}
                          
                          {task.status === TaskStatus.Assigned && (
                            <button
                              onClick={() => setSubmitForm({ 
                                taskId: task.taskId, 
                                deliverable: '', 
                                isSubmitting: true 
                              })}
                              className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                            >
                              Submit Work
                            </button>
                          )}
                        </>
                      )}

                      {/* Sponsor Actions */}
                      {userRole === 'sponsor' && task.sponsor.toLowerCase() === web3.account?.toLowerCase() && (
                        <>
                          {task.status === TaskStatus.Submitted && (
                            <button
                              onClick={() => handleApproveTask(task.taskId)}
                              className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                            >
                              Approve & Pay
                            </button>
                          )}
                          
                          {(task.status === TaskStatus.Created || task.status === TaskStatus.Assigned) && (
                            <button
                              onClick={() => handleCancelTask(task.taskId)}
                              className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Submit Deliverable Form */}
                  {submitForm.isSubmitting && submitForm.taskId === task.taskId && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h6 className="font-medium text-gray-900 mb-2">Submit Deliverable</h6>
                      <textarea
                        value={submitForm.deliverable}
                        onChange={(e) => setSubmitForm(prev => ({ ...prev, deliverable: e.target.value }))}
                        rows={3}
                        placeholder="Describe the completed work or provide links to deliverables..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => setSubmitForm({ taskId: '', deliverable: '', isSubmitting: false })}
                          className="px-3 py-1 text-xs bg-gray-300 hover:bg-gray-400 text-gray-700 rounded transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitDeliverable(task.taskId)}
                          className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SponsorshipTasks;