'use client';

import { useState } from 'react';
import {
  PottyEvent,
  ChildSettings,
  StreakData,
  CoachingContext,
  CoachingResponse,
} from '@/data/potty-tracker-types';
import { calculateTrend, getRecentEvents } from '@/lib/potty-tracker-utils';

interface CoachingPanelProps {
  events: PottyEvent[];
  settings: ChildSettings;
  streakData: StreakData;
  readinessScore?: number;
  milestonesUnlocked: string[];
  onClose: () => void;
}

export function CoachingPanel({
  events,
  settings,
  streakData,
  readinessScore,
  milestonesUnlocked,
  onClose,
}: CoachingPanelProps) {
  const [selectedContext, setSelectedContext] = useState<CoachingContext | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [response, setResponse] = useState<CoachingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trend = calculateTrend(events);
  const recentEvents = getRecentEvents(events, 10);
  const successRate =
    streakData.totalSuccesses + streakData.totalAccidents > 0
      ? (streakData.totalSuccesses /
          (streakData.totalSuccesses + streakData.totalAccidents)) *
        100
      : 0;

  const contextOptions: { context: CoachingContext; emoji: string; label: string; description: string }[] = [
    {
      context: 'encouragement',
      emoji: '💪',
      label: 'Encouragement',
      description: 'Get motivating words',
    },
    {
      context: 'strategy',
      emoji: '📋',
      label: 'Strategy Tips',
      description: 'Training approach advice',
    },
    {
      context: 'regression',
      emoji: '🔄',
      label: 'Handle Setbacks',
      description: 'When progress stalls',
    },
    {
      context: 'transition',
      emoji: '⬆️',
      label: 'Next Steps',
      description: 'Ready for more?',
    },
  ];

  const fetchCoaching = async (context: CoachingContext, question?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/potty-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          childName: settings.name || 'your child',
          currentPhase: settings.currentPhase,
          recentStats: {
            successRate,
            currentStreak: streakData.currentStreak,
            totalSuccesses: streakData.totalSuccesses,
            recentTrend: trend,
          },
          specificQuestion: question,
          recentEvents: recentEvents.map((e) => ({
            type: e.type,
            timestamp: e.timestamp,
            promptedByParent: e.promptedByParent,
          })),
          readinessScore,
          milestonesUnlocked,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get coaching advice');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContextSelect = (context: CoachingContext) => {
    setSelectedContext(context);
    fetchCoaching(context);
  };

  const handleAskQuestion = () => {
    if (customQuestion.trim()) {
      setSelectedContext('question');
      fetchCoaching('question', customQuestion.trim());
    }
  };

  const handleBack = () => {
    setSelectedContext(null);
    setResponse(null);
    setError(null);
    setCustomQuestion('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={selectedContext ? handleBack : onClose}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {selectedContext ? 'Back' : 'Back to Dashboard'}
        </button>
        <h1 className="text-xl font-bold text-[var(--text-white)]">AI Coach</h1>
        <div className="w-16" />
      </div>

      {!selectedContext ? (
        // Context selection
        <>
          {/* Current stats summary */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
            <div className="text-sm text-[var(--text-muted)] mb-2">Your current situation:</div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-[var(--bg-terminal)] px-2 py-1 rounded text-[var(--text-white)]">
                {streakData.currentStreak} streak
              </span>
              <span className="text-xs bg-[var(--bg-terminal)] px-2 py-1 rounded text-[var(--text-white)]">
                {successRate.toFixed(0)}% success rate
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  trend === 'improving'
                    ? 'bg-green-500/20 text-green-400'
                    : trend === 'declining'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {trend === 'improving' ? '📈 Improving' : trend === 'declining' ? '📉 Needs attention' : '➡️ Stable'}
              </span>
            </div>
          </div>

          {/* Context options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--text-white)]">What would you like help with?</h3>
            <div className="grid grid-cols-2 gap-3">
              {contextOptions.map((option) => (
                <button
                  key={option.context}
                  onClick={() => handleContextSelect(option.context)}
                  className="flex flex-col items-start p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--text-primary)]/50 transition-colors text-left"
                >
                  <span className="text-2xl mb-2">{option.emoji}</span>
                  <span className="text-sm font-semibold text-[var(--text-white)]">
                    {option.label}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] mt-1">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom question */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
            <h3 className="text-lg font-semibold text-[var(--text-white)] mb-3">Ask a question</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g., How do I handle nighttime training?"
                className="flex-1 px-4 py-3 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg text-[var(--text-white)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)]"
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              />
              <button
                onClick={handleAskQuestion}
                disabled={!customQuestion.trim()}
                className="px-4 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ask
              </button>
            </div>
          </div>
        </>
      ) : (
        // Response view
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--text-primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-[var(--text-muted)]">Getting personalized advice...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-center">{error}</p>
              <button
                onClick={handleBack}
                className="w-full mt-4 px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-terminal)]"
              >
                Try Again
              </button>
            </div>
          ) : response ? (
            <>
              {/* Main message */}
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="text-[var(--text-white)] whitespace-pre-line">
                      {response.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action items */}
              {response.actionItems && response.actionItems.length > 0 && (
                <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
                  <h3 className="text-lg font-semibold text-[var(--text-white)] mb-3 flex items-center gap-2">
                    <span>✅</span> Action Items
                  </h3>
                  <ul className="space-y-2">
                    {response.actionItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-[var(--text-muted)]"
                      >
                        <span className="text-[var(--text-primary)]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Encouragement */}
              {response.encouragement && (
                <div className="bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💜</span>
                    <p className="text-[var(--accent-purple)]">{response.encouragement}</p>
                  </div>
                </div>
              )}

              {/* Next step suggestion */}
              {response.suggestedNextStep && (
                <div className="bg-[var(--text-primary)]/10 border border-[var(--text-primary)]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">👉</span>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                        Suggested Next Step
                      </div>
                      <p className="text-sm text-[var(--text-white)]">
                        {response.suggestedNextStep}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
