import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from './UserContext.jsx';

// Gamification Context
const GamificationContext = createContext();

// Achievement definitions
const ACHIEVEMENTS = {
  first_login: {
    id: 'first_login',
    title: 'Welcome to NILbx!',
    description: 'Completed your first login',
    icon: '🎉',
    points: 100,
    rarity: 'common'
  },
  profile_complete: {
    id: 'profile_complete',
    title: 'Profile Master',
    description: 'Completed your profile 100%',
    icon: '👤',
    points: 250,
    rarity: 'common'
  },
  first_sponsorship: {
    id: 'first_sponsorship',
    title: 'First Deal',
    description: 'Secured your first sponsorship',
    icon: '🤝',
    points: 500,
    rarity: 'uncommon'
  },
  streak_7: {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Logged in for 7 consecutive days',
    icon: '🔥',
    points: 300,
    rarity: 'uncommon'
  },
  streak_30: {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Logged in for 30 consecutive days',
    icon: '💎',
    points: 1000,
    rarity: 'rare'
  },
  social_share: {
    id: 'social_share',
    title: 'Social Butterfly',
    description: 'Shared your first NIL deal',
    icon: '📱',
    points: 150,
    rarity: 'common'
  },
  deal_maker: {
    id: 'deal_maker',
    title: 'Deal Maker',
    description: 'Completed 10 NIL deals',
    icon: '💼',
    points: 1500,
    rarity: 'epic'
  },
  influencer: {
    id: 'influencer',
    title: 'Rising Influencer',
    description: 'Reached 1000 followers',
    icon: '⭐',
    points: 750,
    rarity: 'rare'
  }
};

// Level system
const LEVELS = [
  { level: 1, minPoints: 0, title: 'Rookie', icon: '🥉', color: '#CD7F32' },
  { level: 2, minPoints: 500, title: 'Amateur', icon: '🥈', color: '#C0C0C0' },
  { level: 3, minPoints: 1500, title: 'Pro', icon: '🥇', color: '#FFD700' },
  { level: 4, minPoints: 3000, title: 'Star', icon: '⭐', color: '#FF6B35' },
  { level: 5, minPoints: 5000, title: 'Elite', icon: '💎', color: '#9B59B6' },
  { level: 6, minPoints: 8000, title: 'Legend', icon: '👑', color: '#E74C3C' },
];

// Gamification Provider
export const GamificationProvider = ({ children }) => {
  const { user } = useUser();
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    achievements: [],
    streak: 0,
    lastLogin: null,
    totalDeals: 0,
    totalShares: 0,
    followers: 0
  });
  const [notifications, setNotifications] = useState([]);

  // Load user stats from localStorage
  useEffect(() => {
    if (user?.email) {
      try {
        const savedStats = localStorage.getItem(`gamification_${user.email}`);
        if (savedStats) {
          setUserStats(JSON.parse(savedStats));
        }
      } catch (error) {
        console.error('Error loading gamification data:', error);
      }
    }
  }, [user]);

  // Save user stats to localStorage
  useEffect(() => {
    if (user?.email) {
      try {
        localStorage.setItem(`gamification_${user.email}`, JSON.stringify(userStats));
      } catch (error) {
        console.error('Error saving gamification data:', error);
      }
    }
  }, [userStats, user]);

  // Calculate level from points
  const calculateLevel = (points) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  };

  // Add points and check for level up
  const addPoints = (points, reason = '') => {
    setUserStats(prev => {
      const newPoints = prev.points + points;
      const currentLevel = calculateLevel(prev.points);
      const newLevel = calculateLevel(newPoints);
      
      // Check for level up
      if (newLevel.level > currentLevel.level) {
        addNotification({
          type: 'level_up',
          title: 'Level Up!',
          message: `You reached ${newLevel.title} (Level ${newLevel.level})!`,
          icon: newLevel.icon,
          points: 0
        });
      }

      // Add points notification
      if (points > 0) {
        addNotification({
          type: 'points',
          title: `+${points} Points!`,
          message: reason,
          icon: '⭐',
          points
        });
      }

      return {
        ...prev,
        points: newPoints,
        level: newLevel.level
      };
    });
  };

  // Unlock achievement
  const unlockAchievement = (achievementId) => {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;

    setUserStats(prev => {
      // Check if already unlocked
      if (prev.achievements.includes(achievementId)) return prev;

      // Add achievement and points
      const newAchievements = [...prev.achievements, achievementId];
      
      addNotification({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        points: achievement.points,
        rarity: achievement.rarity
      });

      // Add points for achievement
      setTimeout(() => addPoints(achievement.points, achievement.title), 1000);

      return {
        ...prev,
        achievements: newAchievements
      };
    });
  };

  // Update streak
  const updateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    setUserStats(prev => {
      if (prev.lastLogin === today) {
        return prev; // Already logged in today
      }

      const newStreak = prev.lastLogin === yesterday ? prev.streak + 1 : 1;
      
      // Check for streak achievements
      if (newStreak === 7 && !prev.achievements.includes('streak_7')) {
        setTimeout(() => unlockAchievement('streak_7'), 500);
      } else if (newStreak === 30 && !prev.achievements.includes('streak_30')) {
        setTimeout(() => unlockAchievement('streak_30'), 500);
      }

      return {
        ...prev,
        streak: newStreak,
        lastLogin: today
      };
    });
  };

  // Record deal completion
  const recordDeal = () => {
    setUserStats(prev => {
      const newTotalDeals = prev.totalDeals + 1;
      
      // Check for deal achievements
      if (newTotalDeals === 1 && !prev.achievements.includes('first_sponsorship')) {
        setTimeout(() => unlockAchievement('first_sponsorship'), 500);
      } else if (newTotalDeals === 10 && !prev.achievements.includes('deal_maker')) {
        setTimeout(() => unlockAchievement('deal_maker'), 500);
      }

      // Add points for deal
      setTimeout(() => addPoints(200, 'Completed NIL deal'), 1000);

      return {
        ...prev,
        totalDeals: newTotalDeals
      };
    });
  };

  // Record social share
  const recordShare = () => {
    setUserStats(prev => {
      const newTotalShares = prev.totalShares + 1;
      
      // Check for social achievements
      if (newTotalShares === 1 && !prev.achievements.includes('social_share')) {
        setTimeout(() => unlockAchievement('social_share'), 500);
      }

      // Add points for share
      setTimeout(() => addPoints(50, 'Shared on social media'), 1000);

      return {
        ...prev,
        totalShares: newTotalShares
      };
    });
  };

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id, timestamp: Date.now() };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Get progress to next level
  const getProgressToNextLevel = () => {
    const currentLevel = calculateLevel(userStats.points);
    const nextLevel = LEVELS.find(l => l.level > currentLevel.level);
    
    if (!nextLevel) {
      return { progress: 100, pointsNeeded: 0 };
    }
    
    const pointsInLevel = userStats.points - currentLevel.minPoints;
    const pointsForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
    const progress = (pointsInLevel / pointsForNextLevel) * 100;
    const pointsNeeded = nextLevel.minPoints - userStats.points;
    
    return { progress: Math.min(progress, 100), pointsNeeded: Math.max(pointsNeeded, 0) };
  };

  // Initialize user on first login
  useEffect(() => {
    if (user && userStats.achievements.length === 0) {
      setTimeout(() => {
        unlockAchievement('first_login');
        updateStreak();
      }, 1000);
    } else if (user) {
      updateStreak();
    }
  }, [user]);

  const value = {
    userStats,
    notifications,
    addPoints,
    unlockAchievement,
    recordDeal,
    recordShare,
    removeNotification,
    calculateLevel,
    getProgressToNextLevel,
    ACHIEVEMENTS,
    LEVELS
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
      <GamificationNotifications />
    </GamificationContext.Provider>
  );
};

