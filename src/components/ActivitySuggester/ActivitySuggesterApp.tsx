"use client";

import { useState, useCallback } from 'react';
import { Activity, CategoryType, CATEGORY_INFO } from '@/data/activity-types';
import { useActivitySuggester } from '@/hooks/useActivitySuggester';
import { ActivityCard } from './ActivityCard';
import { PrintableActivities } from './PrintableActivities';

export function ActivitySuggesterApp() {
  const { favorites, isLoaded, addFavorite, removeFavorite, isFavorite } = useActivitySuggester();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('learning');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const suggestActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setActivities([]);

    try {
      const response = await fetch('/api/suggest-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate activities');
      }

      const data = await response.json();
      setActivities(data.activities);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  const handleToggleFavorite = useCallback((activity: Activity) => {
    if (isFavorite(activity.id)) {
      removeFavorite(activity.id);
    } else {
      addFavorite(activity);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const handlePrint = () => {
    window.print();
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  // Determine which activities to show for printing (current or favorites)
  const printableActivities = showFavorites ? favorites : activities;

  return (
    <>
      {/* Category Selection */}
      <div className="mb-8 print:hidden">
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
          Choose a stimulation type:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(Object.keys(CATEGORY_INFO) as CategoryType[]).map((category) => {
            const info = CATEGORY_INFO[category];
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-[var(--text-primary)] bg-[var(--text-primary)]/10'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)]/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{info.emoji}</span>
                  <span className={`font-semibold ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-white)]'}`}>
                    {info.label}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{info.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-8 print:hidden">
        <button
          onClick={suggestActivities}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Suggest Activities
            </>
          )}
        </button>

        {activities.length > 0 && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Cards
          </button>
        )}

        {favorites.length > 0 && (
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-4 py-2 border rounded transition-colors flex items-center gap-2 ${
              showFavorites
                ? 'bg-[var(--accent-pink)]/20 border-[var(--accent-pink)] text-[var(--accent-pink)]'
                : 'bg-[var(--bg-terminal)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)]'
            }`}
          >
            <svg className="w-4 h-4" fill={showFavorites ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Favorites ({favorites.length})
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 print:hidden">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--bg-terminal)] rounded-xl border border-[var(--border-color)] p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[var(--bg-card)] rounded" />
                <div className="h-5 bg-[var(--bg-card)] rounded w-32" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-[var(--bg-card)] rounded w-full" />
                <div className="h-4 bg-[var(--bg-card)] rounded w-3/4" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-[var(--bg-card)] rounded w-20" />
                <div className="h-3 bg-[var(--bg-card)] rounded w-full" />
                <div className="h-3 bg-[var(--bg-card)] rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activities Display */}
      {!isLoading && !showFavorites && activities.length > 0 && (
        <div className="print:hidden">
          <h2 className="text-lg font-semibold text-[var(--text-white)] mb-4 flex items-center gap-2">
            <span>{CATEGORY_INFO[selectedCategory].emoji}</span>
            {CATEGORY_INFO[selectedCategory].label} Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isFavorite={isFavorite(activity.id)}
                onToggleFavorite={() => handleToggleFavorite(activity)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Favorites Display */}
      {!isLoading && showFavorites && (
        <div className="print:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-white)] flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent-pink)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Saved Favorites
            </h2>
            {favorites.length > 0 && (
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-sm bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print All
              </button>
            )}
          </div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isFavorite={true}
                  onToggleFavorite={() => removeFavorite(activity.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <div className="text-4xl mb-4">💭</div>
              <p className="text-[var(--text-muted)]">No favorites saved yet.</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Click the heart icon on activities to save them here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !showFavorites && activities.length === 0 && (
        <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] print:hidden">
          <div className="text-6xl mb-6">🧒</div>
          <h3 className="text-xl font-semibold text-[var(--text-white)] mb-2">
            Ready for Fun?
          </h3>
          <p className="text-[var(--text-muted)] max-w-md mx-auto mb-6">
            Select a category above and click &quot;Suggest Activities&quot; to get AI-generated
            activity ideas perfect for toddlers ages 1-3.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--text-secondary)] rounded-full">
              Safe for toddlers
            </span>
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--accent-purple)] rounded-full">
              Household items
            </span>
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--accent-pink)] rounded-full">
              5-20 minutes each
            </span>
          </div>
        </div>
      )}

      {/* Printable Activities (hidden until print) */}
      <PrintableActivities activities={printableActivities} />
    </>
  );
}
