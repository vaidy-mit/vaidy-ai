"use client";

import React from "react";
import { profile } from "@/data/profile";
import { experiences } from "@/data/experience";
import { patents } from "@/data/patents";
import { skillCategories } from "@/data/skills";
import { achievements } from "@/data/achievements";
import { education } from "@/data/education";

interface AboutViewProps {
  onSwitchView: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSwitchView }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <div className="w-24 h-24 rounded-2xl bg-[var(--text-primary)] flex items-center justify-center text-[var(--bg-primary)] font-bold text-5xl mx-auto mb-6">
          V
        </div>
        <h1 className="text-4xl font-bold text-[var(--text-white)] mb-2">
          {profile.name}
        </h1>
        <p className="text-xl text-[var(--text-primary)] mb-2">
          {profile.title} @ {profile.company}
        </p>
        <p className="text-[var(--text-muted)] mb-6">
          📍 {profile.location}
        </p>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          {profile.tagline}
        </p>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { value: "10+", label: "Years in Tech" },
            { value: "5", label: "US Patents" },
            { value: "4", label: "Inventor Awards" },
            { value: "10+", label: "Engineers Led" }
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
              <div className="text-2xl font-bold text-[var(--text-primary)]">{value}</div>
              <div className="text-xs text-[var(--text-muted)]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Meta Connect Video Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-6 flex items-center gap-2">
          <span className="text-[var(--accent-pink)]">🎤</span> Meta Connect 2025
        </h2>
        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] overflow-hidden">
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/0v4_2pLH4jg"
              title="Meta Connect 2025 - Optimising Horizon Developer Experience for the Agentic AI Era"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Optimising Horizon Developer Experience for the Agentic AI Era
            </h3>
            <p className="text-[var(--text-muted)] text-sm">
              Featured speaker at Meta Connect 2025, presenting to 5,000+ developers with 100K+ keynote viewers.
              Discussing responsible development of agentic AI systems and knowledge graph architecture for safe code assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-6 flex items-center gap-2">
          <span className="text-[var(--text-secondary)]">💼</span> Experience
        </h2>
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {exp.role}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {exp.company} • {exp.team}
                  </p>
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1 sm:mt-0 sm:text-right">
                  <div>{exp.period}</div>
                  <div>📍 {exp.location}</div>
                </div>
              </div>
              <ul className="text-[var(--text-muted)] text-sm space-y-2 mb-4">
                {exp.highlights.slice(0, 3).map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--text-primary)] mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {exp.skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs bg-[var(--bg-terminal)] text-[var(--accent-purple)] rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Patents Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-6 flex items-center gap-2">
          <span className="text-[var(--accent-purple)]">📜</span> Patents ({patents.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {patents.map((patent) => (
            <div
              key={patent.id}
              className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-[var(--text-primary)] font-medium">
                  {patent.shortTitle}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    patent.status === "issued"
                      ? "bg-[var(--text-primary)]/20 text-[var(--text-primary)]"
                      : "bg-[var(--accent-orange)]/20 text-[var(--accent-orange)]"
                  }`}
                >
                  {patent.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-2">
                {patent.company} • {patent.year}
                {patent.patentNumber && ` • ${patent.patentNumber}`}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {patent.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-6 flex items-center gap-2">
          <span className="text-[var(--accent-pink)]">⚡</span> Skills
        </h2>
        <div className="space-y-4">
          {skillCategories.map((category) => (
            <div
              key={category.name}
              className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4"
            >
              <h3 className="font-medium mb-3" style={{ color: category.color }}>
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-[var(--bg-terminal)] text-[var(--text-white)] rounded border border-[var(--border-color)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-6 flex items-center gap-2">
          <span className="text-[var(--accent-orange)]">🏆</span> Achievements
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((ach) => {
            const icon = ach.category === "speaking" ? "🎤" :
                        ach.category === "award" ? "🏆" :
                        ach.category === "competition" ? "🥇" : "📜";
            return (
              <div
                key={ach.id}
                className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h3 className="text-[var(--text-primary)] font-medium">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">
                      {ach.organization} • {ach.year}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {ach.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[var(--text-white)] mb-6 flex items-center gap-2">
          <span className="text-[var(--accent-blue)]">🎓</span> Education
        </h2>
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4"
            >
              <h3 className="text-[var(--text-primary)] font-medium">
                {edu.degree}
              </h3>
              <p className="text-[var(--text-secondary)]">
                {edu.institution} • {edu.period}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                📍 {edu.location}
              </p>
              {edu.achievement && (
                <p className="text-sm text-[var(--accent-orange)] mt-1">
                  ✨ {edu.achievement}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-8 border-t border-[var(--border-color)]">
        <h2 className="text-xl font-bold text-[var(--text-white)] mb-4">
          Want to explore interactively?
        </h2>
        <p className="text-[var(--text-muted)] mb-6">
          Try the Terminal or Knowledge Graph view for a more immersive experience
        </p>
        <button
          onClick={onSwitchView}
          className="btn-primary text-lg px-8 py-3"
        >
          Launch Terminal View
        </button>
      </section>
    </div>
  );
};

export default AboutView;
