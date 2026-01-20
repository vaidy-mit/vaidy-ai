"use client";

import { useState, useEffect, useRef } from 'react';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, ingredients: string[]) => void;
  onDelete?: () => void;
  initialName?: string;
  initialIngredients?: string[];
  isEditing?: boolean;
}

export function AddMealModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialName = '',
  initialIngredients = [],
  isEditing = false,
}: AddMealModalProps) {
  const [mealName, setMealName] = useState(initialName);
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [newIngredient, setNewIngredient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevIsOpenRef = useRef(false);

  // Reset form when modal opens (transitions from closed to open)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // Modal just opened
      setMealName(initialName);
      setIngredients(initialIngredients);
      setNewIngredient('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialName, initialIngredients]);

  const handleGenerateIngredients = async () => {
    if (!mealName.trim()) {
      setError('Please enter a meal name first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealName: mealName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ingredients');
      }

      const data = await response.json();
      setIngredients(data.ingredients || []);
    } catch {
      setError('Failed to generate ingredients. Please try again or add manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddIngredient = () => {
    const trimmed = newIngredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!mealName.trim()) {
      setError('Please enter a meal name');
      return;
    }
    onSave(mealName.trim(), ingredients);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newIngredient.trim()) {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center print:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="font-display text-xl font-semibold text-[var(--text-white)]">
            {isEditing ? 'Edit Meal' : 'Add New Meal'}
          </h2>
          <div className="flex items-center gap-2">
            {isEditing && onDelete && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this meal?')) {
                    onDelete();
                    onClose();
                  }
                }}
                className="text-[var(--accent-red)] hover:text-[var(--accent-red)]/80 transition-colors p-1"
                title="Delete meal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* Meal Name */}
          <div className="mb-4">
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Meal Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g., Chicken Tikka Masala"
              className="w-full bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-white)] placeholder-[var(--text-muted)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateIngredients}
            disabled={isGenerating || !mealName.trim()}
            className="w-full mb-4 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
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
                Generate Ingredients with AI
              </>
            )}
          </button>

          {error && (
            <div className="mb-4 p-3 bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/50 rounded-lg text-sm text-[var(--accent-red)]">
              {error}
            </div>
          )}

          {/* Ingredients List */}
          <div className="mb-4">
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Ingredients ({ingredients.length})
            </label>

            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-[var(--bg-terminal)] border border-[var(--border-color)] px-3 py-1 rounded-full text-sm text-[var(--text-white)]"
                  >
                    {ingredient}
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] mb-3">
                No ingredients yet. Generate with AI or add manually below.
              </p>
            )}

            {/* Add Ingredient Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add ingredient manually..."
                className="flex-1 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-white)] placeholder-[var(--text-muted)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
              />
              <button
                onClick={handleAddIngredient}
                disabled={!newIngredient.trim()}
                className="px-3 py-2 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!mealName.trim()}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update Meal' : 'Save Meal'}
          </button>
        </div>
      </div>
    </div>
  );
}
