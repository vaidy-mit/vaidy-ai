'use client';

import { TrainingPhase } from '@/data/potty-tracker-types';
import { getPhaseLabel, getPhaseEmoji, getPhaseProgress } from '@/lib/potty-tracker-utils';

interface PhaseIndicatorProps {
  phase: TrainingPhase;
  onPhaseClick?: () => void;
}

const PHASES: TrainingPhase[] = [
  'not_started',
  'readiness_assessment',
  'introduction',
  'active_training',
  'consolidation',
  'graduated',
];

export function PhaseIndicator({ phase, onPhaseClick }: PhaseIndicatorProps) {
  const progress = getPhaseProgress(phase);
  const currentIndex = PHASES.indexOf(phase);

  return (
    <button
      onClick={onPhaseClick}
      className="w-full bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 hover:border-[var(--text-primary)]/50 transition-colors text-left"
    >
      {/* Current Phase */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getPhaseEmoji(phase)}</span>
          <div>
            <div className="text-sm text-[var(--text-muted)]">Current Phase</div>
            <div className="text-lg font-semibold text-[var(--text-white)]">
              {getPhaseLabel(phase)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{progress}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-[var(--bg-terminal)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--text-primary)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Phase markers */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0">
          {PHASES.map((p, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={p}
                className={`
                  w-3 h-3 rounded-full border-2 transition-all
                  ${
                    isCompleted
                      ? 'bg-[var(--text-primary)] border-[var(--text-primary)]'
                      : isCurrent
                      ? 'bg-[var(--accent-purple)] border-[var(--accent-purple)] ring-2 ring-[var(--accent-purple)]/30'
                      : 'bg-[var(--bg-terminal)] border-[var(--border-color)]'
                  }
                `}
                title={getPhaseLabel(p)}
              />
            );
          })}
        </div>
      </div>

      {/* Phase labels (condensed) */}
      <div className="flex justify-between mt-3 text-xs text-[var(--text-muted)]">
        <span>Start</span>
        <span>Training</span>
        <span>Graduate</span>
      </div>
    </button>
  );
}
