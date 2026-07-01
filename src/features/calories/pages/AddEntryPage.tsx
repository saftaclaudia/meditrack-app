import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Search, Lock, Zap, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { MealType, CalorieEntry } from "../../../types/calorie";
import { addCalorieEntry } from "../caloriesThunks";
import { foodDatabase, type FoodItem } from "../data/foodDatabase";
import { loadCustomFoods, saveCustomFood } from "../data/customFoods";
import { fetchFavorites, addFavorite, removeFavorite } from "../favoritesSlice";
import type { FavoriteFood } from "../../../types/favorites";
import { MealTemplatesPanel, SaveAsTemplateButton } from "../components/MealTemplatesPanel";

const VALID_MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const todayStr = () => new Date().toISOString().split("T")[0];

export function AddEntryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { todayLog, history } = useAppSelector((s) => s.calories);
  const { profile } = useAppSelector((s) => s.profile);
  const favorites = useAppSelector((s) => s.favorites.items);

  const mealParam = searchParams.get("meal") as MealType | null;
  const mealType: MealType =
    mealParam && VALID_MEAL_TYPES.includes(mealParam) ? mealParam : "breakfast";

  const dailyGoal = todayLog?.dailyGoal ?? profile?.recommendedCalories ?? 2000;

  const [customFoods, setCustomFoods] = useState<FoodItem[]>(() => loadCustomFoods());

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState<"g" | "buc" | "ml">("g");
  const [calories, setCalories] = useState("");
  const [calsPer, setCalsPer] = useState("");
  const [isAutoCalc, setIsAutoCalc] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const [showMacros, setShowMacros] = useState(false);
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const isFavorite = (foodName: string) =>
    favorites.some((f) => f.name.toLowerCase() === foodName.toLowerCase());

  const toggleFavorite = () => {
    if (!name.trim() || !calories) return;
    const food: FavoriteFood = {
      name: name.trim(),
      calories: Number(calories),
      quantity: Number(quantity),
      unit,
      ...(protein && { protein: Number(protein) }),
      ...(carbs && { carbs: Number(carbs) }),
      ...(fat && { fat: Number(fat) }),
    };
    if (isFavorite(name)) {
      dispatch(removeFavorite(name.trim()));
    } else {
      dispatch(addFavorite(food));
    }
  };

  const handleSelectFavorite = (fav: FavoriteFood) => {
    setSelectedFood(null);
    fillForm(
      fav.name,
      String(fav.calories),
      fav.unit as "g" | "buc" | "ml",
      String(fav.quantity),
      { protein: fav.protein, carbs: fav.carbs, fat: fav.fat }
    );
    setCalsPer("");
  };

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const allFoods = [...customFoods, ...foodDatabase];

  const results = query.trim()
    ? allFoods.filter((f) => normalize(f.name).includes(normalize(query.trim()))).slice(0, 8)
    : [];

  // Recent unique entries from today + history
  const recentEntries: CalorieEntry[] = (() => {
    const seen = new Set<string>();
    const entries: CalorieEntry[] = [];
    const sources = [
      ...(todayLog?.meals ?? []),
      ...(history ?? []).flatMap((log) => log.meals),
    ];
    for (const meal of sources) {
      for (const entry of [...meal.entries].reverse()) {
        const key = entry.name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          entries.push(entry);
        }
        if (entries.length >= 6) break;
      }
      if (entries.length >= 6) break;
    }
    return entries;
  })();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fillForm = (
    foodName: string,
    foodCalories: string,
    foodUnit: "g" | "buc" | "ml",
    foodQuantity: string,
    macros?: { protein?: number; carbs?: number; fat?: number }
  ) => {
    setName(foodName);
    setCalories(foodCalories);
    setUnit(foodUnit);
    setQuantity(foodQuantity);
    setQuery(foodName);
    setShowDropdown(false);
    setIsAutoCalc(true);
    if (macros) {
      setProtein(macros.protein != null ? String(macros.protein) : "");
      setCarbs(macros.carbs != null ? String(macros.carbs) : "");
      setFat(macros.fat != null ? String(macros.fat) : "");
      if (macros.protein != null || macros.carbs != null || macros.fat != null) {
        setShowMacros(true);
      }
    }
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    const qty = food.defaultQty;
    const calc = Math.round((food.caloriesPer * qty) / food.baseQty);
    const macros = food.proteinPer != null
      ? {
          protein: Math.round((food.proteinPer * qty) / food.baseQty),
          carbs: food.carbsPer != null ? Math.round((food.carbsPer * qty) / food.baseQty) : undefined,
          fat: food.fatPer != null ? Math.round((food.fatPer * qty) / food.baseQty) : undefined,
        }
      : undefined;
    fillForm(food.name, String(calc), food.unit, String(qty), macros);
    setCalsPer("");
  };

  const handleSelectRecent = (entry: CalorieEntry) => {
    setSelectedFood(null);
    fillForm(
      entry.name,
      String(entry.calories),
      entry.unit as "g" | "buc" | "ml",
      String(entry.quantity),
      { protein: entry.protein, carbs: entry.carbs, fat: entry.fat }
    );
    setCalsPer("");
  };

  const recalcFromPer = (per: string, qty: string, u: "g" | "buc" | "ml") => {
    const perNum = Number(per);
    const qtyNum = Number(qty);
    if (perNum > 0 && qtyNum > 0) {
      const base = u === "buc" ? 1 : 100;
      setCalories(String(Math.round((perNum * qtyNum) / base)));
      setIsAutoCalc(true);
    }
  };

  const handleQuantityChange = (val: string) => {
    setQuantity(val);
    if (selectedFood) {
      const qty = Number(val);
      if (qty > 0) {
        setCalories(String(Math.round((selectedFood.caloriesPer * qty) / selectedFood.baseQty)));
        if (selectedFood.proteinPer != null)
          setProtein(String(Math.round((selectedFood.proteinPer * qty) / selectedFood.baseQty)));
        if (selectedFood.carbsPer != null)
          setCarbs(String(Math.round((selectedFood.carbsPer * qty) / selectedFood.baseQty)));
        if (selectedFood.fatPer != null)
          setFat(String(Math.round((selectedFood.fatPer * qty) / selectedFood.baseQty)));
      }
    } else if (calsPer) {
      recalcFromPer(calsPer, val, unit);
    }
  };

  const handleUnitChange = (val: "g" | "buc" | "ml") => {
    setUnit(val);
    if (!selectedFood && calsPer) recalcFromPer(calsPer, quantity, val);
  };

  const handleCalsPerChange = (val: string) => {
    setCalsPer(val);
    recalcFromPer(val, quantity, unit);
  };

  const handleCaloriesChange = (val: string) => {
    setCalories(val);
    setCalsPer("");
    setIsAutoCalc(false);
  };

  const handleSubmit = () => {
    if (!name.trim() || !calories) return;

    if (!selectedFood && calsPer) {
      const custom: FoodItem = {
        id: `custom-${name.trim().toLowerCase().replace(/\s+/g, "-")}`,
        name: name.trim(),
        caloriesPer: Number(calsPer),
        baseQty: unit === "buc" ? 1 : 100,
        unit,
        defaultQty: Number(quantity),
      };
      saveCustomFood(custom);
      setCustomFoods(loadCustomFoods());
    }

    dispatch(
      addCalorieEntry({
        date: todayStr(),
        mealType,
        entry: {
          name: name.trim(),
          calories: Number(calories),
          quantity: Number(quantity),
          unit,
          ...(protein && { protein: Number(protein) }),
          ...(carbs && { carbs: Number(carbs) }),
          ...(fat && { fat: Number(fat) }),
        },
        dailyGoal,
      })
    );
    navigate("/calories");
  };

  // Existing entries for current meal (for template save)
  const currentMealEntries = todayLog?.meals.find((m) => m.type === mealType)?.entries ?? [];

  const handleApplyTemplate = (template: import("../../../types/mealTemplate").MealTemplate) => {
    for (const entry of template.entries) {
      dispatch(
        addCalorieEntry({
          date: todayStr(),
          mealType,
          entry: {
            name: entry.name,
            calories: entry.calories,
            quantity: entry.quantity,
            unit: entry.unit as "g" | "buc" | "ml",
            ...(entry.protein != null && { protein: entry.protein }),
            ...(entry.carbs != null && { carbs: entry.carbs }),
            ...(entry.fat != null && { fat: entry.fat }),
          },
          dailyGoal,
        })
      );
    }
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

      <div className="border-t border-border-light dark:border-border-dark" />

      {/* Favorites */}
      {favorites.length > 0 && !name && (
        <div className="space-y-2">
          <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted flex items-center gap-1.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            {t("nutrition.favorites_title")}
          </p>
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav) => (
              <button
                key={fav.name}
                onClick={() => handleSelectFavorite(fav)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300/40 dark:border-amber-400/20 bg-amber-50/50 dark:bg-amber-400/5 text-xs text-text-secondary dark:text-text-darkSecondary hover:border-amber-400 transition"
              >
                <Star size={9} className="text-amber-400 fill-amber-400" />
                <span>{fav.name}</span>
                <span className="text-text-muted dark:text-text-darkMuted">{fav.calories} kcal</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick re-add */}
      {recentEntries.length > 0 && !name && (
        <div className="space-y-2">
          <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            Recent
          </p>
          <div className="flex flex-wrap gap-2">
            {recentEntries.map((entry) => (
              <button
                key={entry._id}
                onClick={() => handleSelectRecent(entry)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-light dark:border-border-dark text-xs text-text-secondary dark:text-text-darkSecondary hover:border-primary hover:text-primary transition"
              >
                <span>{entry.name}</span>
                <span className="text-text-muted dark:text-text-darkMuted">{entry.calories} kcal</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-darkMuted" />
          <input
            type="text"
            placeholder={t("nutrition.search_placeholder")}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
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
                  <div className="text-right">
                    <span className="text-xs text-text-muted dark:text-text-darkMuted block">
                      {food.caloriesPer} kcal/{unitLabel(food.unit)}
                    </span>
                    {food.proteinPer != null && (
                      <span className="text-[10px] text-text-muted dark:text-text-darkMuted">
                        P {food.proteinPer}g · C {food.carbsPer ?? 0}g · F {food.fatPer ?? 0}g
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border-light dark:border-border-dark" />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.food_name")}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t("nutrition.food_name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            {name.trim() && calories && (
              <button
                type="button"
                onClick={toggleFavorite}
                title={isFavorite(name) ? t("nutrition.favorites_remove") : t("nutrition.favorites_add")}
                className="shrink-0 p-2 rounded-xl border border-border-light dark:border-border-dark hover:border-amber-400 transition"
              >
                <Star
                  size={15}
                  className={isFavorite(name) ? "text-amber-400 fill-amber-400" : "text-text-muted dark:text-text-darkMuted"}
                />
              </button>
            )}
          </div>
        </div>

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
              onChange={(e) => handleUnitChange(e.target.value as "g" | "buc" | "ml")}
              className={inputClass}
            >
              <option value="g">g</option>
              <option value="buc">buc</option>
              <option value="ml">ml</option>
            </select>
          </div>
        </div>

        {!selectedFood && (
          <div className="space-y-1.5">
            <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
              {unit === "buc" ? `kcal / ${t("nutrition.per_piece")}` : `kcal / 100${unit}`}
            </label>
            <input
              type="number"
              min="0"
              placeholder="ex. 52"
              value={calsPer}
              onChange={(e) => handleCalsPerChange(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

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

        {/* Macros — collapsible */}
        <button
          type="button"
          onClick={() => setShowMacros((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-text-muted dark:text-text-darkMuted hover:text-primary transition"
        >
          {showMacros ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          Macros (optional)
        </button>

        {showMacros && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Protein (g)", value: protein, set: setProtein },
              { label: "Carbs (g)", value: carbs, set: setCarbs },
              { label: "Fat (g)", value: fat, set: setFat },
            ].map(({ label, value, set }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
                  {label}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meal templates */}
      <MealTemplatesPanel onApply={handleApplyTemplate} />

      {currentMealEntries.length > 0 && (
        <SaveAsTemplateButton entries={currentMealEntries} />
      )}

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
