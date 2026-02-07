'use client';

import { Milestone } from '@/data/potty-tracker-types';
import { formatDateTime } from '@/lib/potty-tracker-utils';

interface MilestoneGalleryProps {
  milestones: Milestone[];
  onClose: () => void;
}

export function MilestoneGallery({ milestones, onClose }: MilestoneGalleryProps) {
  const unlockedMilestones = milestones.filter((m) => m.unlockedAt);
  const lockedMilestones = milestones.filter((m) => !m.unlockedAt);

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
        <h1 className="text-xl font-bold text-[var(--text-white)]">Milestones</h1>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Progress */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--text-muted)]">Progress</span>
          <span className="text-[var(--text-primary)] font-bold">
            {unlockedMilestones.length} / {milestones.length}
          </span>
        </div>
        <div className="h-3 bg-[var(--bg-terminal)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--text-primary)] rounded-full transition-all duration-500"
            style={{
              width: `${(unlockedMilestones.length / milestones.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Unlocked Milestones */}
      {unlockedMilestones.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-white)] mb-3 flex items-center gap-2">
            <span>🏆</span> Unlocked
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {unlockedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-[var(--bg-card)] rounded-xl border border-[var(--accent-purple)]/30 p-4 relative overflow-hidden"
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background:
                      'radial-gradient(circle at center, var(--accent-purple) 0%, transparent 70%)',
                  }}
                />

                <div className="relative">
                  <div className="text-3xl mb-2">{milestone.emoji}</div>
                  <div className="text-sm font-semibold text-[var(--text-white)]">
                    {milestone.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {milestone.description}
                  </div>
                  {milestone.unlockedAt && (
                    <div className="text-xs text-[var(--accent-purple)] mt-2">
                      {formatDateTime(milestone.unlockedAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Milestones */}
      {lockedMilestones.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-white)] mb-3 flex items-center gap-2">
            <span>🔒</span> Locked
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {lockedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 opacity-60"
              >
                <div className="text-3xl mb-2 grayscale">{milestone.emoji}</div>
                <div className="text-sm font-semibold text-[var(--text-muted)]">
                  {milestone.name}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {milestone.requirement}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No milestones unlocked */}
      {unlockedMilestones.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-lg font-semibold text-[var(--text-white)] mb-2">
            Start Your Journey!
          </h3>
          <p className="text-[var(--text-muted)]">
            Log your first success to unlock your first milestone.
          </p>
        </div>
      )}
    </div>
  );
}
