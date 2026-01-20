import { Meal, DayPlan, MealSlotType } from '@/data/meal-planner-types';

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as first day
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function getMonthDates(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Get the Monday before or on the first day of month
  const startDay = firstDay.getDay();
  const startDiff = startDay === 0 ? -6 : 1 - startDay;
  const calendarStart = new Date(firstDay);
  calendarStart.setDate(firstDay.getDate() + startDiff);

  // Get 6 weeks of dates (42 days)
  const dates: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(calendarStart);
    d.setDate(calendarStart.getDate() + i);
    // Stop if we've passed the month and reached the next Monday
    if (d > lastDay && d.getDay() === 1 && dates.length >= 28) {
      break;
    }
    dates.push(d);
  }
  return dates;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getDayName(date: Date, short = false): string {
  return date.toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' });
}

export function getMonthName(date: Date, short = false): string {
  return date.toLocaleDateString('en-US', { month: short ? 'short' : 'long' });
}

export function navigateWeek(date: Date, direction: 'prev' | 'next'): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
  return newDate;
}

export function navigateMonth(date: Date, direction: 'prev' | 'next'): Date {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
  return newDate;
}

export function navigateDay(date: Date, direction: 'prev' | 'next'): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
  return newDate;
}

export function generateId(): string {
  return `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getMealSlots(): MealSlotType[] {
  return ['breakfast', 'lunch', 'snacks', 'dinner'];
}

export function getSlotLabel(slot: MealSlotType): string {
  const labels: Record<MealSlotType, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snacks: 'Snacks',
    dinner: 'Dinner',
  };
  return labels[slot];
}

export function getSlotEmoji(slot: MealSlotType): string {
  const emojis: Record<MealSlotType, string> = {
    breakfast: '🌅',
    lunch: '☀️',
    snacks: '🍿',
    dinner: '🌙',
  };
  return emojis[slot];
}

export function aggregateIngredients(
  plans: DayPlan[],
  meals: Meal[],
  weekDates: Date[]
): Map<string, number> {
  const ingredientCounts = new Map<string, number>();
  const dateStrings = new Set(weekDates.map(formatDate));
  const mealMap = new Map(meals.map(m => [m.id, m]));

  for (const plan of plans) {
    if (!dateStrings.has(plan.date)) continue;

    const slots: MealSlotType[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
    for (const slot of slots) {
      const mealId = plan[slot];
      if (!mealId) continue;

      const meal = mealMap.get(mealId);
      if (!meal) continue;

      for (const ingredient of meal.ingredients) {
        const normalized = ingredient.toLowerCase().trim();
        ingredientCounts.set(normalized, (ingredientCounts.get(normalized) || 0) + 1);
      }
    }
  }

  return ingredientCounts;
}

export function getPlanForDate(plans: DayPlan[], date: Date): DayPlan | undefined {
  const dateStr = formatDate(date);
  return plans.find(p => p.date === dateStr);
}
