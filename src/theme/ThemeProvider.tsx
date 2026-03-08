import React, { useState, useCallback, useMemo } from 'react';
import { ThemeMode } from './colors';
import { ThemeContext, buildTheme } from './useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  primaryColor?: string;
  borderRadius?: number;
}

export function ThemeProvider({
  children,
  initialMode = 'light',
  primaryColor,
  borderRadius,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setThemeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  const value = useMemo(
    () => ({
      theme: buildTheme(mode, { primaryColor, borderRadius }),
      toggleTheme,
      setThemeMode,
    }),
    [mode, primaryColor, borderRadius, toggleTheme, setThemeMode]
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
}
