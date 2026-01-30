import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { setLanguage } from "../../features/settings/settingsSlice";
import type { Language } from "../../types/language";
import { Globe } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface LanguageSelectProps {
  className?: string;
  onAction?: () => void;
  fullWidth?: boolean;
}

export function LanguageSelect({
  className,
  onAction,
  fullWidth,
}: LanguageSelectProps) {
  const dispatch = useDispatch();
  const currentLanguage = useAppSelector((state) => state.settings.language);
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = ["en", "ro", "de"];

  return (
    <div className={clsx("relative", fullWidth && "w-full", className)}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center justify-center gap-2 px-4 py-2 rounded-xl w-full",
          "bg-pink-50 dark:bg-gray-800",
          "hover:bg-pink-100 dark:hover:bg-gray-700",
          "transition focus:outline-none focus:ring-2 focus:ring-pink-300",
          "trasition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97]",
        )}
        aria-label="Select language"
      >
        <Globe className="w-5 h-5 text-pink-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Language
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            "absolute left-0 right-0 mt-2",
            "rounded-xl overflow-hidden",
            "bg-white dark:bg-gray-800",
            "border border-pink-100 dark:border-gray-700",
            "shadow-lg z-50",
          )}
        >
          {languages.map((lang) => {
            const isActive = lang === currentLanguage;

            return (
              <button
                key={lang}
                onClick={() => {
                  dispatch(setLanguage(lang));
                  setIsOpen(false);
                  onAction?.();
                }}
                className={clsx(
                  "w-full px-4 py-2 text-left text-sm transition",
                  "hover:bg-pink-50 dark:hover:bg-gray-700",
                  isActive &&
                    "bg-pink-100 dark:bg-gray-700 font-semibold text-pink-600 dark:text-pink-300",
                )}
              >
                {lang.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
