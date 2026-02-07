'use client';

import { useState } from 'react';
import { PottyEvent } from '@/data/potty-tracker-types';
import {
  getLocationEmoji,
  getLocationLabel,
  getContentEmoji,
  getContentLabel,
} from '@/lib/potty-tracker-utils';

interface EventLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<PottyEvent, 'id' | 'timestamp'>) => void;
  initialType?: PottyEvent['type'];
}

const EVENT_TYPES: { value: PottyEvent['type']; label: string; emoji: string }[] = [
  { value: 'success', label: 'Success!', emoji: '⭐' },
  { value: 'accident', label: 'Accident', emoji: '💧' },
  { value: 'attempt', label: 'Attempt', emoji: '🚽' },
];

const LOCATIONS: PottyEvent['location'][] = ['potty', 'toilet', 'diaper', 'floor', 'clothes'];
const CONTENTS: PottyEvent['content'][] = ['pee', 'poop', 'both'];

export function EventLogger({ isOpen, onClose, onSave, initialType = 'success' }: EventLoggerProps) {
  const [type, setType] = useState<PottyEvent['type']>(initialType);
  const [location, setLocation] = useState<PottyEvent['location']>(
    initialType === 'success' ? 'potty' : 'clothes'
  );
  const [content, setContent] = useState<PottyEvent['content']>('pee');
  const [promptedByParent, setPromptedByParent] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      type,
      location,
      content,
      promptedByParent,
      notes: notes.trim() || undefined,
    });
    // Reset form
    setNotes('');
    onClose();
  };

  const handleTypeChange = (newType: PottyEvent['type']) => {
    setType(newType);
    // Auto-set reasonable defaults based on type
    if (newType === 'success') {
      setLocation('potty');
    } else if (newType === 'accident') {
      setLocation('clothes');
    } else {
      setLocation('potty');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-white)]">Log Event</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Event Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
            What happened?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {EVENT_TYPES.map((eventType) => (
              <button
                key={eventType.value}
                onClick={() => handleTypeChange(eventType.value)}
                className={`
                  flex flex-col items-center p-4 rounded-xl border-2 transition-all
                  ${
                    type === eventType.value
                      ? 'border-[var(--text-primary)] bg-[var(--text-primary)]/10'
                      : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }
                `}
              >
                <span className="text-3xl mb-1">{eventType.emoji}</span>
                <span className="text-sm font-medium text-[var(--text-white)]">
                  {eventType.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
            Where?
          </label>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                  ${
                    location === loc
                      ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]'
                      : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                  }
                `}
              >
                <span>{getLocationEmoji(loc)}</span>
                <span className="text-sm">{getLocationLabel(loc)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
            What?
          </label>
          <div className="flex gap-3">
            {CONTENTS.map((c) => (
              <button
                key={c}
                onClick={() => setContent(c)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border transition-all flex-1 justify-center
                  ${
                    content === c
                      ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]'
                      : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                  }
                `}
              >
                <span>{getContentEmoji(c)}</span>
                <span className="text-sm">{getContentLabel(c)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompted toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
            Who initiated?
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setPromptedByParent(true)}
              className={`
                flex-1 px-4 py-3 rounded-lg border transition-all text-center
                ${
                  promptedByParent
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]'
                    : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                }
              `}
            >
              <span className="text-lg mb-1">👆</span>
              <div className="text-sm font-medium">Parent prompted</div>
            </button>
            <button
              onClick={() => setPromptedByParent(false)}
              className={`
                flex-1 px-4 py-3 rounded-lg border transition-all text-center
                ${
                  !promptedByParent
                    ? 'border-[var(--text-primary)] bg-[var(--text-primary)]/10 text-[var(--text-primary)]'
                    : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                }
              `}
            >
              <span className="text-lg mb-1">🙋</span>
              <div className="text-sm font-medium">Child initiated</div>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details..."
            rows={2}
            className="w-full px-4 py-3 bg-[var(--bg-terminal)] border border-[var(--border-color)] rounded-lg text-[var(--text-white)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-terminal)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold hover:opacity-90 transition-opacity"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}
