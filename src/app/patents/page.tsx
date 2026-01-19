"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import the timeline to avoid SSR issues with D3
const PatentTimeline = dynamic(
  () => import("@/components/Patents/PatentTimeline"),
  { ssr: false, loading: () => <TimelineLoading /> }
);

const TimelineLoading = () => (
  <div className="w-full">
    <div className="terminal-glow rounded-lg overflow-hidden border border-[var(--border-color)]">
      <div className="h-[400px] bg-[var(--bg-terminal)] flex items-center justify-center">
        <div className="text-[var(--text-primary)] animate-pulse">
          Loading Patent Timeline...
        </div>
      </div>
    </div>
  </div>
);

export default function PatentsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-white)] mb-3">
            Patents & <span className="text-[var(--accent-purple)]">Inventions</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl">
            Intellectual property contributions spanning voice AI, speech recognition,
            and knowledge systems. Click on a patent to explore details.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Patents" value="5" color="var(--text-primary)" />
          <StatCard label="Issued" value="4" color="var(--accent-purple)" />
          <StatCard label="Pending" value="1" color="var(--accent-orange)" />
          <StatCard label="Companies" value="2" color="var(--text-secondary)" />
        </div>

        {/* Timeline Visualization */}
        <PatentTimeline />

        {/* External Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://scholar.google.com/citations?user=aMLpi2gAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/>
            </svg>
            Google Scholar
          </a>
          <Link href="/profile" className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View Full Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4">
    <div className="text-2xl md:text-3xl font-bold" style={{ color }}>
      {value}
    </div>
    <div className="text-sm text-[var(--text-muted)]">{label}</div>
  </div>
);
