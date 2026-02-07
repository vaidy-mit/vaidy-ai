'use client';

import { StreakData } from '@/data/potty-tracker-types';

interface RewardDisplayProps {
  streakData: StreakData;
  rewardEmoji?: string;
}

export function RewardDisplay({ streakData, rewardEmoji = '⭐' }: RewardDisplayProps) {
  const { currentStreak, bestStreak, totalSuccesses } = streakData;

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
      <h3 className="text-lg font-semibold text-[var(--text-white)] mb-4 flex items-center gap-2">
        <span>🏆</span> Progress
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="relative">
            <div
              className={`
                text-4xl font-bold mb-1
                ${currentStreak >= 5 ? 'text-[var(--text-primary)]' : 'text-[var(--text-white)]'}
              `}
              style={{
                textShadow:
                  currentStreak >= 5 ? '0 0 20px var(--glow-green)' : 'none',
              }}
            >
              {currentStreak}
            </div>
            {currentStreak >= 3 && (
              <span className="absolute -top-1 -right-1 text-xl animate-bounce">🔥</span>
            )}
          </div>
          <div className="text-xs text-[var(--text-muted)]">Current Streak</div>
        </div>

        {/* Total Stars */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-2xl">{rewardEmoji}</span>
            <span className="text-3xl font-bold text-[var(--accent-yellow)]">
              {totalSuccesses}
            </span>
          </div>
          <div className="text-xs text-[var(--text-muted)]">Total Stars</div>
        </div>

        {/* Best Streak */}
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--accent-purple)] mb-1">
            {bestStreak}
          </div>
          <div className="text-xs text-[var(--text-muted)]">Best Streak</div>
        </div>
      </div>

      {/* Star collection visualization for kids */}
      {totalSuccesses > 0 && totalSuccesses <= 20 && (
        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: totalSuccesses }).map((_, i) => (
              <span
                key={i}
                className="text-xl animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '2s',
                }}
              >
                {rewardEmoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Streak encouragement */}
      {currentStreak >= 1 && (
        <div className="mt-4 pt-4 border-t border-[var(--border-color)] text-center">
          <div className="text-sm text-[var(--text-muted)]">
            {currentStreak === 1 && "Great start! Let's keep it going! 💪"}
            {currentStreak === 2 && 'Two in a row! Amazing! 🌟'}
            {currentStreak === 3 && 'Hat trick! Three successes! 🎩'}
            {currentStreak === 4 && 'Four stars! Almost at High Five! 🙌'}
            {currentStreak === 5 && 'HIGH FIVE! 5 in a row! 🖐️'}
            {currentStreak > 5 && currentStreak < 10 && `${currentStreak} streak! Incredible! 🚀`}
            {currentStreak >= 10 && 'SUPER STAR! 10+ streak! 🌟🌟🌟'}
          </div>
        </div>
      )}
    </div>
  );
}
