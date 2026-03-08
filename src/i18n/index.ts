import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import en, { TranslationKeys } from './en';
import es from './es';
import fr from './fr';
import de from './de';

export type Locale = 'en' | 'es' | 'fr' | 'de';

export type Translations = Record<TranslationKeys, string>;

const translationMap: Record<Locale, Translations> = {
  en: en as Translations,
  es: es as Translations,
  fr: fr as Translations,
  de: de as Translations,
};

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Espa\u00f1ol',
  fr: 'Fran\u00e7ais',
  de: 'Deutsch',
};

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKeys) => string;
}

export const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: TranslationKeys) => en[key] || key,
});

export function useI18n(): I18nContextType {
  return useContext(I18nContext);
}

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale = 'en' }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const t = useCallback(
    (key: TranslationKeys): string => {
      const translations = translationMap[locale];
      return translations[key] || en[key] || key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, t]
  );

  return React.createElement(I18nContext.Provider, { value }, children);
}

export type { TranslationKeys };
