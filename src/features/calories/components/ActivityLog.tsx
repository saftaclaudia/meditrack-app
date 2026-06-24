import { useState } from "react";
import { Flame, Timer, Trash2, Plus, Dumbbell, Heart, Trophy, Home, Pencil, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { deleteActivity, updateActivity } from "../activitiesThunks";
import type { Activity, ActivityCategory } from "../../../types/activity";

const categoryIcon = (cat: ActivityCategory) => {
  if (cat === "cardio") return <Heart size={12} />;
  if (cat === "strength") return <Dumbbell size={12} />;
  if (cat === "sport") return <Trophy size={12} />;
  return <Home size={12} />;
};

interface EditState {
  name: string;
  duration: string;
  caloriesBurned: string;
}

function ActivityRow({ activity }: { activity: Activity }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditState>({
    name: activity.name,
    duration: String(activity.duration),
    caloriesBurned: String(activity.caloriesBurned),
  });

  const categoryLabel = (cat: ActivityCategory) => {
    if (cat === "cardio") return t("nutrition.cat_cardio");
    if (cat === "strength") return t("nutrition.cat_strength");
    if (cat === "sport") return t("nutrition.cat_sport");
    return t("nutrition.cat_daily");
  };

  const handleSave = () => {
    const duration = Number(form.duration);
    const caloriesBurned = Number(form.caloriesBurned);
    if (!form.name.trim() || duration <= 0 || caloriesBurned < 0) return;
    dispatch(updateActivity({
      id: activity._id,
      payload: { name: form.name.trim(), duration, caloriesBurned },
    }));
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ name: activity.name, duration: String(activity.duration), caloriesBurned: String(activity.caloriesBurned) });
    setEditing(false);
  };

  const inputClass = "h-7 px-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-xs text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary";

  if (editing) {
    return (
      <div className="px-4 py-3 rounded-xl border border-primary/40 bg-primary/5 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-danger/10 text-danger shrink-0">
            {categoryIcon(activity.category)}
          </div>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={`${inputClass} flex-1`}
            autoFocus
          />
        </div>
        <div className="flex items-center gap-2 pl-10">
          <div className="flex items-center gap-1">
            <Timer size={10} className="text-text-muted dark:text-text-darkMuted" />
            <input
              type="number"
              min="1"
              value={form.duration}
              onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              className={`${inputClass} w-16`}
            />
            <span className="text-[10px] text-text-muted dark:text-text-darkMuted">min</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={10} className="text-danger" />
            <input
              type="number"
              min="0"
              value={form.caloriesBurned}
              onChange={(e) => setForm((p) => ({ ...p, caloriesBurned: e.target.value }))}
              className={`${inputClass} w-16`}
            />
            <span className="text-[10px] text-text-muted dark:text-text-darkMuted">kcal</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition"
            >
              <Check size={12} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-muted hover:text-danger transition"
            >
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="pl-10">
          <p className="text-[10px] text-text-muted dark:text-text-darkMuted">
            {categoryLabel(activity.category)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between px-4 py-3 rounded-xl border border-border-light dark:border-border-dark">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-danger/10 text-danger">
          {categoryIcon(activity.category)}
        </div>
        <div>
          <p className="text-sm text-text-primary dark:text-text-darkPrimary">{activity.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-[10px] text-text-muted dark:text-text-darkMuted">
              <Timer size={9} />
              {activity.duration} min
            </span>
            <span className="text-[10px] text-text-muted dark:text-text-darkMuted">·</span>
            <span className="text-[10px] text-text-muted dark:text-text-darkMuted">
              {categoryLabel(activity.category)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-light text-danger">−{activity.caloriesBurned} kcal</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-text-muted hover:text-primary transition"
            title={t("nutrition.activity_edit")}
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => dispatch(deleteActivity(activity._id))}
            className="p-1 text-text-muted hover:text-danger transition"
            title={t("nutrition.activity_delete")}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActivityLog() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const activities = useAppSelector((s) => s.activities.items);

  const totalBurned = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={15} className={totalBurned > 0 ? "text-danger" : "text-text-muted dark:text-text-darkMuted"} />
          <div>
            <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
              {t("nutrition.activity_title")}
            </span>
            {totalBurned > 0 && (
              <p className="text-[10px] text-danger">
                {t("nutrition.activity_burned_today", { count: totalBurned })}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate("/calories/activity/add")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-light dark:border-border-dark text-xs text-text-muted dark:text-text-darkMuted hover:border-primary hover:text-primary transition"
        >
          <Plus size={12} />
          {t("nutrition.activity_add")}
        </button>
      </div>

      {activities.length === 0 ? (
        <button
          onClick={() => navigate("/calories/activity/add")}
          className="w-full py-6 rounded-2xl border border-dashed border-border-light dark:border-border-dark text-text-muted dark:text-text-darkMuted text-sm font-light hover:border-primary hover:text-primary transition"
        >
          {t("nutrition.activity_add_cta")}
        </button>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <ActivityRow key={activity._id} activity={activity} />
          ))}

          {activities.length > 1 && (
            <div className="flex justify-end px-1">
              <span className="text-xs text-danger font-light">
                {t("nutrition.activity_total", { count: totalBurned })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
