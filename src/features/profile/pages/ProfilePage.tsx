import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type {
  ActivityLevel,
  Sex,
  UpdateProfilePayload,
} from "../../../types/profile";
import { fetchProfile, updateProfile } from "../profileThunks";
import { Activity, Flame, Ruler, Target, User, Dumbbell } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { fetchMacroGoals, updateMacroGoals } from "../../calories/favoritesSlice";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { profile, loading, error } = useAppSelector((s) => s.profile);
  const macroGoals = useAppSelector((s) => s.favorites.macroGoals);
  const [saved, setSaved] = useState(false);
  const [overrides, setOverrides] = useState<Partial<typeof baseForm>>({});
  const [macroProtein, setMacroProtein] = useState("");
  const [macroCarbs, setMacroCarbs] = useState("");
  const [macroFat, setMacroFat] = useState("");

  const baseForm = {
    name: profile?.name ?? "",
    age: profile?.age?.toString() ?? "",
    sex: (profile?.sex ?? "") as Sex | "",
    heightCm: profile?.heightCm?.toString() ?? "",
    weightKg: profile?.weightKg?.toString() ?? "",
    targetWeightKg: profile?.targetWeightKg?.toString() ?? "",
    activityLevel: (profile?.activityLevel ?? "") as ActivityLevel | "",
  };
  const form = { ...baseForm, ...overrides };

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchMacroGoals());
  }, [dispatch]);

  useEffect(() => {
    setMacroProtein(macroGoals.protein != null ? String(macroGoals.protein) : "");
    setMacroCarbs(macroGoals.carbs != null ? String(macroGoals.carbs) : "");
    setMacroFat(macroGoals.fat != null ? String(macroGoals.fat) : "");
  }, [macroGoals]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setOverrides((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async () => {
    const payload: UpdateProfilePayload = {};
    if (form.name) payload.name = form.name;
    if (form.age) payload.age = Number(form.age);
    if (form.sex) payload.sex = form.sex as Sex;
    if (form.heightCm) payload.heightCm = Number(form.heightCm);
    if (form.weightKg) payload.weightKg = Number(form.weightKg);
    if (form.targetWeightKg)
      payload.targetWeightKg = Number(form.targetWeightKg);
    if (form.activityLevel)
      payload.activityLevel = form.activityLevel as ActivityLevel;

    const result = await dispatch(updateProfile(payload));

    if (updateProfile.fulfilled.match(result)) {
      // Save macro goals
      await dispatch(updateMacroGoals({
        ...(macroProtein && { protein: Number(macroProtein) }),
        ...(macroCarbs && { carbs: Number(macroCarbs) }),
        ...(macroFat && { fat: Number(macroFat) }),
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const getGoalLabel = () => {
    if (!profile?.weightKg || !profile?.targetWeightKg) return null;
    const diff = profile.targetWeightKg - profile.weightKg;
    if (diff < -1) return t("profile.goal_lose", { amount: Math.abs(diff).toFixed(1) });
    if (diff > 1) return t("profile.goal_gain", { amount: Math.abs(diff).toFixed(1) });
    return t("profile.goal_maintain");
  };

  const activityKeys: ActivityLevel[] = [
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
  ];

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary";

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div>
        <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted mb-1">
          {t("profile.account_label")}
        </p>
        <h1 className="font-serif text-xl font-light text-primary">
          {t("profile.title")}
        </h1>
      </div>

      {/* Recommended calories card */}
      {profile?.recommendedCalories && (
        <div className="rounded-2xl border border-border-light dark:border-border-dark p-4 flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Flame size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-muted dark:text-text-darkMuted uppercase tracking-wider">
              {t("profile.recommended_intake")}
            </p>
            <p className="text-2xl font-light text-text-primary dark:text-text-darkPrimary">
              {profile.recommendedCalories}
              <span className="text-sm text-text-muted dark:text-text-darkMuted ml-1">
                kcal
              </span>
            </p>
            {getGoalLabel() && (
              <p className="text-xs text-text-muted dark:text-text-darkMuted mt-1">
                {t("profile.goal_label")}: {getGoalLabel()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Personal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <User size={14} className="text-text-muted dark:text-text-darkMuted" />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              {t("profile.section_personal")}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-text-muted dark:text-text-darkMuted">
              {t("profile.name")}
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("profile.name_placeholder")}
              className={`${inputClass} bg-transparent`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                {t("profile.age")}
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder={t("profile.age_placeholder")}
                min={10}
                max={120}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                {t("profile.sex")}
              </label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">{t("profile.sex_select")}</option>
                <option value="female">{t("profile.sex_female")}</option>
                <option value="male">{t("profile.sex_male")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Ruler size={14} className="text-text-muted dark:text-text-darkMuted" />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              {t("profile.section_measurements")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                {t("profile.height")}
              </label>
              <input
                type="number"
                name="heightCm"
                value={form.heightCm}
                onChange={handleChange}
                placeholder={t("profile.height_placeholder")}
                min={100}
                max={250}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                {t("profile.weight")}
              </label>
              <input
                type="number"
                name="weightKg"
                value={form.weightKg}
                onChange={handleChange}
                placeholder={t("profile.weight_placeholder")}
                min={30}
                max={300}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-text-muted dark:text-text-darkMuted" />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              {t("profile.section_goal")}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-text-muted dark:text-text-darkMuted">
              {t("profile.target_weight")}
            </label>
            <input
              type="number"
              name="targetWeightKg"
              value={form.targetWeightKg}
              onChange={handleChange}
              placeholder={t("profile.target_weight_placeholder")}
              min={30}
              max={300}
              className={`${inputClass} bg-transparent`}
            />
          </div>
        </div>

        {/* Macro Goals */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell size={14} className="text-text-muted dark:text-text-darkMuted" />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              {t("profile.section_macros")}
            </p>
          </div>
          <p className="text-xs text-text-muted dark:text-text-darkMuted -mt-1">
            {t("profile.section_macros_desc")}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t("nutrition.macro_protein"), value: macroProtein, set: setMacroProtein },
              { label: t("nutrition.macro_carbs"),   value: macroCarbs,   set: setMacroCarbs },
              { label: t("nutrition.macro_fat"),     value: macroFat,     set: setMacroFat },
            ].map(({ label, value, set }) => (
              <div key={label} className="space-y-1">
                <label className="text-xs text-text-muted dark:text-text-darkMuted">{label} (g)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="—"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-text-muted dark:text-text-darkMuted" />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              {t("profile.section_activity")}
            </p>
          </div>
          <div className="space-y-2">
            {activityKeys.map((value) => (
              <button
                key={value}
                onClick={() =>
                  setOverrides((prev) => ({ ...prev, activityLevel: value }))
                }
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                  form.activityLevel === value
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border-light dark:border-border-dark text-text-primary dark:text-text-darkPrimary"
                }`}
              >
                {t(`profile.activity_${value}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-center text-sm text-danger">{error}</p>}

      {saved && (
        <p className="text-center text-sm text-primary">{t("profile.saved")}</p>
      )}

      <Button fullWidth onClick={handleSubmit} disabled={loading}>
        {loading ? t("profile.saving") : t("profile.save")}
      </Button>
    </div>
  );
}
