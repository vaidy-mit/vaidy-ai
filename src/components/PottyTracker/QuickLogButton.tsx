'use client';

import { useState } from 'react';

interface QuickLogButtonProps {
  type: 'success' | 'accident' | 'attempt';
  onLog: () => void;
  disabled?: boolean;
}

const BUTTON_CONFIG = {
  success: {
    emoji: '⭐',
    label: 'Success!',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    hoverBg: 'hover:bg-green-500/30',
    textColor: 'text-green-400',
    glowColor: 'rgba(34, 197, 94, 0.4)',
  },
  accident: {
    emoji: '💧',
    label: 'Accident',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    hoverBg: 'hover:bg-blue-500/30',
    textColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  attempt: {
    emoji: '🚽',
    label: 'Attempt',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    hoverBg: 'hover:bg-purple-500/30',
    textColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.4)',
  },
};

export function QuickLogButton({ type, onLog, disabled }: QuickLogButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const config = BUTTON_CONFIG[type];

  const handleClick = () => {
    if (disabled || isAnimating) return;

    setIsAnimating(true);
    onLog();

    // Reset animation after delay
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`
        relative flex flex-col items-center justify-center
        w-full aspect-square rounded-2xl
        border-2 ${config.borderColor} ${config.bgColor}
        ${config.hoverBg} transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95 transform
        ${isAnimating ? 'scale-110' : ''}
      `}
      style={{
        boxShadow: isAnimating ? `0 0 30px ${config.glowColor}` : 'none',
      }}
    >
      {/* Emoji */}
      <span
        className={`text-5xl mb-2 transition-transform duration-300 ${
          isAnimating ? 'scale-125' : ''
        }`}
      >
        {config.emoji}
      </span>

      {/* Label */}
      <span className={`text-lg font-semibold ${config.textColor}`}>{config.label}</span>

      {/* Ripple effect on click */}
      {isAnimating && (
        <span
          className="absolute inset-0 rounded-2xl animate-ping opacity-30"
          style={{ backgroundColor: config.glowColor }}
        />
      )}
    </button>
  );
}
