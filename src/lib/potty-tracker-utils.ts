// Potty Tracker Utilities

import {
  PottyEvent,
  HourlyPattern,
  DailyStats,
  PatternInsight,
  StreakData,
  Milestone,
  MilestoneId,
  ReadinessQuestion,
  ReadinessAssessmentResult,
  TrainingPhase,
} from '@/data/potty-tracker-types';

// ID Generation
export function generateId(): string {
  return `pt${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Date utilities
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = formatDate(date) === formatDate(today);
  const isYesterday = formatDate(date) === formatDate(yesterday);

  const time = formatTime(date);

  if (isToday) return `Today at ${time}`;
  if (isYesterday) return `Yesterday at ${time}`;

  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${time}`;
}

export function getHourFromTimestamp(isoString: string): number {
  return new Date(isoString).getHours();
}

export function isToday(isoString: string): boolean {
  return formatDate(new Date(isoString)) === formatDate(new Date());
}

export function isSameDay(date1: string, date2: string): boolean {
  return formatDate(new Date(date1)) === formatDate(new Date(date2));
}

export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Event type helpers
export function getEventEmoji(type: PottyEvent['type']): string {
  switch (type) {
    case 'success':
      return '⭐';
    case 'accident':
      return '💧';
    case 'attempt':
      return '🚽';
  }
}

export function getEventLabel(type: PottyEvent['type']): string {
  switch (type) {
    case 'success':
      return 'Success!';
    case 'accident':
      return 'Accident';
    case 'attempt':
      return 'Attempt';
  }
}

export function getLocationEmoji(location: PottyEvent['location']): string {
  switch (location) {
    case 'potty':
      return '🪑';
    case 'toilet':
      return '🚽';
    case 'diaper':
      return '🩲';
    case 'floor':
      return '🏠';
    case 'clothes':
      return '👕';
  }
}

export function getLocationLabel(location: PottyEvent['location']): string {
  switch (location) {
    case 'potty':
      return 'Potty chair';
    case 'toilet':
      return 'Toilet';
    case 'diaper':
      return 'Diaper';
    case 'floor':
      return 'Floor';
    case 'clothes':
      return 'Clothes';
  }
}

export function getContentEmoji(content: PottyEvent['content']): string {
  switch (content) {
    case 'pee':
      return '💛';
    case 'poop':
      return '💩';
    case 'both':
      return '🌟';
  }
}

export function getContentLabel(content: PottyEvent['content']): string {
  switch (content) {
    case 'pee':
      return 'Pee';
    case 'poop':
      return 'Poop';
    case 'both':
      return 'Both';
  }
}

// Stats calculations
export function calculateTodayStats(events: PottyEvent[]): {
  successes: number;
  accidents: number;
  attempts: number;
} {
  const todayEvents = events.filter((e) => isToday(e.timestamp));
  return {
    successes: todayEvents.filter((e) => e.type === 'success').length,
    accidents: todayEvents.filter((e) => e.type === 'accident').length,
    attempts: todayEvents.filter((e) => e.type === 'attempt').length,
  };
}

export function calculateStreak(events: PottyEvent[]): StreakData {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (consecutive successes from most recent)
  for (const event of sortedEvents) {
    if (event.type === 'success') {
      currentStreak++;
    } else if (event.type === 'accident') {
      break;
    }
    // attempts don't break streaks
  }

  // Calculate best streak
  for (const event of sortedEvents) {
    if (event.type === 'success') {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else if (event.type === 'accident') {
      tempStreak = 0;
    }
  }

  const successes = events.filter((e) => e.type === 'success');
  const lastSuccess = successes.length > 0 ? successes[0]?.timestamp : undefined;

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    lastSuccessDate: lastSuccess,
    totalSuccesses: events.filter((e) => e.type === 'success').length,
    totalAccidents: events.filter((e) => e.type === 'accident').length,
    totalAttempts: events.filter((e) => e.type === 'attempt').length,
    selfInitiatedCount: events.filter((e) => e.type === 'success' && !e.promptedByParent).length,
  };
}

// Pattern analysis
export function calculateHourlyPatterns(events: PottyEvent[]): HourlyPattern[] {
  const patterns: HourlyPattern[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    successes: 0,
    accidents: 0,
    attempts: 0,
    total: 0,
  }));

  for (const event of events) {
    const hour = getHourFromTimestamp(event.timestamp);
    patterns[hour].total++;
    if (event.type === 'success') patterns[hour].successes++;
    if (event.type === 'accident') patterns[hour].accidents++;
    if (event.type === 'attempt') patterns[hour].attempts++;
  }

  return patterns;
}

