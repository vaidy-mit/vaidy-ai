import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-6xl mb-6 block">🚀</span>
          <h1 className="font-display text-4xl font-bold text-[var(--text-white)] mb-4">
            Projects
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto leading-relaxed measure">
            Side projects, experiments, and open source contributions.
          </p>
        </div>

        {/* Meal Planner Card */}
        <Link
          href="/projects/meal-planner"
          className="block bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 mb-6 hover:border-[var(--text-primary)]/50 transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--text-primary)]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-semibold text-[var(--text-white)] mb-1 group-hover:text-[var(--text-primary)] transition-colors">
                Meal Planner
              </h2>
              <p className="text-[var(--text-muted)] text-sm mb-3">
                Plan weekly meals with AI-powered ingredient suggestions. Generate shopping lists and print calendars for your fridge.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-[var(--bg-terminal)] text-[var(--text-secondary)] rounded">
                  AI Ingredients
                </span>
                <span className="px-2 py-1 bg-[var(--bg-terminal)] text-[var(--accent-purple)] rounded">
                  Calendar Views
                </span>
                <span className="px-2 py-1 bg-[var(--bg-terminal)] text-[var(--accent-pink)] rounded">
                  Shopping Lists
                </span>
              </div>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Resume Builder Card */}
        <Link
          href="/projects/resume-builder"
          className="block bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 mb-6 hover:border-[var(--text-primary)]/50 transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--accent-orange)]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📄</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-xl font-semibold text-[var(--text-white)] group-hover:text-[var(--text-primary)] transition-colors">
                  Resume Builder
                </h2>
                <span className="px-2 py-0.5 text-xs bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] rounded-full">
                  Local Tool
                </span>
              </div>
              <p className="text-[var(--text-muted)] text-sm mb-3">
                AI-powered tool that tailors LaTeX resumes for job applications using Claude Code CLI. Paste a job description and get a perfectly optimized PDF.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-[var(--bg-terminal)] text-[var(--accent-purple)] rounded">
                  Claude Code
                </span>
                <span className="px-2 py-1 bg-[var(--bg-terminal)] text-[var(--text-secondary)] rounded">
                  LaTeX
                </span>
                <span className="px-2 py-1 bg-[var(--bg-terminal)] text-[var(--accent-pink)] rounded">
                  Streamlit
                </span>
              </div>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* More Projects Coming Soon */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-purple)]/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--accent-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-[var(--text-white)] mb-2">
            More Coming Soon
          </h2>
          <p className="text-[var(--text-muted)] mb-6 leading-relaxed measure">
            I&apos;m working on documenting more projects and building interactive demos.
            Check back soon!
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--text-secondary)] rounded-full">
              AI Tools
            </span>
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--accent-purple)] rounded-full">
              Developer Platforms
            </span>
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--accent-pink)] rounded-full">
              Open Source
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-[var(--text-primary)] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
