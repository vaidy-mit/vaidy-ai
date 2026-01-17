"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Terminal } from "@/components/Terminal/Terminal";
import { QuickLinks } from "@/components/QuickLinks";
import { AboutView } from "@/components/AboutView";

// Dynamically import the graph to avoid SSR issues with D3
const KnowledgeGraph = dynamic(
  () => import("@/components/Graph/KnowledgeGraph"),
  { ssr: false, loading: () => <GraphLoading /> }
);

const GraphLoading = () => (
  <div className="w-full max-w-6xl mx-auto">
    <div className="terminal-glow rounded-lg overflow-hidden border border-[var(--border-color)]">
      <div className="h-[60vh] min-h-[500px] bg-[var(--bg-terminal)] flex items-center justify-center">
        <div className="text-[var(--text-primary)] animate-pulse">
          Loading Knowledge Graph...
        </div>
      </div>
    </div>
  </div>
);

type ViewType = "about" | "terminal" | "graph";

export default function Home() {
  const [view, setView] = useState<ViewType>("about");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const switchToView = useCallback((newView: ViewType) => {
    if (newView === view) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [view]);

  const handleOpenLink = useCallback((url: string) => {
    if (url.startsWith("/")) {
      window.open(url, "_blank");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo/Name */}
          <button
            onClick={() => switchToView("about")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--text-primary)] flex items-center justify-center text-[var(--bg-primary)] font-bold text-xl">
              V
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-[var(--text-white)]">
                vaidy<span className="text-[var(--text-primary)]">.ai</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                AI Foundations @ Meta Reality Labs
              </p>
            </div>
          </button>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            <QuickLinks className="hidden md:flex" />

            {/* View Toggle */}
            <div className="flex items-center bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-1">
              {[
                { id: "about" as ViewType, label: "About", icon: "👤" },
                { id: "terminal" as ViewType, label: "Terminal", icon: ">" },
                { id: "graph" as ViewType, label: "Graph", icon: "◉" },
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => switchToView(id)}
                  className={`px-3 py-1.5 text-sm rounded transition-all ${
                    view === id
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium"
                      : "text-[var(--text-muted)] hover:text-[var(--text-white)]"
                  }`}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Quick Links */}
        <div className="flex md:hidden justify-center mt-4">
          <QuickLinks />
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`view-transition ${isTransitioning ? "view-enter" : "view-enter-active"}`}
      >
        {view === "about" && (
          <AboutView onSwitchView={() => switchToView("terminal")} />
        )}
        {view === "terminal" && (
          <Terminal
            onSwitchView={() => switchToView("graph")}
            onOpenLink={handleOpenLink}
          />
        )}
        {view === "graph" && (
          <KnowledgeGraph onSwitchView={() => switchToView("terminal")} />
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 pt-4 border-t border-[var(--border-color)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <p>
            Built with{" "}
            <span className="text-[var(--text-primary)]">Next.js</span> +{" "}
            <span className="text-[var(--accent-purple)]">D3.js</span> +{" "}
            <span className="text-[var(--accent-pink)]">Tailwind</span>
          </p>
          <p>
            &copy; {new Date().getFullYear()} Vaidyanathan P K
          </p>
        </div>
      </footer>
    </main>
  );
}
