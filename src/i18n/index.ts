import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ro from "./ro.json";
import de from "./de.json";
// Setup i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ro: { translation: ro },
    de: { translation: de },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});
export default i18n;
