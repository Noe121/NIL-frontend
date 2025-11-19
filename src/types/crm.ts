/**
 * NILBx CRM TypeScript Type Definitions
 * Comprehensive type definitions for CRM service integration
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface DateRangeParams {
  start_date?: string;
  end_date?: string;
}

export interface SearchParams {
  search?: string;
  search_fields?: string[];
}

// ============================================================================
// CONTACT TYPES
// ============================================================================

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  stakeholder_type: 'athlete' | 'influencer' | 'coach' | 'recruiter' | 'agent' | 'other';
  organization?: string;
  title?: string;
  location?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  website?: string;
  bio?: string;
  interests?: string[];
  lead_score?: number;
  lead_status?: string;
  pipeline_stage?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_contacted_at?: string;
  enrichment_data?: EnrichmentData;
}

export interface ContactCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  stakeholder_type: Contact['stakeholder_type'];
  organization?: string;
  title?: string;
  location?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  website?: string;
  bio?: string;
  interests?: string[];
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface ContactUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  stakeholder_type?: Contact['stakeholder_type'];
  organization?: string;
  title?: string;
  location?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  website?: string;
  bio?: string;
  interests?: string[];
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface ContactListParams extends PaginationParams, SearchParams {
  stakeholder_type?: Contact['stakeholder_type'];
  lead_score_min?: number;
  lead_score_max?: number;
  lead_status?: string;
  pipeline_stage?: string;
  tags?: string[];
  organization?: string;
  location?: string;
}

export interface InfluencerListParams extends ContactListParams {
  follower_count_min?: number;
  follower_count_max?: number;
  engagement_rate_min?: number;
  engagement_rate_max?: number;
  niche?: string[];
}

export interface CoachListParams extends ContactListParams {
  sport?: string;
  level?: string;
  experience_years_min?: number;
  experience_years_max?: number;
}

// ============================================================================
// CAMPAIGN TYPES
// ============================================================================

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'social' | 'direct_mail';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  subject?: string;
  content?: string;
  template_id?: number;
  target_audience: {
    stakeholder_types?: Contact['stakeholder_type'][];
    tags?: string[];
    lead_score_min?: number;
    lead_score_max?: number;
    organizations?: string[];
    locations?: string[];
  };
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  analytics?: CampaignAnalytics;
}

export interface CampaignCreate {
  name: string;
  description?: string;
  type: Campaign['type'];
  subject?: string;
  content?: string;
  template_id?: number;
  target_audience: Campaign['target_audience'];
  scheduled_at?: string;
}

export interface CampaignUpdate {
  name?: string;
  description?: string;
  type?: Campaign['type'];
  subject?: string;
  content?: string;
  template_id?: number;
  target_audience?: Campaign['target_audience'];
  scheduled_at?: string;
}

export interface CampaignListParams extends PaginationParams, SearchParams {
  type?: Campaign['type'];
  status?: Campaign['status'];
  scheduled_after?: string;
  scheduled_before?: string;
  sent_after?: string;
  sent_before?: string;
}

export interface CampaignAnalytics {
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  revenue_generated?: number;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface DashboardMetrics {
  overview: {
    total_contacts: number;
    new_contacts_this_month: number;
    active_campaigns: number;
    total_revenue: number;
    avg_lead_score: number;
    pipeline_conversion_rate: number;
  };
  charts: {
    lead_score_distribution: Array<{ score_range: string; count: number }>;
    pipeline_funnel: Array<{ stage: string; count: number; percentage: number }>;
    revenue_trends: Array<{ date: string; revenue: number }>;
    campaign_performance: Array<{ campaign_name: string; open_rate: number; click_rate: number }>;
  };
  recent_activity: Array<{
    type: 'contact_created' | 'campaign_sent' | 'deal_closed' | 'meeting_scheduled';
    description: string;
    timestamp: string;
  }>;
}

export interface CustomReportRequest {
  report_type: 'contacts' | 'campaigns' | 'revenue' | 'pipeline' | 'engagement';
  date_range: DateRangeParams;
  filters?: Record<string, any>;
  group_by?: string[];
  metrics?: string[];
}

export interface CustomReportResponse {
  data: any[];
  summary: Record<string, any>;
  generated_at: string;
}

// ============================================================================
// LEAD SCORING TYPES
// ============================================================================

export interface LeadScoreResponse {
  contact_id: number;
  lead_score: number;
  lead_status: string;
  scoring_factors: Array<{
    factor: string;
    weight: number;
    score: number;
    explanation: string;
  }>;
  recommendations: string[];
}

export interface BulkLeadScoreResponse {
  results: LeadScoreResponse[];
  processed_count: number;
  failed_count: number;
  errors?: Array<{ contact_id: number; error: string }>;
}

export interface ScoringInsights {
  average_score: number;
  score_distribution: Array<{ range: string; count: number; percentage: number }>;
  top_scoring_factors: Array<{ factor: string; average_impact: number }>;
  conversion_rates_by_score: Array<{ score_range: string; conversion_rate: number }>;
}

// ============================================================================
// PIPELINE TYPES
// ============================================================================

export interface PipelineStatus {
  contact_id: number;
  current_stage: string;
  stage_history: Array<{
    stage: string;
    entered_at: string;
    exited_at?: string;
    duration_days?: number;
    notes?: string;
  }>;
  next_actions: Array<{
    action: string;
    due_date?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  estimated_close_date?: string;
  probability?: number;
}

export interface PipelineOverview {
  stages: Array<{
    stage: string;
    count: number;
    value: number;
    avg_days_in_stage: number;
  }>;
  conversion_rates: Array<{
    from_stage: string;
    to_stage: string;
    rate: number;
  }>;
  bottlenecks: Array<{
    stage: string;
    avg_days: number;
    issue: string;
  }>;
}

// ============================================================================
// CALENDLY TYPES
// ============================================================================

export interface CalendlyUser {
  uri: string;
  name: string;
  slug: string;
  email: string;
  scheduling_url: string;
  timezone: string;
  avatar_url?: string;
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  description?: string;
  duration: number;
  slug: string;
  color: string;
  active: boolean;
  scheduling_url: string;
  created_at: string;
  updated_at: string;
}

export interface CalendlyEvent {
  uri: string;
  name: string;
  meeting_notes?: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location?: {
    type: 'physical' | 'zoom' | 'google_meet' | 'custom';
    location?: string;
    join_url?: string;
  };
  invitees: Array<{
    email: string;
    first_name?: string;
    last_name?: string;
    status: 'active' | 'canceled';
  }>;
  created_at: string;
  updated_at: string;
}

export interface CalendlyAvailability {
  calendar: {
    busy: Array<{
      start: string;
      end: string;
    }>;
    free: Array<{
      start: string;
      end: string;
    }>;
  };
}

// ============================================================================
// ENRICHMENT TYPES
// ============================================================================

export interface EnrichmentData {
  linkedin_profile?: {
    headline: string;
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      field: string;
    }>;
  };
  social_media?: {
    twitter_followers?: number;
    instagram_followers?: number;
    engagement_rate?: number;
  };
  company_info?: {
    name: string;
    industry: string;
    size: string;
    website: string;
    description: string;
  };
  enriched_at: string;
  source: string;
}

export interface EnrichmentRequest {
  contact_id?: number;
  email?: string;
  linkedin_url?: string;
  company_name?: string;
}

export interface EnrichmentResponse {
  success: boolean;
  data?: EnrichmentData;
  error?: string;
}

export interface BulkEnrichmentResponse {
  results: Array<{
    contact_id?: number;
    email?: string;
    success: boolean;
    data?: EnrichmentData;
    error?: string;
  }>;
  processed_count: number;
  successful_count: number;
  failed_count: number;
}

export interface EnrichmentStats {
  total_enriched: number;
  success_rate: number;
  average_enrichment_time: number;
  sources_used: Record<string, number>;
  last_updated: string;
}

// ============================================================================
// DEAL TYPES
// ============================================================================

export interface Deal {
  id: number;
  contact_id: number;
  title: string;
  description?: string;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expected_close_date?: string;
  actual_close_date?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  contact?: Contact;
}

export interface DealCreate {
  contact_id: number;
  title: string;
  description?: string;
  value: number;
  currency?: string;
  stage: string;
  probability?: number;
  expected_close_date?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface DealUpdate {
  title?: string;
  description?: string;
  value?: number;
  currency?: string;
  stage?: string;
  probability?: number;
  expected_close_date?: string;
  actual_close_date?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface DealListParams extends PaginationParams, SearchParams {
  contact_id?: number;
  stage?: string;
  value_min?: number;
  value_max?: number;
  expected_close_after?: string;
  expected_close_before?: string;
  tags?: string[];
}

// ============================================================================
// INTERACTION TYPES
// ============================================================================

export interface Interaction {
  id: number;
  contact_id: number;
  type: 'email' | 'call' | 'meeting' | 'note' | 'social' | 'other';
  direction?: 'inbound' | 'outbound';
  subject?: string;
  content?: string;
  duration_minutes?: number;
  outcome?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  contact?: Contact;
}

export interface InteractionCreate {
  contact_id: number;
  type: Interaction['type'];
  direction?: Interaction['direction'];
  subject?: string;
  content?: string;
  duration_minutes?: number;
  outcome?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface InteractionUpdate {
  type?: Interaction['type'];
  direction?: Interaction['direction'];
  subject?: string;
  content?: string;
  duration_minutes?: number;
  outcome?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface InteractionListParams extends PaginationParams, DateRangeParams {
  contact_id?: number;
  type?: Interaction['type'];
  direction?: Interaction['direction'];
  outcome?: string;
  tags?: string[];
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface CRMConfig {
  apiUrl: string;
  apiVersion: string;
  auth: {
    storageKey: string;
  };
  ui: {
    apiTimeout: number;
  };
}
