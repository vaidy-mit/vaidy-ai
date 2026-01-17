"use client";

import React from "react";

interface ViewToggleProps {
  view: "terminal" | "graph";
  onToggle: () => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
    >
      {view === "terminal" ? (
        <>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-sm">Graph View</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 19.59V8l-6-6H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59z"/>
          </svg>
          <span className="text-sm">Terminal View</span>
        </>
      )}
    </button>
  );
};

export default ViewToggle;
