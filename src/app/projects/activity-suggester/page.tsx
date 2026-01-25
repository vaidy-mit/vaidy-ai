import { Metadata } from 'next';
import Link from 'next/link';
import { ActivitySuggesterApp } from '@/components/ActivitySuggester';

export const metadata: Metadata = {
  title: 'Toddler Activity Suggester',
  description: 'AI-powered activity ideas for toddlers ages 1-3. Get learning, physical play, and creative art suggestions with printable activity cards.',
};

export default function ActivitySuggesterPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] print:bg-white print:min-h-0">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 print:p-0 print:max-w-none">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <Link
            href="/projects"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="font-display text-3xl font-bold text-[var(--text-white)] mb-2">
            Toddler Activity Suggester
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl">
            Get AI-powered activity ideas perfect for toddlers ages 1-3. Choose a stimulation type,
            and receive safe, engaging activities using common household items.
          </p>
        </div>

        {/* Main App */}
        <ActivitySuggesterApp />
      </div>
    </div>
  );
}
