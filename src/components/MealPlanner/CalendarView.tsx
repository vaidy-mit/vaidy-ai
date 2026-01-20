"use client";

import { Meal, DayPlan, MealSlotType, ViewType } from '@/data/meal-planner-types';
import {
  getWeekDates,
  getMonthDates,
  getDayName,
  getMonthName,
  isToday,
  isSameDay,
  formatDate,
  navigateWeek,
  navigateMonth,
  getMealSlots,
  getSlotEmoji,
} from '@/lib/meal-planner-utils';
import { MealSlot } from './MealSlot';

interface CalendarViewProps {
  viewType: 'week' | 'month';
  date: Date;
  plans: DayPlan[];
  meals: Meal[];
  onSelectMeal: (date: Date, slot: MealSlotType, mealId: string | undefined) => void;
  onAddNewMeal: () => void;
  onNavigate: (date: Date) => void;
  onSelectDay: (date: Date) => void;
  onChangeView: (view: ViewType) => void;
}

export function CalendarView({
  viewType,
  date,
  plans,
  meals,
  onSelectMeal,
  onAddNewMeal,
  onNavigate,
  onSelectDay,
}: CalendarViewProps) {
  const dates = viewType === 'week' ? getWeekDates(date) : getMonthDates(date);
  const slots = getMealSlots();

  const getPlanForDate = (d: Date): DayPlan | undefined => {
    const dateStr = formatDate(d);
    return plans.find(p => p.date === dateStr);
  };

  const getDateTitle = () => {
    if (viewType === 'week') {
      const start = dates[0];
      const end = dates[6];
      if (start.getMonth() === end.getMonth()) {
        return `${getMonthName(start)} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${getMonthName(start, true)} ${start.getDate()} - ${getMonthName(end, true)} ${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${getMonthName(date)} ${date.getFullYear()}`;
  };

  const navigate = (direction: 'prev' | 'next') => {
    const navFn = viewType === 'week' ? navigateWeek : navigateMonth;
    onNavigate(navFn(date, direction));
  };

  if (viewType === 'week') {
    return (
      <div className="space-y-4">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('prev')}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <h2 className="font-display text-xl font-bold text-[var(--text-white)]">
              {getDateTitle()}
            </h2>
            <button
              onClick={() => onNavigate(new Date())}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Go to This Week
            </button>
          </div>

          <button
            onClick={() => navigate('next')}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Week Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dates.map((d, i) => {
                const today = isToday(d);
                return (
                  <div
                    key={i}
                    className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                      today
                        ? 'bg-[var(--text-primary)]/20 text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
                    }`}
                    onClick={() => onSelectDay(d)}
                  >
                    <div className="text-xs">{getDayName(d, true)}</div>
                    <div className={`text-lg font-bold ${today ? 'text-[var(--text-primary)]' : 'text-[var(--text-white)]'}`}>
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Meal Rows */}
            {slots.map((slot) => (
              <div key={slot} className="grid grid-cols-7 gap-2 mb-2">
                {dates.map((d, i) => {
                  const plan = getPlanForDate(d);
                  return (
                    <MealSlot
                      key={i}
                      slot={slot}
                      selectedMealId={plan?.[slot]}
                      meals={meals}
                      onSelectMeal={(mealId) => onSelectMeal(d, slot, mealId)}
                      onAddNewMeal={onAddNewMeal}
                      compact
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Month View
  const currentMonth = date.getMonth();

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('prev')}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-[var(--text-white)]">
            {getDateTitle()}
          </h2>
          <button
            onClick={() => onNavigate(new Date())}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Go to This Month
          </button>
        </div>

        <button
          onClick={() => navigate('next')}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-xs text-[var(--text-muted)] py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((d, i) => {
          const today = isToday(d);
          const isCurrentMonth = d.getMonth() === currentMonth;
          const plan = getPlanForDate(d);
          const hasMeals = plan && (plan.breakfast || plan.lunch || plan.snacks || plan.dinner);

          return (
            <div
              key={i}
              onClick={() => onSelectDay(d)}
              className={`
                min-h-[80px] p-2 rounded-lg cursor-pointer transition-colors border
                ${today ? 'border-[var(--text-primary)] bg-[var(--text-primary)]/10' : 'border-[var(--border-color)]'}
                ${!isCurrentMonth ? 'opacity-40' : ''}
                hover:border-[var(--text-primary)]/50 hover:bg-[var(--bg-card)]
              `}
            >
              <div className={`text-sm font-bold mb-1 ${today ? 'text-[var(--text-primary)]' : 'text-[var(--text-white)]'}`}>
                {d.getDate()}
              </div>

              {hasMeals && (
                <div className="flex flex-wrap gap-0.5">
                  {slots.map((slot) =>
                    plan[slot] ? (
                      <span key={slot} className="text-xs" title={meals.find(m => m.id === plan[slot])?.name}>
                        {getSlotEmoji(slot)}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Click on a day to view or edit meals
      </p>
    </div>
  );
}
