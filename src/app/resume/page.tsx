import Link from "next/link";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-white)]">Resume</h1>
          <div className="flex gap-4">
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] text-[var(--text-muted)] rounded-lg border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download PDF
            </a>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back
            </Link>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <iframe
            src="/resume.pdf"
            className="w-full"
            style={{ height: "calc(100vh - 180px)", minHeight: "600px" }}
            title="Resume - Vaidyanathan P K"
          />
        </div>
      </div>
    </div>
  );
}
