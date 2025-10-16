import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GamificationProvider, useGamification, UserStatsWidget, AchievementsGrid } from '../src/contexts/GamificationContext.jsx';
import { UserProvider } from '../src/contexts/UserContext.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Test component to access gamification context
const TestGamificationComponent = () => {
  const { 
    userStats, 
    addPoints, 
    unlockAchievement, 
    recordDeal, 
    recordShare,
    getProgressToNextLevel 
  } = useGamification();

  return (
    <div>
      <div data-testid="points">{userStats.points}</div>
      <div data-testid="level">{userStats.level}</div>
      <div data-testid="streak">{userStats.streak}</div>
      <div data-testid="achievements">{userStats.achievements.length}</div>
      <button onClick={() => addPoints(100, 'Test points')}>Add Points</button>
      <button onClick={() => unlockAchievement('first_login')}>Unlock Achievement</button>
      <button onClick={() => recordDeal()}>Record Deal</button>
      <button onClick={() => recordShare()}>Record Share</button>
      <div data-testid="progress">{JSON.stringify(getProgressToNextLevel())}</div>
    </div>
  );
};

const TestWrapper = ({ children, mockUser = null }) => (
  <UserProvider initialUser={mockUser}>
    <GamificationProvider>
      {children}
    </GamificationProvider>
  </UserProvider>
);

describe('GamificationContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('initializes with default stats', () => {
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('points')).toHaveTextContent('0');
    expect(screen.getByTestId('level')).toHaveTextContent('1');
    expect(screen.getByTestId('streak')).toHaveTextContent('0');
    expect(screen.getByTestId('achievements')).toHaveTextContent('0');
  });

  it('adds points correctly', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    const addPointsButton = screen.getByText('Add Points');
    await user.click(addPointsButton);

    expect(screen.getByTestId('points')).toHaveTextContent('100');
  });

  it('unlocks achievements correctly', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    const unlockButton = screen.getByText('Unlock Achievement');
    await user.click(unlockButton);

    // Should have unlocked one achievement
    expect(screen.getByTestId('achievements')).toHaveTextContent('1');
    
    // Should have added points from the achievement
    vi.advanceTimersByTime(1100); // Wait for delayed point addition
    expect(screen.getByTestId('points')).toHaveTextContent('100');
  });

  it('records deals and triggers achievements', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    const recordDealButton = screen.getByText('Record Deal');
    await user.click(recordDealButton);

    // Should trigger first_sponsorship achievement
    vi.advanceTimersByTime(600); // Wait for achievement delay
    expect(screen.getByTestId('achievements')).toHaveTextContent('1');
    
    // Should add points for the deal
    vi.advanceTimersByTime(1100); // Wait for points delay
    expect(screen.getByTestId('points')).toHaveTextContent('700'); // 500 from achievement + 200 from deal
  });

  it('records social shares', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    const recordShareButton = screen.getByText('Record Share');
    await user.click(recordShareButton);

    // Should trigger social_share achievement
    vi.advanceTimersByTime(600);
    expect(screen.getByTestId('achievements')).toHaveTextContent('1');
    
    // Should add points for the share
    vi.advanceTimersByTime(1100);
    expect(screen.getByTestId('points')).toHaveTextContent('200'); // 150 from achievement + 50 from share
  });

  it('calculates level progression correctly', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    // Add enough points to reach level 2 (500 points)
    const addPointsButton = screen.getByText('Add Points');
    
    // Add points multiple times
    for (let i = 0; i < 6; i++) {
      await user.click(addPointsButton);
    }

    // Should level up to level 2
    expect(screen.getByTestId('level')).toHaveTextContent('2');
  });

  it('persists data to localStorage', async () => {
    const user = userEvent.setup();
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    const addPointsButton = screen.getByText('Add Points');
    await user.click(addPointsButton);

    // Check localStorage
    const savedData = localStorage.getItem('gamification_test@example.com');
    expect(savedData).toBeTruthy();
    
    const parsedData = JSON.parse(savedData);
    expect(parsedData.points).toBe(100);
  });

  it('loads data from localStorage', () => {
    const mockUser = { email: 'test@example.com' };
    
    // Pre-populate localStorage
    const mockData = {
      points: 250,
      level: 2,
      achievements: ['first_login'],
      streak: 5,
      totalDeals: 2,
      totalShares: 3
    };
    localStorage.setItem('gamification_test@example.com', JSON.stringify(mockData));
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('points')).toHaveTextContent('250');
    expect(screen.getByTestId('level')).toHaveTextContent('2');
    expect(screen.getByTestId('achievements')).toHaveTextContent('1');
    expect(screen.getByTestId('streak')).toHaveTextContent('5');
  });

  it('calculates progress to next level', () => {
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    const progressData = screen.getByTestId('progress');
    const progress = JSON.parse(progressData.textContent);
    
    expect(progress).toHaveProperty('progress');
    expect(progress).toHaveProperty('pointsNeeded');
    expect(progress.pointsNeeded).toBe(500); // Points needed to reach level 2
  });
});

