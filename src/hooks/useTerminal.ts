"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { executeCommand, getCommandSuggestions, CommandOutput } from "@/lib/commands";

interface HistoryEntry {
  command: string;
  output: CommandOutput[];
}

interface UseTerminalReturn {
  history: HistoryEntry[];
  currentInput: string;
  setCurrentInput: (input: string) => void;
  handleCommand: (command: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  clearHistory: () => void;
  suggestions: string[];
  historyIndex: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const useTerminal = (onSpecialAction?: (action: string) => void): UseTerminalReturn => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeOutput: CommandOutput[] = [
      { type: "text", content: "Welcome to vaidy.ai", color: "var(--text-primary)" },
      { type: "text", content: "═".repeat(40), color: "var(--border-color)" },
      { type: "text", content: "" },
      { type: "text", content: "Lead AI Engineer @ Meta Reality Labs", color: "var(--text-secondary)" },
      { type: "text", content: "Building the future of developer AI for the Metaverse", color: "var(--accent-purple)" },
      { type: "text", content: "" },
      { type: "text", content: "Type 'help' for available commands", color: "var(--text-muted)" },
      { type: "text", content: "Or click the buttons below for quick access", color: "var(--text-muted)" },
      { type: "text", content: "" }
    ];
    setHistory([{ command: "", output: welcomeOutput }]);
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (currentInput) {
      setSuggestions(getCommandSuggestions(currentInput));
    } else {
      setSuggestions([]);
    }
  }, [currentInput]);

  const handleCommand = useCallback((command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    const output = executeCommand(trimmed);

    // Check for special actions
    const specialAction = output.find(o => o.type === "special");
    if (specialAction?.action) {
      if (specialAction.action === "clear") {
        setHistory([]);
        setCurrentInput("");
        return;
      }
      if (onSpecialAction) {
        onSpecialAction(specialAction.action);
      }
    }

    setHistory(prev => [...prev, { command: trimmed, output }]);
    setCommandHistory(prev => [trimmed, ...prev.slice(0, 49)]); // Keep last 50 commands
    setCurrentInput("");
    setHistoryIndex(-1);
  }, [onSpecialAction]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleCommand(currentInput);
        break;

      case "ArrowUp":
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentInput("");
        }
        break;

      case "Tab":
        e.preventDefault();
        if (suggestions.length === 1) {
          setCurrentInput(suggestions[0]);
        } else if (suggestions.length > 1) {
          // Find common prefix
          const commonPrefix = suggestions.reduce((prefix, suggestion) => {
            while (!suggestion.startsWith(prefix)) {
              prefix = prefix.slice(0, -1);
            }
            return prefix;
          }, suggestions[0]);
          if (commonPrefix.length > currentInput.length) {
            setCurrentInput(commonPrefix);
          }
        }
        break;

      case "c":
        if (e.ctrlKey) {
          e.preventDefault();
          setCurrentInput("");
        }
        break;

      case "l":
        if (e.ctrlKey) {
          e.preventDefault();
          setHistory([]);
        }
        break;
    }
  }, [currentInput, commandHistory, historyIndex, suggestions, handleCommand]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    currentInput,
    setCurrentInput,
    handleCommand,
    handleKeyDown,
    clearHistory,
    suggestions,
    historyIndex,
    inputRef
  };
};
