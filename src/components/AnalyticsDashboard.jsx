/**
 * AnalyticsDashboard.jsx
 * NILBx - Advanced Analytics Dashboard Component
 *
 * Comprehensive analytics dashboard with AI-powered insights
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Speed,
  ThumbUp,
  Visibility,
  CheckCircle,
  Schedule,
  Star,
  Refresh
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import analyticsService, { TimePeriods } from '../services/analyticsService';

const AnalyticsDashboard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState(TimePeriods.LAST_30_DAYS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [userId, period]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load dashboard summary
      const summaryResult = await analyticsService.getDashboardSummary(userId);
      if (summaryResult.success) {
        setDashboardData(summaryResult.data);
      }

      // Load performance metrics
      const performanceResult = await analyticsService.getUserPerformance(userId, period);
      if (performanceResult.success) {
        setPerformanceData(performanceResult.data);
      }

      // Load AI insights
      const insightsResult = await analyticsService.getAIInsights(userId);
      if (insightsResult.success) {
        setAiInsights(insightsResult.data);
      }

      // Load predictions
      const predictionsResult = await analyticsService.getPredictedEarnings(userId, 3);
      if (predictionsResult.success) {
        setPredictions(predictionsResult.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Time Period"
            >
              <MenuItem value={TimePeriods.LAST_7_DAYS}>Last 7 Days</MenuItem>
              <MenuItem value={TimePeriods.LAST_30_DAYS}>Last 30 Days</MenuItem>
              <MenuItem value={TimePeriods.LAST_90_DAYS}>Last 90 Days</MenuItem>
              <MenuItem value={TimePeriods.LAST_YEAR}>Last Year</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={loadDashboardData}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      {dashboardData && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Revenue"
              value={analyticsService.formatCurrency(dashboardData.total_revenue)}
              icon={<AttachMoney />}
              color="#4CAF50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Deals"
              value={dashboardData.active_deals}
              subtitle={`${dashboardData.total_deals} total`}
              icon={<Speed />}
              color="#2196F3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Success Rate"
              value={analyticsService.formatPercentage(dashboardData.success_rate)}
              icon={<CheckCircle />}
              color="#FF9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Average Rating"
              value={dashboardData.average_rating ? dashboardData.average_rating.toFixed(1) : 'N/A'}
              subtitle={dashboardData.average_rating ? `⭐ ${analyticsService.getRatingStars(dashboardData.average_rating)}` : ''}
              icon={<Star />}
              color="#9C27B0"
            />
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Performance" />
        <Tab label="AI Insights" />
        <Tab label="Predictions" />
      </Tabs>

      {/* Tab Panels */}
      {activeTab === 0 && <OverviewTab dashboardData={dashboardData} />}
      {activeTab === 1 && <PerformanceTab performanceData={performanceData} />}
      {activeTab === 2 && <AIInsightsTab aiInsights={aiInsights} />}
      {activeTab === 3 && <PredictionsTab predictions={predictions} />}
    </Box>
  );
};

// MARK: - Stats Card Component

const StatsCard = ({ title, value, subtitle, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
          {icon}
        </Avatar>
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// MARK: - Overview Tab

const OverviewTab = ({ dashboardData }) => {
  if (!dashboardData) return null;

  return (
    <Grid container spacing={3}>
      {/* Recent Earnings Chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Earnings
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.recent_earnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#4CAF50" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Brands */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Brands
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {dashboardData.top_brands.map((brand, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{brand.brand_name}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {analyticsService.formatCurrency(brand.total_revenue)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {brand.deals_count} deals
                    </Typography>
                    {brand.average_rating && (
                      <Typography variant="caption" color="text.secondary">
                        ⭐ {brand.average_rating.toFixed(1)}
                      </Typography>
                    )}
                  </Box>
                  {index < dashboardData.top_brands.length - 1 && <Box sx={{ height: 1, bgcolor: 'divider', my: 1 }} />}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Deliverables */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Deliverables Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
                <Typography variant="h5">{dashboardData.pending_deliverables}</Typography>
              </Box>
              <Schedule fontSize="large" color="warning" />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Completion Rate */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Deal Completion
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completed</Typography>
                <Typography variant="body2">{dashboardData.completed_deals}/{dashboardData.total_deals}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(dashboardData.completed_deals / dashboardData.total_deals) * 100}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="h5" color="primary">
              {analyticsService.formatPercentage(dashboardData.success_rate)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// MARK: - Performance Tab

const PerformanceTab = ({ performanceData }) => {
  if (!performanceData) return null;

  return (
    <Grid container spacing={3}>
      {/* Performance Metrics */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <MetricRow
                label="On-Time Delivery"
                value={analyticsService.formatPercentage(performanceData.on_time_delivery_rate)}
                color={analyticsService.getPerformanceColor(performanceData.on_time_delivery_rate)}
              />
              <MetricRow
                label="Response Rate"
                value={analyticsService.formatPercentage(performanceData.response_rate)}
                color={analyticsService.getPerformanceColor(performanceData.response_rate)}
              />
              <MetricRow
                label="Total Deliverables"
                value={performanceData.total_deliverables}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Categories */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {performanceData.top_categories.map((category, index) => (
                <Chip key={index} label={category} color="primary" variant="outlined" />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {performanceData.recent_activity.slice(0, 5).map((activity, index) => (
                <Box key={index} sx={{ mb: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2">{activity.description}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// MARK: - AI Insights Tab

const AIInsightsTab = ({ aiInsights }) => {
  if (!aiInsights) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🤖 AI Insights
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {aiInsights.insights?.map((insight, index) => (
                <Alert key={index} severity="info" icon={<TrendingUp />}>
                  {insight}
                </Alert>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💡 Recommendations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {aiInsights.recommendations?.map((recommendation, index) => (
                <Alert key={index} severity="success">
                  {recommendation}
                </Alert>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {aiInsights.risk_factors && aiInsights.risk_factors.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚠️ Risk Factors
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {aiInsights.risk_factors.map((risk, index) => (
                  <Alert key={index} severity="warning">
                    {risk}
                  </Alert>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

// MARK: - Predictions Tab

const PredictionsTab = ({ predictions }) => {
  if (!predictions) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📈 Earnings Forecast
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictions.predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="predicted_amount" stroke="#4CAF50" name="Predicted" strokeWidth={2} />
                <Line type="monotone" dataKey="low_estimate" stroke="#FF9800" name="Low" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="high_estimate" stroke="#2196F3" name="High" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Confidence: {analyticsService.formatPercentage(predictions.confidence)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Key Factors
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {predictions.factors?.map((factor, index) => (
                <Chip key={index} label={factor} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// MARK: - Helper Components

const MetricRow = ({ label, value, color }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="bold" sx={{ color }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default AnalyticsDashboard;
