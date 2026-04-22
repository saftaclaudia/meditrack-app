import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type {
  ActivityLevel,
  Sex,
  UpdateProfilePayload,
} from "../../../types/profile";
import { fetchProfile, updateProfile } from "../profileThunks";

import { Activity, Flame, Ruler, Target, User } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (office, no sport)",
  light: "Light (1-3 days/week)",
  moderate: "Moderate (3-5 days/week)",
  active: "Active (6-7 days/week)",
  very_active: "Very active (physical job + sport)",
};

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((s) => s.profile);
  const [saved, setSaved] = useState(false);
  const [overrides, setOverrides] = useState<Partial<typeof baseForm>>({});

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
  }, [dispatch]);

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
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const getGoalLabel = () => {
    if (!profile?.weightKg || !profile?.targetWeightKg) return null;
    const diff = profile.targetWeightKg - profile.weightKg;
    if (diff < -1) return `Lose ${Math.abs(diff).toFixed(1)} kg`;
    if (diff > 1) return `Gain ${Math.abs(diff).toFixed(1)}kg`;
    return "Maintain weight";
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div>
        <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted mb-1">
          Account
        </p>
        <h1 className="font-serif text-xl font-light text-text-primary dark:text-text-darkPrimary">
          Health Profile
        </h1>
      </div>

      {/* Card calories */}
      {profile?.recommendedCalories && (
        <div className="rounded-2xl border border-border-light dark:border-border-dark p-4 flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Flame size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-muted dark:text-text-darkMuted uppercase tracking-wider">
              Recommended daily intake
            </p>
            <p className="text-2xl font-light text-text-primary dark:text-text-darkPrimary">
              {profile.recommendedCalories}
              <span className="text-sm text-text-muted dark:text-text-darkMuted">
                Kcal
              </span>
            </p>
            {getGoalLabel() && (
              <p className="text-xs text-text-muted dark:text-text-darkMuted mt-1">
                Goal: {getGoalLabel()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Form  */}
      <div className="space-y-6">
        {/* Personal data */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <User
              size={14}
              className="text-text-muted dark:text-text-darkMuted"
            />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              Personal
            </p>
          </div>
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs text-text-muted dark:text-text-darkMuted">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary"
            />
          </div>

          {/* Age +Sex */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                Age
              </label>
              <input
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g 28"
                min={10}
                max={120}
                className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark  bg-surface-light dark:bg-surface-dark text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                Sex
              </label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary"
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Ruler
              size={14}
              className="text-text-muted dark:text-text-darkMuted"
            />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              Measurements
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                Height (cm)
              </label>
              <input
                type="number"
                name="heightCm"
                value={form.heightCm}
                onChange={handleChange}
                placeholder="e.g. 168"
                min={100}
                max={250}
                className="w-full px-4 py-2.5 rounded-xl border  border-border-light dark:border-border-dark  bg-surface-light dark:bg-surface-dark text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                Current weight (kg)
              </label>
              <input
                type="number"
                name="weightKg"
                value={form.weightKg}
                onChange={handleChange}
                placeholder="e.g. 65"
                min={30}
                max={300}
                className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark  bg-surface-light dark:bg-surface-dark text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Goal Target weight */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Target
              size={14}
              className="text-text-muted dark:text-text-darkMuted"
            />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              Goal
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-text-muted dark:text-text-darkMuted">
              Target weight
            </label>
            <input
              type="number"
              name="targetWeightKg"
              value={form.targetWeightKg}
              onChange={handleChange}
              placeholder="e.g. 58"
              min={30}
              max={300}
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Activity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity
              size={14}
              className="text-text-muted dark:text-text-darkMuted"
            />
            <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              Activity level{" "}
            </p>
          </div>

          <div className="space-y-2">
            {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(
              ([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setOverrides((prev) => ({ ...prev, activityLevel: value }));
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${form.activityLevel === value ? "border-primary text-primary bg-primary/5" : "border-border-light dark:border-border-dark text-text-primary dark:text-text-darkPrimary"}`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
      {/* Error */}
      {error && <p className="text-center text-sm text-danger">{error}</p>}

      {/* Succes */}
      {saved && (
        <p className="text-center text-sm text-primary">
          Profile saved! Daily goal updated
        </p>
      )}

      {/* Save button */}
      <Button fullWidth onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
