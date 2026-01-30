import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { saveLanguage } from "../utils/languageStorage";

import { BottomNav } from "../components/ui/BottomNav";
import Navbar from "../components/ui/Navbar";

export default function AppLayout() {
  const { i18n } = useTranslation();
  const language = useAppSelector((state) => state.settings.language);
  const theme = useAppSelector((state) => state.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
    saveLanguage(language);
  }, [language, i18n]);

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-6 md:py-8">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
