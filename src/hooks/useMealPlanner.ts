"use client";

import { useState, useEffect, useCallback } from 'react';
import { Meal, DayPlan, MealSlotType } from '@/data/meal-planner-types';
import { generateId, formatDate } from '@/lib/meal-planner-utils';

const MEALS_STORAGE_KEY = 'mealPlannerMeals';
const PLANS_STORAGE_KEY = 'mealPlannerPlans';

interface UseMealPlannerReturn {
  meals: Meal[];
  plans: DayPlan[];
  isLoaded: boolean;
  addMeal: (name: string, ingredients: string[]) => Meal;
  updateMeal: (id: string, updates: Partial<Omit<Meal, 'id' | 'createdAt'>>) => void;
  deleteMeal: (id: string) => void;
  getMealById: (id: string) => Meal | undefined;
  setMealForSlot: (date: Date, slot: MealSlotType, mealId: string | undefined) => void;
  getPlanForDate: (date: Date) => DayPlan | undefined;
  clearPlanForDate: (date: Date) => void;
}

export function useMealPlanner(): UseMealPlannerReturn {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [plans, setPlans] = useState<DayPlan[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedMeals = localStorage.getItem(MEALS_STORAGE_KEY);
      const storedPlans = localStorage.getItem(PLANS_STORAGE_KEY);

      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans));
      }
    } catch (error) {
      console.error('Error loading meal planner data:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save meals to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
    }
  }, [meals, isLoaded]);

  // Save plans to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    }
  }, [plans, isLoaded]);

  const addMeal = useCallback((name: string, ingredients: string[]): Meal => {
    const newMeal: Meal = {
      id: generateId(),
      name,
      ingredients,
      createdAt: new Date().toISOString(),
    };
    setMeals(prev => [...prev, newMeal]);
    return newMeal;
  }, []);

  const updateMeal = useCallback((id: string, updates: Partial<Omit<Meal, 'id' | 'createdAt'>>) => {
    setMeals(prev =>
      prev.map(meal =>
        meal.id === id ? { ...meal, ...updates } : meal
      )
    );
  }, []);

  const deleteMeal = useCallback((id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
    // Also remove from any plans
    setPlans(prev =>
      prev.map(plan => {
        const updatedPlan = { ...plan };
        if (plan.breakfast === id) updatedPlan.breakfast = undefined;
        if (plan.lunch === id) updatedPlan.lunch = undefined;
        if (plan.snacks === id) updatedPlan.snacks = undefined;
        if (plan.dinner === id) updatedPlan.dinner = undefined;
        return updatedPlan;
      }).filter(plan =>
        plan.breakfast || plan.lunch || plan.snacks || plan.dinner
      )
    );
  }, []);

  const getMealById = useCallback((id: string): Meal | undefined => {
    return meals.find(meal => meal.id === id);
  }, [meals]);

  const setMealForSlot = useCallback((date: Date, slot: MealSlotType, mealId: string | undefined) => {
    const dateStr = formatDate(date);
    setPlans(prev => {
      const existingIndex = prev.findIndex(p => p.date === dateStr);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], [slot]: mealId };
        // Remove plan if all slots are empty
        const plan = updated[existingIndex];
        if (!plan.breakfast && !plan.lunch && !plan.snacks && !plan.dinner) {
          return prev.filter((_, i) => i !== existingIndex);
        }
        return updated;
      } else if (mealId) {
        return [...prev, { date: dateStr, [slot]: mealId }];
      }
      return prev;
    });
  }, []);

  const getPlanForDate = useCallback((date: Date): DayPlan | undefined => {
    const dateStr = formatDate(date);
    return plans.find(p => p.date === dateStr);
  }, [plans]);

  const clearPlanForDate = useCallback((date: Date) => {
    const dateStr = formatDate(date);
    setPlans(prev => prev.filter(p => p.date !== dateStr));
  }, []);

  return {
    meals,
    plans,
    isLoaded,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealById,
    setMealForSlot,
    getPlanForDate,
    clearPlanForDate,
  };
}
