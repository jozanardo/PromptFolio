import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type Language = 'en' | 'pt';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

function resolveInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    const stored = window.localStorage.getItem('lang');
    if (stored === 'en' || stored === 'pt') {
      return stored;
    }
  } catch {
    // Ignore storage failures and fall back to browser language.
  }

  return window.navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>(resolveInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;

    try {
      window.localStorage.setItem('lang', lang);
    } catch {
      // Ignore storage failures and keep language in memory.
    }
  }, [lang]);

  const setLang = (l: Language) => {
    setLangState(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be inside LanguageProvider');
  }
  return ctx;
}
