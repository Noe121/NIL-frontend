import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi.js';
import { config } from '../utils/config.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function CommunityPage() {
  const { apiService } = useApi();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModerator, setIsModerator] = useState(false);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchThreads();
    checkModeratorStatus();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/community/threads');
      setThreads(Array.isArray(response) ? response : []);
      setError('');
    } catch (err) {
      // If 401, show demo threads for public browsing
      if (err.response?.status === 401) {
        const demoThreads = [
          {
            id: 'demo-1',
            title: 'Welcome to NILBx Community!',
            content: 'Excited to see the future of college sports NIL opportunities. This platform looks amazing!',
            author: 'SportsFan2024',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            messageCount: 12
          },
          {
            id: 'demo-2',
            title: 'NIL Rights Discussion',
            content: 'What are your thoughts on the current NIL landscape? How do you think it will evolve?',
            author: 'AthleteAdvocate',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            messageCount: 8
          },
          {
            id: 'demo-3',
            title: 'Success Stories',
            content: 'Share your favorite athlete success stories from the NIL era so far.',
            author: 'NILWatcher',
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            messageCount: 15
          },
          {
            id: 'demo-4',
            title: 'Sponsor Opportunities',
            content: 'Looking for advice on how to connect with student-athletes for sponsorship deals.',
            author: 'BusinessOwner',
            createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            messageCount: 6
          },
          {
            id: 'demo-5',
            title: 'Fan Engagement Ideas',
            content: 'What are some creative ways fans can support their favorite athletes?',
            author: 'SuperSupporter',
            createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            messageCount: 9
          }
        ];
        setThreads(demoThreads);
        setError('');
      } else {
        setError('Failed to load discussion threads');
        setThreads([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkModeratorStatus = async () => {
    try {
      const response = await apiService.get('/user/role');
      setIsModerator(response.role === 'moderator' || response.role === 'admin');
    } catch (err) {
      setIsModerator(false);
    }
  };

  const connectWebSocket = () => {
    if (!config.features.realTimeChat) return;

    try {
      wsRef.current = new WebSocket('ws://localhost:8080/community');

      wsRef.current.onopen = () => {
        console.log('Connected to community chat');
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message' && data.threadId === selectedThread?.id) {
          setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'thread_update') {
          fetchThreads();
        }
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected from community chat');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (err) {
      console.error('Failed to connect to WebSocket:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();

    if (!newThread.title.trim() || !newThread.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      await apiService.post('/community/threads', newThread);
      await fetchThreads();
      setNewThread({ title: '', content: '' });
      setError('');
    } catch (err) {
      setError('Failed to create thread');
    }
  };

  const handleSelectThread = async (thread) => {
    setSelectedThread(thread);
    try {
      const response = await apiService.get(`/community/threads/${thread.id}/messages`);
      setMessages(Array.isArray(response) ? response : []);
    } catch (err) {
      // If 401, show demo messages for public browsing
      if (err.response?.status === 401) {
        const demoMessages = [
          {
            id: 1,
            content: 'This is such an exciting development for college sports!',
            author: 'SportsEnthusiast',
            timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          },
          {
            id: 2,
            content: 'I agree! The NIL opportunities are game-changing for athletes.',
            author: 'AthleteSupporter',
            timestamp: new Date(Date.now() - 1800000).toISOString() // 30 min ago
          },
          {
            id: 3,
            content: 'Can\'t wait to see how this evolves. Great platform!',
            author: 'FutureFan',
            timestamp: new Date(Date.now() - 900000).toISOString() // 15 min ago
          }
        ];
        setMessages(demoMessages);
      } else {
        setMessages([]);
        setError('Failed to load messages');
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedThread) return;

    try {
      const messageData = {
        threadId: selectedThread.id,
        content: newMessage.trim()
      };

      await apiService.post('/community/messages', messageData);

      // Optimistically add message
      const optimisticMessage = {
        id: Date.now(),
        content: newMessage.trim(),
        author: 'You',
        timestamp: new Date().toISOString(),
        isOptimistic: true
      };
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');

      // Send via WebSocket if connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'send_message',
          threadId: selectedThread.id,
          content: newMessage.trim()
        }));
      }
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const handleModerateThread = async (threadId, action) => {
    if (!isModerator) return;

    try {
      await apiService.post(`/community/threads/${threadId}/moderate`, { action });
      await fetchThreads();
    } catch (err) {
      setError('Failed to moderate thread');
    }
  };

  const handleReportMessage = async (messageId) => {
    try {
      await apiService.post(`/community/messages/${messageId}/report`, {});
      setError('Message reported successfully');
    } catch (err) {
      setError('Failed to report message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Loading community...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Community</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Threads List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Discussion Threads</h2>

              {/* Create New Thread */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">💬 Join the Conversation</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Connect with athletes, sponsors, and fans in our community discussions.
                </p>
                <button
                  onClick={() => window.location.href = '/auth?redirect=/community'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login to Post
                </button>
              </div>

              {/* Threads List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedThread?.id === thread.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{thread.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{thread.content}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{thread.author}</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>

                    {isModerator && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModerateThread(thread.id, 'pin');
                          }}
                          className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                        >
                          Pin
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModerateThread(thread.id, 'lock');
                          }}
                          className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                        >
                          Lock
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {threads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No discussion threads yet.</p>
                  <p>Be the first to start a conversation!</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedThread ? (
              <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">{selectedThread.title}</h2>
                  <p className="text-sm text-gray-600">Started by {selectedThread.author}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto max-h-96">
                  {messages.map((message) => (
                    <div key={message.id} className="mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {message.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{message.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{message.content}</p>
                          <button
                            onClick={() => handleReportMessage(message.id)}
                            className="text-xs text-red-600 hover:text-red-800 mt-1"
                          >
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200">
                  <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 mb-2">💬 Want to join the discussion?</p>
                    <button
                      onClick={() => window.location.href = '/auth?redirect=/community'}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Login to Reply
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Thread</h3>
                  <p className="text-gray-500">Choose a discussion thread to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}