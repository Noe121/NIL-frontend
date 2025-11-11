// frontend/src/test-data/workflows.js

/**
 * NILBx Workflow Test Data - Frontend (React/JavaScript)
 *
 * Comprehensive test data covering all 12 NIL workflow types
 * Used for development, testing, and demonstration purposes
 */

export const WORKFLOW_TEST_DATA = {
  // ==========================================
  // WORKFLOW TYPE 1: Brand → Athlete (Traditional NIL)
  // ==========================================
  traditional_nil: {
    id: "wf_traditional_nil_001",
    type: "brand_to_athlete",
    title: "Traditional NIL Deal",
    description: "Brand creates NIL deal contract with student athlete",
    participants: {
      brand: {
        id: 100,
        name: "Nike",
        type: "brand"
      },
      athlete: {
        id: 200,
        name: "Alex Johnson",
        sport: "Basketball",
        school: "University of California",
        type: "athlete"
      }
    },
    contract: {
      deal_type: "brand_to_athlete",
      brand_id: 100,
      athlete_id: 200,
      deliverables: [
        {
          type: "social_post",
          platform: "instagram",
          required_hashtags: ["#Nike", "#NIL", "#StudentAthlete"],
          required_mentions: ["@Nike"],
          due_date: "2025-02-01",
          status: "pending"
        },
        {
          type: "geo_checkin",
          location: "Nike Store - Downtown LA",
          geo_fence: { lat: 34.0522, lng: -118.2437, radius: 50 },
          due_date: "2025-02-05",
          status: "pending"
        },
        {
          type: "photo_with_product",
          product: "Nike Air Max",
          due_date: "2025-02-10",
          status: "pending"
        }
      ],
      compensation: 5000.00,
      timeline: "30 days",
      status: "draft"
    },
    verification_steps: [
      {
        step: "social_verification",
        description: "Verify social media posts contain required hashtags and mentions",
        automated: true,
        status: "pending"
      },
      {
        step: "geo_verification",
        description: "Verify athlete checked in at specified location",
        automated: true,
        status: "pending"
      },
      {
        step: "engagement_tracking",
        description: "Track post engagement metrics",
        automated: true,
        status: "pending"
      },
      {
        step: "ncaa_compliance",
        description: "Verify NCAA compliance requirements",
        automated: false,
        status: "pending"
      },
      {
        step: "brand_approval",
        description: "Brand reviews and approves deliverables",
        automated: false,
        status: "pending"
      }
    ]
  },

  // ==========================================
  // WORKFLOW TYPE 2: Brand → Micro-Influencer
  // ==========================================
  micro_influencer: {
    id: "wf_micro_influencer_002",
    type: "brand_to_influencer",
    title: "Micro-Influencer Partnership",
    description: "Brand partners with micro-influencer for content creation",
    participants: {
      brand: {
        id: 101,
        name: "Adidas",
        type: "brand"
      },
      influencer: {
        id: 300,
        name: "Sarah Chen",
        platform: "TikTok",
        followers: 25000,
        niche: "Fitness",
        type: "influencer"
      }
    },
    contract: {
      deal_type: "brand_to_influencer",
      brand_id: 101,
      influencer_id: 300,
      content_requirements: [
        "Product unboxing video",
        "Tutorial demonstrating product use",
        "Story series showcasing features",
        "User-generated content integration"
      ],
      posting_schedule: [
        { type: "reel", date: "2025-02-15", platform: "tiktok" },
        { type: "story", date: "2025-02-16", platform: "instagram" },
        { type: "post", date: "2025-02-18", platform: "instagram" }
      ],
      engagement_targets: {
        min_likes: 1000,
        min_comments: 50,
        min_shares: 25
      },
      usage_rights: "6 months commercial use",
      compensation: 2500.00,
      status: "active"
    },
    deliverables: [
      {
        id: "del_001",
        type: "tiktok_reel",
        title: "Adidas Ultraboost Unboxing",
        due_date: "2025-02-15",
        status: "completed",
        metrics: { likes: 2500, comments: 120, shares: 85 }
      },
      {
        id: "del_002",
        type: "instagram_story",
        title: "Daily Story Series",
        due_date: "2025-02-16",
        status: "in_progress",
        metrics: { views: 5000, interactions: 200 }
      }
    ]
  },

  // ==========================================
  // WORKFLOW TYPE 3: Brand → Multiple Athletes (Team)
  // ==========================================
  team_sponsorship: {
    id: "wf_team_sponsorship_003",
    type: "team_sponsorship",
    title: "Team Sponsorship Deal",
    description: "Brand sponsors entire athletic team",
    participants: {
      brand: {
        id: 102,
        name: "Under Armour",
        type: "brand"
      },
      team: {
        name: "UCLA Bruins Basketball",
        athletes: [
          { id: 201, name: "Jordan Smith", position: "Point Guard" },
          { id: 202, name: "Marcus Johnson", position: "Shooting Guard" },
          { id: 203, name: "Tyler Davis", position: "Small Forward" },
          { id: 204, name: "Kevin Brown", position: "Power Forward" },
          { id: 205, name: "Alex Wilson", position: "Center" }
        ]
      }
    },
    contract: {
      deal_type: "team_sponsorship",
      brand_id: 102,
      athletes: [201, 202, 203, 204, 205],
      shared_deliverables: [
        {
          type: "team_photo",
          location: "Pauley Pavilion",
          all_required: true,
          due_date: "2025-03-01"
        },
        {
          type: "coordinated_posts",
          date: "2025-03-15",
          time_window: "6pm-8pm",
          platforms: ["instagram", "twitter"]
        }
      ],
      individual_deliverables: [
        {
          type: "social_post",
          per_athlete: true,
          requirements: "Personal story about gear"
        }
      ],
      compensation_per_athlete: 1000.00,
      team_bonus: 2000.00,
      coordinator: {
        name: "Coach Martinez",
        role: "Team Coordinator"
      }
    }
  },

  // ==========================================
  // WORKFLOW TYPE 4: Athlete → Brand (Athlete-Initiated)
  // ==========================================
  athlete_initiated: {
    id: "wf_athlete_initiated_004",
    type: "athlete_to_brand",
    title: "Athlete-Initiated Deal",
    description: "Athlete proactively pitches to brand",
    participants: {
      athlete: {
        id: 206,
        name: "Emma Rodriguez",
        sport: "Soccer",
        school: "Stanford University",
        stats: {
          followers: 45000,
          engagement_rate: 8.5,
          avg_impressions: 25000
        }
      },
      brand: {
        id: 103,
        name: "Puma",
        type: "brand"
      }
    },
    proposal: {
      athlete_profile: {
        reach: "45K followers across Instagram/TikTok",
        engagement: "8.5% average engagement rate",
        content_style: "Motivational fitness content",
        target_audience: "18-25 year old fitness enthusiasts"
      },
      proposed_deliverables: [
        "3 Instagram posts per month",
        "2 TikTok videos per month",
        "Monthly story takeovers",
        "Product launch participation"
      ],
      asking_compensation: 8000.00,
      proposed_timeline: "6 months",
      unique_value_prop: "Authentic fitness journey storytelling"
    },
    negotiation_history: [
      {
        round: 1,
        athlete_offer: 8000.00,
        brand_counter: 6000.00,
        status: "rejected"
      },
      {
        round: 2,
        athlete_offer: 7000.00,
        brand_counter: 6500.00,
        status: "accepted"
      }
    ]
  },

  // ==========================================
  // WORKFLOW TYPE 5: Marketplace Deal (Open Market)
  // ==========================================
  marketplace_open: {
    id: "wf_marketplace_open_005",
    type: "marketplace_open",
    title: "Open Marketplace Deal",
    description: "Brand posts open deal for any qualified athlete",
    participants: {
      brand: {
        id: 104,
        name: "Gatorade",
        type: "brand"
      }
    },
    marketplace_listing: {
      deal_type: "marketplace_open",
      brand_id: 104,
      available_slots: 10,
      requirements: {
        min_followers: 5000,
        sport: "any",
        location: "California",
        engagement_rate: 5.0
      },
      deliverables: [
        {
          type: "social_post",
          platform: "instagram",
          requirements: "Post with product, use brand hashtags"
        }
      ],
      compensation: 500.00,
      auto_accept: true,
      application_deadline: "2025-03-01"
    },
    applications: [
      {
        athlete_id: 207,
        name: "Carlos Mendez",
        followers: 8500,
        sport: "Baseball",
        applied_date: "2025-02-15",
        status: "accepted"
      },
      {
        athlete_id: 208,
        name: "Lisa Wong",
        followers: 6200,
        sport: "Volleyball",
        applied_date: "2025-02-16",
        status: "accepted"
      }
    ]
  },

  // ==========================================
  // WORKFLOW TYPE 6: Event-Based Deal
  // ==========================================
  event_based: {
    id: "wf_event_based_006",
    type: "event_appearance",
    title: "Game Day Appearance Deal",
    description: "Athlete appearance at brand event",
    participants: {
      brand: {
        id: 105,
        name: "State Farm",
        type: "brand"
      },
      athlete: {
        id: 209,
        name: "Ryan Thompson",
        sport: "Football",
        school: "Ohio State"
      },
      venue: {
        name: "Ohio Stadium",
        capacity: 102000
      }
    },
    event_details: {
      event_name: "Ohio State vs Michigan",
      date: "2025-11-15",
      time: "12:00 PM",
      location: "Ohio Stadium, Columbus OH",
      duration: "4 hours",
      activities: [
        "Pre-game meet & greet",
        "Halftime photo session",
        "Post-game autograph session",
        "Social media appearances"
      ]
    },
    contract: {
      deal_type: "event_based",
      brand_id: 105,
      athlete_id: 209,
      event_requirements: {
        checkin_time: "10:00 AM",
        geo_fence: { lat: 40.0142, lng: -83.0309, radius: 100 },
        duration: "4 hours",
        activities: ["meet_greet", "photos", "autographs", "social_media"]
      },
      compensation: 3000.00,
      bonus_structure: {
        engagement_bonus: "Extra $500 if fan engagement > 1000 interactions"
      }
    },
    verification: {
      geo_checkin: { status: "verified", timestamp: "2025-11-15T10:05:00Z" },
      activities_completed: ["meet_greet", "photos"],
      social_posts: 3,
      fan_engagement: 1250
    }
  },

  // ==========================================
  // WORKFLOW TYPE 7: Ongoing Ambassador Deal
  // ==========================================
  brand_ambassador: {
    id: "wf_brand_ambassador_007",
    type: "brand_ambassador",
    title: "Brand Ambassador Program",
    description: "Long-term brand ambassador relationship",
    participants: {
      brand: {
        id: 106,
        name: "Reebok",
        type: "brand"
      },
      athlete: {
        id: 210,
        name: "Maya Patel",
        sport: "Track & Field",
        school: "University of Oregon"
      }
    },
    contract: {
      deal_type: "brand_ambassador",
      brand_id: 106,
      athlete_id: 210,
      term: "12 months",
      monthly_deliverables: [
        { type: "instagram_post", quantity: 4 },
        { type: "instagram_story", quantity: 8 },
        { type: "engagement_minutes", quantity: 120 }
      ],
      monthly_compensation: 2000.00,
      quarterly_bonus: 1000.00,
      exclusivity: "sports apparel category",
      performance_metrics: {
        required_engagement_rate: 6.0,
        minimum_reach: 15000
      }
    },
    monthly_tracking: [
      {
        month: "January 2025",
        posts_completed: 4,
        stories_completed: 8,
        engagement_minutes: 145,
        avg_engagement: 7.2,
        compensation: 2000.00,
        bonus_earned: 250.00
      },
      {
        month: "February 2025",
        posts_completed: 4,
        stories_completed: 7,
        engagement_minutes: 118,
        avg_engagement: 6.8,
        compensation: 2000.00,
        bonus_earned: 0
      }
    ]
  },

  // ==========================================
  // WORKFLOW TYPE 8: Performance-Based Deal
  // ==========================================
  performance_based: {
    id: "wf_performance_based_008",
    type: "performance_based",
    title: "Commission-Based Partnership",
    description: "Revenue sharing based on performance",
    participants: {
      brand: {
        id: 107,
        name: "Gymshark",
        type: "brand"
      },
      influencer: {
        id: 301,
        name: "David Kim",
        platform: "YouTube",
        subscribers: 125000,
        niche: "Fitness"
      }
    },
    contract: {
      deal_type: "performance_based",
      brand_id: 107,
      influencer_id: 301,
      compensation_model: {
        base: 500.00,
        commission_rate: 0.10,
        bonus_tiers: {
          "10_sales": 100.00,
          "50_sales": 500.00,
          "100_sales": 1500.00
        }
      },
      tracking: {
        promo_code: "DAVID20",
        affiliate_link: "gymshark.com/ref/david",
        tracking_period: "6 months"
      },
      performance_targets: {
        min_conversion_rate: 2.0,
        target_sales: 50
      }
    },
    performance_data: {
      month_1: {
        clicks: 2500,
        conversions: 35,
        revenue: 1750.00,
        commission: 175.00,
        bonus: 100.00,
        total_earned: 775.00
      },
      month_2: {
        clicks: 3200,
        conversions: 52,
        revenue: 2600.00,
        commission: 260.00,
        bonus: 500.00,
        total_earned: 1260.00
      },
      total_to_date: {
        clicks: 5700,
        conversions: 87,
        revenue: 4350.00,
        commission: 435.00,
        bonus: 600.00,
        total_earned: 2035.00
      }
    }
  },

  // ==========================================
  // WORKFLOW TYPE 9: Content Licensing Deal
  // ==========================================
  content_licensing: {
    id: "wf_content_licensing_009",
    type: "content_licensing",
    title: "Content Licensing Agreement",
    description: "Brand licenses athlete's content for commercial use",
    participants: {
      brand: {
        id: 108,
        name: "ESPN",
        type: "media_brand"
      },
      athlete: {
        id: 211,
        name: "Taylor Swift",
        sport: "Soccer",
        school: "University of Tennessee"
      }
    },
    licensing_request: {
      content_type: "Highlight reel",
      usage_scope: ["website", "social_media", "broadcast"],
      duration: "2 years",
      territories: ["United States", "Canada"],
      requested_fee: 15000.00
    },
    negotiated_terms: {
      agreed_fee: 12000.00,
      usage_rights: "2 years worldwide digital rights",
      credit_requirements: "Photo credit to athlete",
      exclusivity: "Non-exclusive license",
      delivery_requirements: {
        format: "4K MP4",
        minimum_length: "60 seconds",
        maximum_length: "90 seconds"
      }
    },
    delivery_status: {
      submitted: true,
      approved: true,
      payment_processed: false,
      license_activated: false
    }
  },

  // ==========================================
  // WORKFLOW TYPE 10: Group Campaign (Multiple Brands)
  // ==========================================
  group_campaign: {
    id: "wf_group_campaign_010",
    type: "multi_brand_campaign",
    title: "Multi-Brand Campaign",
    description: "Athlete works with multiple non-competing brands",
    participants: {
      athlete: {
        id: 212,
        name: "Zoe Martinez",
        sport: "Swimming",
        school: "USC"
      },
      brands: [
        {
          id: 109,
          name: "Speedo",
          category: "Swimwear",
          compensation: 4000.00
        },
        {
          id: 110,
          name: "GogglesPlus",
          category: "Swimming Accessories",
          compensation: 2000.00
        },
        {
          id: 111,
          name: "SwimCap Co",
          category: "Swimming Accessories",
          compensation: 1500.00
        }
      ]
    },
    campaign_structure: {
      theme: "Summer Swimming Essentials",
      coordinated_schedule: {
        launch_date: "2025-06-01",
        campaign_duration: "8 weeks",
        key_milestones: [
          { date: "2025-06-01", event: "Campaign Launch" },
          { date: "2025-06-15", event: "Mid-campaign Check-in" },
          { date: "2025-07-15", event: "Campaign Wrap" }
        ]
      },
      brand_coordination: {
        shared_content: "Summer swimming tips",
        individual_features: "Brand-specific product highlights",
        cross_promotion: "Allowed with disclosure"
      }
    },
    deliverables: [
      {
        brand_id: 109,
        type: "product_showcase",
        platforms: ["instagram", "tiktok"],
        due_date: "2025-06-10",
        status: "completed"
      },
      {
        brand_id: 110,
        type: "tutorial_video",
        platforms: ["youtube"],
        due_date: "2025-06-20",
        status: "in_progress"
      }
    ]
  },

  // ==========================================
  // WORKFLOW TYPE 11: Tiered Deal (Milestone-Based)
  // ==========================================
  tiered_deal: {
    id: "wf_tiered_deal_011",
    type: "tiered_milestone",
    title: "Tiered Milestone Deal",
    description: "Progressive compensation based on achievement milestones",
    participants: {
      brand: {
        id: 112,
        name: "Red Bull",
        type: "brand"
      },
      athlete: {
        id: 213,
        name: "Jake Anderson",
        sport: "BMX",
        platform: "Instagram",
        followers: 78000
      }
    },
    tier_structure: {
      tier_1: {
        requirement: "Create and post initial content",
        deliverables: ["Instagram post", "Story series"],
        compensation: 500.00,
        status: "completed"
      },
      tier_2: {
        requirement: "Reach 10K impressions on content",
        metric_target: 10000,
        current_metric: 12500,
        compensation: 1000.00,
        status: "completed"
      },
      tier_3: {
        requirement: "Generate 100 clicks to brand link",
        metric_target: 100,
        current_metric: 87,
        compensation: 1500.00,
        status: "in_progress"
      },
      tier_4: {
        requirement: "Drive 10 product sales",
        metric_target: 10,
        current_metric: 0,
        compensation: 2500.00,
        status: "locked"
      }
    },
    progress_tracking: {
      total_earned: 1500.00,
      next_tier_unlock: "Tier 4 - Complete 100 link clicks",
      estimated_completion: "2025-03-15",
      performance_multiplier: 1.2
    }
  },

  // ==========================================
  // WORKFLOW TYPE 12: Charity/Cause Deal
  // ==========================================
  charity_deal: {
    id: "wf_charity_deal_012",
    type: "charity_cause",
    title: "Charity Awareness Campaign",
    description: "Athlete supports charitable cause with reduced/no compensation",
    participants: {
      nonprofit: {
        id: 113,
        name: "Special Olympics",
        cause: "Athlete support for special needs athletes",
        type: "nonprofit"
      },
      athlete: {
        id: 214,
        name: "Morgan Lee",
        sport: "Tennis",
        school: "Duke University"
      }
    },
    campaign_details: {
      cause_name: "Inclusive Sports for All",
      campaign_goals: [
        "Raise awareness for Special Olympics",
        "Recruit 50 new volunteers",
        "Generate $10,000 in donations",
        "Increase social media following by 20%"
      ],
      athlete_compensation: 0.00, // Pro bono
      tax_benefits: {
        volunteer_hours: 40,
        estimated_value: 2000.00,
        tax_deduction: "Consult tax advisor"
      }
    },
    deliverables: [
      {
        type: "awareness_post",
        platforms: ["instagram", "twitter"],
        content: "Why inclusive sports matter",
        due_date: "2025-03-01",
        status: "completed"
      },
      {
        type: "fundraising_link",
        platforms: ["link_in_bio"],
        goal: "$5000 raised",
        current_amount: 3200.00,
        status: "in_progress"
      },
      {
        type: "event_participation",
        event: "Special Olympics Fundraiser",
        date: "2025-04-15",
        activities: ["Speaking", "Photo ops", "Meet & greet"],
        status: "scheduled"
      }
    ],
    impact_metrics: {
      awareness_reach: 25000,
      volunteers_recruited: 35,
      funds_raised: 3200.00,
      social_growth: 15
    }
  },

  // ==========================================
  // INFLUENCER WORKFLOW TYPE 1: Content Creator Partnership
  // ==========================================
  content_creator_partnership: {
    id: "wf_content_creator_001",
    type: "influencer_content_creation",
    title: "Content Creator Partnership",
    description: "Brand partners with content creator for authentic product integration",
    participants: {
      brand: {
        id: 100,
        name: "Fashion Nova",
        type: "brand"
      },
      influencer: {
        id: 400,
        name: "Mia Thompson",
        platform: "Instagram",
        followers: 85000,
        niche: "Fashion & Lifestyle",
        type: "influencer"
      }
    },
    contract: {
      deal_type: "influencer_content_creation",
      brand_id: 100,
      influencer_id: 400,
      content_requirements: [
        "Product styling and outfit posts",
        "Behind-the-scenes content creation",
        "User-generated content features",
        "Story takeovers and live sessions"
      ],
      posting_schedule: [
        { type: "feed_post", date: "2025-02-20", platform: "instagram" },
        { type: "story_series", date: "2025-02-21", platform: "instagram" },
        { type: "reel", date: "2025-02-23", platform: "tiktok" },
        { type: "live_session", date: "2025-02-25", platform: "instagram" }
      ],
      engagement_targets: {
        min_likes: 2000,
        min_comments: 150,
        min_shares: 100,
        min_saves: 500
      },
      usage_rights: "12 months commercial use",
      compensation: 3500.00,
      status: "active"
    },
    deliverables: [
      {
        id: "del_inf_001",
        type: "instagram_feed_post",
        title: "Fashion Nova Outfit Showcase",
        due_date: "2025-02-20",
        status: "completed",
        metrics: { likes: 3200, comments: 180, shares: 120, saves: 650 }
      },
      {
        id: "del_inf_002",
        type: "tiktok_reel",
        title: "OOTD Transformation",
        due_date: "2025-02-23",
        status: "in_progress",
        metrics: { views: 15000, likes: 2100, comments: 95 }
      }
    ]
  },

  // ==========================================
  // INFLUENCER WORKFLOW TYPE 2: Affiliate Marketing Deal
  // ==========================================
  affiliate_marketing_deal: {
    id: "wf_affiliate_marketing_002",
    type: "influencer_affiliate",
    title: "Affiliate Marketing Partnership",
    description: "Performance-based affiliate marketing with commission structure",
    participants: {
      brand: {
        id: 101,
        name: "Beauty Glow",
        type: "brand"
      },
      influencer: {
        id: 401,
        name: "Jessica Liu",
        platform: "YouTube",
        subscribers: 250000,
        niche: "Beauty & Skincare",
        type: "influencer"
      }
    },
    contract: {
      deal_type: "influencer_affiliate",
      brand_id: 101,
      influencer_id: 401,
      compensation_model: {
        base: 1000.00,
        commission_rate: 0.12,
        bonus_tiers: {
          "25_sales": 500.00,
          "100_sales": 2000.00,
          "500_sales": 5000.00
        },
        performance_bonus: "Extra 2% commission for >15% conversion rate"
      },
      tracking: {
        promo_code: "JESSGLOW15",
        affiliate_link: "beautyglow.com/ref/jessica",
        tracking_period: "12 months"
      },
      content_requirements: [
        "Monthly product reviews",
        "Tutorial videos",
        "Before/after transformations",
        "Subscriber exclusive discounts"
      ],
      performance_targets: {
        min_conversion_rate: 8.0,
        target_sales: 100,
        min_content_pieces: 4
      }
    },
    performance_data: {
      month_1: {
        clicks: 8500,
        conversions: 68,
        revenue: 3400.00,
        commission: 408.00,
        bonus: 500.00,
        total_earned: 1908.00
      },
      month_2: {
        clicks: 12000,
        conversions: 96,
        revenue: 4800.00,
        commission: 576.00,
        bonus: 2000.00,
        total_earned: 3576.00
      },
      total_to_date: {
        clicks: 20500,
        conversions: 164,
        revenue: 8200.00,
        commission: 984.00,
        bonus: 2500.00,
        total_earned: 5484.00
      }
    }
  },

  // ==========================================
  // INFLUENCER WORKFLOW TYPE 3: Brand Ambassador Program
  // ==========================================
  influencer_ambassador_program: {
    id: "wf_influencer_ambassador_003",
    type: "influencer_ambassador",
    title: "Influencer Ambassador Program",
    description: "Long-term brand ambassador relationship with creative freedom",
    participants: {
      brand: {
        id: 102,
        name: "EcoBeauty",
        type: "brand"
      },
      influencer: {
        id: 402,
        name: "Alex Rivera",
        platform: "TikTok",
        followers: 180000,
        niche: "Sustainable Living",
        type: "influencer"
      }
    },
    contract: {
      deal_type: "influencer_ambassador",
      brand_id: 102,
      influencer_id: 402,
      term: "18 months",
      monthly_deliverables: [
        { type: "tiktok_video", quantity: 6 },
        { type: "instagram_post", quantity: 8 },
        { type: "instagram_story", quantity: 12 },
        { type: "engagement_session", quantity: 4 }
      ],
      monthly_compensation: 4000.00,
      quarterly_bonus: 2000.00,
      exclusivity: "Natural beauty products category",
      creative_freedom: "Full creative control with brand alignment",
      performance_metrics: {
        required_engagement_rate: 8.0,
        minimum_reach: 50000,
        brand_mention_frequency: "80% of content"
      }
    },
    monthly_tracking: [
      {
        month: "January 2025",
        videos_completed: 6,
        posts_completed: 8,
        stories_completed: 12,
        engagement_sessions: 4,
        avg_engagement: 9.2,
        avg_reach: 75000,
        compensation: 4000.00,
        bonus_earned: 500.00
      },
      {
        month: "February 2025",
        videos_completed: 6,
        posts_completed: 7,
        stories_completed: 11,
        engagement_sessions: 4,
        avg_engagement: 8.8,
        avg_reach: 68000,
        compensation: 4000.00,
        bonus_earned: 0
      }
    ]
  },

  // ==========================================
  // INFLUENCER WORKFLOW TYPE 4: Event Activation Deal
  // ==========================================
  event_activation_deal: {
    id: "wf_event_activation_004",
    type: "influencer_event_activation",
    title: "Event Activation Partnership",
    description: "Influencer participates in brand event with live coverage",
    participants: {
      brand: {
        id: 103,
        name: "TechFlow",
        type: "brand"
      },
      influencer: {
        id: 403,
        name: "Marcus Chen",
        platform: "YouTube",
        subscribers: 450000,
        niche: "Technology & Gadgets",
        type: "influencer"
      },
      venue: {
        name: "Tech Expo Center",
        capacity: 5000
      }
    },
    event_details: {
      event_name: "TechFlow Product Launch",
      date: "2025-03-15",
      time: "10:00 AM",
      location: "Tech Expo Center, San Francisco",
      duration: "8 hours",
      activities: [
        "Live product demonstrations",
        "Attendee interviews",
        "Backstage coverage",
        "Social media live streams",
        "Post-event content creation"
      ]
    },
    contract: {
      deal_type: "influencer_event_activation",
      brand_id: 103,
      influencer_id: 403,
      event_requirements: {
        checkin_time: "9:00 AM",
        live_stream_duration: "4 hours",
        content_pieces: 5,
        post_event_content: 3
      },
      compensation: 8000.00,
      bonus_structure: {
        engagement_bonus: "Extra $1000 if live stream > 10K concurrent viewers",
        content_bonus: "Extra $500 per viral post (>100K views)"
      }
    },
    deliverables: [
      {
        type: "live_stream",
        title: "TechFlow Launch Live Coverage",
        duration: "4 hours",
        viewers: 25000,
        status: "completed"
      },
      {
        type: "event_highlights",
        title: "Behind the Scenes & Interviews",
        views: 150000,
        status: "completed"
      }
    ]
  },

  // ==========================================
  // INFLUENCER WORKFLOW TYPE 5: Co-Creation Campaign
  // ==========================================
  co_creation_campaign: {
    id: "wf_co_creation_005",
    type: "influencer_co_creation",
    title: "Co-Creation Campaign",
    description: "Influencer collaborates with brand on custom content and product development",
    participants: {
      brand: {
        id: 104,
        name: "StreetStyle",
        type: "brand"
      },
      influencer: {
        id: 404,
        name: "Zara Kim",
        platform: "Instagram",
        followers: 320000,
        niche: "Street Fashion",
        type: "influencer"
      }
    },
    collaboration_details: {
      campaign_theme: "Urban Edge Collection",
      co_creation_elements: [
        "Custom product design input",
        "Content concept development",
        "Style guide creation",
        "Launch campaign execution"
      ],
      timeline: {
        planning_phase: "2 weeks",
        creation_phase: "4 weeks",
        execution_phase: "6 weeks",
        total_duration: "12 weeks"
      }
    },
    contract: {
      deal_type: "influencer_co_creation",
      brand_id: 104,
      influencer_id: 404,
      compensation_structure: {
        base_fee: 15000.00,
        royalty_percentage: 0.05,
        performance_bonus: 5000.00
      },
      deliverables: [
        {
          type: "concept_presentation",
          title: "Urban Edge Collection Concepts",
          due_date: "2025-03-01",
          status: "completed"
        },
        {
          type: "content_series",
          title: "Collection Launch Content",
          pieces: 12,
          due_date: "2025-04-15",
          status: "in_progress"
        }
      ],
      ownership: {
        content_ownership: "Shared",
        product_ip: "Brand retains primary rights",
        influencer_credit: "Full credit on all materials"
      }
    }
  },

  // ==========================================
  // INFLUENCER WORKFLOW TYPE 6: Marketplace Gig Economy
  // ==========================================
  marketplace_gig_economy: {
    id: "wf_marketplace_gig_006",
    type: "influencer_marketplace_gig",
    title: "Marketplace Gig Economy",
    description: "Open marketplace for brands to hire influencers for specific gigs",
    participants: {
      brand: {
        id: 105,
        name: "Local Boutique",
        type: "brand"
      }
    },
    marketplace_listing: {
      deal_type: "influencer_marketplace_gig",
      brand_id: 105,
      available_gigs: 5,
      requirements: {
        min_followers: 10000,
        platforms: ["instagram", "tiktok"],
        engagement_rate: 3.0,
        location: "Local area preferred",
        niche: "Fashion or Lifestyle"
      },
      gig_details: [
        {
          type: "store_visit",
          title: "In-Store Experience & Review",
          compensation: 300.00,
          deliverables: ["Store visit", "Social media posts", "Product photos"]
        },
        {
          type: "product_showcase",
          title: "Product Showcase Video",
          compensation: 500.00,
          deliverables: ["Product video", "Unboxing content", "Usage demonstration"]
        }
      ],
      auto_accept: false,
      application_deadline: "2025-03-10"
    },
    applications: [
      {
        influencer_id: 405,
        name: "Sophie Martinez",
        followers: 45000,
        platform: "Instagram",
        applied_date: "2025-02-20",
        proposed_rate: 400.00,
        status: "accepted"
      },
      {
        influencer_id: 406,
        name: "Ryan Park",
        followers: 28000,
        platform: "TikTok",
        applied_date: "2025-02-21",
        proposed_rate: 350.00,
        status: "pending"
      }
    ]
  }
};