export function calculateDailyStats(events: PottyEvent[], days: number = 7): DailyStats[] {
  const stats: DailyStats[] = [];

  for (let i = 0; i < days; i++) {
    const date = getDaysAgo(i);
    const dateStr = formatDate(date);
    const dayEvents = events.filter((e) => formatDate(new Date(e.timestamp)) === dateStr);

    const successes = dayEvents.filter((e) => e.type === 'success').length;
    const accidents = dayEvents.filter((e) => e.type === 'accident').length;
    const attempts = dayEvents.filter((e) => e.type === 'attempt').length;
    const total = successes + accidents;

    stats.push({
      date: dateStr,
      successes,
      accidents,
      attempts,
      successRate: total > 0 ? (successes / total) * 100 : 0,
    });
  }

  return stats.reverse();
}

export function generatePatternInsights(
  events: PottyEvent[],
  hourlyPatterns: HourlyPattern[]
): PatternInsight[] {
  const insights: PatternInsight[] = [];

  if (events.length < 5) {
    insights.push({
      type: 'trend',
      message: 'Keep logging events to unlock pattern insights! Need at least 5 events.',
      confidence: 'low',
    });
    return insights;
  }

  // Find peak success hours
  const successHours = hourlyPatterns
    .filter((p) => p.successes > 0)
    .sort((a, b) => b.successes - a.successes);

  if (successHours.length > 0) {
    const peakHour = successHours[0];
    insights.push({
      type: 'peak_success',
      message: `Best success time: ${formatHour(peakHour.hour)} (${peakHour.successes} successes)`,
      hour: peakHour.hour,
      confidence: peakHour.successes >= 3 ? 'high' : 'medium',
    });
  }

  // Find accident-prone hours
  const accidentHours = hourlyPatterns
    .filter((p) => p.accidents > 0)
    .sort((a, b) => b.accidents - a.accidents);

  if (accidentHours.length > 0) {
    const riskHour = accidentHours[0];
    if (riskHour.accidents >= 2) {
      insights.push({
        type: 'accident_prone',
        message: `Watch out around ${formatHour(riskHour.hour)} - ${riskHour.accidents} accidents recorded`,
        hour: riskHour.hour,
        confidence: riskHour.accidents >= 3 ? 'high' : 'medium',
      });
    }
  }

  // Suggest reminder times based on gaps
  const successTimes = events
    .filter((e) => e.type === 'success')
    .map((e) => new Date(e.timestamp).getHours());

  if (successTimes.length >= 3) {
    const avgInterval = calculateAverageInterval(events);
    if (avgInterval) {
      insights.push({
        type: 'suggested_reminder',
        message: `Average time between successes: ${Math.round(avgInterval / 60)} minutes. Consider setting reminders.`,
        confidence: 'medium',
      });
    }
  }

  // Weekly trend
  const weekStats = calculateDailyStats(events, 7);
  const recentDays = weekStats.slice(-3);
  const earlierDays = weekStats.slice(0, 4);

  const recentSuccessRate =
    recentDays.reduce((sum, d) => sum + d.successRate, 0) / recentDays.length;
  const earlierSuccessRate =
    earlierDays.length > 0
      ? earlierDays.reduce((sum, d) => sum + d.successRate, 0) / earlierDays.length
      : 0;

  if (recentSuccessRate > earlierSuccessRate + 10) {
    insights.push({
      type: 'celebration',
      message: 'Great progress! Success rate is improving this week!',
      confidence: 'high',
    });
  } else if (recentSuccessRate < earlierSuccessRate - 10) {
    insights.push({
      type: 'trend',
      message: "Success rate has dipped recently. That's normal - stay consistent!",
      confidence: 'medium',
    });
  }

  return insights;
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

function calculateAverageInterval(events: PottyEvent[]): number | null {
  const successes = events
    .filter((e) => e.type === 'success')
    .map((e) => new Date(e.timestamp).getTime())
    .sort((a, b) => a - b);

  if (successes.length < 2) return null;

  let totalInterval = 0;
  for (let i = 1; i < successes.length; i++) {
    totalInterval += successes[i] - successes[i - 1];
  }

  return totalInterval / (successes.length - 1) / 1000; // Return in seconds
}

// Milestone definitions and checking
export const MILESTONE_DEFINITIONS: Omit<Milestone, 'unlockedAt'>[] = [
  {
    id: 'first_star',
    name: 'First Star',
    description: 'Logged your first success!',
    emoji: '⭐',
    requirement: '1 success',
  },
  {
    id: 'hat_trick',
    name: 'Hat Trick',
    description: '3 successes in a row!',
    emoji: '🎩',
    requirement: '3-streak',
  },
  {
    id: 'high_five',
    name: 'High Five',
    description: '5 successes in a row!',
    emoji: '🖐️',
    requirement: '5-streak',
  },
  {
    id: 'perfect_ten',
    name: 'Perfect 10',
    description: 'Reached 10 total successes!',
    emoji: '🔟',
    requirement: '10 total successes',
  },
  {
    id: 'super_star',
    name: 'Super Star',
    description: '10 successes in a row!',
    emoji: '🌟',
    requirement: '10-streak',
  },
  {
    id: 'dry_day_champion',
    name: 'Dry Day Champion',
    description: 'Full day with no accidents!',
    emoji: '🏆',
    requirement: 'Full day, 3+ successes, no accidents',
  },
  {
    id: 'self_starter',
    name: 'Self Starter',
    description: '5 self-initiated successes!',
    emoji: '🚀',
    requirement: '5 unprompted successes',
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Successes every day for a week!',
    emoji: '📅',
    requirement: 'At least 1 success each day for 7 days',
  },
  {
    id: 'poop_pro',
    name: 'Poop Pro',
    description: '5 successful poops on the potty!',
    emoji: '💩',
    requirement: '5 poop successes',
  },
  {
    id: 'independence_day',
    name: 'Independence Day',
    description: 'A day of only self-initiated successes!',
    emoji: '🗽',
    requirement: 'Full day with 3+ unprompted successes',
  },
];

export function checkMilestones(
  events: PottyEvent[],
  currentMilestones: Milestone[]
): Milestone[] {
  const updatedMilestones = [...currentMilestones];
  const streakData = calculateStreak(events);
  const todayEvents = events.filter((e) => isToday(e.timestamp));
  const todaySuccesses = todayEvents.filter((e) => e.type === 'success');
  const todayAccidents = todayEvents.filter((e) => e.type === 'accident');

  const milestoneChecks: Record<MilestoneId, () => boolean> = {
    first_star: () => streakData.totalSuccesses >= 1,
    hat_trick: () => streakData.currentStreak >= 3 || streakData.bestStreak >= 3,
    high_five: () => streakData.currentStreak >= 5 || streakData.bestStreak >= 5,
    perfect_ten: () => streakData.totalSuccesses >= 10,
    super_star: () => streakData.currentStreak >= 10 || streakData.bestStreak >= 10,
    dry_day_champion: () => todaySuccesses.length >= 3 && todayAccidents.length === 0,
    self_starter: () => streakData.selfInitiatedCount >= 5,
    week_warrior: () => {
      const weekStats = calculateDailyStats(events, 7);
      return weekStats.every((day) => day.successes >= 1);
    },
    poop_pro: () => {
      const poopSuccesses = events.filter(
        (e) => e.type === 'success' && (e.content === 'poop' || e.content === 'both')
      );
      return poopSuccesses.length >= 5;
    },
    independence_day: () => {
      const selfInitiated = todaySuccesses.filter((e) => !e.promptedByParent);
      return selfInitiated.length >= 3 && selfInitiated.length === todaySuccesses.length;
    },
  };

  for (const milestone of updatedMilestones) {
    if (!milestone.unlockedAt && milestoneChecks[milestone.id]?.()) {
      milestone.unlockedAt = new Date().toISOString();
    }
  }

  return updatedMilestones;
}

export function getNewlyUnlockedMilestones(
  oldMilestones: Milestone[],
  newMilestones: Milestone[]
): Milestone[] {
  return newMilestones.filter((newM) => {
    const oldM = oldMilestones.find((m) => m.id === newM.id);
    return newM.unlockedAt && !oldM?.unlockedAt;
  });
}

// Readiness assessment questions
export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  // Physical readiness (5 questions)
  {
    id: 'physical_1',
    category: 'physical',
    question: 'Can stay dry for 2+ hours during the day?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'physical_2',
    category: 'physical',
    question: 'Has regular, predictable bowel movements?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'physical_3',
    category: 'physical',
    question: 'Can walk to and sit on the potty independently?',
    type: 'boolean',
    weight: 1,
  },
  {
    id: 'physical_4',
    category: 'physical',
    question: 'Can pull pants up and down with minimal help?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'physical_5',
    category: 'physical',
    question: 'Wakes up dry from naps sometimes?',
    type: 'boolean',
    weight: 1,
  },

  // Cognitive readiness (5 questions)
  {
    id: 'cognitive_1',
    category: 'cognitive',
    question: 'Understands simple instructions (2-3 steps)?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'cognitive_2',
    category: 'cognitive',
    question: 'Knows the words for pee and poop?',
    type: 'boolean',
    weight: 1,
  },
  {
    id: 'cognitive_3',
    category: 'cognitive',
    question: 'Can tell you when diaper is wet or dirty?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'cognitive_4',
    category: 'cognitive',
    question: 'Understands the connection between urge and action?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'cognitive_5',
    category: 'cognitive',
    question: 'Can focus on one activity for 5+ minutes?',
    type: 'boolean',
    weight: 1,
  },

  // Behavioral readiness (5 questions)
  {
    id: 'behavioral_1',
    category: 'behavioral',
    question: 'Shows discomfort when diaper is wet/dirty?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'behavioral_2',
    category: 'behavioral',
    question: 'Wants to be changed promptly after wetting?',
    type: 'boolean',
    weight: 1,
  },
  {
    id: 'behavioral_3',
    category: 'behavioral',
    question: 'Shows signs before going (squatting, hiding, facial expressions)?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'behavioral_4',
    category: 'behavioral',
    question: 'Can sit still for 2-5 minutes at a time?',
    type: 'boolean',
    weight: 1,
  },
  {
    id: 'behavioral_5',
    category: 'behavioral',
    question: 'Follows simple routines willingly?',
    type: 'boolean',
    weight: 2,
  },

  // Interest (5 questions)
  {
    id: 'interest_1',
    category: 'interest',
    question: 'Shows interest in the bathroom/toilet?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'interest_2',
    category: 'interest',
    question: 'Wants to watch parents/siblings use the toilet?',
    type: 'boolean',
    weight: 1,
  },
  {
    id: 'interest_3',
    category: 'interest',
    question: 'Interested in wearing "big kid" underwear?',
    type: 'boolean',
    weight: 2,
  },
  {
    id: 'interest_4',
    category: 'interest',
    question: 'Wants to be more independent in general?',
    type: 'boolean',
    weight: 1,
  },
  {
    id: 'interest_5',
    category: 'interest',
    question: 'Responds positively to praise and encouragement?',
    type: 'boolean',
    weight: 2,
  },
];