// Gamification Notifications Component
const GamificationNotifications = () => {
  const { notifications, removeNotification } = useContext(GamificationContext);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="pointer-events-auto"
          >
            <div 
              className={`
                max-w-sm p-4 rounded-lg shadow-lg border-l-4 cursor-pointer
                ${notification.type === 'achievement' 
                  ? `bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400 ${getRarityColor(notification.rarity)}` 
                  : notification.type === 'level_up'
                    ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-400'
                    : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400'
                }
              `}
              onClick={() => removeNotification(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{notification.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    {notification.points > 0 && (
                      <span className="text-xs font-bold text-yellow-600">
                        +{notification.points}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  {notification.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.description}
                    </p>
                  )}
                  {notification.rarity && (
                    <div className="flex items-center mt-2">
                      <span className={`
                        px-2 py-1 text-xs font-medium text-white rounded-full
                        ${getRarityColor(notification.rarity)}
                      `}>
                        {notification.rarity.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ 
  value, 
  max = 100, 
  className = '', 
  showLabel = true, 
  animated = true,
  color = 'blue'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// User Stats Widget
export const UserStatsWidget = ({ className = '' }) => {
  const { userStats, calculateLevel, getProgressToNextLevel } = useContext(GamificationContext);
  const currentLevel = calculateLevel(userStats.points);
  const { progress, pointsNeeded } = getProgressToNextLevel();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{currentLevel.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{currentLevel.title}</h3>
            <p data-testid="level" className="text-sm text-gray-600">Level {currentLevel.level}</p>
          </div>
        </div>
        <div className="text-right">
          <div data-testid="points" className="text-xl font-bold text-blue-600">{userStats.points}</div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <ProgressBar 
          value={userStats.points - currentLevel.minPoints} 
          max={pointsNeeded + (userStats.points - currentLevel.minPoints)}
          color="purple"
          showLabel={false}
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>{pointsNeeded} points to next level</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <div data-testid="streak" className="text-lg font-bold text-gray-900">{userStats.streak}</div>
          <div className="text-xs text-gray-500">day streak</div>
        </div>
        <div className="text-center">
          <div data-testid="deals" className="text-lg font-bold text-gray-900">{userStats.totalDeals}</div>
          <div className="text-xs text-gray-500">deals</div>
        </div>
        <div className="text-center">
          <div data-testid="achievements" className="text-lg font-bold text-gray-900">{userStats.achievements.length}</div>
          <div className="text-xs text-gray-500">achievements</div>
        </div>
      </div>
    </motion.div>
  );
};

// Achievements Grid
export const AchievementsGrid = ({ className = '' }) => {
  const { userStats, ACHIEVEMENTS } = useContext(GamificationContext);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'uncommon': return 'border-green-300 bg-green-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Object.values(ACHIEVEMENTS).map((achievement) => {
        const isUnlocked = userStats.achievements.includes(achievement.id);
        
        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${isUnlocked 
                ? getRarityColor(achievement.rarity) 
                : 'border-gray-200 bg-gray-100 opacity-60'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium ${isUnlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                    +{achievement.points} points
                  </span>
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${isUnlocked 
                      ? getRarityColor(achievement.rarity).replace('bg-', 'text-').replace('-50', '-700')
                      : 'text-gray-400'
                    }
                  `}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
              </div>
              {isUnlocked && (
                <div className="text-green-500">
                  ✅
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Custom hook
export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

export default GamificationProvider;