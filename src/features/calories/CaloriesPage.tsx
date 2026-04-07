import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { MealType, NewEntry } from "../../types/calorie";
import {
  addCalorieEntry,
  deleteCaloryEntry,
  fetchDayLog,
  updateDailyGoal,
} from "./caloriesThunks";
import CalorieRing from "./components/CalorieRing";
import MealCard from "./components/MealCard";

const ALL_MEALS: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const todayStr = () => new Date().toISOString().split("T")[0];

export default function CaloriesPage() {
  const dispatch = useAppDispatch();
  const { todayLog, loading, error } = useAppSelector((s) => s.calories);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("2000");

  useEffect(() => {
    dispatch(fetchDayLog(todayStr()));
  }, [dispatch]);
  const dailyGoal = todayLog?.dailyGoal ?? 2000;

  const handleStartEditing = () => {
    setGoalInput(String(dailyGoal));
    setEditingGoal(true);
  };

  const totalConsumed =
    todayLog?.meals.reduce(
      (total, meal) =>
        total + meal.entries.reduce((sum, e) => sum + e.calories, 0),
      0,
    ) ?? 0;

  const handleAddEntry = (mealType: MealType, entry: NewEntry) => {
    dispatch(addCalorieEntry({ date: todayStr(), mealType, entry, dailyGoal }));
  };
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
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div>
        <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted mb-1">
          Today
        </p>
        <h1 className="font-serif text-xl font-light text-text-primary dark:text-text-darkPrimary">
          Calorie Log
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-sm text-text-muted dark:text-text-darkMuted">
            Loading...
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CalorieRing consumed={totalConsumed} goal={dailyGoal} />
          <div className="flex items-center gap-2">
            {editingGoal ? (
              <>
                <input
                  type="number"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-24 px-2 py-1 text-center text-sm rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-primary "
                  autoFocus
                />
                <button
                  onClick={handleSaveGoal}
                  className="text-xs text-primary hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={handleStartEditing}
                  className="text-xs text-text-muted hover:underline"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditingGoal(true)}
                className="text-xs text-text-muted dark:text-text-darkMuted hover:text-primary transition"
              >
                Daily goal :{dailyGoal} kcal · Edit
              </button>
            )}
          </div>
        </div>
      )}
      {/* Error */}
      {error && <p className="text-center text-sm text-danger">{error}</p>}
      {/* Meal Card */}
      <div>
        {meals.map((meal) => (
          <MealCard
            key={meal._id}
            meal={meal}
            onAddEntry={handleAddEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        ))}
      </div>
    </div>
  );
}
