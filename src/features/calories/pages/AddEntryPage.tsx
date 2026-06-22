import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Search, Lock, Zap } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { MealType } from "../../../types/calorie";
import { addCalorieEntry } from "../caloriesThunks";
import { foodDatabase, type FoodItem } from "../data/foodDatabase";

const VALID_MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const todayStr = () => new Date().toISOString().split("T")[0];

export function AddEntryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { todayLog } = useAppSelector((s) => s.calories);
  const { profile } = useAppSelector((s) => s.profile);

  const mealParam = searchParams.get("meal") as MealType | null;
  const mealType: MealType =
    mealParam && VALID_MEAL_TYPES.includes(mealParam) ? mealParam : "breakfast";

  const dailyGoal =
    todayLog?.dailyGoal ?? profile?.recommendedCalories ?? 2000;

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState<"g" | "buc" | "ml">("g");
  const [calories, setCalories] = useState("");
  const [isAutoCalc, setIsAutoCalc] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? foodDatabase
        .filter((f) =>
          f.name.toLowerCase().includes(query.trim().toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setName(food.name);
    setUnit(food.unit);
    const qty = food.defaultQty;
    setQuantity(String(qty));
    const calc = Math.round((food.caloriesPer * qty) / food.baseQty);
    setCalories(String(calc));
    setIsAutoCalc(true);
    setQuery(food.name);
    setShowDropdown(false);
  };

  const handleQuantityChange = (val: string) => {
    setQuantity(val);
    if (isAutoCalc && selectedFood) {
      const qty = Number(val);
      if (qty > 0) {
        const calc = Math.round(
          (selectedFood.caloriesPer * qty) / selectedFood.baseQty
        );
        setCalories(String(calc));
      }
    }
  };

  const handleCaloriesChange = (val: string) => {
    setCalories(val);
    setIsAutoCalc(false);
  };

  const handleSubmit = () => {
    if (!name.trim() || !calories) return;
    dispatch(
      addCalorieEntry({
        date: todayStr(),
        mealType,
        entry: {
          name: name.trim(),
          calories: Number(calories),
          quantity: Number(quantity),
          unit,
        },
        dailyGoal,
      })
    );
    navigate("/calories");
  };

  const mealLabel = t(`nutrition.${mealType}`);

  const unitLabel = (u: "g" | "buc" | "ml") => {
    if (u === "g") return t("nutrition.per_100g");
    if (u === "buc") return t("nutrition.per_piece");
    return t("nutrition.per_100ml");
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl text-sm font-light bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary transition";

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/calories")}
          className="p-1.5 rounded-full hover:bg-surface-cardLight dark:hover:bg-surface-cardDark transition text-text-muted dark:text-text-darkMuted"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.back")}
          </p>
          <h1 className="font-serif text-xl font-light text-primary">
            {t("nutrition.add_entry_title", { meal: mealLabel })}
          </h1>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-light dark:border-border-dark" />

      {/* Search */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-darkMuted"
          />
          <input
            type="text"
            placeholder={t("nutrition.search_placeholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className={`${inputClass} pl-9`}
          />
        </div>

        {showDropdown && query.trim().length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shadow-lg overflow-hidden">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-text-muted dark:text-text-darkMuted">
                {t("nutrition.no_results")}
              </p>
            ) : (
              results.map((food) => (
                <button
                  key={food.id}
                  onMouseDown={() => handleSelectFood(food)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-surface-cardLight dark:hover:bg-surface-cardDark transition"
                >
                  <span className="text-sm text-text-primary dark:text-text-darkPrimary">
                    {food.name}
                  </span>
                  <span className="text-xs text-text-muted dark:text-text-darkMuted">
                    {food.caloriesPer} kcal/{unitLabel(food.unit)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border-light dark:border-border-dark" />

      {/* Form */}
      <div className="space-y-4">
        {/* Food name */}
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.food_name")}
          </label>
          <input
            type="text"
            placeholder={t("nutrition.food_name_placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Quantity + Unit */}
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.quantity")}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className={`${inputClass} w-28`}
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "g" | "buc" | "ml")}
              className={inputClass}
            >
              <option value="g">g</option>
              <option value="buc">buc</option>
              <option value="ml">ml</option>
            </select>
          </div>
        </div>

        {/* Calories */}
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.calories_kcal")}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={calories}
              onChange={(e) => handleCaloriesChange(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            {isAutoCalc ? (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs bg-primary/10 text-primary whitespace-nowrap">
                <Zap size={11} />
                {t("nutrition.calories_auto")}
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs bg-surface-cardLight dark:bg-surface-cardDark text-text-muted dark:text-text-darkMuted whitespace-nowrap">
                <Lock size={11} />
                manual
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !calories}
        className="w-full py-3 rounded-2xl bg-primary text-white text-sm font-light tracking-wider disabled:opacity-40 hover:opacity-90 transition"
      >
        {t("nutrition.add_entry_btn", { meal: mealLabel })}
      </button>
    </div>
  );
}
