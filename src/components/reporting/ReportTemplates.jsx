import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Eye,
  Clock,
  Calendar
} from 'lucide-react';
import { reportingService } from '../../services/reportingService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

/**
 * ReportTemplates - React Component
 *
 * Browse and use predefined report templates
 * Allows quick report generation from templates
 */

const ReportTemplates = () => {
  const navigate = useNavigate();

  // State management
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate form state
  const [generateForm, setGenerateForm] = useState({
    reportName: '',
    periodStart: '',
    periodEnd: '',
    format: 'pdf'
  });

  // Template categories
  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'financial', label: 'Financial' },
    { value: 'operational', label: 'Operational' },
    { value: 'user', label: 'User Analytics' },
    { value: 'compliance', label: 'Compliance' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportingService.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err.message || 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter templates by category
  const filteredTemplates = templates.filter(template => {
    if (selectedCategory === 'all') return true;
    return template.category === selectedCategory;
  });

  // Handle generate report
  const handleGenerateReport = async () => {
    try {
      const userId = getUserId();
      await reportingService.generateReport({
        userId,
        templateId: selectedTemplate.id,
        reportName: generateForm.reportName,
        periodStart: new Date(generateForm.periodStart),
        periodEnd: new Date(generateForm.periodEnd),
        format: generateForm.format
      });
      setShowGenerateDialog(false);
      navigate('/reports');
    } catch (err) {
      setError(err.message || 'Failed to generate report');
    }
  };

  // Template configurations
  const templateConfig = {
    revenue: {
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      category: 'financial'
    },
    user_activity: {
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      category: 'user'
    },
    disputes: {
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      category: 'operational'
    },
    completions: {
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      category: 'operational'
    },
    performance: {
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      category: 'operational'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Templates</h1>
          <p className="text-gray-600">
            Choose from predefined templates to generate reports quickly
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Templates Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Templates Found
                </h3>
                <p className="text-gray-600">
                  {selectedCategory === 'all'
                    ? 'No templates are available at this time'
                    : 'No templates found in this category'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                config={templateConfig[template.templateType] || templateConfig.revenue}
                onClick={() => {
                  setSelectedTemplate(template);
                  setGenerateForm({
                    ...generateForm,
                    reportName: template.templateName
                  });
                  setShowGenerateDialog(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Popular Templates Section */}
        {!isLoading && filteredTemplates.length > 0 && selectedCategory === 'all' && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates
                .filter(t => t.isPopular)
                .slice(0, 4)
                .map(template => (
                  <PopularTemplateCard
                    key={template.id}
                    template={template}
                    config={templateConfig[template.templateType] || templateConfig.revenue}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setGenerateForm({
                        ...generateForm,
                        reportName: template.templateName
                      });
                      setShowGenerateDialog(true);
                    }}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Report from Template</DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-6 py-4">
              {/* Template Info */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        templateConfig[selectedTemplate.templateType]?.bgColor || 'bg-gray-100'
                      }`}
                    >
                      {React.createElement(
                        templateConfig[selectedTemplate.templateType]?.icon || FileText,
                        {
                          className: `h-8 w-8 ${
                            templateConfig[selectedTemplate.templateType]?.color || 'text-gray-600'
                          }`
                        }
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {selectedTemplate.templateName}
                      </h3>
                      <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Report Name
                  </label>
                  <Input
                    type="text"
                    placeholder="My Custom Report"
                    value={generateForm.reportName}
                    onChange={(e) =>
                      setGenerateForm({ ...generateForm, reportName: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={generateForm.periodStart}
                      onChange={(e) =>
                        setGenerateForm({ ...generateForm, periodStart: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={generateForm.periodEnd}
                      onChange={(e) =>
                        setGenerateForm({ ...generateForm, periodEnd: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Export Format
                  </label>
                  <Select
                    value={generateForm.format}
                    onValueChange={(val) => setGenerateForm({ ...generateForm, format: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Template Metrics */}
              {selectedTemplate.dataFields && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Included Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.dataFields.map((field, index) => (
                        <Badge key={index} variant="secondary">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowGenerateDialog(false);
                setSelectedTemplate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={
                !generateForm.reportName || !generateForm.periodStart || !generateForm.periodEnd
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Template Card Component
const TemplateCard = ({ template, config, onClick }) => {
  const Icon = config.icon;

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Icon and Title */}
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-lg ${config.bgColor}`}>
              <Icon className={`h-6 w-6 ${config.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{template.templateName}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {template.dataFields?.length || 0} metrics
            </span>
            <Badge variant="secondary">{getCategoryLabel(config.category)}</Badge>
          </div>

          {/* Actions */}
          <Button className="w-full" onClick={onClick}>
            <Eye className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Popular Template Card Component
const PopularTemplateCard = ({ template, config, onClick }) => {
  const Icon = config.icon;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-8 w-8 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{template.templateName}</h3>
              <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {template.dataFields?.length || 0} metrics
              </span>
              <span>•</span>
              <span>{getCategoryLabel(config.category)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper Functions
const getUserId = () => {
  // Replace with actual auth logic
  return 1;
};

const getCategoryLabel = (category) => {
  const labels = {
    financial: 'Financial',
    operational: 'Operational',
    user: 'User Analytics',
    compliance: 'Compliance'
  };
  return labels[category] || 'General';
};

export default ReportTemplates;
