import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-6xl mb-6 block">🚀</span>
          <h1 className="text-4xl font-bold text-[var(--text-white)] mb-4">
            Projects
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
            Side projects, experiments, and open source contributions.
            This section is coming soon.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-purple)]/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--accent-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-white)] mb-2">
            Under Construction
          </h2>
          <p className="text-[var(--text-muted)] mb-6">
            I&apos;m working on documenting my projects and building interactive demos.
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
