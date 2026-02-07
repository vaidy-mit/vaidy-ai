import { Metadata } from 'next';
import Link from 'next/link';
import { PottyTrackerApp } from '@/components/PottyTracker';

export const metadata: Metadata = {
  title: 'Potty Tracker | vaidy.ai',
  description: 'Track potty training progress with AI-powered coaching, pattern analysis, and rewards.',
};

export default function PottyTrackerPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-6 px-4">
      {/* Back to projects link */}
      <div className="max-w-md mx-auto mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>
      </div>

      <PottyTrackerApp />
    </main>
  );
}
