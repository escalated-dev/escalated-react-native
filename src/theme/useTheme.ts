import React, { createContext, useContext } from 'react';
import { ThemeMode, ThemeColors, getThemeColors } from './colors';
import { spacing, borderRadius, fontSize, fontWeight } from './spacing';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

function buildTheme(
  mode: ThemeMode,
  overrides?: { primaryColor?: string; borderRadius?: number }
): Theme {
  const br = overrides?.borderRadius != null
    ? {
        default: overrides.borderRadius,
        card: overrides.borderRadius + 4,
        badge: overrides.borderRadius + 16,
        full: 9999,
      } as typeof borderRadius
    : borderRadius;
  return {
    mode,
    colors: getThemeColors(mode, overrides?.primaryColor),
    spacing,
    borderRadius: br,
    fontSize,
    fontWeight,
  };
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: buildTheme('light'),
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}

export { buildTheme };
