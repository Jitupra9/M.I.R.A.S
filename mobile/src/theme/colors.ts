export const MIDNIGHT_THEME = {
  name: 'midnight' as const,
  displayName: 'Midnight Navy (Emerald & Purple)',
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

export const CYBER_THEME = {
  name: 'cyber' as const,
  displayName: 'Cyber Jarvis (Emerald)',
  // Backgrounds (Deep Emerald Luxury Forest Dark Mode)
  background: '#060E0A',
  backgroundGradientStart: '#060E0A',
  backgroundGradientEnd: '#0A1711',
  cardBg: '#0D1A14',
  cardBgElevated: '#12231B',
  cardBgSubtle: '#09140F',
  surfaceSubtle: 'rgba(0, 229, 153, 0.04)',
  surfaceBorder: 'rgba(0, 229, 153, 0.16)',
  surfaceBorderSubtle: 'rgba(255, 255, 255, 0.07)',

  // Primary Mint & Emerald Glowing Accents
  primary: '#00E599',       // Vibrant Mint Green
  primaryGlow: 'rgba(0, 229, 153, 0.35)',
  primaryDeep: '#059669',   // Deep Forest Emerald
  primaryLight: '#34D399',

  // Secondary Accents
  secondary: '#10B981',
  secondaryGlow: 'rgba(16, 185, 129, 0.25)',
  ambientGreenGlow: 'rgba(0, 229, 153, 0.12)',

  // Themed Accents
  accentPurple: '#132A20',
  accentPurpleLight: '#34D399',
  accentPurpleBorder: 'rgba(0, 229, 153, 0.25)',
  accentCharcoal: '#12231B',

  // Status Colors
  success: '#00E599',
  successGlow: 'rgba(0, 229, 153, 0.25)',
  warning: '#F59E0B',       // Warm Amber
  warningGlow: 'rgba(245, 158, 11, 0.25)',
  danger: '#EF4444',        // Soft Coral Red
  dangerGlow: 'rgba(239, 68, 68, 0.3)',

  // Typography
  textPrimary: '#F1FDF6',   // Crisp clean white-mint
  textSecondary: '#8CA496', // Gentle sage grey
  textMuted: '#52695C',    // Subdued green-grey
  textGreen: '#00E599',
  textCyan: '#00E599',

  // UI Navigation Elements
  activeNav: '#00E599',
  inactiveNav: '#52695C',
  badgeBg: 'rgba(0, 229, 153, 0.12)',
  buttonTextDark: '#05180F', // High contrast dark text on mint button
  userBubbleBg: 'rgba(0, 229, 153, 0.15)',
  userBubbleBorder: 'rgba(0, 229, 153, 0.25)',
  surfaceCard: '#0D1A14',
  primaryBorder: 'rgba(0, 229, 153, 0.25)',
};

export const CLAUDE_THEME = {
  name: 'claude' as const,
  displayName: 'Claude Warm (Terracotta)',
  // Backgrounds (Deep Dark Espresso & Charcoal)
  background: '#0D0C0A',
  backgroundGradientStart: '#0D0C0A',
  backgroundGradientEnd: '#141210',
  cardBg: '#171512',
  cardBgElevated: '#1F1C18',
  cardBgSubtle: '#11100D',
  surfaceSubtle: 'rgba(217, 119, 87, 0.06)',
  surfaceBorder: 'rgba(217, 119, 87, 0.22)',
  surfaceBorderSubtle: 'rgba(255, 255, 255, 0.07)',

  // Primary Claude Signature Warm Terracotta
  primary: '#D97757',       // Warm Terracotta
  primaryGlow: 'rgba(217, 119, 87, 0.35)',
  primaryDeep: '#B55A3C',
  primaryLight: '#E89173',

  // Secondary Accents
  secondary: '#C66D4E',
  secondaryGlow: 'rgba(198, 109, 78, 0.25)',
  ambientGreenGlow: 'rgba(217, 119, 87, 0.12)',

  // Themed Accents
  accentPurple: '#2A1A14',
  accentPurpleLight: '#E89173',
  accentPurpleBorder: 'rgba(217, 119, 87, 0.25)',
  accentCharcoal: '#1F1C18',

  // Status Colors
  success: '#38A169',
  successGlow: 'rgba(56, 161, 105, 0.25)',
  warning: '#E28743',
  warningGlow: 'rgba(226, 135, 67, 0.25)',
  danger: '#E53E3E',
  dangerGlow: 'rgba(229, 62, 62, 0.3)',

  // Typography
  textPrimary: '#FDF8F5',   // Crisp clean cream text
  textSecondary: '#A89E95', // Warm readable sand grey
  textMuted: '#6B625A',    // Deep warm earthy grey
  textGreen: '#D97757',
  textCyan: '#D97757',

  // UI Navigation Elements
  activeNav: '#D97757',
  inactiveNav: '#6B625A',
  badgeBg: 'rgba(217, 119, 87, 0.16)',
  buttonTextDark: '#0D0C0A',
  userBubbleBg: 'rgba(217, 119, 87, 0.18)',
  userBubbleBorder: 'rgba(217, 119, 87, 0.3)',
  surfaceCard: '#171512',
  primaryBorder: 'rgba(217, 119, 87, 0.3)',
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

export type ThemeName = 'midnight' | 'cyber' | 'claude';
export type ThemeColors = Omit<typeof MIDNIGHT_THEME, 'name'> & { name: ThemeName };

type ThemeListener = (themeName: ThemeName) => void;

const THEME_STORAGE_KEY = 'miras_active_theme_v1';

const getSavedTheme = (): ThemeName => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'midnight' || saved === 'cyber' || saved === 'claude') {
        return saved;
      }
    } catch {
      // fallback
    }
  }
  return 'midnight'; // Midnight Navy is default and primary
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
    case 'claude':
      return CLAUDE_THEME;
    case 'cyber':
      return CYBER_THEME;
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
    // Cycles: midnight -> cyber -> claude -> midnight
    const next: ThemeName =
      activeThemeName === 'midnight' ? 'cyber' : activeThemeName === 'cyber' ? 'claude' : 'midnight';
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
  isMidnight: boolean;
  isCyber: boolean;
  isClaude: boolean;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'midnight',
  colors: MIDNIGHT_THEME,
  isMidnight: true,
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
        isMidnight: themeName === 'midnight',
        isCyber: themeName === 'cyber',
        isClaude: themeName === 'claude',
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
      isMidnight: name === 'midnight',
      isCyber: name === 'cyber',
      isClaude: name === 'claude',
      setTheme: ThemeManager.setTheme,
      toggleTheme: ThemeManager.toggleTheme,
    };
  }
  return ctx;
};
