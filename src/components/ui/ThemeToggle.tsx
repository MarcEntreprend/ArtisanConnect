// src/components/ui/ThemeToggle.tsx

import { Sun, Moon } from "lucide-react";

interface Props {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      onClick={onToggle}
      className="
        relative w-9 h-9 rounded-full
        flex items-center justify-center
        text-(--ink-soft)
        hover:bg-(--bg-sunken) hover:text-(--ink)
        transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
        active:scale-90
      "
    >
      <span
        className="absolute transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark
            ? "rotate(90deg) scale(0.6)"
            : "rotate(0deg) scale(1)",
        }}
      >
        <Sun size={17} strokeWidth={2} />
      </span>
      <span
        className="absolute transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark
            ? "rotate(0deg) scale(1)"
            : "rotate(-90deg) scale(0.6)",
        }}
      >
        <Moon size={17} strokeWidth={2} />
      </span>
    </button>
  );
}
