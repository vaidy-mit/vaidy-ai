"use client";

import { Meal, DayPlan, MealSlotType } from '@/data/meal-planner-types';
import { getMealSlots, getDayName, getMonthName, isToday, navigateDay } from '@/lib/meal-planner-utils';
import { MealSlot } from './MealSlot';

interface DayViewProps {
  date: Date;
  plan: DayPlan | undefined;
  meals: Meal[];
  onSelectMeal: (slot: MealSlotType, mealId: string | undefined) => void;
  onAddNewMeal: () => void;
  onNavigate: (date: Date) => void;
}

export function DayView({
  date,
  plan,
  meals,
  onSelectMeal,
  onAddNewMeal,
  onNavigate,
}: DayViewProps) {
  const slots = getMealSlots();
  const today = isToday(date);

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate(navigateDay(date, 'prev'))}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-[var(--text-white)]">
            {getDayName(date)}
          </h2>
          <p className={`text-sm ${today ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
            {getMonthName(date)} {date.getDate()}, {date.getFullYear()}
            {today && ' (Today)'}
          </p>
        </div>

        <button
          onClick={() => onNavigate(navigateDay(date, 'next'))}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Today Button */}
      {!today && (
        <div className="text-center">
          <button
            onClick={() => onNavigate(new Date())}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Go to Today
          </button>
        </div>
      )}

      {/* Meal Slots */}
      <div className="grid gap-4 md:grid-cols-2">
        {slots.map((slot) => (
          <MealSlot
            key={slot}
            slot={slot}
            selectedMealId={plan?.[slot]}
            meals={meals}
            onSelectMeal={(mealId) => onSelectMeal(slot, mealId)}
            onAddNewMeal={onAddNewMeal}
          />
        ))}
      </div>
    </div>
  );
}
