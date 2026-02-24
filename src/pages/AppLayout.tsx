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
        sessionStorage.getItem("auth_exptres_at") ||
        "0",
    );
    if (!expiresAt) return;

    const timeout = expiresAt - Date.now();

    if (timeout <= 0) {
      dispatch(logout());
      navigate("/login", { replace: true });
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
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 w-full max-w-4xl  mx-auto px-5 py-8 md:py-8">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
