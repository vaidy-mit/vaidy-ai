import { Metadata } from 'next';
import Link from 'next/link';
import { WorkflowPipeline } from '@/components/ResumeBuilder';

export const metadata: Metadata = {
  title: 'Resume Builder',
  description: 'AI-powered tool that tailors LaTeX resumes for job applications using Claude Code CLI.',
};

export default function ResumeBuilderPage() {
  const features = [
    {
      icon: '🎯',
      title: 'Smart Tailoring',
      description: 'Claude reorders bullets and adjusts wording to highlight the most relevant experience for each job.',
    },
    {
      icon: '📐',
      title: 'LaTeX Quality',
      description: 'Professional typesetting with TinyTeX compilation. Perfect typography and consistent formatting.',
    },
    {
      icon: '🔒',
      title: 'Privacy-First',
      description: 'Runs entirely on your local machine. Your resume data never leaves your computer.',
    },
    {
      icon: '✨',
      title: 'One-Click Operation',
      description: 'Simple Streamlit UI hides all the complexity. Just paste and click.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/projects"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📄</span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-[var(--text-white)]">
                  Resume Builder
                </h1>
                <span className="px-3 py-1 text-xs bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] rounded-full font-medium">
                  Local CLI Tool
                </span>
              </div>
            </div>
          </div>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl leading-relaxed">
            AI-powered tool that tailors your LaTeX resume for specific job applications.
            Paste a job description, and Claude optimizes your resume to highlight relevant experience.
          </p>
        </div>

        {/* Workflow Pipeline */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 md:p-8 mb-8">
          <h2 className="font-display text-lg font-semibold text-[var(--text-white)] mb-6 text-center">
            How It Works
          </h2>
          <WorkflowPipeline />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="font-display font-semibold text-[var(--text-white)] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Setup Instructions */}
        <details className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] mb-8 group">
          <summary className="p-5 cursor-pointer list-none flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚙️</span>
              <h3 className="font-display font-semibold text-[var(--text-white)]">
                Setup Instructions
              </h3>
            </div>
            <svg
              className="w-5 h-5 text-[var(--text-muted)] transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-5 pb-5 pt-0 border-t border-[var(--border-color)]">
            <ol className="list-decimal list-inside space-y-3 text-[var(--text-muted)] text-sm mt-4">
              <li>
                <span className="text-[var(--text-secondary)]">Install Claude Code CLI:</span>
                <code className="ml-2 px-2 py-0.5 bg-[var(--bg-terminal)] rounded text-[var(--accent-purple)]">
                  npm install -g @anthropic-ai/claude-code
                </code>
              </li>
              <li>
                <span className="text-[var(--text-secondary)]">Install TinyTeX for LaTeX compilation</span>
              </li>
              <li>
                <span className="text-[var(--text-secondary)]">Clone the repository and install dependencies:</span>
                <code className="ml-2 px-2 py-0.5 bg-[var(--bg-terminal)] rounded text-[var(--accent-purple)]">
                  pip install streamlit
                </code>
              </li>
              <li>
                <span className="text-[var(--text-secondary)]">Place your LaTeX resume in the</span>
                <code className="ml-1 px-2 py-0.5 bg-[var(--bg-terminal)] rounded text-[var(--text-secondary)]">
                  resumes/
                </code>
                <span className="text-[var(--text-secondary)]"> folder</span>
              </li>
              <li>
                <span className="text-[var(--text-secondary)]">Run:</span>
                <code className="ml-2 px-2 py-0.5 bg-[var(--bg-terminal)] rounded text-[var(--accent-purple)]">
                  streamlit run app.py
                </code>
              </li>
            </ol>
          </div>
        </details>

        {/* CTA */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 text-center">
          <h3 className="font-display text-lg font-semibold text-[var(--text-white)] mb-2">
            Get Started
          </h3>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            View the source code and setup instructions on GitHub.
          </p>
          <a
            href="https://github.com/vaidy-mit/vaidy-ai/tree/main/tools/resume-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/80 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
