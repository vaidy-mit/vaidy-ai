"use client";

import { useState, useMemo } from 'react';
import { Meal, DayPlan } from '@/data/meal-planner-types';
import {
  getWeekDates,
  getMonthName,
  navigateWeek,
  aggregateIngredients,
} from '@/lib/meal-planner-utils';

interface ShoppingListProps {
  date: Date;
  plans: DayPlan[];
  meals: Meal[];
  onNavigate: (date: Date) => void;
  onClose: () => void;
}

export function ShoppingList({
  date,
  plans,
  meals,
  onNavigate,
  onClose,
}: ShoppingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const weekDates = getWeekDates(date);
  const ingredients = useMemo(
    () => aggregateIngredients(plans, meals, weekDates),
    [plans, meals, weekDates]
  );

  const sortedIngredients = useMemo(() => {
    return Array.from(ingredients.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [ingredients]);

  const toggleItem = (ingredient: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ingredient)) {
        newSet.delete(ingredient);
      } else {
        newSet.add(ingredient);
      }
      return newSet;
    });
  };

  const copyToClipboard = () => {
    const text = sortedIngredients
      .filter(([ing]) => !checkedItems.has(ing))
      .map(([ing, count]) => (count > 1 ? `${ing} (x${count})` : ing))
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const clearChecked = () => {
    setCheckedItems(new Set());
  };

  const getWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    if (start.getMonth() === end.getMonth()) {
      return `${getMonthName(start, true)} ${start.getDate()} - ${end.getDate()}`;
    }
    return `${getMonthName(start, true)} ${start.getDate()} - ${getMonthName(end, true)} ${end.getDate()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center print:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="font-display text-xl font-semibold text-[var(--text-white)]">
            Shopping List
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Week Selector */}
        <div className="flex items-center justify-between p-4 bg-[var(--bg-terminal)] border-b border-[var(--border-color)]">
          <button
            onClick={() => onNavigate(navigateWeek(date, 'prev'))}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-[var(--text-secondary)]">{getWeekRange()}</span>
          <button
            onClick={() => onNavigate(navigateWeek(date, 'next'))}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {sortedIngredients.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-[var(--text-muted)]">No meals planned for this week</p>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                Add meals to your calendar to generate a shopping list
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {sortedIngredients.length} items &middot; {checkedItems.size} checked
              </p>

              <ul className="space-y-2">
                {sortedIngredients.map(([ingredient, count]) => {
                  const isChecked = checkedItems.has(ingredient);
                  return (
                    <li
                      key={ingredient}
                      onClick={() => toggleItem(ingredient)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                        ${isChecked
                          ? 'bg-[var(--text-primary)]/10 line-through text-[var(--text-muted)]'
                          : 'bg-[var(--bg-terminal)] hover:bg-[var(--bg-terminal)]/80 text-[var(--text-white)]'
                        }
                      `}
                    >
                      <span
                        className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                          ${isChecked
                            ? 'bg-[var(--text-primary)] border-[var(--text-primary)]'
                            : 'border-[var(--border-color)]'
                          }
                        `}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 text-[var(--bg-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1 capitalize">{ingredient}</span>
                      {count > 1 && (
                        <span className="text-sm text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-0.5 rounded">
                          x{count}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        {sortedIngredients.length > 0 && (
          <div className="flex gap-3 p-4 border-t border-[var(--border-color)]">
            <button
              onClick={clearChecked}
              disabled={checkedItems.size === 0}
              className="flex-1 px-4 py-2 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-white)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Checked
            </button>
            <button
              onClick={copyToClipboard}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy List
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
