import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Meal, MealType, NewEntry } from "../../../types/calorie";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import EntryItem from "./EntryItem";
import AddEntryModal from "./AddEntryModal";

interface MealCardProps {
  meal: Meal;
  onAddEntry: (mealType: MealType, entry: NewEntry) => void;
  onDeleteEntry: (mealType: MealType, entryId: string) => void;
}

const getMealTotal = (meal: Meal) =>
  meal.entries.reduce((acc, entry) => acc + entry.calories, 0);

export default function MealCard({
  meal,
  onAddEntry,
  onDeleteEntry,
}: MealCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const total = getMealTotal(meal);
  const mealLabel = t(`nutrition.${meal.type}`);

  return (
    <>
      <div className={`rounded-2xl border overflow-hidden transition-colors ${total > 0 ? "bg-soft-light dark:bg-soft-dark border-primary/30 dark:border-primary/40" : "bg-surface-cardLight dark:bg-surface-cardDark border-border-light dark:border-border-dark"}`}>
        {/* Header card - click expand/collapse */}
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
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
              onClick={() => setShowModal(true)}
              className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline transition"
            >
              <Plus size={13} />
              {t("nutrition.add_food")}
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
