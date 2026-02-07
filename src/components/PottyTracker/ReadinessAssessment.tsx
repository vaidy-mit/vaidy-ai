'use client';

import { useState } from 'react';
import { ReadinessAssessmentResult } from '@/data/potty-tracker-types';
import {
  READINESS_QUESTIONS,
  calculateReadinessScore,
  getReadinessLevel,
} from '@/lib/potty-tracker-utils';

interface ReadinessAssessmentProps {
  onComplete: (result: ReadinessAssessmentResult) => void;
  onClose: () => void;
  previousAssessments: ReadinessAssessmentResult[];
}

export function ReadinessAssessment({
  onComplete,
  onClose,
  previousAssessments,
}: ReadinessAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: boolean }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<ReadinessAssessmentResult | null>(null);

  const question = READINESS_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / READINESS_QUESTIONS.length) * 100;
  const latestPrevious = previousAssessments[0];

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, { questionId: question.id, answer }];
    setAnswers(newAnswers);

    if (currentQuestion < READINESS_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete assessment
      const assessmentResult = calculateReadinessScore(newAnswers);
      setResult(assessmentResult);
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleSaveResult = () => {
    if (result) {
      onComplete(result);
      onClose();
    }
  };

  const getCategoryEmoji = (category: string): string => {
    switch (category) {
      case 'physical':
        return '💪';
      case 'cognitive':
        return '🧠';
      case 'behavioral':
        return '👀';
      case 'interest':
        return '⭐';
      default:
        return '📝';
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'physical':
        return 'Physical';
      case 'cognitive':
        return 'Cognitive';
      case 'behavioral':
        return 'Behavioral';
      case 'interest':
        return 'Interest';
      default:
        return category;
    }
  };

  if (showResults && result) {
    const readiness = getReadinessLevel(result.percentageScore);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-white)] mb-2">Assessment Complete!</h1>
          <p className="text-[var(--text-muted)]">Here are the results</p>
        </div>

        {/* Score gauge */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
          <div className="text-center mb-6">
            <div
              className="text-6xl font-bold mb-2"
              style={{ color: readiness.color }}
            >
              {result.percentageScore}%
            </div>
            <div
              className="text-xl font-semibold"
              style={{ color: readiness.color }}
            >
              {readiness.level}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-4 bg-[var(--bg-terminal)] rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${result.percentageScore}%`,
                backgroundColor: readiness.color,
              }}
            />
          </div>

          {/* Comparison with previous */}
          {latestPrevious && (
            <div className="text-center text-sm text-[var(--text-muted)]">
              {result.percentageScore > latestPrevious.percentageScore ? (
                <span className="text-green-400">
                  ↑ {result.percentageScore - latestPrevious.percentageScore}% from last assessment
                </span>
              ) : result.percentageScore < latestPrevious.percentageScore ? (
                <span className="text-yellow-400">
                  ↓ {latestPrevious.percentageScore - result.percentageScore}% from last assessment
                </span>
              ) : (
                <span>Same as last assessment</span>
              )}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
          <h3 className="text-lg font-semibold text-[var(--text-white)] mb-4">By Category</h3>
          <div className="space-y-3">
            {Object.entries(result.categoryScores).map(([category, score]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[var(--text-muted)]">
                    {getCategoryEmoji(category)} {getCategoryLabel(category)}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-white)]">{score}%</span>
                </div>
                <div className="h-2 bg-[var(--bg-terminal)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-purple)] rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4">
          <h3 className="text-lg font-semibold text-[var(--text-white)] mb-2">Recommendation</h3>
          <p className="text-[var(--text-muted)]">{readiness.recommendation}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-terminal)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveResult}
            className="flex-1 px-4 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold hover:opacity-90 transition-opacity"
          >
            Save Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={currentQuestion === 0 ? onClose : handleBack}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {currentQuestion === 0 ? 'Cancel' : 'Back'}
        </button>
        <h1 className="text-xl font-bold text-[var(--text-white)]">Readiness Check</h1>
        <div className="w-16 text-right text-sm text-[var(--text-muted)]">
          {currentQuestion + 1}/{READINESS_QUESTIONS.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[var(--bg-terminal)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--text-primary)] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{getCategoryEmoji(question.category)}</span>
          <span className="text-sm text-[var(--text-muted)]">
            {getCategoryLabel(question.category)}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-xl font-semibold text-[var(--text-white)] mb-8">
          {question.question}
        </h2>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(true)}
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-all"
          >
            <span className="text-4xl mb-2">✓</span>
            <span className="text-lg font-semibold text-green-400">Yes</span>
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-500/30 bg-gray-500/10 hover:bg-gray-500/20 transition-all"
          >
            <span className="text-4xl mb-2">✗</span>
            <span className="text-lg font-semibold text-gray-400">Not Yet</span>
          </button>
        </div>
      </div>

      {/* Tip */}
      <div className="text-center text-sm text-[var(--text-muted)]">
        <p>Answer based on what&apos;s typical, not exceptional moments.</p>
      </div>
    </div>
  );
}
