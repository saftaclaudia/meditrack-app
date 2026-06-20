import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useTranslation } from "react-i18next";
import { saveLanguage } from "../utils/languageStorage";

import Navbar from "../components/ui/Navbar";
import { BottomNav } from "../components/ui/BottomNav";
import { logout } from "../features/auth/authSlice";

export default function AppLayout() {
  const { i18n } = useTranslation();

  const language = useAppSelector((state) => state.settings.language);
  const theme = useAppSelector((state) => state.settings.theme);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const expiresAt = parseInt(
      localStorage.getItem("auth_expires_at") ||
        sessionStorage.getItem("auth_expires_at") ||
        "0",
    );

    if (!expiresAt) return;

    const timeout = expiresAt - Date.now();

    if (timeout <= 0) {
      dispatch(logout());
      navigate("/login", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      dispatch(logout());
      navigate("/login", { replace: true });
    }, timeout);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

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
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-body dark:text-text-bodyDark transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 pb-28 md:pb-10 md:px-8 md:py-10">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
