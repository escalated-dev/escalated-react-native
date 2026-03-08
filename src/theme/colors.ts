export const colors = {
  primary: '#4f46e5',
  primaryLight: '#6366f1',

  light: {
    surface: '#ffffff',
    background: '#f9fafb',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
  },

  dark: {
    surface: '#171717',
    background: '#0a0a0a',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    border: 'rgba(255,255,255,0.06)',
  },

  status: {
    open: '#3b82f6',
    in_progress: '#f59e0b',
    waiting_on_customer: '#8b5cf6',
    waiting_on_agent: '#ec4899',
    escalated: '#ef4444',
    resolved: '#10b981',
    closed: '#6b7280',
    reopened: '#f97316',
  } as Record<string, string>,

  priority: {
    low: '#6b7280',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#f97316',
    critical: '#ef4444',
  } as Record<string, string>,

  rating: {
    star: '#f59e0b',
    starEmpty: '#d1d5db',
  },

  sla: {
    ok: '#10b981',
    warning: '#f59e0b',
    breached: '#ef4444',
  },

  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  surface: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export function getThemeColors(mode: ThemeMode): ThemeColors {
  const modeColors = mode === 'light' ? colors.light : colors.dark;
  return {
    primary: colors.primary,
    primaryLight: colors.primaryLight,
    surface: modeColors.surface,
    background: modeColors.background,
    textPrimary: modeColors.textPrimary,
    textSecondary: modeColors.textSecondary,
    border: modeColors.border,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
  };
}
