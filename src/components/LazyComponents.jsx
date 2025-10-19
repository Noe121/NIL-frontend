// Lazy-loaded components for better performance
import { createLazyRoute } from '../utils/performance.js';

// Lazy load dashboard components
export const LazyAthleteDashboard = createLazyRoute(
  () => import('../views/AthleteDashboard.jsx')
);

export const LazySponsorDashboard = createLazyRoute(
  () => import('../views/SponsorDashboard.jsx')
);

export const LazyFanDashboard = createLazyRoute(
  () => import('../views/FanDashboard.jsx')
);

// Lazy load other view components
export const LazyLandingPage = createLazyRoute(
  () => import('../LandingPage.jsx')
);

export const LazyUserInfo = createLazyRoute(
  () => import('../UserInfo.jsx')
);

// Profile and management components
// TODO: Create these view components
/*
export const LazyProfileManagement = createLazyRoute(
  () => import('../views/ProfileManagement.jsx')
);

export const LazySponsorshipManagement = createLazyRoute(
  () => import('../views/SponsorshipManagement.jsx')
);

export const LazyAthleteSearch = createLazyRoute(
  () => import('../views/AthleteSearch.jsx')
);

export const LazyAnalytics = createLazyRoute(
  () => import('../views/Analytics.jsx')
);

export const LazyReports = createLazyRoute(
  () => import('../views/Reports.jsx')
);
*/

// Additional view components - TODO: Create these
/*
export const LazySchedule = createLazyRoute(
  () => import('../views/Schedule.jsx')
);

export const LazyStore = createLazyRoute(
  () => import('../views/Store.jsx')
);

export const LazyNotifications = createLazyRoute(
  () => import('../views/Notifications.jsx')
);

export const LazyAthleteProfiles = createLazyRoute(
  () => import('../views/AthleteProfiles.jsx')
);
*/

// Authentication components (keep small ones non-lazy for faster initial load)
// Auth and Register are kept as regular imports since they're entry points