export interface Meal {
  id: string;
  name: string;
  ingredients: string[];
  createdAt: string;
}

export interface DayPlan {
  date: string; // YYYY-MM-DD
  breakfast?: string; // meal id
  lunch?: string;
  snacks?: string;
  dinner?: string;
}

export interface MealPlannerState {
  meals: Meal[];
  plans: DayPlan[];
}

export type MealSlotType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type ViewType = 'day' | 'week' | 'month';
