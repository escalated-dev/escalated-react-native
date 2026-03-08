import React, { useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme/ThemeProvider';
import { ThemeMode } from './theme/colors';
import { I18nProvider, Locale } from './i18n';
import { AuthHooks, setAuthHooks, DefaultAuthHooks } from './services/authHooks';
import { setBaseURL } from './services/apiClient';
import { AuthProvider } from './AuthProvider';

export interface EscalatedConfig {
  apiBaseUrl: string;
  authHooks?: AuthHooks;
  defaultLocale?: Locale;
  darkMode?: boolean;
  primaryColor?: string;
  borderRadius?: number;
}

interface EscalatedProviderProps {
  config: EscalatedConfig;
  children: React.ReactNode;
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
});

export function EscalatedProvider({ config, children }: EscalatedProviderProps) {
  const themeMode: ThemeMode = config.darkMode ? 'dark' : 'light';
  const locale: Locale = config.defaultLocale ?? 'en';

  useEffect(() => {
    setBaseURL(config.apiBaseUrl);
  }, [config.apiBaseUrl]);

  useEffect(() => {
    if (config.authHooks) {
      setAuthHooks(config.authHooks);
    } else {
      setAuthHooks(new DefaultAuthHooks(config.apiBaseUrl));
    }
  }, [config.authHooks]);

  const queryClient = useMemo(() => defaultQueryClient, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialMode={themeMode}>
        <I18nProvider initialLocale={locale}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
