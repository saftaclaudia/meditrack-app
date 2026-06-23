import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Meal, MealType } from "../../../types/calorie";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import EntryItem from "./EntryItem";

interface MealCardProps {
  meal: Meal;
  onDeleteEntry: (mealType: MealType, entryId: string) => void;
}

const getMealTotal = (meal: Meal) =>
  meal.entries.reduce((acc, e) => acc + e.calories, 0);

export default function MealCard({ meal, onDeleteEntry }: MealCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const total = getMealTotal(meal);
  const mealLabel = t(`nutrition.${meal.type}`);

  const macroTotals = meal.entries.reduce(
    (acc, e) => ({
      protein: acc.protein + (e.protein ?? 0),
      carbs: acc.carbs + (e.carbs ?? 0),
      fat: acc.fat + (e.fat ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );
  const hasMacros = meal.entries.some(
    (e) => e.protein != null || e.carbs != null || e.fat != null
  );

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-colors mb-3 ${
        total > 0
          ? "bg-soft-light dark:bg-soft-dark border-primary/30 dark:border-primary/40"
          : "bg-surface-cardLight dark:bg-surface-cardDark border-border-light dark:border-border-dark"
      }`}
    >
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            {mealLabel}
          </span>
          {total > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {total} kcal
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasMacros && total > 0 && (
            <span className="text-[10px] text-text-muted dark:text-text-darkMuted hidden sm:block">
              P {Math.round(macroTotals.protein)}g · C {Math.round(macroTotals.carbs)}g · F {Math.round(macroTotals.fat)}g
            </span>
          )}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-1">
          {meal.entries.length === 0 ? (
            <p className="text-xs text-text-muted dark:text-text-darkMuted py-2 text-center">
              {t("nutrition.no_entries")}
            </p>
          ) : (
            meal.entries.map((entry) => (
              <EntryItem
                key={entry._id}
                entry={entry}
                onDelete={(entryId) => onDeleteEntry(meal.type, entryId)}
              />
            ))
          )}

          <button
            onClick={() => navigate(`/calories/add?meal=${meal.type}`)}
            className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline transition"
          >
            <Plus size={13} />
            {t("nutrition.add_food")}
          </button>
        </div>
      )}
    </div>
  );
}
