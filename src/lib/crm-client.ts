/**
 * NILBx CRM API Client
 * Comprehensive API client for CRM service integration
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../utils/config';
import {
  Contact,
  ContactCreate,
  ContactUpdate,
  ContactListParams,
  InfluencerListParams,
  CoachListParams,
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  CampaignListParams,
  CampaignAnalytics,
  DashboardMetrics,
  CustomReportRequest,
  CustomReportResponse,
  LeadScoreResponse,
  BulkLeadScoreResponse,
  ScoringInsights,
  PipelineStatus,
  PipelineOverview,
  EnrichmentResponse,
  EnrichmentRequest,
  BulkEnrichmentResponse,
  EnrichmentStats,
  Deal,
  DealCreate,
  DealUpdate,
  DealListParams,
  Interaction,
  InteractionCreate,
  InteractionUpdate,
  InteractionListParams,
} from '../types/crm';

// CRM API Configuration
const CRM_BASE_URL = config.crmApiUrl;
const API_VERSION = config.crmApiVersion;

/**
 * CRM API Client Class
 * Handles all CRM service interactions with proper error handling and authentication
 */
class CRMApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${CRM_BASE_URL}/api/${API_VERSION}`,
      timeout: config.ui.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor (add auth token)
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(config.auth.storageKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor (handle errors)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem(config.auth.storageKey);
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  // ============================================================================
  // CONTACTS API
  // ============================================================================

  contacts = {
    /**
     * List contacts with optional filtering and pagination
     */
    list: (params?: ContactListParams) =>
      this.client.get<Contact[]>('/', { params }),

    /**
     * Get a specific contact by ID
     */
    get: (id: number) =>
      this.client.get<Contact>(`/${id}`),

    /**
     * Create a new contact
     */
    create: (data: ContactCreate) =>
      this.client.post<Contact>('/', data),

    /**
     * Update an existing contact
     */
    update: (id: number, data: ContactUpdate) =>
      this.client.put<Contact>(`/${id}`, data),

    /**
     * Delete a contact
     */
    delete: (id: number) =>
      this.client.delete(`/${id}`),

    /**
     * List influencers with filtering
     */
    listInfluencers: (params?: InfluencerListParams) =>
      this.client.get<Contact[]>('/influencers/', { params }),

    /**
     * List coaches with filtering
     */
    listCoaches: (params?: CoachListParams) =>
      this.client.get<Contact[]>('/coaches/', { params }),

    /**
     * Enrich a contact with external data
     */
    enrich: (id: number) =>
      this.client.post(`/${id}/enrich`),

    /**
     * Get contact enrichment statistics
     */
    getEnrichmentStats: () =>
      this.client.get('/enrichment/stats'),
  };

  // ============================================================================
  // CAMPAIGNS API
  // ============================================================================

  campaigns = {
    /**
     * List campaigns with optional filtering
     */
    list: (params?: CampaignListParams) =>
      this.client.get<Campaign[]>('/', { params }),

    /**
     * Get a specific campaign by ID
     */
    get: (id: number) =>
      this.client.get<Campaign>(`/${id}`),

    /**
     * Create a new campaign
     */
    create: (data: CampaignCreate) =>
      this.client.post<Campaign>('/', data),

    /**
     * Update an existing campaign
     */
    update: (id: number, data: CampaignUpdate) =>
      this.client.put<Campaign>(`/${id}`, data),

    /**
     * Send a campaign
     */
    send: (id: number) =>
      this.client.post(`/${id}/send`),

    /**
     * Schedule a campaign for future sending
     */
    schedule: (id: number, scheduledAt: string) =>
      this.client.post(`/${id}/schedule`, { scheduled_at: scheduledAt }),

    /**
     * Get campaign analytics
     */
    analytics: (id: number) =>
      this.client.get<CampaignAnalytics>(`/${id}/analytics`),

    /**
     * Delete a campaign
     */
    delete: (id: number) =>
      this.client.delete(`/${id}`),
  };

  // ============================================================================
  // ANALYTICS API
  // ============================================================================

  analytics = {
    /**
     * Get comprehensive dashboard metrics
     */
    dashboard: (days: number = 30) =>
      this.client.get<DashboardMetrics>('/analytics/dashboard', { params: { days } }),

    /**
     * Get overview metrics
     */
    overview: (days: number = 30) =>
      this.client.get('/analytics/overview', { params: { days } }),

    /**
     * Get campaign performance metrics
     */
    campaignPerformance: (days: number = 30) =>
      this.client.get('/analytics/campaign-performance', { params: { days } }),

    /**
     * Get lead scoring analytics
     */
    leadScoring: () =>
      this.client.get('/analytics/lead-scoring'),

    /**
     * Get pipeline health metrics
     */
    pipelineHealth: () =>
      this.client.get('/analytics/pipeline-health'),

    /**
     * Get revenue tracking metrics
     */
    revenueTracking: (days: number = 30) =>
      this.client.get('/analytics/revenue-tracking', { params: { days } }),

    /**
     * Get engagement metrics
     */
    engagement: (days: number = 30) =>
      this.client.get('/analytics/engagement', { params: { days } }),

    /**
     * Generate custom reports
     */
    customReport: (request: CustomReportRequest) =>
      this.client.post<CustomReportResponse>('/analytics/custom-report', request),

    /**
     * Get lead score distribution chart data
     */
    leadScoreChart: () =>
      this.client.get('/analytics/charts/lead-scores'),

    /**
     * Get pipeline funnel chart data
     */
    pipelineFunnelChart: () =>
      this.client.get('/analytics/charts/pipeline-funnel'),

    /**
     * Get revenue trends chart data
     */
    revenueTrendsChart: (days: number = 90) =>
      this.client.get('/analytics/charts/revenue-trends', { params: { days } }),
  };

  // ============================================================================
  // LEAD SCORING API
  // ============================================================================

  leadScoring = {
    /**
     * Score a specific contact
     */
    score: (contactId: number) =>
      this.client.post<LeadScoreResponse>('/scoring/score', { contact_id: contactId }),

    /**
     * Bulk score multiple contacts
     */
    bulkScore: (contactIds: number[]) =>
      this.client.post<BulkLeadScoreResponse>('/scoring/score/bulk', { contact_ids: contactIds }),

    /**
     * Get scoring insights and statistics
     */
    insights: () =>
      this.client.get<ScoringInsights>('/scoring/insights'),

    /**
     * Get top-scoring leads
     */
    topLeads: (minScore: number = 70, limit: number = 50) =>
      this.client.get('/scoring/top-leads', { params: { min_score: minScore, limit } }),

    /**
     * Manually update lead score and status
     */
    updateManual: (contactId: number, score: number, status?: string) =>
      this.client.put(`/scoring/manual/${contactId}`, {
        manual_score: score,
        manual_status: status
      }),
  };

  // ============================================================================
  // PIPELINE API
  // ============================================================================

  pipeline = {
    /**
     * Get pipeline status for a contact
     */
    getStatus: (contactId: number) =>
      this.client.get<PipelineStatus>(`/pipeline/${contactId}`),

    /**
     * Advance contact to next pipeline stage
     */
    advance: (contactId: number, newStage: string, notes?: string) =>
      this.client.post(`/pipeline/${contactId}/advance`, {
        new_stage: newStage,
        notes
      }),

    /**
     * Get pipeline overview by stakeholder type
     */
    overview: (stakeholderType?: string) =>
      this.client.get<PipelineOverview>('/pipeline/overview', {
        params: { stakeholder_type: stakeholderType }
      }),

    /**
     * Trigger follow-up actions for pipeline
     */
    triggerFollowUps: () =>
      this.client.post('/pipeline/follow-ups'),
  };

  // ============================================================================
  // CALENDLY API
  // ============================================================================

  calendly = {
    /**
     * Get current Calendly user information
     */
    getUser: () =>
      this.client.get('/calendly/user'),

    /**
     * List all event types
     */
    listEventTypes: () =>
      this.client.get('/calendly/event-types'),

    /**
     * Create a new event type
     */
    createEventType: (name: string, duration: number = 30, description: string = "") =>
      this.client.post('/calendly/event-types', { name, duration, description }),

    /**
     * Get user availability
     */
    getAvailability: (userUri: string, days: number = 7) =>
      this.client.get(`/calendly/availability/${userUri}`, { params: { days } }),

    /**
     * Create a scheduling link
     */
    createSchedulingLink: (eventTypeUri: string, contactId?: number) =>
      this.client.post('/calendly/scheduling-link', {
        event_type_uri: eventTypeUri,
        contact_id: contactId
      }),

    /**
     * Get scheduled events
     */
    getEvents: (daysAhead: number = 30) =>
      this.client.get('/calendly/events', { params: { days_ahead: daysAhead } }),

    /**
     * Cancel an event
     */
    cancelEvent: (eventUri: string, reason: string = "") =>
      this.client.delete(`/calendly/events/${eventUri}`, { params: { reason } }),

    /**
     * Reschedule an event
     */
    rescheduleEvent: (eventUri: string, newStartTime: string) =>
      this.client.patch(`/calendly/events/${eventUri}`, { new_start_time: newStartTime }),

    /**
     * Get event details
     */
    getEventDetails: (eventUri: string) =>
      this.client.get(`/calendly/events/${eventUri}`),

    /**
     * Create meeting from lead
     */
    createMeetingFromLead: (contactId: number, eventTypeName: string = 'Initial Consultation') =>
      this.client.post(`/calendly/meeting-from-lead/${contactId}`, null, {
        params: { event_type_name: eventTypeName }
      }),

    /**
     * Get upcoming meetings
     */
    upcomingMeetings: (daysAhead: number = 7) =>
      this.client.get('/calendly/upcoming-meetings', { params: { days_ahead: daysAhead } }),
  };

  // ============================================================================
  // BULK IMPORT API
  // ============================================================================

  bulkImport = {
    /**
     * Import contacts from file
     */
    importContacts: (file: File, stakeholderType: string) => {
      const formData = new FormData();
      formData.append('file', file);
      return this.client.post('/bulk-import/contacts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { stakeholder_type: stakeholderType },
      });
    },

    /**
     * Get import template
     */
    getTemplate: (importType: 'contacts' | 'organizations') =>
      this.client.get(`/bulk-import/template/${importType}`),

    /**
     * Get import status
     */
    getImportStatus: (importId: string) =>
      this.client.get(`/bulk-import/status/${importId}`),
  };

  // ============================================================================
  // ENRICHMENT API
  // ============================================================================

  enrichment = {
    /**
     * Enrich a contact or by email
     */
    enrich: (contactId?: number, email?: string) =>
      this.client.post<EnrichmentResponse>('/enrich', { contact_id: contactId, email }),

    /**
     * Bulk enrich multiple contacts
     */
    bulkEnrich: (contacts: EnrichmentRequest[]) =>
      this.client.post<BulkEnrichmentResponse>('/enrich/bulk', { contacts }),

    /**
     * Get enrichment statistics
     */
    stats: () =>
      this.client.get<EnrichmentStats>('/enrichment/stats'),
  };

  // ============================================================================
  // DEALS API
  // ============================================================================

  deals = {
    /**
     * List deals with filtering
     */
    list: (params?: DealListParams) =>
      this.client.get<Deal[]>('/', { params }),

    /**
     * Get a specific deal
     */
    get: (id: number) =>
      this.client.get<Deal>(`/${id}`),

    /**
     * Create a new deal
     */
    create: (data: DealCreate) =>
      this.client.post<Deal>('/', data),

    /**
     * Update a deal
     */
    update: (id: number, data: DealUpdate) =>
      this.client.put<Deal>(`/${id}`, data),

    /**
     * Delete a deal
     */
    delete: (id: number) =>
      this.client.delete(`/${id}`),

    /**
     * Get deals for a contact
     */
    getByContact: (contactId: number) =>
      this.client.get<Deal[]>(`/contact/${contactId}`),
  };

  // ============================================================================
  // INTERACTIONS API
  // ============================================================================

  interactions = {
    /**
     * List interactions with filtering
     */
    list: (params?: InteractionListParams) =>
      this.client.get<Interaction[]>('/', { params }),

    /**
     * Get interactions for a contact
     */
    getByContact: (contactId: number, params?: InteractionListParams) =>
      this.client.get<Interaction[]>(`/contact/${contactId}`, { params }),

    /**
     * Create a new interaction
     */
    create: (data: InteractionCreate) =>
      this.client.post<Interaction>('/', data),

    /**
     * Update an interaction
     */
    update: (id: number, data: InteractionUpdate) =>
      this.client.put<Interaction>(`/${id}`, data),

    /**
     * Delete an interaction
     */
    delete: (id: number) =>
      this.client.delete(`/${id}`),
  };
}

// Create and export singleton instance
export const crmApi = new CRMApiClient();
