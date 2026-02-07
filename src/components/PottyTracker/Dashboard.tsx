'use client';

import { PottyEvent, ChildSettings, StreakData, Milestone } from '@/data/potty-tracker-types';
import {
  calculateTodayStats,
  getRecentEvents,
  suggestNextPottyTime,
  formatSuggestedTime,
  formatDateTime,
  getEventEmoji,
  getEventLabel,
  getLocationEmoji,
} from '@/lib/potty-tracker-utils';
import { QuickLogButton } from './QuickLogButton';
import { RewardDisplay } from './RewardDisplay';
import { PhaseIndicator } from './PhaseIndicator';

interface DashboardProps {
  events: PottyEvent[];
  settings: ChildSettings;
  streakData: StreakData;
  milestones: Milestone[];
  onQuickLog: (type: 'success' | 'accident' | 'attempt') => void;
  onDetailedLog: (type?: 'success' | 'accident' | 'attempt') => void;
  onViewPatterns: () => void;
  onViewCoaching: () => void;
  onViewSettings: () => void;
  onViewMilestones: () => void;
}

export function Dashboard({
  events,
  settings,
  streakData,
  milestones,
  onQuickLog,
  onDetailedLog,
  onViewPatterns,
  onViewCoaching,
  onViewSettings,
  onViewMilestones,
}: DashboardProps) {
  const todayStats = calculateTodayStats(events);
  const recentEvents = getRecentEvents(events, 3);
  const suggestedTime = suggestNextPottyTime(events);
  const unlockedMilestones = milestones.filter((m) => m.unlockedAt);

  return (
    <div className="space-y-6">
      {/* Header with child name */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-white)]">
            {settings.name ? `${settings.name}'s Potty Journey` : 'Potty Tracker'}
          </h1>
          <p className="text-[var(--text-muted)]">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={onViewSettings}
          className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-terminal)] transition-colors"
          title="Settings"
        >
          <svg
            className="w-5 h-5 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* Phase Indicator */}
      <PhaseIndicator phase={settings.currentPhase} onPhaseClick={onViewSettings} />

      {/* Today's Stats */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-lg font-semibold text-[var(--text-white)] mb-4">Today&apos;s Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-green-400">{todayStats.successes}</div>
            <div className="text-xs text-[var(--text-muted)]">Successes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">{todayStats.accidents}</div>
            <div className="text-xs text-[var(--text-muted)]">Accidents</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">{todayStats.attempts}</div>
            <div className="text-xs text-[var(--text-muted)]">Attempts</div>
          </div>
        </div>
      </div>

      {/* Quick Log Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-white)]">Quick Log</h3>
          <button
            onClick={() => onDetailedLog()}
            className="text-sm text-[var(--text-primary)] hover:underline"
          >
            + Detailed log
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <QuickLogButton type="success" onLog={() => onQuickLog('success')} />
          <QuickLogButton type="accident" onLog={() => onQuickLog('accident')} />
          <QuickLogButton type="attempt" onLog={() => onQuickLog('attempt')} />
        </div>
      </div>

      {/* Rewards */}
      <RewardDisplay streakData={streakData} rewardEmoji={settings.preferredRewardEmoji} />

      {/* Next Suggested Time */}
      {suggestedTime && (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <div className="text-sm text-[var(--text-muted)]">Next suggested potty time</div>
              <div className="text-lg font-semibold text-[var(--accent-blue)]">
                {formatSuggestedTime(suggestedTime)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
          <h3 className="text-lg font-semibold text-[var(--text-white)] mb-3">Recent Events</h3>
          <div className="space-y-2">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getEventEmoji(event.type)}</span>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-white)]">
                      {getEventLabel(event.type)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {getLocationEmoji(event.location)} {formatDateTime(event.timestamp)}
                    </div>
                  </div>
                </div>
                {!event.promptedByParent && (
                  <span className="text-xs bg-[var(--text-primary)]/20 text-[var(--text-primary)] px-2 py-1 rounded-full">
                    Self-initiated!
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones Preview */}
      {unlockedMilestones.length > 0 && (
        <button
          onClick={onViewMilestones}
          className="w-full bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 hover:border-[var(--accent-purple)]/50 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--text-white)]">Milestones</h3>
            <span className="text-sm text-[var(--text-muted)]">
              {unlockedMilestones.length} unlocked
            </span>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {unlockedMilestones.slice(0, 5).map((milestone) => (
              <div
                key={milestone.id}
                className="flex-shrink-0 text-2xl p-2 bg-[var(--accent-purple)]/10 rounded-lg border border-[var(--accent-purple)]/30"
                title={milestone.name}
              >
                {milestone.emoji}
              </div>
            ))}
            {unlockedMilestones.length > 5 && (
              <div className="flex-shrink-0 text-sm px-3 py-2 bg-[var(--bg-terminal)] rounded-lg text-[var(--text-muted)] flex items-center">
                +{unlockedMilestones.length - 5} more
              </div>
            )}
          </div>
        </button>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onViewPatterns}
          className="flex items-center justify-center gap-2 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-blue)]/50 transition-colors"
        >
          <span className="text-xl">📊</span>
          <span className="text-sm font-medium text-[var(--text-white)]">Patterns</span>
        </button>
        <button
          onClick={onViewCoaching}
          className="flex items-center justify-center gap-2 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--text-primary)]/50 transition-colors"
        >
          <span className="text-xl">🤖</span>
          <span className="text-sm font-medium text-[var(--text-white)]">AI Coach</span>
        </button>
      </div>
    </div>
  );
}
