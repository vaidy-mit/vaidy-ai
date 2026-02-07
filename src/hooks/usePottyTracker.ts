'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  PottyEvent,
  ChildSettings,
  StreakData,
  Milestone,
  ReadinessAssessmentResult,
  TrainingPhase,
} from '@/data/potty-tracker-types';
import {
  generateId,
  calculateStreak,
  checkMilestones,
  getNewlyUnlockedMilestones,
  MILESTONE_DEFINITIONS,
} from '@/lib/potty-tracker-utils';

// Storage keys
const EVENTS_STORAGE_KEY = 'pottyTrackerEvents';
const SETTINGS_STORAGE_KEY = 'pottyTrackerSettings';
const MILESTONES_STORAGE_KEY = 'pottyTrackerMilestones';
const READINESS_STORAGE_KEY = 'pottyTrackerReadiness';

// Default settings
const DEFAULT_SETTINGS: ChildSettings = {
  name: '',
  currentPhase: 'not_started',
  preferredRewardEmoji: '⭐',
  reminderIntervalMinutes: 45,
};

// Initialize milestones
const DEFAULT_MILESTONES: Milestone[] = MILESTONE_DEFINITIONS.map((m) => ({
  ...m,
  unlockedAt: undefined,
}));

export interface UsePottyTrackerReturn {
  // Data
  events: PottyEvent[];
  settings: ChildSettings;
  streakData: StreakData;
  milestones: Milestone[];
  readinessAssessments: ReadinessAssessmentResult[];
  isLoaded: boolean;

  // Event actions
  addEvent: (event: Omit<PottyEvent, 'id' | 'timestamp'>) => {
    event: PottyEvent;
    newMilestones: Milestone[];
  };
  updateEvent: (id: string, updates: Partial<PottyEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => PottyEvent | undefined;

  // Settings actions
  updateSettings: (updates: Partial<ChildSettings>) => void;
  setPhase: (phase: TrainingPhase) => void;

  // Readiness actions
  addReadinessAssessment: (result: ReadinessAssessmentResult) => void;
  getLatestReadiness: () => ReadinessAssessmentResult | undefined;

  // Quick log helper
  quickLog: (
    type: 'success' | 'accident' | 'attempt',
    promptedByParent?: boolean
  ) => { event: PottyEvent; newMilestones: Milestone[] };

  // Reset
  resetAllData: () => void;
}

export function usePottyTracker(): UsePottyTrackerReturn {
  const [events, setEvents] = useState<PottyEvent[]>([]);
  const [settings, setSettings] = useState<ChildSettings>(DEFAULT_SETTINGS);
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [readinessAssessments, setReadinessAssessments] = useState<ReadinessAssessmentResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculated streak data
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    totalSuccesses: 0,
    totalAccidents: 0,
    totalAttempts: 0,
    selfInitiatedCount: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const storedMilestones = localStorage.getItem(MILESTONES_STORAGE_KEY);
      const storedReadiness = localStorage.getItem(READINESS_STORAGE_KEY);

      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
        setStreakData(calculateStreak(parsedEvents));
      }

      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }

      if (storedMilestones) {
        // Merge stored with defaults to pick up any new milestones
        const parsed = JSON.parse(storedMilestones);
        const merged = DEFAULT_MILESTONES.map((defaultM) => {
          const stored = parsed.find((m: Milestone) => m.id === defaultM.id);
          return stored ? { ...defaultM, unlockedAt: stored.unlockedAt } : defaultM;
        });
        setMilestones(merged);
      }

      if (storedReadiness) {
        setReadinessAssessments(JSON.parse(storedReadiness));
      }
    } catch (error) {
      console.error('Error loading potty tracker data:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save events to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
      setStreakData(calculateStreak(events));
    }
  }, [events, isLoaded]);

  // Save settings to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Save milestones to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(milestones));
    }
  }, [milestones, isLoaded]);

  // Save readiness assessments to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(readinessAssessments));
    }
  }, [readinessAssessments, isLoaded]);

  // Add event
  const addEvent = useCallback(
    (eventData: Omit<PottyEvent, 'id' | 'timestamp'>) => {
      const newEvent: PottyEvent = {
        ...eventData,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };

      const newEvents = [newEvent, ...events];
      setEvents(newEvents);

      // Check for new milestones
      const updatedMilestones = checkMilestones(newEvents, milestones);
      const newlyUnlocked = getNewlyUnlockedMilestones(milestones, updatedMilestones);

      if (newlyUnlocked.length > 0) {
        setMilestones(updatedMilestones);
      }

      return { event: newEvent, newMilestones: newlyUnlocked };
    },
    [events, milestones]
  );

  // Update event
  const updateEvent = useCallback((id: string, updates: Partial<PottyEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  }, []);

  // Delete event
  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  // Get event by ID
  const getEventById = useCallback(
    (id: string) => {
      return events.find((event) => event.id === id);
    },
    [events]
  );

  // Update settings
  const updateSettings = useCallback((updates: Partial<ChildSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // Set phase
  const setPhase = useCallback((phase: TrainingPhase) => {
    setSettings((prev) => ({ ...prev, currentPhase: phase }));
  }, []);

  // Add readiness assessment
  const addReadinessAssessment = useCallback((result: ReadinessAssessmentResult) => {
    setReadinessAssessments((prev) => [result, ...prev]);
  }, []);

  // Get latest readiness assessment
  const getLatestReadiness = useCallback(() => {
    return readinessAssessments[0];
  }, [readinessAssessments]);

  // Quick log helper
  const quickLog = useCallback(
    (type: 'success' | 'accident' | 'attempt', promptedByParent: boolean = true) => {
      // Default to most common values for quick logging
      const location = type === 'success' ? 'potty' : type === 'accident' ? 'clothes' : 'potty';
      const content = 'pee'; // Most common

      return addEvent({
        type,
        location: location as PottyEvent['location'],
        content,
        promptedByParent,
      });
    },
    [addEvent]
  );

  // Reset all data
  const resetAllData = useCallback(() => {
    setEvents([]);
    setSettings(DEFAULT_SETTINGS);
    setMilestones(DEFAULT_MILESTONES);
    setReadinessAssessments([]);
    setStreakData({
      currentStreak: 0,
      bestStreak: 0,
      totalSuccesses: 0,
      totalAccidents: 0,
      totalAttempts: 0,
      selfInitiatedCount: 0,
    });
    localStorage.removeItem(EVENTS_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    localStorage.removeItem(MILESTONES_STORAGE_KEY);
    localStorage.removeItem(READINESS_STORAGE_KEY);
  }, []);

  return {
    events,
    settings,
    streakData,
    milestones,
    readinessAssessments,
    isLoaded,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    updateSettings,
    setPhase,
    addReadinessAssessment,
    getLatestReadiness,
    quickLog,
    resetAllData,
  };
}
