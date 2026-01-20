"use client";

import { useState, useCallback } from 'react';
import { ViewType, MealSlotType, Meal } from '@/data/meal-planner-types';
import { useMealPlanner } from '@/hooks/useMealPlanner';
import { DayView } from './DayView';
import { CalendarView } from './CalendarView';
import { AddMealModal } from './AddMealModal';
import { ShoppingList } from './ShoppingList';
import { PrintableCalendar } from './PrintableCalendar';

export function MealPlannerApp() {
  const {
    meals,
    plans,
    isLoaded,
    addMeal,
    updateMeal,
    deleteMeal,
    setMealForSlot,
    getPlanForDate,
  } = useMealPlanner();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('week');
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [pendingSlot, setPendingSlot] = useState<{
    date: Date;
    slot: MealSlotType;
  } | null>(null);

  const handleSelectMeal = useCallback(
    (date: Date, slot: MealSlotType, mealId: string | undefined) => {
      setMealForSlot(date, slot, mealId);
    },
    [setMealForSlot]
  );

  const handleAddNewMeal = useCallback((date?: Date, slot?: MealSlotType) => {
    if (date && slot) {
      setPendingSlot({ date, slot });
    }
    setShowAddMealModal(true);
  }, []);

  const handleSaveMeal = useCallback(
    (name: string, ingredients: string[]) => {
      if (editingMeal) {
        // Update existing meal
        updateMeal(editingMeal.id, { name, ingredients });
      } else {
        // Create new meal
        const newMeal = addMeal(name, ingredients);
        if (pendingSlot) {
          setMealForSlot(pendingSlot.date, pendingSlot.slot, newMeal.id);
          setPendingSlot(null);
        }
      }
    },
    [addMeal, updateMeal, setMealForSlot, pendingSlot, editingMeal]
  );

  const handleEditMeal = useCallback((meal: Meal) => {
    setEditingMeal(meal);
    setShowAddMealModal(true);
  }, []);

  const handleDeleteMeal = useCallback(() => {
    if (editingMeal) {
      deleteMeal(editingMeal.id);
    }
  }, [deleteMeal, editingMeal]);

  const handleCloseAddMealModal = useCallback(() => {
    setShowAddMealModal(false);
    setEditingMeal(null);
    setPendingSlot(null);
  }, []);

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

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 print:hidden">
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[var(--bg-terminal)] p-1 rounded-lg">
          {(['day', 'week', 'month'] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => setViewType(view)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === view
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-white)]'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddNewMeal()}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Meal
          </button>
          <button
            onClick={() => setShowShoppingList(true)}
            className="px-4 py-2 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:border-[var(--text-secondary)] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Shopping List
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 print:hidden">
        {viewType === 'day' && (
          <DayView
            date={currentDate}
            plan={getPlanForDate(currentDate)}
            meals={meals}
            onSelectMeal={(slot, mealId) => handleSelectMeal(currentDate, slot, mealId)}
            onAddNewMeal={() => handleAddNewMeal(currentDate, 'breakfast')}
            onNavigate={setCurrentDate}
          />
        )}

        {(viewType === 'week' || viewType === 'month') && (
          <CalendarView
            viewType={viewType}
            date={currentDate}
            plans={plans}
            meals={meals}
            onSelectMeal={handleSelectMeal}
            onAddNewMeal={() => handleAddNewMeal()}
            onNavigate={setCurrentDate}
            onSelectDay={(d) => {
              setCurrentDate(d);
              setViewType('day');
            }}
            onChangeView={setViewType}
          />
        )}
      </div>

      {/* Saved Meals Summary */}
      {meals.length > 0 && (
        <div className="mt-6 print:hidden">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
            Saved Meals ({meals.length}) - click to edit
          </h3>
          <div className="flex flex-wrap gap-2">
            {meals.map((meal) => (
              <button
                key={meal.id}
                onClick={() => handleEditMeal(meal)}
                className="px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-sm text-[var(--text-white)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                {meal.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddMealModal
        isOpen={showAddMealModal}
        onClose={handleCloseAddMealModal}
        onSave={handleSaveMeal}
        onDelete={handleDeleteMeal}
        initialName={editingMeal?.name}
        initialIngredients={editingMeal?.ingredients}
        isEditing={!!editingMeal}
      />

      {showShoppingList && (
        <ShoppingList
          date={currentDate}
          plans={plans}
          meals={meals}
          onNavigate={setCurrentDate}
          onClose={() => setShowShoppingList(false)}
        />
      )}

      {/* Printable Calendar (hidden until print) */}
      <PrintableCalendar date={currentDate} plans={plans} meals={meals} />
    </>
  );
}
