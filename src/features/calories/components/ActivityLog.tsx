import { Flame, Timer, Trash2, Plus, Dumbbell, Heart, Trophy, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { deleteActivity } from "../activitiesThunks";
import type { ActivityCategory } from "../../../types/activity";

const categoryIcon = (cat: ActivityCategory) => {
  if (cat === "cardio") return <Heart size={12} />;
  if (cat === "strength") return <Dumbbell size={12} />;
  if (cat === "sport") return <Trophy size={12} />;
  return <Home size={12} />;
};

export function ActivityLog() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const activities = useAppSelector((s) => s.activities.items);

  const totalBurned = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);

  const categoryLabel = (cat: ActivityCategory) => {
    if (cat === "cardio") return t("nutrition.cat_cardio");
    if (cat === "strength") return t("nutrition.cat_strength");
    if (cat === "sport") return t("nutrition.cat_sport");
    return t("nutrition.cat_daily");
  };

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
            <div
              key={activity._id}
              className="group flex items-center justify-between px-4 py-3 rounded-xl border border-border-light dark:border-border-dark"
            >
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
              <div className="flex items-center gap-3">
                <span className="text-sm font-light text-danger">−{activity.caloriesBurned} kcal</span>
                <button
                  onClick={() => dispatch(deleteActivity(activity._id))}
                  className="opacity-0 group-hover:opacity-100 transition text-text-muted hover:text-danger"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
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
