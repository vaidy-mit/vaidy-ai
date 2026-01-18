import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-6xl mb-6 block">✍️</span>
          <h1 className="font-display text-4xl font-bold text-[var(--text-white)] mb-4">
            Blog
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto leading-relaxed measure">
            Technical articles on AI, engineering, and career growth.
            This section is coming soon.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-pink)]/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--accent-pink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-[var(--text-white)] mb-2">
            Coming Soon
          </h2>
          <p className="text-[var(--text-muted)] mb-6 leading-relaxed measure">
            I&apos;m preparing articles on AI engineering, building developer platforms,
            and lessons from my journey at Meta and Amazon.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--text-primary)] rounded-full">
              AI/ML
            </span>
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--accent-orange)] rounded-full">
              Engineering
            </span>
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--accent-blue)] rounded-full">
              Career
            </span>
            <span className="px-3 py-1 bg-[var(--bg-terminal)] text-[var(--accent-purple)] rounded-full">
              Tutorials
            </span>
          </div>
        </div>

        {/* Notify Section */}
        <div className="bg-[var(--bg-terminal)] rounded-xl border border-[var(--border-color)] p-6 text-center mb-8">
          <p className="text-[var(--text-muted)] mb-4 leading-relaxed measure">
            Want to be notified when I publish?
          </p>
          <a
            href="https://www.linkedin.com/in/vaidyanathan-pk-1a494086/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--bg-card)] text-[var(--text-white)] rounded-lg border border-[var(--border-color)] hover:border-[#0077b5] hover:text-[#0077b5] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Follow on LinkedIn
          </a>
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
