/**
 * Athlete Type Configuration
 * Centralized configuration for different athlete landing pages
 * Supports dynamic routing: /sports/:athleteType
 */

export const athleteTypes = {
  // College/Student Athletes (existing /sports page)
  'college': {
    id: 'college',
    name: 'College Athletes',
    slug: 'college',
    displayName: 'Student-Athletes',
    category: 'NCAA & NAIA',

    hero: {
      badge: 'NCAA • NAIA • All College Athletes 🏆',
      icon: '⚡',
      headline: 'Student Athletes',
      subheadline: 'Turn Your Talent Into',
      highlightedWord: 'Real Deals',
      description: 'Land lucrative sponsorship deals • Access 1000+ premium brands • Earn $500K+ during your college years',
      primaryCTA: {
        text: '🎯 Unlock Premium Deals',
        action: '/premium-deals'
      },
      secondaryCTA: {
        text: 'Learn More (2 min)',
        action: '/learn-more'
      },
      stats: [
        { label: 'Deal Support', value: '24/7' },
        { label: 'Compliance Safe', value: '100%' },
        { label: 'Platform Fee', value: '0% → 9%' },
        { label: 'Success Rate', value: '98%' }
      ],
      pricing: {
        year1: '0% platform fee',
        year2: '9% platform fee',
        comparison: '40–70% less than competing NIL platforms (15–30%)',
        guarantee: 'Brands pay into secure escrow. You get paid within 24 hours of deal approval'
      }
    },

    workflow: {
      title: 'Built for NCAA & NAIA Student-Athletes',
      subtitle: 'Every step mirrors the verified workflow from STUDENT_ATHLETE_WORKFLOW_TEST_RESULTS.md',
      exampleAthlete: {
        name: 'SARAH JOHNSON',
        school: 'Stanford',
        sport: 'Basketball',
        followers: '15K',
        deal: {
          brand: 'Nike',
          type: 'Instagram Stories',
          amount: 750,
          tier: 'Professional',
          multiplier: 1.2,
          netPayout: 765
        }
      }
    },

    stats: {
      totalAthletes: '2.5K+',
      totalDeals: '$500M+',
      brands: '1K+',
      avgEarnings: [
        { sport: '🏀 Basketball', range: '$200K-$500K' },
        { sport: '🏈 Football', range: '$250K-$600K' },
        { sport: '⚽ Soccer', range: '$150K-$400K' },
        { sport: '🎾 Other Sports', range: '$100K-$300K' }
      ]
    }
  },

  // Professional Athletes
  'professional': {
    id: 'professional',
    name: 'Professional Athletes',
    slug: 'professional',
    displayName: 'Pro Athletes',
    category: 'NFL • NBA • MLB • NHL',

    hero: {
      badge: 'NFL • NBA • MLB • NHL • MLS • WNBA 🏆',
      icon: '🏅',
      headline: 'Professional Athletes',
      subheadline: 'Maximize Your',
      highlightedWord: 'Brand Value',
      description: 'Premium sponsorships • Global brand partnerships • Earn $1M+ annually through strategic NIL deals',
      primaryCTA: {
        text: '💎 Access Elite Brands',
        action: '/elite-brands'
      },
      secondaryCTA: {
        text: 'Schedule Consultation',
        action: '/consultation'
      },
      stats: [
        { label: 'Avg Deal Size', value: '$50K+' },
        { label: 'Elite Brands', value: '500+' },
        { label: 'Dedicated Agent', value: '24/7' },
        { label: 'Earnings Growth', value: '+340%' }
      ],
      pricing: {
        year1: '5% platform fee (premier tier)',
        year2: '5% platform fee (no increase)',
        comparison: '60% less than traditional sports agents (15-20%)',
        guarantee: 'Guaranteed payouts within 48 hours. Premium contract negotiation included.'
      }
    },

    workflow: {
      title: 'Built for Elite Professional Athletes',
      subtitle: 'White-glove service with dedicated account management and contract negotiation',
      exampleAthlete: {
        name: 'MARCUS WILLIAMS',
        school: 'NFL',
        sport: 'Football',
        followers: '2.5M',
        deal: {
          brand: 'Nike',
          type: 'Multi-Year Partnership',
          amount: 500000,
          tier: 'Elite',
          multiplier: 2.5,
          netPayout: 1187500
        }
      }
    },

    stats: {
      totalAthletes: '1.2K+',
      totalDeals: '$2.5B+',
      brands: '500+',
      avgEarnings: [
        { sport: '🏈 NFL', range: '$500K-$5M' },
        { sport: '🏀 NBA', range: '$750K-$10M' },
        { sport: '⚾ MLB', range: '$300K-$3M' },
        { sport: '🏒 NHL', range: '$200K-$2M' }
      ]
    }
  },

  // High School Athletes
  'highschool': {
    id: 'highschool',
    name: 'High School Athletes',
    slug: 'highschool',
    displayName: 'High School Athletes',
    category: 'Future NCAA Stars',

    hero: {
      badge: 'High School Athletes • Build Your Brand Early 🌟',
      icon: '🎓',
      headline: 'High School Athletes',
      subheadline: 'Start Building Your',
      highlightedWord: 'NIL Portfolio',
      description: 'Local sponsorships • Build your brand • Get college-ready • Earn $50K+ before freshman year',
      primaryCTA: {
        text: '🚀 Start Building Now',
        action: '/highschool-signup'
      },
      secondaryCTA: {
        text: 'Parent Guide (3 min)',
        action: '/parent-guide'
      },
      stats: [
        { label: 'Parental Dashboard', value: '100%' },
        { label: 'Local Brands', value: '5K+' },
        { label: 'Platform Fee', value: '0% Year 1' },
        { label: 'Parent Approval', value: 'Required' }
      ],
      pricing: {
        year1: '0% platform fee',
        year2: '7% platform fee (student discount)',
        comparison: 'Parental consent built-in. COPPA compliant. Bank account managed by guardian.',
        guarantee: 'All deals require parental approval. Funds transferred to parent/guardian account.'
      }
    },

    workflow: {
      title: 'Built for Future College Stars',
      subtitle: 'Parent-approved deals with automatic compliance for state high school athletic associations',
      exampleAthlete: {
        name: 'JAKE THOMPSON',
        school: 'Lincoln High School',
        sport: 'Basketball',
        followers: '8K',
        deal: {
          brand: 'Local Sports Shop',
          type: 'Social Media Posts',
          amount: 300,
          tier: 'Starter',
          multiplier: 1.0,
          netPayout: 285
        }
      }
    },

    stats: {
      totalAthletes: '5K+',
      totalDeals: '$50M+',
      brands: '2K+',
      avgEarnings: [
        { sport: '🏀 Basketball', range: '$10K-$50K' },
        { sport: '🏈 Football', range: '$15K-$75K' },
        { sport: '⚽ Soccer', range: '$8K-$40K' },
        { sport: '🎾 Other Sports', range: '$5K-$30K' }
      ]
    }
  },

  // Olympic Athletes
  'olympic': {
    id: 'olympic',
    name: 'Olympic Athletes',
    slug: 'olympic',
    displayName: 'Olympic Athletes',
    category: 'Olympic & International',

    hero: {
      badge: 'Olympic • Paralympic • International Athletes 🥇',
      icon: '🏅',
      headline: 'Olympic Athletes',
      subheadline: 'Monetize Your',
      highlightedWord: 'Olympic Journey',
      description: 'Global brand deals • Olympic sponsorships • Earn year-round • $250K+ annual income',
      primaryCTA: {
        text: '🥇 Unlock Olympic Deals',
        action: '/olympic-deals'
      },
      secondaryCTA: {
        text: 'Success Stories',
        action: '/olympic-stories'
      },
      stats: [
        { label: 'Global Brands', value: '300+' },
        { label: 'Multi-Language', value: '12+' },
        { label: 'Platform Fee', value: '6%' },
        { label: 'Avg Deal', value: '$25K' }
      ],
      pricing: {
        year1: '6% platform fee (Olympic tier)',
        year2: '6% platform fee (flat rate)',
        comparison: 'Supports Rule 40 compliance. Pre/during/post Olympics campaigns.',
        guarantee: 'International payment support. Multi-currency payouts in 24 hours.'
      }
    },

    workflow: {
      title: 'Built for Olympic Champions',
      subtitle: 'Rule 40 compliant campaigns. Multi-currency support. Global brand matching.',
      exampleAthlete: {
        name: 'ELENA MARTINEZ',
        school: 'USA Gymnastics',
        sport: 'Gymnastics',
        followers: '500K',
        deal: {
          brand: 'Adidas',
          type: 'Olympic Campaign',
          amount: 100000,
          tier: 'Elite Olympic',
          multiplier: 2.0,
          netPayout: 188000
        }
      }
    },

    stats: {
      totalAthletes: '800+',
      totalDeals: '$200M+',
      brands: '300+',
      avgEarnings: [
        { sport: '🏊 Swimming', range: '$100K-$1M' },
        { sport: '🤸 Gymnastics', range: '$150K-$2M' },
        { sport: '🏃 Track & Field', range: '$75K-$500K' },
        { sport: '⛷️ Winter Sports', range: '$50K-$300K' }
      ]
    }
  },

  // E-Sports Athletes
  'esports': {
    id: 'esports',
    name: 'E-Sports Athletes',
    slug: 'esports',
    displayName: 'E-Sports Athletes',
    category: 'Gaming & Streaming',

    hero: {
      badge: 'E-Sports • Streaming • Gaming Athletes 🎮',
      icon: '🎮',
      headline: 'E-Sports Athletes',
      subheadline: 'Level Up Your',
      highlightedWord: 'Sponsorships',
      description: 'Gaming brands • Streaming gear deals • Tech sponsorships • Earn $100K+ annually',
      primaryCTA: {
        text: '🎮 Level Up Now',
        action: '/esports-deals'
      },
      secondaryCTA: {
        text: 'Streamer Guide',
        action: '/streamer-guide'
      },
      stats: [
        { label: 'Gaming Brands', value: '1K+' },
        { label: 'Twitch/YouTube', value: 'Integrated' },
        { label: 'Platform Fee', value: '8%' },
        { label: 'Creator Tools', value: 'Free' }
      ],
      pricing: {
        year1: '0% platform fee (Year 1 promo)',
        year2: '8% platform fee',
        comparison: 'Lower than MCN networks (20-30%). Direct brand partnerships.',
        guarantee: 'Sponsored stream tracking. Affiliate link management. Revenue analytics.'
      }
    },

    workflow: {
      title: 'Built for Competitive Gamers & Streamers',
      subtitle: 'Stream-friendly deals. Performance tracking. Creator dashboard.',
      exampleAthlete: {
        name: 'TYLER "PROGAMER" CHEN',
        school: 'Cloud9',
        sport: 'League of Legends',
        followers: '350K',
        deal: {
          brand: 'Razer',
          type: 'Gaming Gear Partnership',
          amount: 15000,
          tier: 'Pro Gamer',
          multiplier: 1.5,
          netPayout: 20700
        }
      }
    },

    stats: {
      totalAthletes: '3K+',
      totalDeals: '$75M+',
      brands: '1K+',
      avgEarnings: [
        { sport: '🎮 Pro Players', range: '$50K-$500K' },
        { sport: '📺 Streamers', range: '$30K-$200K' },
        { sport: '🎥 Content Creators', range: '$20K-$150K' },
        { sport: '🏆 Tournament Players', range: '$25K-$300K' }
      ]
    }
  }
};

/**
 * Get athlete type configuration by slug
 */
export const getAthleteType = (slug) => {
  return athleteTypes[slug] || athleteTypes['college']; // Default to college
};

/**
 * Get all athlete type slugs for routing
 */
export const getAllAthleteSlugs = () => {
  return Object.keys(athleteTypes);
};

/**
 * Navigation menu items for athlete types
 */
export const athleteTypeNav = [
  {
    label: 'College',
    slug: 'college',
    icon: '⚡',
    description: 'NCAA & NAIA Athletes'
  },
  {
    label: 'Pro',
    slug: 'professional',
    icon: '🏅',
    description: 'NFL • NBA • MLB • NHL'
  },
  {
    label: 'High School',
    slug: 'highschool',
    icon: '🎓',
    description: 'Future College Stars'
  },
  {
    label: 'Olympic',
    slug: 'olympic',
    icon: '🥇',
    description: 'Olympic & International'
  },
  {
    label: 'E-Sports',
    slug: 'esports',
    icon: '🎮',
    description: 'Gaming & Streaming'
  }
];

export default athleteTypes;
