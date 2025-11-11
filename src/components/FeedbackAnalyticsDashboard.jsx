import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { AlertTriangle, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { useDataManagement } from '../contexts/DataManagementContext';

export const FeedbackAnalyticsDashboard = ({ className = '' }) => {
  const { feedbackData } = useDataManagement();
  const [feedbackSummary, setFeedbackSummary] = useState({
    totalFeedback: 0,
    helpfulCount: 0,
    confusingCount: 0,
    averageHelpfulness: 0,
    commonIssues: []
  });
  const [demoContentPerformance, setDemoContentPerformance] = useState({});
  const [improvementSuggestions, setImprovementSuggestions] = useState([]);

  useEffect(() => {
    analyzeFeedback();
  }, [feedbackData]);

  const analyzeFeedback = () => {
    const feedback = feedbackData;

    // Calculate summary statistics
    const totalFeedback = feedback.length;
    const helpfulCount = feedback.filter(f => f.feedback.helpful === true).length;
    const confusingCount = feedback.filter(f => f.feedback.confusing).length;

    const averageHelpfulness = totalFeedback > 0 ? helpfulCount / totalFeedback : 0;

    // Analyze common issues from comments
    const commonIssues = extractCommonIssues(feedback);

    setFeedbackSummary({
      totalFeedback,
      helpfulCount,
      confusingCount,
      averageHelpfulness,
      commonIssues
    });

    // Analyze performance by content type
    analyzeContentPerformance(feedback);

    // Generate improvement suggestions
    generateImprovementSuggestions();
  };

  const extractCommonIssues = (feedback) => {
    const issues = [];

    // Analyze comments for common themes
    const comments = feedback
      .map(f => f.feedback.comments)
      .filter(comment => comment !== undefined && comment.trim().length > 0);

    // Simple keyword analysis (in production, this would use NLP)
    const issueKeywords = {
      'confusing': 'Content layout/structure is confusing',
      'unclear': 'Information is unclear or hard to understand',
      'missing': 'Important information is missing',
      'outdated': 'Content appears outdated',
      'irrelevant': 'Content doesn\'t match user expectations',
      'difficult': 'Content is difficult to navigate',
      'slow': 'Performance issues with content loading',
      'inaccurate': 'Information appears inaccurate'
    };

    for (const [keyword, issue] of Object.entries(issueKeywords)) {
      const mentions = comments.filter(comment =>
        comment.toLowerCase().includes(keyword)
      ).length;
      if (mentions >= 2) { // If mentioned by 2+ users
        issues.push(issue);
      }
    }

    return issues;
  };

  const analyzeContentPerformance = (feedback) => {
    const performanceByType = {};

    // Group feedback by data type
    const feedbackByType = feedback.reduce((acc, f) => {
      const type = f.dataType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(f);
      return acc;
    }, {});

    for (const [dataType, typeFeedback] of Object.entries(feedbackByType)) {
      const totalFeedback = typeFeedback.length;
      const helpfulCount = typeFeedback.filter(f => f.feedback.helpful === true).length;
      const confusingCount = typeFeedback.filter(f => f.feedback.confusing).length;

      const helpfulPercentage = totalFeedback > 0 ? helpfulCount / totalFeedback : 0;
      const confusingPercentage = totalFeedback > 0 ? confusingCount / totalFeedback : 0;

      // Determine if content needs improvement
      const needsImprovement = helpfulPercentage < 0.6 || confusingPercentage > 0.3;

      performanceByType[dataType] = {
        dataType,
        totalViews: 0, // Would be tracked separately
        feedbackCount: totalFeedback,
        helpfulPercentage,
        confusingPercentage,
        needsImprovement
      };
    }

    setDemoContentPerformance(performanceByType);
  };

  const generateImprovementSuggestions = () => {
    const suggestions = [];

    // Analyze overall feedback
    if (feedbackSummary.averageHelpfulness < 0.5) {
      suggestions.push('Overall demo content helpfulness is low. Consider major redesign of demo content.');
    }

    if (feedbackSummary.confusingCount > feedbackSummary.totalFeedback * 0.3) {
      suggestions.push('High confusion rate detected. Improve content clarity and add better explanations.');
    }

    // Analyze specific content types
    for (const [dataType, performance] of Object.entries(demoContentPerformance)) {
      if (performance.needsImprovement) {
        suggestions.push(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} content needs improvement - low helpfulness or high confusion rates.`);
      }

      if (performance.helpfulPercentage < 0.4) {
        suggestions.push(`Consider replacing ${dataType} demo content with real data sooner.`);
      }
    }

    // Add suggestions based on common issues
    for (const issue of feedbackSummary.commonIssues) {
      suggestions.push(`Address: ${issue}`);
    }

    // Add proactive suggestions
    if (feedbackSummary.totalFeedback < 10) {
      suggestions.push('Collect more feedback to improve analysis accuracy.');
    }

    setImprovementSuggestions(suggestions);
  };

    const exportFeedbackReport = () => {
    let report = 'NILBx Demo Content Feedback Report\n';
    report += `Generated: ${new Date().toLocaleString()}\n\n`;

    report += 'SUMMARY:\n';
    report += `Total Feedback: ${feedbackSummary.totalFeedback}\n`;
    report += `Helpful Responses: ${feedbackSummary.helpfulCount}\n`;
    report += `Confusing Responses: ${feedbackSummary.confusingCount}\n`;
    report += `Average Helpfulness: ${(feedbackSummary.averageHelpfulness * 100).toFixed(1)}%\n\n`;

    report += 'CONTENT PERFORMANCE:\n';
    for (const [dataType, performance] of Object.entries(demoContentPerformance)) {
      report += `${dataType.charAt(0).toUpperCase() + dataType.slice(1)}:\n`;
      report += `  Feedback Count: ${performance.feedbackCount}\n`;
      report += `  Helpfulness: ${(performance.helpfulPercentage * 100).toFixed(1)}%\n`;
      report += `  Confusion Rate: ${(performance.confusingPercentage * 100).toFixed(1)}%\n`;
      report += `  Needs Improvement: ${performance.needsImprovement}\n\n`;
    }

    report += 'IMPROVEMENT SUGGESTIONS:\n';
    for (const suggestion of improvementSuggestions) {
      report += `• ${suggestion}\n`;
    }

    // Create and download the report
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nilbx-feedback-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Demo Content Feedback Analytics</h2>
        <Button onClick={exportFeedbackReport} variant="outline">
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackSummary.totalFeedback}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Helpful Responses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackSummary.helpfulCount}</div>
            <p className="text-xs text-muted-foreground">
              {(feedbackSummary.averageHelpfulness * 100).toFixed(1)}% average helpfulness
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confusing Responses</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackSummary.confusingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Common Issues</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackSummary.commonIssues.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(demoContentPerformance).map(([dataType, performance]) => (
              <div key={dataType} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{dataType}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={performance.needsImprovement ? "destructive" : "secondary"}>
                      {performance.needsImprovement ? "Needs Improvement" : "Good"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {performance.feedbackCount} feedback
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Helpfulness</span>
                    <span>{(performance.helpfulPercentage * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={performance.helpfulPercentage * 100} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Confusion Rate</span>
                    <span>{(performance.confusingPercentage * 100).toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={performance.confusingPercentage * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      {improvementSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Common Issues */}
      {feedbackSummary.commonIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Common Issues Reported</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedbackSummary.commonIssues.map((issue, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};