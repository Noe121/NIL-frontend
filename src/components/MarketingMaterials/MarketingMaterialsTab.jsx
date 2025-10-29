/**
 * Marketing Materials Tab Component
 * Main component for company dashboard marketing materials management
 */
import React, { useState, useEffect } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import TemplateGallery from './TemplateGallery';
import QuickOrderForm from './QuickOrderForm';
import AutomatedCampaignBuilder from './AutomatedCampaignBuilder';
import OrderHistoryTable from './OrderHistoryTable';
import { marketingMaterialsService } from '../../services/marketingMaterialsService';

const MarketingMaterialsTab = ({ companyId }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeAutomations: 0
  });

  useEffect(() => {
    loadData();
  }, [companyId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesData, campaignsData, ordersData] = await Promise.all([
        marketingMaterialsService.getTemplates(companyId),
        marketingMaterialsService.getCampaigns(companyId),
        marketingMaterialsService.getOrders(companyId)
      ]);

      setTemplates(templatesData);
      setCampaigns(campaignsData);
      setOrders(ordersData);

      // Calculate stats
      setStats({
        totalOrders: ordersData.length,
        totalSpent: ordersData.reduce((sum, order) => sum + (order.total_cost || 0), 0),
        activeAutomations: campaignsData.filter(c => c.is_active).length
      });
    } catch (error) {
      console.error('Failed to load marketing materials data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="marketing-materials-tab">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Physical Marketing Materials
        </h1>
        <p className="text-gray-600">
          Automate physical marketing materials to your athletes and fans
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Automations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAutomations}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'templates', label: 'Templates', icon: '📄' },
            { id: 'quick-order', label: 'Quick Order', icon: '🚀' },
            { id: 'automation', label: 'Automation', icon: '⚡' },
            { id: 'orders', label: 'Order History', icon: '📦' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeSection === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="mt-6">
        {activeSection === 'templates' && (
          <TemplateGallery
            companyId={companyId}
            templates={templates}
            onTemplateUploaded={loadData}
          />
        )}

        {activeSection === 'quick-order' && (
          <QuickOrderForm
            companyId={companyId}
            templates={templates}
            onOrderCreated={loadData}
          />
        )}

        {activeSection === 'automation' && (
          <AutomatedCampaignBuilder
            companyId={companyId}
            templates={templates}
            campaigns={campaigns}
            onCampaignCreated={loadData}
          />
        )}

        {activeSection === 'orders' && (
          <OrderHistoryTable
            orders={orders}
            onRefresh={loadData}
          />
        )}
      </div>
    </div>
  );
};

export default MarketingMaterialsTab;
