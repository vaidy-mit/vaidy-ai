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

export default function ProfilePage() {
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                className={`px-4 py-2 text-sm rounded transition-all ${
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

          {/* Quick Links */}
          <QuickLinks className="hidden sm:flex" />
        </div>

        {/* Mobile Quick Links */}
        <div className="flex sm:hidden justify-center mt-4">
          <QuickLinks />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 pb-8">
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
      </div>
    </div>
  );
}
