/**
 * NILBx CRM React Query Hooks
 * Provides React Query hooks for all CRM API operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '../lib/crm-client';
import type {
  ContactCreate,
  ContactUpdate,
  ContactListParams,
  CampaignCreate,
  CampaignUpdate,
  CampaignListParams,
  DealCreate,
  DealUpdate,
  DealListParams,
  InteractionCreate,
  InteractionUpdate,
  InteractionListParams,
} from '../types/crm';

// ============================================================================
// CONTACTS HOOKS
// ============================================================================

export const useContacts = (params?: ContactListParams) => {
  return useQuery({
    queryKey: ['crm', 'contacts', params],
    queryFn: () => crmApi.contacts.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useContact = (id: number) => {
  return useQuery({
    queryKey: ['crm', 'contacts', id],
    queryFn: () => crmApi.contacts.get(id),
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactCreate) => crmApi.contacts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContactUpdate }) =>
      crmApi.contacts.update(id, data),
    onSuccess: (response) => {
      const updatedContact = response.data;
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
      queryClient.setQueryData(['crm', 'contacts', updatedContact.id], updatedContact);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => crmApi.contacts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
    },
  });
};

export const useInfluencers = (params?: ContactListParams) => {
  return useQuery({
    queryKey: ['crm', 'influencers', params],
    queryFn: () => crmApi.contacts.listInfluencers(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCoaches = (params?: ContactListParams) => {
  return useQuery({
    queryKey: ['crm', 'coaches', params],
    queryFn: () => crmApi.contacts.listCoaches(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEnrichContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => crmApi.contacts.enrich(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts', id] });
    },
  });
};

export const useEnrichmentStats = () => {
  return useQuery({
    queryKey: ['crm', 'enrichment', 'stats'],
    queryFn: () => crmApi.contacts.getEnrichmentStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============================================================================
// CAMPAIGNS HOOKS
// ============================================================================

export const useCampaigns = (params?: CampaignListParams) => {
  return useQuery({
    queryKey: ['crm', 'campaigns', params],
    queryFn: () => crmApi.campaigns.list(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCampaign = (id: number) => {
  return useQuery({
    queryKey: ['crm', 'campaigns', id],
    queryFn: () => crmApi.campaigns.get(id),
    enabled: !!id,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CampaignCreate) => crmApi.campaigns.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'campaigns'] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CampaignUpdate }) =>
      crmApi.campaigns.update(id, data),
    onSuccess: (response) => {
      const updatedCampaign = response.data;
      queryClient.invalidateQueries({ queryKey: ['crm', 'campaigns'] });
      queryClient.setQueryData(['crm', 'campaigns', updatedCampaign.id], updatedCampaign);
    },
  });
};

export const useSendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => crmApi.campaigns.send(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'campaigns', id] });
    },
  });
};

export const useScheduleCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, scheduledAt }: { id: number; scheduledAt: string }) =>
      crmApi.campaigns.schedule(id, scheduledAt),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'campaigns', id] });
    },
  });
};

export const useCampaignAnalytics = (id: number) => {
  return useQuery({
    queryKey: ['crm', 'campaigns', id, 'analytics'],
    queryFn: () => crmApi.campaigns.analytics(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => crmApi.campaigns.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'campaigns'] });
    },
  });
};

// ============================================================================
// ANALYTICS HOOKS
// ============================================================================

export const useDashboardMetrics = (days: number = 30) => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'dashboard', days],
    queryFn: () => crmApi.analytics.dashboard(days),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOverviewMetrics = (days: number = 30) => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'overview', days],
    queryFn: () => crmApi.analytics.overview(days),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCampaignPerformance = (days: number = 30) => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'campaign-performance', days],
    queryFn: () => crmApi.analytics.campaignPerformance(days),
    staleTime: 10 * 60 * 1000,
  });
};

export const useLeadScoringAnalytics = () => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'lead-scoring'],
    queryFn: () => crmApi.analytics.leadScoring(),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePipelineHealth = () => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'pipeline-health'],
    queryFn: () => crmApi.analytics.pipelineHealth(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRevenueTracking = (days: number = 30) => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'revenue-tracking', days],
    queryFn: () => crmApi.analytics.revenueTracking(days),
    staleTime: 10 * 60 * 1000,
  });
};

export const useEngagementMetrics = (days: number = 30) => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'engagement', days],
    queryFn: () => crmApi.analytics.engagement(days),
    staleTime: 10 * 60 * 1000,
  });
};

export const useLeadScoreChart = () => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'charts', 'lead-scores'],
    queryFn: () => crmApi.analytics.leadScoreChart(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const usePipelineFunnelChart = () => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'charts', 'pipeline-funnel'],
    queryFn: () => crmApi.analytics.pipelineFunnelChart(),
    staleTime: 15 * 60 * 1000,
  });
};

export const useRevenueTrendsChart = (days: number = 90) => {
  return useQuery({
    queryKey: ['crm', 'analytics', 'charts', 'revenue-trends', days],
    queryFn: () => crmApi.analytics.revenueTrendsChart(days),
    staleTime: 15 * 60 * 1000,
  });
};

// ============================================================================
// LEAD SCORING HOOKS
// ============================================================================

export const useScoreContact = () => {
  return useMutation({
    mutationFn: (contactId: number) => crmApi.leadScoring.score(contactId),
  });
};

export const useBulkScoreContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactIds: number[]) => crmApi.leadScoring.bulkScore(contactIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'analytics'] });
    },
  });
};

export const useScoringInsights = () => {
  return useQuery({
    queryKey: ['crm', 'lead-scoring', 'insights'],
    queryFn: () => crmApi.leadScoring.insights(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useTopLeads = (minScore: number = 70, limit: number = 50) => {
  return useQuery({
    queryKey: ['crm', 'lead-scoring', 'top-leads', minScore, limit],
    queryFn: () => crmApi.leadScoring.topLeads(minScore, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateLeadScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, score, status }: { contactId: number; score: number; status?: string }) =>
      crmApi.leadScoring.updateManual(contactId, score, status),
    onSuccess: (_, { contactId }) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts', contactId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'analytics'] });
    },
  });
};

// ============================================================================
// PIPELINE HOOKS
// ============================================================================

export const usePipelineStatus = (contactId: number) => {
  return useQuery({
    queryKey: ['crm', 'pipeline', contactId],
    queryFn: () => crmApi.pipeline.getStatus(contactId),
    enabled: !!contactId,
  });
};

export const useAdvancePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, newStage, notes }: { contactId: number; newStage: string; notes?: string }) =>
      crmApi.pipeline.advance(contactId, newStage, notes),
    onSuccess: (_, { contactId }) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'pipeline', contactId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'analytics'] });
    },
  });
};

export const usePipelineOverview = (stakeholderType?: string) => {
  return useQuery({
    queryKey: ['crm', 'pipeline', 'overview', stakeholderType],
    queryFn: () => crmApi.pipeline.overview(stakeholderType),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTriggerFollowUps = () => {
  return useMutation({
    mutationFn: () => crmApi.pipeline.triggerFollowUps(),
  });
};

// ============================================================================
// CALENDLY HOOKS
// ============================================================================

export const useCalendlyUser = () => {
  return useQuery({
    queryKey: ['crm', 'calendly', 'user'],
    queryFn: () => crmApi.calendly.getUser(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCalendlyEventTypes = () => {
  return useQuery({
    queryKey: ['crm', 'calendly', 'event-types'],
    queryFn: () => crmApi.calendly.listEventTypes(),
    staleTime: 15 * 60 * 1000,
  });
};

export const useCreateCalendlyEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, duration, description }: { name: string; duration?: number; description?: string }) =>
      crmApi.calendly.createEventType(name, duration, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'calendly', 'event-types'] });
    },
  });
};

export const useCalendlyAvailability = (userUri: string, days: number = 7) => {
  return useQuery({
    queryKey: ['crm', 'calendly', 'availability', userUri, days],
    queryFn: () => crmApi.calendly.getAvailability(userUri, days),
    enabled: !!userUri,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSchedulingLink = () => {
  return useMutation({
    mutationFn: ({ eventTypeUri, contactId }: { eventTypeUri: string; contactId?: number }) =>
      crmApi.calendly.createSchedulingLink(eventTypeUri, contactId),
  });
};

export const useCalendlyEvents = (daysAhead: number = 30) => {
  return useQuery({
    queryKey: ['crm', 'calendly', 'events', daysAhead],
    queryFn: () => crmApi.calendly.getEvents(daysAhead),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCancelCalendlyEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventUri, reason }: { eventUri: string; reason?: string }) =>
      crmApi.calendly.cancelEvent(eventUri, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'calendly', 'events'] });
    },
  });
};

export const useRescheduleCalendlyEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventUri, newStartTime }: { eventUri: string; newStartTime: string }) =>
      crmApi.calendly.rescheduleEvent(eventUri, newStartTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'calendly', 'events'] });
    },
  });
};

export const useCalendlyEventDetails = (eventUri: string) => {
  return useQuery({
    queryKey: ['crm', 'calendly', 'events', eventUri],
    queryFn: () => crmApi.calendly.getEventDetails(eventUri),
    enabled: !!eventUri,
  });
};

export const useCreateMeetingFromLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, eventTypeName }: { contactId: number; eventTypeName?: string }) =>
      crmApi.calendly.createMeetingFromLead(contactId, eventTypeName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'calendly', 'events'] });
    },
  });
};

export const useUpcomingMeetings = (daysAhead: number = 7) => {
  return useQuery({
    queryKey: ['crm', 'calendly', 'upcoming-meetings', daysAhead],
    queryFn: () => crmApi.calendly.upcomingMeetings(daysAhead),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ============================================================================
// DEALS HOOKS
// ============================================================================

export const useDeals = (params?: DealListParams) => {
  return useQuery({
    queryKey: ['crm', 'deals', params],
    queryFn: () => crmApi.deals.list(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeal = (id: number) => {
  return useQuery({
    queryKey: ['crm', 'deals', id],
    queryFn: () => crmApi.deals.get(id),
    enabled: !!id,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DealCreate) => crmApi.deals.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'deals'] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'analytics'] });
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DealUpdate }) =>
      crmApi.deals.update(id, data),
    onSuccess: (response) => {
      const updatedDeal = response.data;
      queryClient.invalidateQueries({ queryKey: ['crm', 'deals'] });
      queryClient.setQueryData(['crm', 'deals', updatedDeal.id], updatedDeal);
      queryClient.invalidateQueries({ queryKey: ['crm', 'analytics'] });
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => crmApi.deals.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'deals'] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'analytics'] });
    },
  });
};

export const useDealsByContact = (contactId: number) => {
  return useQuery({
    queryKey: ['crm', 'deals', 'contact', contactId],
    queryFn: () => crmApi.deals.getByContact(contactId),
    enabled: !!contactId,
  });
};

// ============================================================================
// INTERACTIONS HOOKS
// ============================================================================

export const useInteractions = (params?: InteractionListParams) => {
  return useQuery({
    queryKey: ['crm', 'interactions', params],
    queryFn: () => crmApi.interactions.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useInteractionsByContact = (contactId: number, params?: InteractionListParams) => {
  return useQuery({
    queryKey: ['crm', 'interactions', 'contact', contactId, params],
    queryFn: () => crmApi.interactions.getByContact(contactId, params),
    enabled: !!contactId,
  });
};

export const useCreateInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InteractionCreate) => crmApi.interactions.create(data),
    onSuccess: (response) => {
      const newInteraction = response.data;
      queryClient.invalidateQueries({ queryKey: ['crm', 'interactions'] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts', newInteraction.contact_id] });
    },
  });
};

export const useUpdateInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InteractionUpdate }) =>
      crmApi.interactions.update(id, data),
    onSuccess: (response) => {
      const updatedInteraction = response.data;
      queryClient.invalidateQueries({ queryKey: ['crm', 'interactions'] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts', updatedInteraction.contact_id] });
    },
  });
};

export const useDeleteInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => crmApi.interactions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'interactions'] });
    },
  });
};

// ============================================================================
// ENRICHMENT HOOKS
// ============================================================================

export const useEnrichContactData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, email }: { contactId?: number; email?: string }) =>
      crmApi.enrichment.enrich(contactId, email),
    onSuccess: (_, { contactId }) => {
      if (contactId) {
        queryClient.invalidateQueries({ queryKey: ['crm', 'contacts', contactId] });
      }
    },
  });
};

export const useBulkEnrichContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requests: Array<{ contact_id?: number; email?: string; linkedin_url?: string; company_name?: string }>) =>
      crmApi.enrichment.bulkEnrich(requests),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'enrichment', 'stats'] });
    },
  });
};

export const useEnrichmentStatsDetailed = () => {
  return useQuery({
    queryKey: ['crm', 'enrichment', 'stats'],
    queryFn: () => crmApi.enrichment.stats(),
    staleTime: 10 * 60 * 1000,
  });
};
