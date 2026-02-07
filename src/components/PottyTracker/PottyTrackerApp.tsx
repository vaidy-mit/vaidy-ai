'use client';

import { useState, useEffect } from 'react';
import { usePottyTracker } from '@/hooks/usePottyTracker';
import { TrackerView, Milestone, PottyEvent } from '@/data/potty-tracker-types';
import {
  calculateHourlyPatterns,
  calculateDailyStats,
  generatePatternInsights,
} from '@/lib/potty-tracker-utils';

import { Dashboard } from './Dashboard';
import { EventLogger } from './EventLogger';
import { EventHistory } from './EventHistory';
import { PatternChart } from './PatternChart';
import { PatternInsights } from './PatternInsights';
import { MilestoneGallery } from './MilestoneGallery';
import { CoachingPanel } from './CoachingPanel';
import { ReadinessAssessment } from './ReadinessAssessment';
import { SettingsPanel } from './SettingsPanel';

export function PottyTrackerApp() {
  const {
    events,
    settings,
    streakData,
    milestones,
    readinessAssessments,
    isLoaded,
    addEvent,
    deleteEvent,
    updateSettings,
    addReadinessAssessment,
    getLatestReadiness,
    quickLog,
    resetAllData,
  } = usePottyTracker();

  const [currentView, setCurrentView] = useState<TrackerView>('dashboard');
  const [showEventLogger, setShowEventLogger] = useState(false);
  const [eventLoggerType, setEventLoggerType] = useState<PottyEvent['type'] | undefined>();
  const [celebrationMilestone, setCelebrationMilestone] = useState<Milestone | null>(null);

  // Calculate patterns
  const hourlyPatterns = calculateHourlyPatterns(events);
  const weeklyStats = calculateDailyStats(events, 7);
  const insights = generatePatternInsights(events, hourlyPatterns);

  // Handle milestone celebrations
  useEffect(() => {
    if (celebrationMilestone) {
      const timer = setTimeout(() => {
        setCelebrationMilestone(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [celebrationMilestone]);

  const handleQuickLog = (type: 'success' | 'accident' | 'attempt') => {
    const { newMilestones } = quickLog(type);
    if (newMilestones.length > 0) {
      setCelebrationMilestone(newMilestones[0]);
    }
  };

  const handleDetailedLog = (type?: PottyEvent['type']) => {
    setEventLoggerType(type);
    setShowEventLogger(true);
  };

  const handleSaveEvent = (eventData: Omit<PottyEvent, 'id' | 'timestamp'>) => {
    const { newMilestones } = addEvent(eventData);
    if (newMilestones.length > 0) {
      setCelebrationMilestone(newMilestones[0]);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--text-primary)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  const latestReadiness = getLatestReadiness();

  return (
    <div className="relative">
      {/* Main content */}
      <div className="max-w-md mx-auto">
        {currentView === 'dashboard' && (
          <Dashboard
            events={events}
            settings={settings}
            streakData={streakData}
            milestones={milestones}
            onQuickLog={handleQuickLog}
            onDetailedLog={handleDetailedLog}
            onViewPatterns={() => setCurrentView('patterns')}
            onViewCoaching={() => setCurrentView('coaching')}
            onViewSettings={() => setCurrentView('settings')}
            onViewMilestones={() => setCurrentView('milestones')}
          />
        )}

        {currentView === 'history' && (
          <EventHistory
            events={events}
            onClose={() => setCurrentView('dashboard')}
            onDeleteEvent={deleteEvent}
          />
        )}

        {currentView === 'patterns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
              <h1 className="text-xl font-bold text-[var(--text-white)]">Patterns</h1>
              <button
                onClick={() => setCurrentView('history')}
                className="text-sm text-[var(--text-primary)] hover:underline"
              >
                History
              </button>
            </div>
            <PatternChart patterns={hourlyPatterns} />
            <PatternInsights insights={insights} weeklyStats={weeklyStats} />
          </div>
        )}

        {currentView === 'coaching' && (
          <CoachingPanel
            events={events}
            settings={settings}
            streakData={streakData}
            readinessScore={latestReadiness?.percentageScore}
            milestonesUnlocked={milestones.filter((m) => m.unlockedAt).map((m) => m.name)}
            onClose={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'readiness' && (
          <ReadinessAssessment
            onComplete={addReadinessAssessment}
            onClose={() => setCurrentView('settings')}
            previousAssessments={readinessAssessments}
          />
        )}

        {currentView === 'milestones' && (
          <MilestoneGallery
            milestones={milestones}
            onClose={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsPanel
            settings={settings}
            onUpdateSettings={updateSettings}
            onClose={() => setCurrentView('dashboard')}
            onStartReadiness={() => setCurrentView('readiness')}
            onResetData={resetAllData}
          />
        )}
      </div>

      {/* Event logger modal */}
      <EventLogger
        isOpen={showEventLogger}
        onClose={() => setShowEventLogger(false)}
        onSave={handleSaveEvent}
        initialType={eventLoggerType}
      />

      {/* Milestone celebration overlay */}
      {celebrationMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm rounded-2xl border-2 border-[var(--accent-purple)] p-8 text-center animate-bounce shadow-2xl">
            <div className="text-6xl mb-4">{celebrationMilestone.emoji}</div>
            <h2 className="text-2xl font-bold text-[var(--text-white)] mb-2">
              {celebrationMilestone.name}!
            </h2>
            <p className="text-[var(--accent-purple)]">{celebrationMilestone.description}</p>
            <div className="mt-4 text-4xl">🎉</div>
          </div>
        </div>
      )}
    </div>
  );
}
