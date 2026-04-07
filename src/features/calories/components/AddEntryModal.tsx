import { useState } from "react";
import type { MealType, NewEntry } from "../../../types/calorie";
import { X } from "lucide-react";

import { Button } from "../../../components/ui/Button";

interface AddEtryModalProps {
  mealType: MealType;
  onAdd: (entry: NewEntry) => void;
  onClose: () => void;
}

const EMPTY_FORM = { name: "", calories: "", quantity: "1", unit: "buc" };
export default function AddEntryModal({
  mealType,
  onAdd,
  onClose,
}: AddEtryModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  const mealLabels: Record<MealType, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
  };

  const handleSumbit = () => {
    if (!form.name.trim() || !form.calories) return;
    onAdd({
      name: form.name.trim(),
      calories: Number(form.calories),
      quantity: Number(form.quantity),
      unit: form.unit,
    });
    setForm(EMPTY_FORM);
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2 rounded-xl text-sm font-light bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary transition";
  return (
    <div
      className="fixed inset-0 z-50 items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-light text-text-primary dark:text-text-darkPrimary">
            Add to {mealLabels[mealType]}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-cardLight dark:hover:bg-surface-cardDark transition"
          >
            <X size={16} />
          </button>
        </div>
        {/* Form */}
        <div className="space-y-3">
          <input
            placeholder="Food name (e.g. Boiled egg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Calories (Kcal)"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            className={inputClass}
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Qty"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className={`${inputClass} w-24`}
            />
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className={inputClass}
            >
              <option value="buc">buc</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="portion">portion</option>
              <option value="cup">cup</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <Button variant="danger" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="edit" onClick={handleSumbit}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