export function calculateReadinessScore(
  answers: { questionId: string; answer: boolean | number }[]
): ReadinessAssessmentResult {
  const categoryScores = { physical: 0, cognitive: 0, behavioral: 0, interest: 0 };
  const maxCategoryScores = { physical: 0, cognitive: 0, behavioral: 0, interest: 0 };
  let totalScore = 0;
  let maxScore = 0;

  for (const question of READINESS_QUESTIONS) {
    const answer = answers.find((a) => a.questionId === question.id);
    const score = answer?.answer === true ? question.weight : 0;

    categoryScores[question.category] += score;
    maxCategoryScores[question.category] += question.weight;
    totalScore += score;
    maxScore += question.weight;
  }

  // Normalize category scores to 0-100
  const normalizedCategoryScores = {
    physical: Math.round((categoryScores.physical / maxCategoryScores.physical) * 100) || 0,
    cognitive: Math.round((categoryScores.cognitive / maxCategoryScores.cognitive) * 100) || 0,
    behavioral: Math.round((categoryScores.behavioral / maxCategoryScores.behavioral) * 100) || 0,
    interest: Math.round((categoryScores.interest / maxCategoryScores.interest) * 100) || 0,
  };

  return {
    id: generateId(),
    date: new Date().toISOString(),
    answers: answers.map((a) => ({ questionId: a.questionId, answer: a.answer })),
    totalScore,
    maxScore,
    percentageScore: Math.round((totalScore / maxScore) * 100),
    categoryScores: normalizedCategoryScores,
  };
}

