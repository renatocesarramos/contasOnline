import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeSwitchProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeSwitch({ isDark, onToggle }: ThemeSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-colors ${
        isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
      }`}
      aria-label="Alternar tema"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}