import Link from "next/link";
import { profile } from "@/data/profile";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Animated Greeting */}
          <p className="text-[var(--text-primary)] text-lg mb-4 animate-pulse">
            Hey, I&apos;m
          </p>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-white)] mb-6">
            Vaidy
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-[var(--text-muted)] mb-4 max-w-2xl mx-auto">
            AI Engineer building the future of{" "}
            <span className="text-[var(--text-secondary)]">developer tools</span>{" "}
            at Meta Reality Labs
          </p>

          {/* Role */}
          <p className="text-[var(--accent-purple)] mb-12">
            AI Foundations Team Lead • 5 Patents • Meta Connect Speaker
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href="/profile"
              className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              View Profile
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3 bg-[var(--bg-card)] text-[var(--text-white)] font-medium rounded-lg border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-colors"
            >
              See Projects
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: "10+", label: "Years Experience" },
            { value: "5", label: "US Patents" },
            { value: "20K+", label: "Developers Impacted" },
            { value: "500K+", label: "Knowledge Graph Nodes" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="text-center p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-colors"
            >
              <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-1">
                {value}
              </div>
              <div className="text-sm text-[var(--text-muted)]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 border-t border-[var(--border-color)]">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-8 text-center">
          Featured
        </h2>

        {/* Meta Connect Video */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/0v4_2pLH4jg"
                title="Meta Connect 2025 - Optimising Horizon Developer Experience for the Agentic AI Era"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎤</span>
                <span className="text-xs text-[var(--accent-pink)] bg-[var(--accent-pink)]/10 px-2 py-1 rounded">
                  META CONNECT 2025
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Optimising Horizon Developer Experience for the Agentic AI Era
              </h3>
              <p className="text-[var(--text-muted)] text-sm">
                Featured speaker presenting to 5,000+ developers, with 100K+ keynote viewers.
                Discussing responsible development of agentic AI systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 border-t border-[var(--border-color)]">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-8 text-center">
          Explore
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Link
            href="/profile"
            className="group p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-all hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-[var(--text-white)] mb-2 group-hover:text-[var(--text-primary)] transition-colors">
              Profile
            </h3>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              Interactive resume with Terminal, Knowledge Graph, and About views.
            </p>
            <span className="text-[var(--text-primary)] text-sm">
              Explore →
            </span>
          </Link>

          {/* Projects Card */}
          <Link
            href="/projects"
            className="group p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-purple)] transition-all hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-[var(--text-white)] mb-2 group-hover:text-[var(--accent-purple)] transition-colors">
              Projects
            </h3>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              Side projects, experiments, and open source contributions.
            </p>
            <span className="text-[var(--accent-purple)] text-sm">
              Coming Soon →
            </span>
          </Link>

          {/* Blog Card */}
          <Link
            href="/blog"
            className="group p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-pink)] transition-all hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold text-[var(--text-white)] mb-2 group-hover:text-[var(--accent-pink)] transition-colors">
              Blog
            </h3>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              Technical articles on AI, engineering, and career growth.
            </p>
            <span className="text-[var(--accent-pink)] text-sm">
              Coming Soon →
            </span>
          </Link>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 border-t border-[var(--border-color)]">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-8 text-center">
          Connect
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#0077b5] hover:border-[#0077b5] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>

          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            Email
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-purple)] hover:border-[var(--accent-purple)] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM9 13h6v2H9v-2zm0 4h6v2H9v-2z"/>
            </svg>
            Resume
          </a>

          <Link
            href="/links"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
            All Links
          </Link>
        </div>
      </section>
    </div>
  );
}
