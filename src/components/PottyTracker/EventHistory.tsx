'use client';

import { useState } from 'react';
import { PottyEvent } from '@/data/potty-tracker-types';
import {
  formatDateTime,
  getEventEmoji,
  getEventLabel,
  getLocationEmoji,
  getLocationLabel,
  getContentEmoji,
  getContentLabel,
} from '@/lib/potty-tracker-utils';

interface EventHistoryProps {
  events: PottyEvent[];
  onClose: () => void;
  onDeleteEvent: (id: string) => void;
}

type FilterType = 'all' | 'success' | 'accident' | 'attempt';

export function EventHistory({ events, onClose, onDeleteEvent }: EventHistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredEvents =
    filter === 'all' ? events : events.filter((e) => e.type === filter);

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDeleteEvent(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-white)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold text-[var(--text-white)]">Event History</h1>
        <div className="w-16" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'success', 'accident', 'attempt'] as FilterType[]).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${
                filter === filterType
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-white)]'
              }
            `}
          >
            {filterType === 'all' && `All (${events.length})`}
            {filterType === 'success' &&
              `⭐ Success (${events.filter((e) => e.type === 'success').length})`}
            {filterType === 'accident' &&
              `💧 Accident (${events.filter((e) => e.type === 'accident').length})`}
            {filterType === 'attempt' &&
              `🚽 Attempt (${events.filter((e) => e.type === 'attempt').length})`}
          </button>
        ))}
      </div>

      {/* Event list */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <p>No events to show.</p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-[var(--text-primary)] hover:underline mt-2"
            >
              Show all events
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getEventEmoji(event.type)}</span>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-white)]">
                      {getEventLabel(event.type)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      {formatDateTime(event.timestamp)}
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-[var(--bg-terminal)] px-2 py-1 rounded text-[var(--text-muted)]">
                        {getLocationEmoji(event.location)} {getLocationLabel(event.location)}
                      </span>
                      <span className="text-xs bg-[var(--bg-terminal)] px-2 py-1 rounded text-[var(--text-muted)]">
                        {getContentEmoji(event.content)} {getContentLabel(event.content)}
                      </span>
                      {!event.promptedByParent && (
                        <span className="text-xs bg-[var(--text-primary)]/20 px-2 py-1 rounded text-[var(--text-primary)]">
                          🙋 Self-initiated
                        </span>
                      )}
                    </div>

                    {/* Notes */}
                    {event.notes && (
                      <p className="text-xs text-[var(--text-muted)] mt-2 italic">
                        &quot;{event.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(event.id)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${
                      confirmDelete === event.id
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10'
                    }
                  `}
                  title={confirmDelete === event.id ? 'Click again to confirm' : 'Delete'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
