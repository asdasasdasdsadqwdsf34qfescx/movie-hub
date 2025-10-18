"use client";

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="fixed top-6 right-6 z-50 p-3 rounded-full
        bg-white/10 backdrop-blur-md border border-white/20
        hover:bg-white/20 transition-all duration-300
        hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-6 h-6 text-yellow-300" />
      ) : (
        <Moon className="w-6 h-6 text-slate-700" />
      )}
    </Button>
  );
};

export default ThemeToggle;