export function getReadinessLevel(score: number): {
  level: string;
  color: string;
  recommendation: string;
} {
  if (score >= 80) {
    return {
      level: 'Ready!',
      color: 'var(--text-primary)',
      recommendation: 'Great signs of readiness! Consider starting active training.',
    };
  }
  if (score >= 60) {
    return {
      level: 'Almost Ready',
      color: 'var(--accent-yellow)',
      recommendation: 'Good progress! A few more signs and you can begin.',
    };
  }
  if (score >= 40) {
    return {
      level: 'Getting There',
      color: 'var(--accent-orange)',
      recommendation: 'Some readiness signs present. Continue introducing the concept.',
    };
  }
  return {
    level: 'Not Yet',
    color: 'var(--accent-red)',
    recommendation: 'Give it more time. Focus on building familiarity with the potty.',
  };
}

// Phase helpers
export function getPhaseLabel(phase: TrainingPhase): string {
  switch (phase) {
    case 'not_started':
      return 'Not Started';
    case 'readiness_assessment':
      return 'Assessing Readiness';
    case 'introduction':
      return 'Introduction Phase';
    case 'active_training':
      return 'Active Training';
    case 'consolidation':
      return 'Consolidation';
    case 'graduated':
      return 'Graduated!';
  }
}

export function getPhaseEmoji(phase: TrainingPhase): string {
  switch (phase) {
    case 'not_started':
      return '📋';
    case 'readiness_assessment':
      return '🔍';
    case 'introduction':
      return '👋';
    case 'active_training':
      return '🚀';
    case 'consolidation':
      return '💪';
    case 'graduated':
      return '🎓';
  }
}

