/**
 * State-by-State NIL Compliance Rules Configuration
 * All 50 states + DC categorized by tier with specific compliance requirements
 * 
 * Tier 1 (TIER_1): Most permissive - minimal requirements
 * Tier 2 (TIER_2): Moderate - requires parental consent/school notification
 * Tier 3 (TIER_3): Restrictive - limited or no high school NIL opportunities
 */

export const STATE_RULES = {
  // ============================================================================
  // TIER 1: PERMISSIVE STATES (9) - Green Light - Full Access
  // ============================================================================
  
  'CA': {
    name: 'California',
    tier: 'TIER_1',
    description: 'Fair Pay to Play Act - Most permissive',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },
  'FL': {
    name: 'Florida',
    tier: 'TIER_1',
    description: 'Explicitly allows high school NIL',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },
  'TX': {
    name: 'Texas',
    tier: 'TIER_1',
    description: 'Explicitly authorized NIL',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },
  'OH': {
    name: 'Ohio',
    tier: 'TIER_1',
    description: 'Clear NIL guidelines',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },
  'PA': {
    name: 'Pennsylvania',
    tier: 'TIER_1',
    description: 'NIL permitted',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },
  'NY': {
    name: 'New York',
    tier: 'TIER_1',
    description: 'Open market for NIL',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },
  'IL': {
    name: 'Illinois',
    tier: 'TIER_1',
    description: 'NIL permitted',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },
  'GA': {
    name: 'Georgia',
    tier: 'TIER_1',
    description: 'High school NIL allowed',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },
  'NC': {
    name: 'North Carolina',
    tier: 'TIER_1',
    description: 'Open NIL market',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'under_18',
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: ['adult_content', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 50,
    maxDealAmount: 500000,
    reviewDelayHours: 0,
    requirementsList: [
      'Age verification',
      'Parental consent (if under 18)',
      'Content moderation review'
    ],
    restrictions: 'None - all deal types allowed except blacklist'
  },

  // ============================================================================
  // TIER 2: MODERATE STATES (20+) - Yellow Light - Standard Track
  // ============================================================================
  
  'VA': {
    name: 'Virginia',
    tier: 'TIER_2',
    description: 'Restrictions + parental consent required',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded; lower deal limits'
  },
  'MI': {
    name: 'Michigan',
    tier: 'TIER_2',
    description: 'Guidelines apply with parental consent',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded; lower deal limits'
  },
  'CO': {
    name: 'Colorado',
    tier: 'TIER_2',
    description: 'Coordinate with CHSAA oversight',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: true,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 48,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School approval (CHSAA)',
      '48-hour review period'
    ],
    restrictions: 'CHSAA coordination required; no controversial brands'
  },
  'IN': {
    name: 'Indiana',
    tier: 'TIER_2',
    description: 'Limited deals with IHSAA notification',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol', 'apparel_brands'],
    minDealAmount: 100,
    maxDealAmount: 200000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'IHSAA notification',
      '24-hour review period'
    ],
    restrictions: 'Limited deal types; no apparel brands'
  },
  'MN': {
    name: 'Minnesota',
    tier: 'TIER_2',
    description: 'Emerging framework with moderate restrictions',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'WI': {
    name: 'Wisconsin',
    tier: 'TIER_2',
    description: 'Moderate restrictions in place',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'MO': {
    name: 'Missouri',
    tier: 'TIER_2',
    description: 'State guidelines apply',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'TN': {
    name: 'Tennessee',
    tier: 'TIER_2',
    description: 'Moderate restrictions framework',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'KY': {
    name: 'Kentucky',
    tier: 'TIER_2',
    description: 'Standard restrictions apply',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'MD': {
    name: 'Maryland',
    tier: 'TIER_2',
    description: 'Moderate state framework',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'MA': {
    name: 'Massachusetts',
    tier: 'TIER_2',
    description: 'Emerging regulations',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'NJ': {
    name: 'New Jersey',
    tier: 'TIER_2',
    description: 'State guidelines in development',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'CT': {
    name: 'Connecticut',
    tier: 'TIER_2',
    description: 'Moderate compliance framework',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'OR': {
    name: 'Oregon',
    tier: 'TIER_2',
    description: 'Emerging framework with restrictions',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'WA': {
    name: 'Washington',
    tier: 'TIER_2',
    description: 'State guidelines emerging',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'NV': {
    name: 'Nevada',
    tier: 'TIER_2',
    description: 'Moderate framework',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },
  'AZ': {
    name: 'Arizona',
    tier: 'TIER_2',
    description: 'Emerging state guidelines',
    hsNilAllowed: true,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: 'always',
    schoolApprovalRequired: false,
    schoolNotificationRequired: true,
    dealTypesBlacklist: ['adult_content', 'controversial_brands', 'gambling', 'tobacco', 'alcohol'],
    minDealAmount: 100,
    maxDealAmount: 250000,
    reviewDelayHours: 24,
    requirementsList: [
      'Age verification',
      'Parental consent (mandatory)',
      'School notification',
      '24-hour review period'
    ],
    restrictions: 'Controversial brands excluded'
  },

  // ============================================================================
  // TIER 3: RESTRICTIVE STATES (21) - Red Light - Limited Opportunities
  // ============================================================================
  
  'UT': {
    name: 'Utah',
    tier: 'TIER_3',
    description: 'Framework unclear - minimal opportunities',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL opportunities - HS athlete registration not recommended'
  },
  'WY': {
    name: 'Wyoming',
    tier: 'TIER_3',
    description: 'No NIL framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No NIL framework - HS athlete registration not available'
  },
  'IA': {
    name: 'Iowa',
    tier: 'TIER_3',
    description: 'Still forming policies',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL framework - check back later'
  },
  'SD': {
    name: 'South Dakota',
    tier: 'TIER_3',
    description: 'Minimal framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No clear NIL policy'
  },
  'ND': {
    name: 'North Dakota',
    tier: 'TIER_3',
    description: 'No NIL framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No NIL framework established'
  },
  'MS': {
    name: 'Mississippi',
    tier: 'TIER_3',
    description: 'Still forming policies',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL framework'
  },
  'AL': {
    name: 'Alabama',
    tier: 'TIER_3',
    description: 'No clear NIL policy',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No NIL framework for HS athletes'
  },
  'LA': {
    name: 'Louisiana',
    tier: 'TIER_3',
    description: 'Forming policies',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL opportunities'
  },
  'AR': {
    name: 'Arkansas',
    tier: 'TIER_3',
    description: 'Minimal framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No clear NIL policy'
  },
  'OK': {
    name: 'Oklahoma',
    tier: 'TIER_3',
    description: 'Still forming policies',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL framework'
  },
  'KS': {
    name: 'Kansas',
    tier: 'TIER_3',
    description: 'No NIL framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No established NIL policy'
  },
  'NE': {
    name: 'Nebraska',
    tier: 'TIER_3',
    description: 'Minimal framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No clear NIL policy'
  },
  'HI': {
    name: 'Hawaii',
    tier: 'TIER_3',
    description: 'Forming policies',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL framework'
  },
  'AK': {
    name: 'Alaska',
    tier: 'TIER_3',
    description: 'No NIL framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No established NIL policy'
  },
  'MT': {
    name: 'Montana',
    tier: 'TIER_3',
    description: 'Forming policies',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL opportunities'
  },
  'ID': {
    name: 'Idaho',
    tier: 'TIER_3',
    description: 'Minimal framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No clear NIL policy'
  },
  'VT': {
    name: 'Vermont',
    tier: 'TIER_3',
    description: 'No NIL framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No established NIL policy'
  },
  'ME': {
    name: 'Maine',
    tier: 'TIER_3',
    description: 'Forming policies',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL framework'
  },
  'NH': {
    name: 'New Hampshire',
    tier: 'TIER_3',
    description: 'Minimal framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No clear NIL policy'
  },
  'RI': {
    name: 'Rhode Island',
    tier: 'TIER_3',
    description: 'No NIL framework',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'No established NIL policy'
  },
  'DC': {
    name: 'Washington DC',
    tier: 'TIER_3',
    description: 'Forming policies',
    hsNilAllowed: false,
    msNilAllowed: false,
    collegeNilAllowed: true,
    parentalConsentRequired: false,
    schoolApprovalRequired: false,
    schoolNotificationRequired: false,
    dealTypesBlacklist: [],
    minDealAmount: 0,
    maxDealAmount: 0,
    reviewDelayHours: 0,
    requirementsList: ['Consider influencer registration instead'],
    restrictions: 'Limited NIL opportunities'
  }
};

/**
 * Helper Functions
 */

export const getTier = (state) => {
  const rules = STATE_RULES[state?.toUpperCase()];
  return rules ? rules.tier : null;
};

export const getStateRules = (state) => {
  return STATE_RULES[state?.toUpperCase()] || null;
};

export const getAllStates = () => {
  return Object.keys(STATE_RULES).sort();
};

export const getStatesByTier = (tier) => {
  return Object.entries(STATE_RULES)
    .filter(([_, rules]) => rules.tier === tier)
    .map(([state, rules]) => ({ state, ...rules }));
};

export const canRegisterAsHSAthlete = (state) => {
  const rules = getStateRules(state);
  return rules ? rules.hsNilAllowed : false;
};

export const canRegisterAsMSAthlete = (state) => {
  const rules = getStateRules(state);
  return rules ? rules.msNilAllowed : false;
};

export const requiresParentalConsent = (state, age) => {
  const rules = getStateRules(state);
  if (!rules) return false;
  if (rules.parentalConsentRequired === 'always') return true;
  if (rules.parentalConsentRequired === 'under_18' && age < 18) return true;
  return false;
};

export const requiresSchoolNotification = (state) => {
  const rules = getStateRules(state);
  return rules ? rules.schoolNotificationRequired : false;
};

export const getDealRestrictions = (state) => {
  const rules = getStateRules(state);
  if (!rules) return [];
  return {
    blacklist: rules.dealTypesBlacklist,
    minAmount: rules.minDealAmount,
    maxAmount: rules.maxDealAmount,
    reviewDelayHours: rules.reviewDelayHours
  };
};

export const isValidDealAmount = (state, amount) => {
  const rules = getStateRules(state);
  if (!rules) return false;
  return amount >= rules.minDealAmount && amount <= rules.maxDealAmount;
};

export const isValidDealType = (state, dealType) => {
  const rules = getStateRules(state);
  if (!rules) return false;
  return !rules.dealTypesBlacklist.includes(dealType);
};

export default STATE_RULES;
