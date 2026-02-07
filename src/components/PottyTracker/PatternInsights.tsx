'use client';

import { PatternInsight, DailyStats } from '@/data/potty-tracker-types';

interface PatternInsightsProps {
  insights: PatternInsight[];
  weeklyStats: DailyStats[];
}

const INSIGHT_ICONS: Record<PatternInsight['type'], string> = {
  peak_success: '🎯',
  accident_prone: '⚠️',
  suggested_reminder: '⏰',
  trend: '📈',
  celebration: '🎉',
};

const INSIGHT_COLORS: Record<PatternInsight['type'], string> = {
  peak_success: 'border-green-500/30 bg-green-500/10',
  accident_prone: 'border-yellow-500/30 bg-yellow-500/10',
  suggested_reminder: 'border-blue-500/30 bg-blue-500/10',
  trend: 'border-purple-500/30 bg-purple-500/10',
  celebration: 'border-[var(--text-primary)]/30 bg-[var(--text-primary)]/10',
};

export function PatternInsights({ insights, weeklyStats }: PatternInsightsProps) {
  const totalSuccesses = weeklyStats.reduce((sum, d) => sum + d.successes, 0);
  const totalAccidents = weeklyStats.reduce((sum, d) => sum + d.accidents, 0);
  const avgSuccessRate =
    weeklyStats.length > 0
      ? weeklyStats.reduce((sum, d) => sum + d.successRate, 0) / weeklyStats.length
      : 0;

  return (
    <div className="space-y-4">
      {/* Weekly Summary */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-lg font-semibold text-[var(--text-white)] mb-4 flex items-center gap-2">
          <span>📅</span> This Week
        </h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{totalSuccesses}</div>
            <div className="text-xs text-[var(--text-muted)]">Successes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{totalAccidents}</div>
            <div className="text-xs text-[var(--text-muted)]">Accidents</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {avgSuccessRate.toFixed(0)}%
            </div>
            <div className="text-xs text-[var(--text-muted)]">Success Rate</div>
          </div>
        </div>

        {/* Daily breakdown */}
        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
          <div className="flex justify-between gap-1">
            {weeklyStats.map((day, index) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
              const hasData = day.successes + day.accidents > 0;
              const successRate = day.successRate;

              return (
                <div key={index} className="flex-1 text-center">
                  <div className="text-xs text-[var(--text-muted)] mb-1">{dayName}</div>
                  <div
                    className={`
                      h-8 rounded flex items-center justify-center text-xs font-medium
                      ${
                        !hasData
                          ? 'bg-[var(--bg-terminal)] text-[var(--text-muted)]'
                          : successRate >= 80
                          ? 'bg-green-500/30 text-green-400'
                          : successRate >= 50
                          ? 'bg-yellow-500/30 text-yellow-400'
                          : 'bg-red-500/30 text-red-400'
                      }
                    `}
                  >
                    {hasData ? `${successRate.toFixed(0)}%` : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-lg font-semibold text-[var(--text-white)] mb-4 flex items-center gap-2">
          <span>💡</span> Insights
        </h3>

        {insights.length === 0 ? (
          <p className="text-[var(--text-muted)] text-center py-4">
            Keep logging events to unlock insights!
          </p>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border
                  ${INSIGHT_COLORS[insight.type]}
                `}
              >
                <span className="text-xl">{INSIGHT_ICONS[insight.type]}</span>
                <div>
                  <p className="text-sm text-[var(--text-white)]">{insight.message}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Confidence: {insight.confidence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
