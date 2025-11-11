// frontend/src/test-data/user-credentials.js

/**
 * NILBx User Credentials - Development & Testing
 *
 * Comprehensive credentials for all example users across workflows
 * Used for authentication, testing, and demonstration purposes
 */

export const USER_CREDENTIALS = {
  // ==========================================
  // ATHLETES
  // ==========================================
  athletes: {
    alex_johnson: {
      id: 200,
      name: "Alex Johnson",
      email: "alex.johnson@uc.edu",
      password: "Athlete2025!",
      role: "athlete",
      sport: "Basketball",
      school: "University of California",
      profile: {
        followers: 25000,
        engagement_rate: 7.2,
        verified: true
      }
    },
    jordan_smith: {
      id: 201,
      name: "Jordan Smith",
      email: "jordan.smith@ucla.edu",
      password: "Bruins2025!",
      role: "athlete",
      sport: "Basketball",
      school: "UCLA",
      position: "Point Guard",
      profile: {
        followers: 18000,
        engagement_rate: 6.8,
        verified: true
      }
    },
    marcus_johnson: {
      id: 202,
      name: "Marcus Johnson",
      email: "marcus.johnson@ucla.edu",
      password: "Marcus2025!",
      role: "athlete",
      sport: "Basketball",
      school: "UCLA",
      position: "Shooting Guard",
      profile: {
        followers: 22000,
        engagement_rate: 7.1,
        verified: true
      }
    },
    tyler_davis: {
      id: 203,
      name: "Tyler Davis",
      email: "tyler.davis@ucla.edu",
      password: "Tyler2025!",
      role: "athlete",
      sport: "Basketball",
      school: "UCLA",
      position: "Small Forward",
      profile: {
        followers: 19500,
        engagement_rate: 6.9,
        verified: true
      }
    },
    kevin_brown: {
      id: 204,
      name: "Kevin Brown",
      email: "kevin.brown@ucla.edu",
      password: "Kevin2025!",
      role: "athlete",
      sport: "Basketball",
      school: "UCLA",
      position: "Power Forward",
      profile: {
        followers: 21000,
        engagement_rate: 7.0,
        verified: true
      }
    },
    alex_wilson: {
      id: 205,
      name: "Alex Wilson",
      email: "alex.wilson@ucla.edu",
      password: "Wilson2025!",
      role: "athlete",
      sport: "Basketball",
      school: "UCLA",
      position: "Center",
      profile: {
        followers: 23500,
        engagement_rate: 7.3,
        verified: true
      }
    },
    emma_rodriguez: {
      id: 206,
      name: "Emma Rodriguez",
      email: "emma.rodriguez@stanford.edu",
      password: "Emma2025!",
      role: "athlete",
      sport: "Soccer",
      school: "Stanford University",
      profile: {
        followers: 45000,
        engagement_rate: 8.5,
        verified: true
      }
    },
    carlos_mendez: {
      id: 207,
      name: "Carlos Mendez",
      email: "carlos.mendez@usc.edu",
      password: "Carlos2025!",
      role: "athlete",
      sport: "Baseball",
      school: "USC",
      profile: {
        followers: 8500,
        engagement_rate: 5.8,
        verified: true
      }
    },
    lisa_wong: {
      id: 208,
      name: "Lisa Wong",
      email: "lisa.wong@stanford.edu",
      password: "Lisa2025!",
      role: "athlete",
      sport: "Volleyball",
      school: "Stanford University",
      profile: {
        followers: 6200,
        engagement_rate: 6.2,
        verified: true
      }
    },
    ryan_thompson: {
      id: 209,
      name: "Ryan Thompson",
      email: "ryan.thompson@osu.edu",
      password: "Ryan2025!",
      role: "athlete",
      sport: "Football",
      school: "Ohio State University",
      profile: {
        followers: 125000,
        engagement_rate: 9.1,
        verified: true
      }
    },
    maya_patel: {
      id: 210,
      name: "Maya Patel",
      email: "maya.patel@oregon.edu",
      password: "Maya2025!",
      role: "athlete",
      sport: "Track & Field",
      school: "University of Oregon",
      profile: {
        followers: 35000,
        engagement_rate: 7.8,
        verified: true
      }
    },
    taylor_swift: {
      id: 211,
      name: "Taylor Swift",
      email: "taylor.swift@tennessee.edu",
      password: "Taylor2025!",
      role: "athlete",
      sport: "Soccer",
      school: "University of Tennessee",
      profile: {
        followers: 89000000,
        engagement_rate: 12.5,
        verified: true
      }
    },
    zoe_martinez: {
      id: 212,
      name: "Zoe Martinez",
      email: "zoe.martinez@usc.edu",
      password: "Zoe2025!",
      role: "athlete",
      sport: "Swimming",
      school: "USC",
      profile: {
        followers: 28000,
        engagement_rate: 7.5,
        verified: true
      }
    },
    jake_anderson: {
      id: 213,
      name: "Jake Anderson",
      email: "jake.anderson@duke.edu",
      password: "Jake2025!",
      role: "athlete",
      sport: "BMX",
      school: "Duke University",
      profile: {
        followers: 78000,
        engagement_rate: 8.9,
        verified: true
      }
    },
    morgan_lee: {
      id: 214,
      name: "Morgan Lee",
      email: "morgan.lee@duke.edu",
      password: "Morgan2025!",
      role: "athlete",
      sport: "Tennis",
      school: "Duke University",
      profile: {
        followers: 42000,
        engagement_rate: 8.2,
        verified: true
      }
    }
  },

  // ==========================================
  // BRANDS
  // ==========================================
  brands: {
    nike: {
      id: 100,
      name: "Nike",
      email: "deals@nike.com",
      password: "Nike2025!",
      role: "brand",
      company_type: "Sportswear",
      profile: {
        verified: true,
        industry: "Athletic Apparel",
        headquarters: "Beaverton, OR"
      }
    },
    adidas: {
      id: 101,
      name: "Adidas",
      email: "partnerships@adidas.com",
      password: "Adidas2025!",
      role: "brand",
      company_type: "Sportswear",
      profile: {
        verified: true,
        industry: "Athletic Apparel",
        headquarters: "Herzogenaurach, Germany"
      }
    },
    under_armour: {
      id: 102,
      name: "Under Armour",
      email: "sponsorships@underarmour.com",
      password: "UA2025!",
      role: "brand",
      company_type: "Sportswear",
      profile: {
        verified: true,
        industry: "Athletic Apparel",
        headquarters: "Baltimore, MD"
      }
    },
    puma: {
      id: 103,
      name: "Puma",
      email: "athlete-relations@puma.com",
      password: "Puma2025!",
      role: "brand",
      company_type: "Sportswear",
      profile: {
        verified: true,
        industry: "Athletic Apparel",
        headquarters: "Herzogenaurach, Germany"
      }
    },
    gatorade: {
      id: 104,
      name: "Gatorade",
      email: "sponsorship@gatorade.com",
      password: "Gatorade2025!",
      role: "brand",
      company_type: "Sports Drink",
      profile: {
        verified: true,
        industry: "Beverages",
        headquarters: "Chicago, IL"
      }
    },
    state_farm: {
      id: 105,
      name: "State Farm",
      email: "events@statefarm.com",
      password: "StateFarm2025!",
      role: "brand",
      company_type: "Insurance",
      profile: {
        verified: true,
        industry: "Insurance",
        headquarters: "Bloomington, IL"
      }
    },
    reebok: {
      id: 106,
      name: "Reebok",
      email: "ambassadors@reebok.com",
      password: "Reebok2025!",
      role: "brand",
      company_type: "Sportswear",
      profile: {
        verified: true,
        industry: "Athletic Apparel",
        headquarters: "Boston, MA"
      }
    },
    gymshark: {
      id: 107,
      name: "Gymshark",
      email: "influencers@gymshark.com",
      password: "Gymshark2025!",
      role: "brand",
      company_type: "Activewear",
      profile: {
        verified: true,
        industry: "Fitness Apparel",
        headquarters: "Denver, CO"
      }
    },
    espn: {
      id: 108,
      name: "ESPN",
      email: "content-licensing@espn.com",
      password: "ESPN2025!",
      role: "brand",
      company_type: "Media",
      profile: {
        verified: true,
        industry: "Sports Media",
        headquarters: "Bristol, CT"
      }
    },
    speedo: {
      id: 109,
      name: "Speedo",
      email: "sponsorships@speedo.com",
      password: "Speedo2025!",
      role: "brand",
      company_type: "Swimwear",
      profile: {
        verified: true,
        industry: "Swimming Equipment",
        headquarters: "Nottingham, UK"
      }
    },
    goggles_plus: {
      id: 110,
      name: "GogglesPlus",
      email: "partnerships@gogglesplus.com",
      password: "Goggles2025!",
      role: "brand",
      company_type: "Swimming Accessories",
      profile: {
        verified: true,
        industry: "Sports Equipment",
        headquarters: "Irvine, CA"
      }
    },
    red_bull: {
      id: 112,
      name: "Red Bull",
      email: "athletes@redbull.com",
      password: "RedBull2025!",
      role: "brand",
      company_type: "Energy Drink",
      profile: {
        verified: true,
        industry: "Beverages",
        headquarters: "Fuschl am See, Austria"
      }
    }
  },

  // ==========================================
  // INFLUENCERS
  // ==========================================
  influencers: {
    sarah_chen: {
      id: 300,
      name: "Sarah Chen",
      email: "sarah.chen@tiktok.com",
      password: "Sarah2025!",
      role: "influencer",
      platform: "TikTok",
      niche: "Fitness",
      profile: {
        followers: 25000,
        engagement_rate: 8.5,
        verified: true,
        primary_platform: "tiktok"
      }
    },
    david_kim: {
      id: 301,
      name: "David Kim",
      email: "david.kim@youtube.com",
      password: "David2025!",
      role: "influencer",
      platform: "YouTube",
      niche: "Fitness",
      profile: {
        subscribers: 125000,
        engagement_rate: 7.2,
        verified: true,
        primary_platform: "youtube"
      }
    }
  },

  // ==========================================
  // NONPROFITS
  // ==========================================
  nonprofits: {
    special_olympics: {
      id: 113,
      name: "Special Olympics",
      email: "partnerships@specialolympics.org",
      password: "Special2025!",
      role: "nonprofit",
      cause: "Athlete support for special needs athletes",
      profile: {
        verified: true,
        tax_exempt: true,
        headquarters: "Washington, DC"
      }
    }
  },

  // ==========================================
  // ADMIN USERS
  // ==========================================
  admin: {
    platform_admin: {
      id: 1,
      name: "NILBx Admin",
      email: "admin@nilbx.com",
      password: "Admin2025!",
      role: "admin",
      permissions: ["all"],
      profile: {
        verified: true,
        super_admin: true
      }
    },
    compliance_officer: {
      id: 2,
      name: "Compliance Officer",
      email: "compliance@nilbx.com",
      password: "Compliance2025!",
      role: "admin",
      permissions: ["compliance", "audit", "reports"],
      profile: {
        verified: true,
        department: "Compliance"
      }
    },
    support_agent: {
      id: 3,
      name: "Support Agent",
      email: "support@nilbx.com",
      password: "Support2025!",
      role: "admin",
      permissions: ["support", "user_management"],
      profile: {
        verified: true,
        department: "Customer Support"
      }
    }
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const getUserById = (id) => {
  const allUsers = [
    ...Object.values(USER_CREDENTIALS.athletes),
    ...Object.values(USER_CREDENTIALS.brands),
    ...Object.values(USER_CREDENTIALS.influencers),
    ...Object.values(USER_CREDENTIALS.nonprofits),
    ...Object.values(USER_CREDENTIALS.admin)
  ];
  return allUsers.find(user => user.id === id);
};

export const getUserByEmail = (email) => {
  const allUsers = [
    ...Object.values(USER_CREDENTIALS.athletes),
    ...Object.values(USER_CREDENTIALS.brands),
    ...Object.values(USER_CREDENTIALS.influencers),
    ...Object.values(USER_CREDENTIALS.nonprofits),
    ...Object.values(USER_CREDENTIALS.admin)
  ];
  return allUsers.find(user => user.email === email);
};

export const getUsersByRole = (role) => {
  switch (role) {
    case 'athlete':
      return Object.values(USER_CREDENTIALS.athletes);
    case 'brand':
      return Object.values(USER_CREDENTIALS.brands);
    case 'influencer':
      return Object.values(USER_CREDENTIALS.influencers);
    case 'nonprofit':
      return Object.values(USER_CREDENTIALS.nonprofits);
    case 'admin':
      return Object.values(USER_CREDENTIALS.admin);
    default:
      return [];
  }
};

export const getAllUsers = () => {
  return [
    ...Object.values(USER_CREDENTIALS.athletes),
    ...Object.values(USER_CREDENTIALS.brands),
    ...Object.values(USER_CREDENTIALS.influencers),
    ...Object.values(USER_CREDENTIALS.nonprofits),
    ...Object.values(USER_CREDENTIALS.admin)
  ];
};

// Quick login credentials for testing
export const QUICK_LOGIN_CREDENTIALS = {
  athlete: USER_CREDENTIALS.athletes.alex_johnson,
  brand: USER_CREDENTIALS.brands.nike,
  influencer: USER_CREDENTIALS.influencers.sarah_chen,
  admin: USER_CREDENTIALS.admin.platform_admin
};