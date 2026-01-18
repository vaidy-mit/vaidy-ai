"use client";

import React, { useEffect, useRef } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { CommandOutput } from "@/lib/commands";

interface TerminalProps {
  onSwitchView: () => void;
  onOpenLink: (url: string) => void;
}

const OutputLine: React.FC<{ output: CommandOutput; index: number }> = ({ output, index }) => {
  const style: React.CSSProperties = {
    color: output.color || "var(--text-white)",
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    animationDelay: `${index * 20}ms`
  };

  if (output.type === "ascii") {
    return (
      <pre className="fade-in" style={{ ...style, margin: 0, lineHeight: 1.2 }}>
        {output.content}
      </pre>
    );
  }

  if (output.type === "link") {
    return (
      <a
        href={output.action}
        target="_blank"
        rel="noopener noreferrer"
        className="fade-in hover:underline"
        style={{ ...style, cursor: "pointer" }}
      >
        {output.content}
      </a>
    );
  }

  if (output.type === "error") {
    return (
      <div className="fade-in" style={{ ...style, color: "var(--accent-red)" }}>
        {output.content}
      </div>
    );
  }

  return (
    <div className="fade-in" style={style}>
      {output.content}
    </div>
  );
};

export const Terminal: React.FC<TerminalProps> = ({ onSwitchView, onOpenLink }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSpecialAction = (action: string) => {
    switch (action) {
      case "graph":
        onSwitchView();
        break;
      case "linkedin":
        onOpenLink("https://www.linkedin.com/in/vaidyanathan-pk-1a494086/");
        break;
      case "resume":
        onOpenLink("/resume");
        break;
      case "matrix":
        // Trigger matrix effect
        document.body.classList.add("matrix-mode");
        setTimeout(() => {
          document.body.classList.remove("matrix-mode");
        }, 5000);
        break;
    }
  };

  const {
    history,
    currentInput,
    setCurrentInput,
    handleKeyDown,
    suggestions
  } = useTerminal(handleSpecialAction);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Terminal Window */}
      <div className="terminal-glow rounded-lg overflow-hidden border border-[var(--border-color)]">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-card)] border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--text-primary)]" />
          </div>
          <span className="text-sm text-[var(--text-muted)]">vaidy@vaidy.ai ~ </span>
          <div className="w-16" />
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          onClick={focusInput}
          className="h-[60vh] min-h-[400px] overflow-y-auto p-4 bg-[var(--bg-terminal)] cursor-text"
        >
          {/* History */}
          {history.map((entry, historyIdx) => (
            <div key={historyIdx} className="mb-4">
              {entry.command && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[var(--text-primary)]">$</span>
                  <span className="text-[var(--text-white)]">{entry.command}</span>
                </div>
              )}
              <div className="pl-4">
                {entry.output.map((output, outputIdx) => (
                  <OutputLine key={outputIdx} output={output} index={outputIdx} />
                ))}
              </div>
            </div>
          ))}

          {/* Input Line */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-primary)]">$</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-[var(--text-white)] font-mono"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {currentInput && suggestions.length > 0 && suggestions[0] !== currentInput && (
                <span className="absolute left-0 top-0 text-[var(--text-muted)] pointer-events-none">
                  {currentInput}
                  <span className="opacity-50">{suggestions[0].slice(currentInput.length)}</span>
                </span>
              )}
            </div>
            <span className="cursor" />
          </div>
        </div>
      </div>

      {/* Command Hints */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {["help", "whoami", "experience", "patents", "skills", "graph"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setCurrentInput(cmd);
              inputRef.current?.focus();
            }}
            className="px-3 py-1 text-sm bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] rounded hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
