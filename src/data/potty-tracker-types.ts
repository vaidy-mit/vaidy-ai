// Potty Tracker Types

// Event logged each time
export interface PottyEvent {
  id: string;
  timestamp: string; // ISO string
  type: 'success' | 'accident' | 'attempt';
  location: 'potty' | 'toilet' | 'diaper' | 'floor' | 'clothes';
  content: 'pee' | 'poop' | 'both';
  notes?: string;
  promptedByParent: boolean;
}

// Training phases
export type TrainingPhase =
  | 'not_started'
  | 'readiness_assessment'
  | 'introduction'
  | 'active_training'
  | 'consolidation'
  | 'graduated';

// Child settings
export interface ChildSettings {
  name: string;
  birthDate?: string;
  trainingStartDate?: string;
  currentPhase: TrainingPhase;
  preferredRewardEmoji: string;
  reminderIntervalMinutes: number;
}

// Readiness assessment
export interface ReadinessAnswer {
  questionId: string;
  answer: boolean | number; // boolean for yes/no, number for scale
}

export interface ReadinessAssessmentResult {
  id: string;
  date: string;
  answers: ReadinessAnswer[];
  totalScore: number;
  maxScore: number;
  percentageScore: number;
  categoryScores: {
    physical: number;
    cognitive: number;
    behavioral: number;
    interest: number;
  };
}

export interface ReadinessQuestion {
  id: string;
  category: 'physical' | 'cognitive' | 'behavioral' | 'interest';
  question: string;
  type: 'boolean' | 'scale';
  weight: number;
}

// Milestones
export type MilestoneId =
  | 'first_star'
  | 'hat_trick'
  | 'high_five'
  | 'perfect_ten'
  | 'super_star'
  | 'dry_day_champion'
  | 'self_starter'
  | 'week_warrior'
  | 'poop_pro'
  | 'independence_day';

export interface Milestone {
  id: MilestoneId;
  name: string;
  description: string;
  emoji: string;
  requirement: string;
  unlockedAt?: string; // ISO string when unlocked
}

// Streak tracking
export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastSuccessDate?: string;
  totalSuccesses: number;
  totalAccidents: number;
  totalAttempts: number;
  selfInitiatedCount: number;
}

// Pattern analysis
export interface HourlyPattern {
  hour: number;
  successes: number;
  accidents: number;
  attempts: number;
  total: number;
}

export interface DailyStats {
  date: string;
  successes: number;
  accidents: number;
  attempts: number;
  successRate: number;
}

export interface PatternInsight {
  type: 'peak_success' | 'accident_prone' | 'suggested_reminder' | 'trend' | 'celebration';
  message: string;
  hour?: number;
  confidence: 'high' | 'medium' | 'low';
}

// AI Coaching
export type CoachingContext =
  | 'encouragement'
  | 'strategy'
  | 'regression'
  | 'milestone'
  | 'transition'
  | 'readiness'
  | 'question';

export interface CoachingRequest {
  context: CoachingContext;
  childName: string;
  currentPhase: TrainingPhase;
  recentStats: {
    successRate: number;
    currentStreak: number;
    totalSuccesses: number;
    recentTrend: 'improving' | 'stable' | 'declining';
  };
  specificQuestion?: string;
  recentEvents?: PottyEvent[];
  readinessScore?: number;
  milestonesUnlocked?: string[];
}

export interface CoachingResponse {
  message: string;
  actionItems: string[];
  encouragement: string;
  suggestedNextStep?: string;
}

// Storage state
export interface PottyTrackerState {
  events: PottyEvent[];
  settings: ChildSettings;
  streakData: StreakData;
  milestones: Milestone[];
  readinessAssessments: ReadinessAssessmentResult[];
}

// View types
export type TrackerView = 'dashboard' | 'history' | 'patterns' | 'coaching' | 'readiness' | 'milestones' | 'settings';

// Quick log types
export type QuickLogType = 'success' | 'accident' | 'attempt';