describe('UserStatsWidget Component', () => {
  it('displays user stats correctly', () => {
    const mockUser = { email: 'test@example.com' };
    
    // Pre-populate with some stats
    const mockData = {
      points: 750,
      level: 3,
      achievements: ['first_login', 'profile_complete'],
      streak: 7,
      totalDeals: 3,
      totalShares: 5
    };
    localStorage.setItem('gamification_test@example.com', JSON.stringify(mockData));
    
    render(
      <TestWrapper mockUser={mockUser}>
        <UserStatsWidget />
      </TestWrapper>
    );

    expect(screen.getByText('750')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument(); // streak
    expect(screen.getByText('3')).toBeInTheDocument(); // deals
    expect(screen.getByText('2')).toBeInTheDocument(); // achievements
  });

  it('shows progress bar for level progression', () => {
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <UserStatsWidget />
      </TestWrapper>
    );

    // Should show progress bar
    expect(screen.getByText('points to next level')).toBeInTheDocument();
  });
});

describe('AchievementsGrid Component', () => {
  it('displays all available achievements', () => {
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <AchievementsGrid />
      </TestWrapper>
    );

    // Should show achievement titles
    expect(screen.getByText('Welcome to NILbx!')).toBeInTheDocument();
    expect(screen.getByText('Profile Master')).toBeInTheDocument();
    expect(screen.getByText('First Deal')).toBeInTheDocument();
  });

  it('shows unlocked achievements with checkmark', () => {
    const mockUser = { email: 'test@example.com' };
    
    // Pre-populate with unlocked achievement
    const mockData = {
      points: 100,
      level: 1,
      achievements: ['first_login'],
      streak: 1,
      totalDeals: 0,
      totalShares: 0
    };
    localStorage.setItem('gamification_test@example.com', JSON.stringify(mockData));
    
    render(
      <TestWrapper mockUser={mockUser}>
        <AchievementsGrid />
      </TestWrapper>
    );

    // Should show checkmark for unlocked achievement
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('displays achievement points and rarity', () => {
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <AchievementsGrid />
      </TestWrapper>
    );

    // Should show points for achievements
    expect(screen.getByText('+100 points')).toBeInTheDocument();
    expect(screen.getByText('+250 points')).toBeInTheDocument();
    
    // Should show rarity
    expect(screen.getByText('COMMON')).toBeInTheDocument();
    expect(screen.getByText('UNCOMMON')).toBeInTheDocument();
  });
});

describe('Gamification Notifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows achievement notifications', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    const unlockButton = screen.getByText('Unlock Achievement');
    await user.click(unlockButton);

    // Should show achievement notification
    expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to NILbx!')).toBeInTheDocument();
  });

  it('shows level up notifications', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    // Add enough points to level up
    const addPointsButton = screen.getByText('Add Points');
    for (let i = 0; i < 6; i++) {
      await user.click(addPointsButton);
    }

    // Should show level up notification
    expect(screen.getByText('Level Up!')).toBeInTheDocument();
  });

  it('auto-removes notifications after timeout', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mockUser = { email: 'test@example.com' };
    
    render(
      <TestWrapper mockUser={mockUser}>
        <TestGamificationComponent />
      </TestWrapper>
    );

    const unlockButton = screen.getByText('Unlock Achievement');
    await user.click(unlockButton);

    expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();

    // Fast-forward time
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.queryByText('Achievement Unlocked!')).not.toBeInTheDocument();
    });
  });
});