import { profile } from "@/data/profile";

export default function LinksPage() {
  const links = [
    {
      title: "LinkedIn",
      description: "Connect with me professionally",
      href: profile.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: "#0077b5"
    },
    {
      title: "Meta Connect 2025 Talk",
      description: "Watch my presentation on Agentic AI",
      href: "https://www.youtube.com/watch?v=0v4_2pLH4jg",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: "#ff0000"
    },
    {
      title: "Resume",
      description: "Download my full resume (PDF)",
      href: "/resume.pdf",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM9 13h6v2H9v-2zm0 4h6v2H9v-2z"/>
        </svg>
      ),
      color: "var(--accent-purple)"
    },
    {
      title: "Email",
      description: "Get in touch directly",
      href: `mailto:${profile.email}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      color: "var(--accent-orange)"
    },
    {
      title: "Profile",
      description: "Interactive resume with Terminal & Graph",
      href: "/profile",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      color: "var(--text-primary)"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-md mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-2xl bg-[var(--text-primary)] flex items-center justify-center text-[var(--bg-primary)] font-bold text-4xl mx-auto mb-6">
            V
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-white)] mb-2">
            Vaidyanathan P K
          </h1>
          <p className="text-[var(--text-secondary)]">
            Lead AI Engineer @ Meta Reality Labs
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            Building the future of developer AI for the Metaverse
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target={link.href.startsWith("/") ? undefined : "_blank"}
              rel={link.href.startsWith("/") ? undefined : "noopener noreferrer"}
              className="flex items-center gap-4 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:scale-[1.02] transition-all group"
              style={{
                ["--link-color" as string]: link.color
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--link-color)] transition-colors"
                style={{ backgroundColor: "var(--bg-terminal)" }}
              >
                {link.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[var(--text-white)] group-hover:text-[var(--link-color)] transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {link.description}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--link-color)] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-[var(--text-muted)]">
          <p>vaidy.ai</p>
        </div>
      </div>
    </div>
  );
}