export function getPhaseProgress(phase: TrainingPhase): number {
  switch (phase) {
    case 'not_started':
      return 0;
    case 'readiness_assessment':
      return 15;
    case 'introduction':
      return 30;
    case 'active_training':
      return 55;
    case 'consolidation':
      return 80;
    case 'graduated':
      return 100;
  }
}

// Suggested next potty time
export function suggestNextPottyTime(events: PottyEvent[]): Date | null {
  if (events.length === 0) return null;

  const recentSuccesses = events
    .filter((e) => e.type === 'success')
    .slice(0, 10);

  if (recentSuccesses.length === 0) {
    // No successes yet, suggest every 30 minutes
    const next = new Date();
    next.setMinutes(next.getMinutes() + 30);
    return next;
  }

  // Calculate average interval between successes
  const intervals: number[] = [];
  for (let i = 0; i < recentSuccesses.length - 1; i++) {
    const diff =
      new Date(recentSuccesses[i].timestamp).getTime() -
      new Date(recentSuccesses[i + 1].timestamp).getTime();
    if (diff > 0 && diff < 6 * 60 * 60 * 1000) {
      // Ignore gaps > 6 hours (likely overnight)
      intervals.push(diff);
    }
  }

  if (intervals.length === 0) {
    const next = new Date();
    next.setMinutes(next.getMinutes() + 45);
    return next;
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const lastEvent = new Date(events[0].timestamp);
  const suggestedTime = new Date(lastEvent.getTime() + avgInterval);

  // If suggested time is in the past, suggest now + average interval
  if (suggestedTime.getTime() < Date.now()) {
    return new Date(Date.now() + avgInterval);
  }

  return suggestedTime;
}

export function formatSuggestedTime(date: Date | null): string {
  if (!date) return 'No data yet';

  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) return 'Now!';
  if (diff < 60000) return 'In less than a minute';

  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `In ${minutes} minute${minutes === 1 ? '' : 's'}`;

  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `In ${hours} hour${hours === 1 ? '' : 's'}`;
  return `In ${hours}h ${remainingMins}m`;
}

// Trend calculation
export function calculateTrend(
  events: PottyEvent[]
): 'improving' | 'stable' | 'declining' {
  const weekStats = calculateDailyStats(events, 7);
  const recentDays = weekStats.slice(-3);
  const earlierDays = weekStats.slice(0, 4);

  if (recentDays.length === 0 || earlierDays.length === 0) return 'stable';

  const recentAvg = recentDays.reduce((sum, d) => sum + d.successRate, 0) / recentDays.length;
  const earlierAvg = earlierDays.reduce((sum, d) => sum + d.successRate, 0) / earlierDays.length;

  if (recentAvg > earlierAvg + 15) return 'improving';
  if (recentAvg < earlierAvg - 15) return 'declining';
  return 'stable';
}

// Get recent events for display
export function getRecentEvents(events: PottyEvent[], count: number = 5): PottyEvent[] {
  return [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
}
