export const MIDNIGHT_THEME = {
  name: 'midnight' as const,
  displayName: 'Midnight Navy (Dark Version)',
  // Backgrounds: Dark navy and deep charcoal from reference
  background: '#0F131E',
  backgroundGradientStart: '#0F131E',
  backgroundGradientEnd: '#0A0E19',
  cardBg: '#1C202B',
  cardBgElevated: '#242938',
  cardBgSubtle: '#181C27',
  surfaceSubtle: 'rgba(12, 185, 129, 0.05)',
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  surfaceBorderSubtle: '#262D3D',

  // Primary accents: Emerald green and teal from reference
  primary: '#0CB981',       // High-vibrancy Emerald Green
  primaryGlow: 'rgba(12, 185, 129, 0.35)',
  primaryDeep: '#059669',
  primaryLight: '#34D399',

  // Secondary accents: Purple from reference
  secondary: '#6366F1',     // Vibrant Indigo/Purple
  secondaryGlow: 'rgba(99, 102, 241, 0.3)',
  ambientGreenGlow: 'rgba(12, 185, 129, 0.12)',

  // Reference Purple & Charcoal specific tokens
  accentPurple: '#202068',       // Deep purple button background from reference
  accentPurpleLight: '#A5B4FC',  // High readability light purple
  accentPurpleBorder: '#3730A3', // Purple border
  accentCharcoal: '#262A36',     // Dark slate/charcoal button from reference

  // Status Colors
  success: '#0CB981',
  successGlow: 'rgba(12, 185, 129, 0.25)',
  warning: '#F59E0B',       // Warm Amber
  warningGlow: 'rgba(245, 158, 11, 0.25)',
  danger: '#EF4444',        // Soft Coral Red
  dangerGlow: 'rgba(239, 68, 68, 0.3)',

  // Typography: High-contrast light text with readable secondary text
  textPrimary: '#FFFFFF',   // Crisp clean white text
  textSecondary: '#94A3B8', // Readable secondary slate text
  textMuted: '#64748B',    // Subdued slate grey
  textGreen: '#0CB981',
  textCyan: '#2DD4BF',

  // UI Navigation Elements
  activeNav: '#0CB981',
  inactiveNav: '#64748B',
  badgeBg: 'rgba(12, 185, 129, 0.14)',
  buttonTextDark: '#041F15', // High contrast dark text on emerald button
  userBubbleBg: 'rgba(12, 185, 129, 0.15)',
  userBubbleBorder: 'rgba(12, 185, 129, 0.25)',
  surfaceCard: '#1C202B',
  primaryBorder: 'rgba(12, 185, 129, 0.25)',
};

export const MIDNIGHT_DAY_THEME = {
  name: 'midnight-day' as const,
  displayName: 'Midnight Navy (Day Version)',
  // Backgrounds: Clean, crisp soft white and porcelain light slate
  background: '#F8FAFC',
  backgroundGradientStart: '#F8FAFC',
  backgroundGradientEnd: '#EDF2F7',
  cardBg: '#FFFFFF',
  cardBgElevated: '#FFFFFF',
  cardBgSubtle: '#F1F5F9',
  surfaceSubtle: 'rgba(5, 150, 105, 0.05)',
  surfaceBorder: 'rgba(15, 23, 42, 0.08)',
  surfaceBorderSubtle: '#E2E8F0',

  // Primary accents: Emerald Green tailored for light background contrast
  primary: '#059669',          // Deep vivid Emerald Green
  primaryGlow: 'rgba(5, 150, 105, 0.20)',
  primaryDeep: '#047857',
  primaryLight: '#10B981',

  // Secondary accents: Indigo / Royal Purple
  secondary: '#4F46E5',        // Royal Indigo
  secondaryGlow: 'rgba(79, 70, 229, 0.20)',
  ambientGreenGlow: 'rgba(5, 150, 105, 0.08)',

  // Reference Purple & Charcoal specific tokens (Day Version)
  accentPurple: '#EEF2FF',      // Soft pastel indigo container
  accentPurpleLight: '#4338CA', // Indigo readable text
  accentPurpleBorder: '#C7D2FE',
  accentCharcoal: '#E2E8F0',    // Light slate button

  // Status Colors
  success: '#059669',
  successGlow: 'rgba(5, 150, 105, 0.20)',
  warning: '#D97706',          // Warm Amber
  warningGlow: 'rgba(217, 119, 6, 0.20)',
  danger: '#DC2626',           // Crisp Red
  dangerGlow: 'rgba(220, 38, 38, 0.20)',

  // Typography: Dark, crisp, high readability
  textPrimary: '#0F172A',      // Slate 900
  textSecondary: '#475569',    // Slate 600
  textMuted: '#94A3B8',        // Slate 400
  textGreen: '#059669',
  textCyan: '#0D9488',

  // UI Navigation Elements
  activeNav: '#059669',
  inactiveNav: '#64748B',
  badgeBg: 'rgba(5, 150, 105, 0.12)',
  buttonTextDark: '#FFFFFF',   // White text on dark green button
  userBubbleBg: 'rgba(5, 150, 105, 0.10)',
  userBubbleBorder: 'rgba(5, 150, 105, 0.25)',
  surfaceCard: '#FFFFFF',
  primaryBorder: 'rgba(5, 150, 105, 0.25)',
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

export type ThemeName = 'midnight' | 'midnight-day';
export type ThemeColors = Omit<typeof MIDNIGHT_THEME, 'name'> & { name: ThemeName };

type ThemeListener = (themeName: ThemeName) => void;

const THEME_STORAGE_KEY = 'miras_active_theme_v1';

const getSavedTheme = (): ThemeName => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'midnight' || saved === 'midnight-day') {
        return saved;
      }
    } catch {
      // fallback
    }
  }
  return 'midnight'; // Midnight Navy (Dark Version) is default and primary
};

