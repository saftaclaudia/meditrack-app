import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setNotificationPref } from "../settingsSlice";
import type { NotificationPrefs } from "../settingsSlice";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm text-text-primary dark:text-text-darkPrimary">{label}</p>
        <p className="text-xs text-text-muted dark:text-text-darkMuted leading-snug">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-primary" : "bg-border-light dark:bg-border-dark"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function NotificationPreferences() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const prefs = useAppSelector((s) => s.settings.notificationPrefs);

  const handleChange = (key: keyof NotificationPrefs, value: boolean) => {
    dispatch(setNotificationPref({ key, value }));
  };

  return (
    <div className="space-y-4">
      <ToggleRow
        label={t("settings.notif_exams")}
        description={t("settings.notif_exams_desc")}
        checked={prefs.exams}
        onChange={(v) => handleChange("exams", v)}
      />
      <ToggleRow
        label={t("settings.notif_calories")}
        description={t("settings.notif_calories_desc")}
        checked={prefs.calories}
        onChange={(v) => handleChange("calories", v)}
      />
    </div>
  );
}
