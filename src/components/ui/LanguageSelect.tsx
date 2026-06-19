import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setLanguage } from "../../features/settings/settingsSlice";
import type { Language } from "../../types/language";
import { Globe } from "lucide-react";
import { useRef, useState } from "react";
import ToggleButton from "./ToggleButton";
import { useClickOutside } from "../../hooks/useClickOutside";
import clsx from "clsx";

export function LanguageSelect() {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.settings.language);

  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = ["en", "ro", "de"];

  const selectLangRef = useRef(null);
  useClickOutside(selectLangRef, () => setIsOpen(false));

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <ToggleButton
        icon={<Globe className="w-5 h-5 text-primary" />}
        label={`Language: ${currentLanguage.toLocaleUpperCase()}`}
        active={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        fullWidth
        variant="soft"
      />

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={selectLangRef}
          className="absolute left-0 right-0 mt-2 rounded-2xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark shadow-md shadow-black/5 z-50 overflow-hidden"
        >
          {languages.map((lang) => (
            <button
              key={lang}
              role="option"
              onClick={() => {
                dispatch(setLanguage(lang));
                setIsOpen(false);
              }}
              className={clsx(
                "w-full px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark",
                lang === currentLanguage
                  ? "w-full px-4 py-2.5 text-left text-xs font-light text-primary bg-soft-light dark:bg-soft-dark transition-colors"
                  : "w-full px-4 py-2.5 text-left text-xs font-light text-text-secondary dark:text-text-darkSecondary hover:bg-soft-light dark:hover:bg-soft-hoverDark transition-colors",
              )}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