const saveTheme = (name: ThemeName) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, name);
    } catch {
      // fallback
    }
  }
};

let activeThemeName: ThemeName = getSavedTheme();
const listeners: ThemeListener[] = [];

const getThemeObject = (name: ThemeName) => {
  switch (name) {
    case 'midnight-day':
      return MIDNIGHT_DAY_THEME;
    case 'midnight':
    default:
      return MIDNIGHT_THEME;
  }
};

export const COLORS = { ...getThemeObject(activeThemeName) };

export const ThemeManager = {
  getTheme: (): ThemeName => activeThemeName,
  setTheme: (name: ThemeName) => {
    activeThemeName = name;
    saveTheme(name);
    const target = getThemeObject(name);
    Object.assign(COLORS, target);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = target.background;
      document.documentElement.style.backgroundColor = target.background;
    }
    listeners.forEach(fn => fn(name));
  },
  toggleTheme: () => {
    // Cycles between Midnight Navy Dark & Midnight Navy Day
    const next: ThemeName = activeThemeName === 'midnight' ? 'midnight-day' : 'midnight';
    ThemeManager.setTheme(next);
  },
  subscribe: (fn: ThemeListener) => {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },
};

export interface ThemeContextValue {
  themeName: ThemeName;
  colors: ThemeColors;
  isDark: boolean;
  isDay: boolean;
  isMidnight: boolean;
  isMidnightDay: boolean;
  isCyber?: boolean;
  isClaude?: boolean;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'midnight',
  colors: MIDNIGHT_THEME,
  isDark: true,
  isDay: false,
  isMidnight: true,
  isMidnightDay: false,
  isCyber: false,
  isClaude: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => ThemeManager.getTheme());

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const target = getThemeObject(themeName);
      document.body.style.backgroundColor = target.background;
      document.documentElement.style.backgroundColor = target.background;
    }

    return ThemeManager.subscribe(t => {
      setThemeName(t);
    });
  }, [themeName]);

  const colors = getThemeObject(themeName);

  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        themeName,
        colors,
        isDark: themeName === 'midnight',
        isDay: themeName === 'midnight-day',
        isMidnight: themeName === 'midnight',
        isMidnightDay: themeName === 'midnight-day',
        isCyber: false,
        isClaude: false,
        setTheme: ThemeManager.setTheme,
        toggleTheme: ThemeManager.toggleTheme,
      },
    },
    children
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx || !ctx.setTheme) {
    const name = ThemeManager.getTheme();
    const colors = getThemeObject(name);
    return {
      themeName: name,
      colors,
      isDark: name === 'midnight',
      isDay: name === 'midnight-day',
      isMidnight: name === 'midnight',
      isMidnightDay: name === 'midnight-day',
      isCyber: false,
      isClaude: false,
      setTheme: ThemeManager.setTheme,
      toggleTheme: ThemeManager.toggleTheme,
    };
  }
  return ctx;
};
