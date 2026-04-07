import { useState } from "react";
import type { Meal, MealType, NewEntry } from "../../../types/calorie";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import EntryItem from "./EntryItem";
import AddEntryModal from "./AddEntryModal";

interface MealCardProps {
  meal: Meal;
  onAddEntry: (mealType: MealType, entry: NewEntry) => void;
  onDeleteEntry: (mealType: MealType, entryId: string) => void;
}
const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const getMealTotal = (meal: Meal) =>
  meal.entries.reduce((acc, entry) => acc + entry.calories, 0);
export default function MealCard({
  meal,
  onAddEntry,
  onDeleteEntry,
}: MealCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const total = getMealTotal(meal);
  return (
    <>
      <div className="rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark overflow-hidden">
        {/* Header card - click expand/collapse */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
              {MEAL_LABELS[meal.type]}
            </span>
            {total > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {total} kcal
              </span>
            )}
          </div>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-1">
            {meal.entries.length === 0 ? (
              <p className="text-xs text-text-muted dark:text-text-darkMuted py-2 text-center">
                No entries yet
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
              onClick={() => setShowModal(true)}
              className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline transition"
            >
              <Plus size={13} />
              Add food
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <AddEntryModal
          mealType={meal.type}
          onAdd={(entry) => onAddEntry(meal.type, entry)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