// Export individual workflow types for easy access
export const WORKFLOW_TYPES = {
  TRADITIONAL_NIL: WORKFLOW_TEST_DATA.traditional_nil,
  MICRO_INFLUENCER: WORKFLOW_TEST_DATA.micro_influencer,
  TEAM_SPONSORSHIP: WORKFLOW_TEST_DATA.team_sponsorship,
  ATHLETE_INITIATED: WORKFLOW_TEST_DATA.athlete_initiated,
  MARKETPLACE_OPEN: WORKFLOW_TEST_DATA.marketplace_open,
  EVENT_BASED: WORKFLOW_TEST_DATA.event_based,
  BRAND_AMBASSADOR: WORKFLOW_TEST_DATA.brand_ambassador,
  PERFORMANCE_BASED: WORKFLOW_TEST_DATA.performance_based,
  CONTENT_LICENSING: WORKFLOW_TEST_DATA.content_licensing,
  GROUP_CAMPAIGN: WORKFLOW_TEST_DATA.group_campaign,
  TIERED_DEAL: WORKFLOW_TEST_DATA.tiered_deal,
  CHARITY_DEAL: WORKFLOW_TEST_DATA.charity_deal,
  // Influencer Workflows
  CONTENT_CREATOR_PARTNERSHIP: WORKFLOW_TEST_DATA.content_creator_partnership,
  AFFILIATE_MARKETING_DEAL: WORKFLOW_TEST_DATA.affiliate_marketing_deal,
  INFLUENCER_AMBASSADOR_PROGRAM: WORKFLOW_TEST_DATA.influencer_ambassador_program,
  EVENT_ACTIVATION_DEAL: WORKFLOW_TEST_DATA.event_activation_deal,
  CO_CREATION_CAMPAIGN: WORKFLOW_TEST_DATA.co_creation_campaign,
  MARKETPLACE_GIG_ECONOMY: WORKFLOW_TEST_DATA.marketplace_gig_economy
};

// Helper functions for test data manipulation
export const getWorkflowByType = (type) => {
  return Object.values(WORKFLOW_TEST_DATA).find(workflow => workflow.type === type);
};

export const getWorkflowById = (id) => {
  return WORKFLOW_TEST_DATA[id];
};

export const getAllWorkflows = () => {
  return Object.values(WORKFLOW_TEST_DATA);
};

export const getWorkflowsByParticipantType = (participantType) => {
  return Object.values(WORKFLOW_TEST_DATA).filter(workflow => {
    const participants = Object.values(workflow.participants);
    return participants.some(participant => participant.type === participantType);
  });
};