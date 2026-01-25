"use client";

import { Activity } from '@/data/activity-types';

interface ActivityCardProps {
  activity: Activity;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ActivityCard({ activity, isFavorite, onToggleFavorite }: ActivityCardProps) {
  return (
    <div className="bg-[var(--bg-terminal)] rounded-xl border border-[var(--border-color)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{activity.emoji}</span>
          <h3 className="font-display text-lg font-semibold text-[var(--text-white)]">
            {activity.name}
          </h3>
        </div>
        <button
          onClick={onToggleFavorite}
          className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <svg className="w-5 h-5 text-[var(--accent-pink)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[var(--text-muted)] hover:text-[var(--accent-pink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          {activity.description}
        </p>

        {/* Materials */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
            <span>📦</span> Materials
          </h4>
          <ul className="space-y-1">
            {activity.materials.map((material, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <span className="text-[var(--text-primary)]">•</span>
                {material}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
            <span>📝</span> Steps
          </h4>
          <ol className="space-y-2">
            {activity.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--text-primary)]/20 text-[var(--text-primary)] flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Time estimate */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
          <span className="text-sm">⏱️</span>
          <span className="text-sm text-[var(--text-muted)]">
            {activity.timeMinutes < 10
              ? `${activity.timeMinutes} min`
              : `${activity.timeMinutes - 5}-${activity.timeMinutes} min`}
          </span>
        </div>
      </div>
    </div>
  );
}
