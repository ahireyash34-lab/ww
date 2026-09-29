import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LanguageKey, TranslationDictionary } from '../i18n/translations';

interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageKey>(() => {
    const saved = localStorage.getItem('agrivision_language') as LanguageKey;
    return saved && translations[saved] ? saved : 'en';
  });

  const setLanguage = (lang: LanguageKey) => {
    setLanguageState(lang);
    localStorage.setItem('agrivision_language', lang);
  };

  const t = translations[language] || translations['en'];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
