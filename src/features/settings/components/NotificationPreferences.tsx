import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setNotificationPref, setNotificationPrefs } from "../settingsSlice";
import type { NotificationPrefs } from "../settingsSlice";
import { notificationsApi } from "../../../api/notificationsApi";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}

function ToggleRow({ label, description, checked, onChange, children }: ToggleRowProps) {
  return (
    <div className="space-y-2">
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
      {checked && children && <div className="pl-2">{children}</div>}
    </div>
  );
}

type MealKey = "breakfast" | "lunch" | "dinner";
const MEALS: MealKey[] = ["breakfast", "lunch", "dinner"];

export function NotificationPreferences() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const prefs = useAppSelector((s) => s.settings.notificationPrefs);

  useEffect(() => {
    notificationsApi.getPrefs().then((serverPrefs) => {
      dispatch(setNotificationPrefs(serverPrefs as NotificationPrefs));
    }).catch(() => {});
  }, []);

  const saveToServer = (updated: Partial<NotificationPrefs>) => {
    const merged = { ...prefs, ...updated };
    notificationsApi.updatePrefs(merged as NotificationPrefs).catch(() => {});
  };

  const handleBoolPref = (key: keyof NotificationPrefs, value: boolean) => {
    dispatch(setNotificationPref({ key, value }));
    saveToServer({ [key]: value });
  };

  const handleMealToggle = (meal: MealKey, enabled: boolean) => {
    const updated: NotificationPrefs = {
      ...prefs,
      mealReminders: {
        breakfast: { enabled: false, time: "08:00" },
        lunch: { enabled: false, time: "13:00" },
        dinner: { enabled: false, time: "19:00" },
        ...(prefs.mealReminders ?? {}),
        [meal]: { ...(prefs.mealReminders?.[meal] ?? {}), enabled },
      },
    };
    dispatch(setNotificationPrefs(updated));
    saveToServer(updated);
  };

  const handleMealTime = (meal: MealKey, time: string) => {
    const updated: NotificationPrefs = {
      ...prefs,
      mealReminders: {
        breakfast: { enabled: false, time: "08:00" },
        lunch: { enabled: false, time: "13:00" },
        dinner: { enabled: false, time: "19:00" },
        ...(prefs.mealReminders ?? {}),
        [meal]: { ...(prefs.mealReminders?.[meal] ?? {}), time },
      },
    };
    dispatch(setNotificationPrefs(updated));
    saveToServer(updated);
  };

  const mealLabel: Record<MealKey, string> = {
    breakfast: t("nutrition.breakfast"),
    lunch: t("nutrition.lunch"),
    dinner: t("nutrition.dinner"),
  };

  const defaultTimes: Record<MealKey, string> = {
    breakfast: "08:00",
    lunch: "13:00",
    dinner: "19:00",
  };

  return (
    <div className="space-y-5">
      <ToggleRow
        label={t("settings.notif_exams")}
        description={t("settings.notif_exams_desc")}
        checked={prefs.exams}
        onChange={(v) => handleBoolPref("exams", v)}
      />
      <ToggleRow
        label={t("settings.notif_calories")}
        description={t("settings.notif_calories_desc")}
        checked={prefs.calories}
        onChange={(v) => handleBoolPref("calories", v)}
      />
      <ToggleRow
        label={t("settings.notif_water")}
        description={t("settings.notif_water_desc")}
        checked={prefs.waterReminder ?? false}
        onChange={(v) => handleBoolPref("waterReminder", v)}
      />
      <ToggleRow
        label={t("settings.notif_pacing")}
        description={t("settings.notif_pacing_desc")}
        checked={prefs.caloriesPacing ?? false}
        onChange={(v) => handleBoolPref("caloriesPacing", v)}
      />

      <div className="space-y-3">
        <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
          {t("settings.notif_meal_reminders")}
        </p>
        {MEALS.map((meal) => {
          const cfg = prefs.mealReminders?.[meal];
          const enabled = cfg?.enabled ?? false;
          const time = cfg?.time ?? defaultTimes[meal];
          return (
            <ToggleRow
              key={meal}
              label={mealLabel[meal]}
              description={t("settings.notif_meal_desc", { meal: mealLabel[meal] })}
              checked={enabled}
              onChange={(v) => handleMealToggle(meal, v)}
            >
              <div className="flex items-center gap-2 mt-1">
                <label className="text-xs text-text-muted dark:text-text-darkMuted">
                  {t("settings.notif_meal_time")}
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleMealTime(meal, e.target.value)}
                  className="h-7 px-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-xs text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary"
                />
              </div>
            </ToggleRow>
          );
        })}
      </div>
    </div>
  );
}
