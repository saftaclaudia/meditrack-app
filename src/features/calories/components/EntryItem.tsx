import { Trash2 } from "lucide-react";
import type { CalorieEntry } from "../../../types/calorie";

interface EntryItemProps {
  entry: CalorieEntry;
  onDelete: (entryId: string) => void;
}

export default function EntryItem({ entry, onDelete }: EntryItemProps) {
  const hasMacros = entry.protein != null || entry.carbs != null || entry.fat != null;

  return (
    <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark last:border-0">
      <div>
        <p className="text-sm font-light text-text-primary dark:text-text-darkPrimary">
          {entry.name}
        </p>
        <p className="text-[11px] text-text-muted dark:text-text-darkMuted">
          {entry.quantity}{entry.unit}
        </p>
        {hasMacros && (
          <p className="text-[10px] text-text-muted dark:text-text-darkMuted mt-0.5 flex gap-2">
            {entry.protein != null && <span>P {entry.protein}g</span>}
            {entry.carbs != null && <span>C {entry.carbs}g</span>}
            {entry.fat != null && <span>F {entry.fat}g</span>}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-light text-text-secondary dark:text-text-darkSecondary">
          {entry.calories} kcal
        </span>
        <button
          onClick={() => onDelete(entry._id)}
          className="p-1 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
