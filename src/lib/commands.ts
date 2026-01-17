import { profile, socialLinks } from "@/data/profile";
import { experiences } from "@/data/experience";
import { patents } from "@/data/patents";
import { skillCategories } from "@/data/skills";
import { achievements } from "@/data/achievements";
import { education, leadership } from "@/data/education";

export interface CommandOutput {
  type: "text" | "ascii" | "link" | "error" | "special";
  content: string;
  color?: string;
  action?: string;
}

export type CommandHandler = (args: string[]) => CommandOutput[];

const commands: Record<string, CommandHandler> = {
  help: () => [
    { type: "text", content: "Available Commands:", color: "var(--text-secondary)" },
    { type: "text", content: "" },
    { type: "text", content: "  whoami      - About me" },
    { type: "text", content: "  experience  - Work history" },
    { type: "text", content: "  patents     - My patents (5 total)" },
    { type: "text", content: "  skills      - Technical skills" },
    { type: "text", content: "  awards      - Achievements & recognition" },
    { type: "text", content: "  education   - Academic background" },
    { type: "text", content: "  talks       - Conference talks" },
    { type: "text", content: "  leadership  - Leadership & mentorship" },
    { type: "text", content: "  contact     - Get in touch" },
    { type: "text", content: "" },
    { type: "text", content: "  linkedin    - Open LinkedIn profile" },
    { type: "text", content: "  resume      - Download my resume" },
    { type: "text", content: "  graph       - Switch to Knowledge Graph view" },
    { type: "text", content: "" },
    { type: "text", content: "  clear       - Clear terminal" },
    { type: "text", content: "  neofetch    - System info (fun)" },
    { type: "text", content: "  matrix      - Enter the Matrix" },
    { type: "text", content: "" },
    { type: "text", content: "Tip: Use ↑/↓ for command history, Tab for autocomplete", color: "var(--text-muted)" }
  ],

  whoami: () => [
    { type: "ascii", content: profile.ascii, color: "var(--text-primary)" },
    { type: "text", content: "" },
    { type: "text", content: `${profile.name}`, color: "var(--text-primary)" },
    { type: "text", content: `${profile.title} @ ${profile.company}`, color: "var(--text-secondary)" },
    { type: "text", content: `📍 ${profile.location}` },
    { type: "text", content: "" },
    { type: "text", content: profile.tagline, color: "var(--accent-purple)" },
    { type: "text", content: "" },
    { type: "text", content: "Highlights:", color: "var(--text-secondary)" },
    ...profile.highlights.map(h => ({ type: "text" as const, content: `  • ${h}` }))
  ],

  experience: () => {
    const output: CommandOutput[] = [
      { type: "text", content: "Work Experience", color: "var(--text-secondary)" },
      { type: "text", content: "═".repeat(50), color: "var(--border-color)" },
      { type: "text", content: "" }
    ];

    experiences.forEach((exp, index) => {
      output.push(
        { type: "text", content: `[${index + 1}] ${exp.role}`, color: "var(--text-primary)" },
        { type: "text", content: `    ${exp.company} | ${exp.team}`, color: "var(--text-secondary)" },
        { type: "text", content: `    📍 ${exp.location} | 📅 ${exp.period}`, color: "var(--text-muted)" },
        { type: "text", content: "" }
      );
      exp.highlights.slice(0, 2).forEach(h => {
        output.push({ type: "text", content: `    • ${h.substring(0, 100)}${h.length > 100 ? '...' : ''}` });
      });
      output.push(
        { type: "text", content: "" },
        { type: "text", content: `    Skills: ${exp.skills.slice(0, 5).join(", ")}`, color: "var(--accent-pink)" },
        { type: "text", content: "" }
      );
    });

    return output;
  },

  patents: () => {
    const output: CommandOutput[] = [
      { type: "text", content: `Patents (${patents.length} total)`, color: "var(--text-secondary)" },
      { type: "text", content: "═".repeat(50), color: "var(--border-color)" },
      { type: "text", content: "" }
    ];

    patents.forEach((patent, index) => {
      const statusColor = patent.status === "issued" ? "var(--text-primary)" : "var(--accent-orange)";
      output.push(
        { type: "text", content: `[${index + 1}] ${patent.shortTitle}`, color: "var(--text-primary)" },
        { type: "text", content: `    ${patent.company} | ${patent.year}`, color: "var(--text-secondary)" },
        { type: "text", content: `    Status: ${patent.status.toUpperCase()}${patent.patentNumber ? ` (${patent.patentNumber})` : ''}`, color: statusColor },
        { type: "text", content: `    ${patent.description}`, color: "var(--text-muted)" },
        { type: "text", content: "" }
      );
    });

    return output;
  },

  skills: () => {
    const output: CommandOutput[] = [
      { type: "text", content: "Technical Skills", color: "var(--text-secondary)" },
      { type: "text", content: "═".repeat(50), color: "var(--border-color)" },
      { type: "text", content: "" }
    ];

    skillCategories.forEach(category => {
      output.push(
        { type: "text", content: `▸ ${category.name}`, color: category.color },
        { type: "text", content: `  ${category.skills.join(", ")}`, color: "var(--text-muted)" },
        { type: "text", content: "" }
      );
    });

    return output;
  },

  awards: () => {
    const output: CommandOutput[] = [
      { type: "text", content: "Awards & Achievements", color: "var(--text-secondary)" },
      { type: "text", content: "═".repeat(50), color: "var(--border-color)" },
      { type: "text", content: "" }
    ];

    achievements.forEach(ach => {
      const icon = ach.category === "speaking" ? "🎤" :
                   ach.category === "award" ? "🏆" :
                   ach.category === "competition" ? "🥇" : "📜";
      output.push(
        { type: "text", content: `${icon} ${ach.title}`, color: "var(--text-primary)" },
        { type: "text", content: `   ${ach.organization} | ${ach.year}`, color: "var(--text-secondary)" },
        { type: "text", content: `   ${ach.description}`, color: "var(--text-muted)" },
        { type: "text", content: "" }
      );
    });

    return output;
  },

  education: () => {
    const output: CommandOutput[] = [
      { type: "text", content: "Education", color: "var(--text-secondary)" },
      { type: "text", content: "═".repeat(50), color: "var(--border-color)" },
      { type: "text", content: "" }
    ];

    education.forEach(edu => {
      output.push(
        { type: "text", content: `🎓 ${edu.degree}`, color: "var(--text-primary)" },
        { type: "text", content: `   ${edu.institution} | ${edu.period}`, color: "var(--text-secondary)" },
        { type: "text", content: `   📍 ${edu.location}`, color: "var(--text-muted)" },
        { type: "text", content: `   ✨ ${edu.achievement}`, color: "var(--accent-orange)" },
        { type: "text", content: "" }
      );
    });

    return output;
  },

  talks: () => [
    { type: "text", content: "Conference Talks", color: "var(--text-secondary)" },
    { type: "text", content: "═".repeat(50), color: "var(--border-color)" },
    { type: "text", content: "" },
    { type: "text", content: "🎤 Meta Connect 2025", color: "var(--text-primary)" },
    { type: "text", content: '   "Optimising Horizon Developer Experience for the Agentic AI Era"', color: "var(--accent-purple)" },
    { type: "text", content: "   Featured in Connect Developer Keynote" },
    { type: "text", content: "   Audience: 5,000+ developers (live), 100K+ viewers (keynote)", color: "var(--text-muted)" },
    { type: "text", content: "" },
    { type: "link", content: "   📺 Watch: https://youtube.com/watch?v=0v4_2pLH4jg", action: "https://www.youtube.com/watch?v=0v4_2pLH4jg", color: "var(--accent-blue)" },
    { type: "text", content: "" },
    { type: "text", content: "Topics covered:", color: "var(--text-secondary)" },
    { type: "text", content: "   • Responsible development of agentic AI systems" },
    { type: "text", content: "   • Safe and reliable AI assistance for developers" },
    { type: "text", content: "   • Knowledge Graph architecture for code understanding" }
  ],

  leadership: () => {
    const output: CommandOutput[] = [
      { type: "text", content: "Leadership & Mentorship", color: "var(--text-secondary)" },
      { type: "text", content: "═".repeat(50), color: "var(--border-color)" },
      { type: "text", content: "" }
    ];

    leadership.forEach(item => {
      output.push(
        { type: "text", content: `👥 ${item.title}`, color: "var(--text-primary)" },
        { type: "text", content: `   ${item.description}`, color: "var(--text-muted)" },
        { type: "text", content: "" }
      );
    });

    output.push(
      { type: "text", content: "Team Leadership:", color: "var(--text-secondary)" },
      { type: "text", content: "   • Led teams of 4-10 engineers across multiple projects" },
      { type: "text", content: "   • Cross-functional collaboration with data scientists, PMs" },
      { type: "text", content: "   • Technical mentorship and career development" }
    );

    return output;
  },

  contact: () => [
    { type: "text", content: "Contact Information", color: "var(--text-secondary)" },
    { type: "text", content: "═".repeat(50), color: "var(--border-color)" },
    { type: "text", content: "" },
    { type: "text", content: `📧 Email: ${profile.email}`, color: "var(--text-primary)" },
    { type: "text", content: `📱 Phone: ${profile.phone}` },
    { type: "text", content: `📍 Location: ${profile.location}` },
    { type: "text", content: "" },
    { type: "link", content: `🔗 LinkedIn: ${socialLinks.linkedin}`, action: socialLinks.linkedin, color: "var(--accent-blue)" },
    { type: "text", content: "" },
    { type: "text", content: "Type 'linkedin' to open my profile, or 'resume' to download my resume.", color: "var(--text-muted)" }
  ],

  linkedin: () => [
    { type: "special", content: "Opening LinkedIn profile...", action: "linkedin", color: "var(--text-primary)" }
  ],

  resume: () => [
    { type: "special", content: "Downloading resume...", action: "resume", color: "var(--text-primary)" }
  ],

  graph: () => [
    { type: "special", content: "Switching to Knowledge Graph view...", action: "graph", color: "var(--text-primary)" }
  ],

  clear: () => [
    { type: "special", content: "", action: "clear" }
  ],

  neofetch: () => [
    { type: "ascii", content: profile.ascii, color: "var(--text-primary)" },
    { type: "text", content: `vaidy@metaverse`, color: "var(--text-primary)" },
    { type: "text", content: "─".repeat(20) },
    { type: "text", content: `OS: Reality Labs Platform`, color: "var(--accent-blue)" },
    { type: "text", content: `Host: Meta Horizon Worlds`, color: "var(--accent-purple)" },
    { type: "text", content: `Kernel: Agentic AI v2.0`, color: "var(--accent-pink)" },
    { type: "text", content: `Uptime: ${new Date().getFullYear() - 2015} years in tech`, color: "var(--accent-orange)" },
    { type: "text", content: `Packages: 5 patents (4 issued)`, color: "var(--text-primary)" },
    { type: "text", content: `Shell: Knowledge Graph 500K+ nodes`, color: "var(--text-secondary)" },
    { type: "text", content: `Resolution: 20K+ developers impacted`, color: "var(--accent-blue)" },
    { type: "text", content: `CPU: LLM-powered @ 85% accuracy`, color: "var(--accent-purple)" },
    { type: "text", content: `Memory: Meta Connect 2025 📺`, color: "var(--accent-pink)" },
    { type: "text", content: "" },
    { type: "text", content: "████████████████████████", color: "var(--text-primary)" }
  ],

  matrix: () => [
    { type: "special", content: "Entering the Matrix...", action: "matrix", color: "var(--text-primary)" }
  ],

  "sudo": (args) => {
    if (args[0] === "hire-me") {
      return [
        { type: "text", content: "[sudo] password for recruiter: ********" },
        { type: "text", content: "" },
        { type: "text", content: "✅ Access granted!", color: "var(--text-primary)" },
        { type: "text", content: "" },
        { type: "text", content: "🚀 Congratulations! You've unlocked the secret hiring portal.", color: "var(--accent-purple)" },
        { type: "text", content: "" },
        { type: "text", content: "Let's connect:", color: "var(--text-secondary)" },
        { type: "text", content: `   📧 ${profile.email}` },
        { type: "link", content: `   🔗 ${socialLinks.linkedin}`, action: socialLinks.linkedin },
        { type: "text", content: "" },
        { type: "text", content: "I'm always open to discussing interesting opportunities!", color: "var(--text-muted)" }
      ];
    }
    return [{ type: "error", content: `sudo: ${args.join(" ")}: command not found` }];
  }
};

export const executeCommand = (input: string): CommandOutput[] => {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return [];

  const [cmd, ...args] = trimmed.split(/\s+/);

  if (commands[cmd]) {
    return commands[cmd](args);
  }

  // Check for partial matches
  const matches = Object.keys(commands).filter(c => c.startsWith(cmd));
  if (matches.length === 1) {
    return commands[matches[0]](args);
  }

  return [
    { type: "error", content: `Command not found: ${cmd}`, color: "var(--accent-red)" },
    { type: "text", content: "Type 'help' for available commands.", color: "var(--text-muted)" }
  ];
};

export const getCommandSuggestions = (input: string): string[] => {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return Object.keys(commands);
  return Object.keys(commands).filter(cmd => cmd.startsWith(trimmed));
};

export const allCommands = Object.keys(commands);
