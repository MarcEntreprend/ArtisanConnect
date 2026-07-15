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
      aria-label="Changer de thème"
      onClick={onToggle}
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-ink-soft hover:bg-bg-sunken transition-colors"
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
