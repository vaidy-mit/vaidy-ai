'use client';

export function WorkflowPipeline() {
  const steps = [
    {
      icon: '📋',
      title: 'Job Description',
      description: 'Paste the job posting',
    },
    {
      icon: '🤖',
      title: 'Claude Analysis',
      description: 'AI extracts key requirements',
    },
    {
      icon: '📝',
      title: 'LaTeX Tailoring',
      description: 'Reorders & optimizes bullets',
    },
    {
      icon: '📄',
      title: 'PDF Output',
      description: 'Professional resume ready',
    },
  ];

  return (
    <div className="relative">
      {/* Desktop: Horizontal Pipeline */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-[var(--border-color)]">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-pink)] to-[var(--accent-orange)] animate-pulse"
              style={{ animation: 'flowPulse 2s ease-in-out infinite' }}
            />
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center z-10"
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {/* Icon Circle */}
              <div
                className="w-16 h-16 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-color)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[var(--accent-purple)] hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]"
              >
                <span className="text-2xl">{step.icon}</span>
              </div>

              {/* Arrow (between steps) */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 -right-8 text-[var(--text-muted)] hidden lg:block">
                  <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}

              {/* Text */}
              <h4 className="font-display text-sm font-semibold text-[var(--text-white)] mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-[120px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical Pipeline */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            {/* Icon + Line */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-color)] flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{step.icon}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-8 bg-gradient-to-b from-[var(--accent-purple)] to-[var(--accent-pink)] mt-2" />
              )}
            </div>

            {/* Text */}
            <div className="pt-2">
              <h4 className="font-display text-sm font-semibold text-[var(--text-white)] mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes flowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
