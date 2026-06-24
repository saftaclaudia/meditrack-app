import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { MealType } from "../../../types/calorie";
import { useEffect, useState } from "react";
import { deleteCaloryEntry, fetchDayLog, updateDailyGoal } from "../caloriesThunks";
import { fetchActivities } from "../activitiesThunks";
import CalorieRing from "./CalorieRing";
import MealCard from "./MealCard";
import { WaterTracker } from "./WaterTracker";
import { ActivityLog } from "./ActivityLog";

interface LogContentProps {
  dailyGoal: number;
  profileIncomplete: boolean;
  onNavigateToProfile: () => void;
}

const ALL_MEALS: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const todayStr = () => new Date().toISOString().split("T")[0];

export function LogContent({ dailyGoal, profileIncomplete, onNavigateToProfile }: LogContentProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { todayLog, loading, error } = useAppSelector((s) => s.calories);
  const activities = useAppSelector((s) => s.activities.items);

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(dailyGoal));

  useEffect(() => {
    const today = todayStr();
    dispatch(fetchDayLog(today));
    dispatch(fetchActivities(today));
  }, [dispatch]);

  useEffect(() => {
    setGoalInput(String(dailyGoal));
  }, [dailyGoal]);

  const totalConsumed =
    todayLog?.meals.reduce(
      (total, meal) => total + meal.entries.reduce((sum, e) => sum + e.calories, 0),
      0,
    ) ?? 0;

  const totalBurned = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);

  const handleDeleteEntry = (meal: MealType, entryId: string) => {
    dispatch(deleteCaloryEntry({ date: todayStr(), meal, entryId }));
  };

  const handleSaveGoal = () => {
    const value = Number(goalInput);
    if (!value || value < 0) return;
    dispatch(updateDailyGoal({ date: todayStr(), dailyGoal: value }));
    setEditingGoal(false);
  };

  const meals = ALL_MEALS.map((type) => {
    const existing = todayLog?.meals.find((m) => m.type === type);
    return existing ?? { _id: type, type, entries: [] };
  });

  return (
    <div className="space-y-8">
      {profileIncomplete && (
        <button
          onClick={onNavigateToProfile}
          className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary transition-colors"
        >
          <div>
            <p className="text-sm text-text-primary dark:text-text-darkPrimary">
              {t("nutrition.get_goal")}
            </p>
            <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
              {t("nutrition.get_goal_desc")}
            </p>
          </div>
          <span className="text-xs text-primary group-hover:underline whitespace-nowrap ml-4">
            {t("nutrition.set_up")}
          </span>
        </button>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-sm text-text-muted dark:text-text-darkMuted">
            {t("nutrition.loading")}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CalorieRing consumed={totalConsumed} goal={dailyGoal} burned={totalBurned} />
          <div className="flex flex-col gap-1">
            {editingGoal ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-24 px-2 py-1 text-center text-sm rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button onClick={handleSaveGoal} className="text-xs text-primary hover:underline">
                  {t("nutrition.save")}
                </button>
                <button onClick={() => setEditingGoal(false)} className="text-xs text-text-muted hover:underline">
                  {t("nutrition.cancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingGoal(true)}
                className="text-xs text-text-muted dark:text-text-darkMuted hover:text-text-primary transition"
              >
                {t("nutrition.daily_goal")}: {dailyGoal} kcal · {t("nutrition.edit")}
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-center text-sm text-danger">{error}</p>}

      <div>
        {meals.map((meal) => (
          <MealCard key={meal._id} meal={meal} onDeleteEntry={handleDeleteEntry} />
        ))}
      </div>

      <WaterTracker />

      <div className="border-t border-border-light dark:border-border-dark" />

      <ActivityLog />
    </div>
  );
}
