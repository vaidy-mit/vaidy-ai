"use client";

import { Meal, MealSlotType } from '@/data/meal-planner-types';
import { getSlotLabel, getSlotEmoji } from '@/lib/meal-planner-utils';

interface MealSlotProps {
  slot: MealSlotType;
  selectedMealId?: string;
  meals: Meal[];
  onSelectMeal: (mealId: string | undefined) => void;
  onAddNewMeal: () => void;
  compact?: boolean;
}

export function MealSlot({
  slot,
  selectedMealId,
  meals,
  onSelectMeal,
  onAddNewMeal,
  compact = false,
}: MealSlotProps) {
  const selectedMeal = selectedMealId ? meals.find(m => m.id === selectedMealId) : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__new__') {
      onAddNewMeal();
    } else if (value === '') {
      onSelectMeal(undefined);
    } else {
      onSelectMeal(value);
    }
  };

  if (compact) {
    return (
      <div className="group">
        <select
          value={selectedMealId || ''}
          onChange={handleChange}
          className="w-full bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded px-2 py-1 text-xs text-[var(--text-white)] cursor-pointer hover:border-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
        >
          <option value="">{getSlotEmoji(slot)} {getSlotLabel(slot)}</option>
          <option value="__new__">+ Add New Meal</option>
          {meals.map(meal => (
            <option key={meal.id} value={meal.id}>{meal.name}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4 hover:border-[var(--text-primary)]/50 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{getSlotEmoji(slot)}</span>
        <span className="text-[var(--text-secondary)] font-medium">{getSlotLabel(slot)}</span>
      </div>

      <select
        value={selectedMealId || ''}
        onChange={handleChange}
        className="w-full bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-white)] cursor-pointer hover:border-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
      >
        <option value="">Select a meal...</option>
        <option value="__new__">+ Add New Meal</option>
        {meals.map(meal => (
          <option key={meal.id} value={meal.id}>{meal.name}</option>
        ))}
      </select>

      {selectedMeal && (
        <div className="mt-3 text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap gap-1">
            {selectedMeal.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="bg-[var(--bg-terminal)] px-2 py-0.5 rounded">
                {ing}
              </span>
            ))}
            {selectedMeal.ingredients.length > 3 && (
              <span className="bg-[var(--bg-terminal)] px-2 py-0.5 rounded">
                +{selectedMeal.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
