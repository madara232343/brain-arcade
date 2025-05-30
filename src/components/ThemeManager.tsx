
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  gradient: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Cosmic Purple',
    gradient: 'from-indigo-900 via-purple-900 to-pink-800',
    colors: { primary: '#8b5cf6', secondary: '#a855f7', accent: '#ec4899' }
  },
  {
    id: 'neon-theme',
    name: 'Neon Nights',
    gradient: 'from-cyan-900 via-purple-900 to-pink-900',
    colors: { primary: '#06b6d4', secondary: '#8b5cf6', accent: '#ec4899' }
  },
  {
    id: 'nature-theme',
    name: 'Forest Calm',
    gradient: 'from-green-900 via-emerald-900 to-teal-900',
    colors: { primary: '#059669', secondary: '#047857', accent: '#0d9488' }
  },
  {
    id: 'space-theme',
    name: 'Cosmic Explorer',
    gradient: 'from-slate-900 via-purple-900 to-indigo-900',
    colors: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#3b82f6' }
  },
  {
    id: 'ocean-theme',
    name: 'Ocean Depths',
    gradient: 'from-blue-900 via-cyan-900 to-teal-900',
    colors: { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#0891b2' }
  },
  {
    id: 'fire-theme',
    name: 'Phoenix Flame',
    gradient: 'from-red-900 via-orange-900 to-yellow-900',
    colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#d97706' }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = 'default' }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themes.find(t => t.id === initialTheme) || themes[0]
  );

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', currentTheme.colors.primary);
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--theme-accent', currentTheme.colors.accent);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
