import type { Language } from "../types/language";

const LANGUAGE_KEY = "app_language";

export const saveLanguage = (language: Language) => {
  localStorage.setItem(LANGUAGE_KEY, language);
};

export const loadLanguage = (): Language | null => {
  const stored = localStorage.getItem(LANGUAGE_KEY);

  if (stored === "en" || stored === "ro" || stored === "de") {
    return stored;
  }
  return null;
};
