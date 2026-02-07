'use client';

import { HourlyPattern } from '@/data/potty-tracker-types';

interface PatternChartProps {
  patterns: HourlyPattern[];
}

export function PatternChart({ patterns }: PatternChartProps) {
  // Find max for scaling
  const maxTotal = Math.max(...patterns.map((p) => p.total), 1);

  // Format hour for display
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12a';
    if (hour === 12) return '12p';
    if (hour < 12) return `${hour}a`;
    return `${hour - 12}p`;
  };

  // Only show active hours (6am - 10pm typically)
  const activeHours = patterns.filter((p) => p.hour >= 6 && p.hour <= 22);

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
      <h3 className="text-lg font-semibold text-[var(--text-white)] mb-4 flex items-center gap-2">
        <span>🕐</span> Activity by Hour
      </h3>

      {/* 24-hour chart */}
      <div className="space-y-2">
        {activeHours.map((pattern) => {
          const successPercent = maxTotal > 0 ? (pattern.successes / maxTotal) * 100 : 0;
          const accidentPercent = maxTotal > 0 ? (pattern.accidents / maxTotal) * 100 : 0;
          const attemptPercent = maxTotal > 0 ? (pattern.attempts / maxTotal) * 100 : 0;

          return (
            <div key={pattern.hour} className="flex items-center gap-2">
              {/* Hour label */}
              <div className="w-10 text-xs text-[var(--text-muted)] text-right">
                {formatHour(pattern.hour)}
              </div>

              {/* Stacked bar */}
              <div className="flex-1 h-6 bg-[var(--bg-terminal)] rounded overflow-hidden flex">
                {/* Successes */}
                {pattern.successes > 0 && (
                  <div
                    className="h-full bg-green-500 flex items-center justify-center transition-all"
                    style={{ width: `${successPercent}%` }}
                    title={`${pattern.successes} success${pattern.successes > 1 ? 'es' : ''}`}
                  >
                    {pattern.successes > 0 && (
                      <span className="text-xs font-medium text-white">
                        {pattern.successes}
                      </span>
                    )}
                  </div>
                )}

                {/* Accidents */}
                {pattern.accidents > 0 && (
                  <div
                    className="h-full bg-blue-500 flex items-center justify-center transition-all"
                    style={{ width: `${accidentPercent}%` }}
                    title={`${pattern.accidents} accident${pattern.accidents > 1 ? 's' : ''}`}
                  >
                    {pattern.accidents > 0 && (
                      <span className="text-xs font-medium text-white">
                        {pattern.accidents}
                      </span>
                    )}
                  </div>
                )}

                {/* Attempts */}
                {pattern.attempts > 0 && (
                  <div
                    className="h-full bg-purple-500 flex items-center justify-center transition-all"
                    style={{ width: `${attemptPercent}%` }}
                    title={`${pattern.attempts} attempt${pattern.attempts > 1 ? 's' : ''}`}
                  >
                    {pattern.attempts > 0 && (
                      <span className="text-xs font-medium text-white">
                        {pattern.attempts}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Total count */}
              <div className="w-6 text-xs text-[var(--text-muted)] text-right">
                {pattern.total > 0 ? pattern.total : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--border-color)] justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-xs text-[var(--text-muted)]">Success</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-xs text-[var(--text-muted)]">Accident</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded" />
          <span className="text-xs text-[var(--text-muted)]">Attempt</span>
        </div>
      </div>

      {/* No data message */}
      {patterns.every((p) => p.total === 0) && (
        <div className="text-center py-8 text-[var(--text-muted)]">
          <p>No events logged yet.</p>
          <p className="text-sm mt-1">Start tracking to see patterns emerge!</p>
        </div>
      )}
    </div>
  );
}
