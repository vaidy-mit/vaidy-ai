'use client';

import { useState } from 'react';
import { ChildSettings, TrainingPhase } from '@/data/potty-tracker-types';
import { getPhaseLabel, getPhaseEmoji } from '@/lib/potty-tracker-utils';

interface SettingsPanelProps {
  settings: ChildSettings;
  onUpdateSettings: (updates: Partial<ChildSettings>) => void;
  onClose: () => void;
  onStartReadiness: () => void;
  onResetData: () => void;
}

const PHASES: TrainingPhase[] = [
  'not_started',
  'readiness_assessment',
  'introduction',
  'active_training',
  'consolidation',
  'graduated',
];

const REWARD_EMOJIS = ['⭐', '🌟', '✨', '🎯', '🏆', '💎', '🦄', '🚀'];

export function SettingsPanel({
  settings,
  onUpdateSettings,
  onClose,
  onStartReadiness,
  onResetData,
}: SettingsPanelProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [name, setName] = useState(settings.name);

  const handleNameSave = () => {
    if (name.trim() !== settings.name) {
      onUpdateSettings({ name: name.trim() });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold text-[var(--text-white)]">Settings</h1>
        <div className="w-16" />
      </div>

      {/* Child name */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
          Child&apos;s Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="flex-1 px-4 py-3 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg text-[var(--text-white)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)]"
            onBlur={handleNameSave}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
          />
        </div>
      </div>

      {/* Training phase */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
          Training Phase
        </label>
        <div className="space-y-2">
          {PHASES.map((phase) => (
            <button
              key={phase}
              onClick={() => onUpdateSettings({ currentPhase: phase })}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                ${
                  settings.currentPhase === phase
                    ? 'border-[var(--text-primary)] bg-[var(--text-primary)]/10'
                    : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                }
              `}
            >
              <span className="text-xl">{getPhaseEmoji(phase)}</span>
              <span
                className={`text-sm font-medium ${
                  settings.currentPhase === phase
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-white)]'
                }`}
              >
                {getPhaseLabel(phase)}
              </span>
              {settings.currentPhase === phase && (
                <span className="ml-auto text-[var(--text-primary)]">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Readiness Assessment */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">Readiness Assessment</h3>
        <button
          onClick={onStartReadiness}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-[var(--accent-purple)]/50 bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/20 transition-colors"
        >
          <span>🔍</span>
          <span className="font-medium">Take Readiness Assessment</span>
        </button>
        <p className="text-xs text-[var(--text-muted)] mt-2 text-center">
          A quick questionnaire to evaluate potty training readiness
        </p>
      </div>

      {/* Reward emoji */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
          Reward Emoji
        </label>
        <div className="flex flex-wrap gap-2">
          {REWARD_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onUpdateSettings({ preferredRewardEmoji: emoji })}
              className={`
                w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all
                ${
                  settings.preferredRewardEmoji === emoji
                    ? 'bg-[var(--accent-purple)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-terminal)] border border-[var(--border-color)] hover:border-[var(--text-muted)]'
                }
              `}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Reminder interval */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
          Suggested Reminder Interval
        </label>
        <div className="flex gap-2">
          {[30, 45, 60, 90].map((minutes) => (
            <button
              key={minutes}
              onClick={() => onUpdateSettings({ reminderIntervalMinutes: minutes })}
              className={`
                flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  settings.reminderIntervalMinutes === minutes
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'bg-[var(--bg-terminal)] text-[var(--text-muted)] hover:text-[var(--text-white)]'
                }
              `}
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>

      {/* Training dates */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
          Training Start Date
        </label>
        <input
          type="date"
          value={settings.trainingStartDate || ''}
          onChange={(e) => onUpdateSettings({ trainingStartDate: e.target.value })}
          className="w-full px-4 py-3 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg text-[var(--text-white)] focus:outline-none focus:border-[var(--text-primary)]"
        />
      </div>

      {/* Reset data */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-red-500/30 p-4">
        <h3 className="text-sm font-medium text-red-400 mb-3">Danger Zone</h3>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Reset All Data
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-400">
              Are you sure? This will delete all events, milestones, and settings.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-terminal)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
