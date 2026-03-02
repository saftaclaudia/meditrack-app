import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setLanguage } from "../../features/settings/settingsSlice";
import type { Language } from "../../types/language";
import { Globe } from "lucide-react";
import { useState } from "react";
import ToggleButton from "./ToggleButton";

export function LanguageSelect() {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.settings.language);

  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = ["en", "ro", "de"];

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
        <div className="absolute left-0 right-0 mt-2  bg-surface-cardLight dark:bg-surface-cardDark rounded-xl  border border-border-light dark:border-border-dark  shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang}
              role="option"
              onClick={() => {
                dispatch(setLanguage(lang));
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark ${lang === currentLanguage ? "font-semibold text-primary" : ""}`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
