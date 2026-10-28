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

export type ThemeName = 'cyber' | 'claude';
export type ThemeColors = Omit<typeof CYBER_THEME, 'name'> & { name: ThemeName };

type ThemeListener = (themeName: ThemeName) => void;
let activeThemeName: ThemeName = 'cyber';
const listeners: ThemeListener[] = [];

export const COLORS = { ...CYBER_THEME };

export const ThemeManager = {
  getTheme: (): ThemeName => activeThemeName,
  setTheme: (name: ThemeName) => {
    activeThemeName = name;
    const target = name === 'claude' ? CLAUDE_THEME : CYBER_THEME;
    Object.assign(COLORS, target);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = target.background;
      document.documentElement.style.backgroundColor = target.background;
    }
    listeners.forEach(fn => fn(name));
  },
  toggleTheme: () => {
    ThemeManager.setTheme(activeThemeName === 'cyber' ? 'claude' : 'cyber');
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
  isClaude: boolean;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'cyber',
  colors: CYBER_THEME,
  isClaude: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(ThemeManager.getTheme());

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const target = themeName === 'claude' ? CLAUDE_THEME : CYBER_THEME;
      document.body.style.backgroundColor = target.background;
      document.documentElement.style.backgroundColor = target.background;
    }

    return ThemeManager.subscribe(t => {
      setThemeName(t);
    });
  }, [themeName]);

  const colors = themeName === 'claude' ? CLAUDE_THEME : CYBER_THEME;

  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        themeName,
        colors,
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
    return {
      themeName: name,
      colors: name === 'claude' ? CLAUDE_THEME : CYBER_THEME,
      isClaude: name === 'claude',
      setTheme: ThemeManager.setTheme,
      toggleTheme: ThemeManager.toggleTheme,
    };
  }
  return ctx;
};

