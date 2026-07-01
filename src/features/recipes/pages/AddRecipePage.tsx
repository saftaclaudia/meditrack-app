import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Search, Plus, Trash2, Zap } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createRecipe, updateRecipe } from "../recipesThunks";
import { foodDatabase } from "../../calories/data/foodDatabase";
import type { FoodItem } from "../../calories/data/foodDatabase";
import { loadCustomFoods } from "../../calories/data/customFoods";
import type { RecipeIngredient } from "../../../types/recipe";

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

type IngredientDraft = RecipeIngredient & { _key: string };

const emptyDraft = (): IngredientDraft => ({
  _key: crypto.randomUUID(),
  name: "",
  quantity: 100,
  unit: "g",
  caloriesPer: 0,
  baseQty: 100,
  calories: 0,
});

export function AddRecipePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const { recipes } = useAppSelector((s) => s.recipes);
  const existing = isEdit ? recipes.find((r) => r._id === id) : undefined;

  const [recipeName, setRecipeName] = useState(existing?.name ?? "");
  const [portions, setPortions] = useState(String(existing?.portions ?? 4));
  const [ingredients, setIngredients] = useState<IngredientDraft[]>(
    existing?.ingredients.map((ing) => ({ ...ing, _key: crypto.randomUUID() })) ?? []
  );

  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [draft, setDraft] = useState<IngredientDraft>(emptyDraft());
  const [calsPer, setCalsPer] = useState("");
  const [isAutoCalc, setIsAutoCalc] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const customFoods = loadCustomFoods();
  const allFoods = [...customFoods, ...foodDatabase];

  const results = query.trim()
    ? allFoods.filter((f) => normalize(f.name).includes(normalize(query.trim()))).slice(0, 8)
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

  const recalc = (per: number, qty: number, base: number) =>
    per > 0 && qty > 0 ? Math.round((per * qty) / base) : 0;

  const handleSelectFood = (food: FoodItem) => {
    const calories = recalc(food.caloriesPer, food.defaultQty, food.baseQty);
    setDraft({
      ...draft,
      name: food.name,
      quantity: food.defaultQty,
      unit: food.unit,
      caloriesPer: food.caloriesPer,
      baseQty: food.baseQty,
      calories,
    });
    setCalsPer(String(food.caloriesPer));
    setIsAutoCalc(true);
    setQuery(food.name);
    setShowDropdown(false);
  };

  const handleDraftQtyChange = (val: string) => {
    const qty = Number(val);
    const calories = isAutoCalc ? recalc(draft.caloriesPer, qty, draft.baseQty) : draft.calories;
    setDraft({ ...draft, quantity: qty, calories });
  };

  const handleDraftUnitChange = (val: "g" | "ml" | "buc") => {
    const base = val === "buc" ? 1 : 100;
    const per = Number(calsPer);
    const calories = per > 0 ? recalc(per, draft.quantity, base) : draft.calories;
    setDraft({ ...draft, unit: val, baseQty: base, calories });
  };

  const handleCalsPerChange = (val: string) => {
    setCalsPer(val);
    const per = Number(val);
    const base = draft.unit === "buc" ? 1 : 100;
    const calories = recalc(per, draft.quantity, base);
    setDraft({ ...draft, caloriesPer: per, baseQty: base, calories });
    setIsAutoCalc(true);
  };

  const handleAddIngredient = () => {
    if (!draft.name.trim() || draft.calories <= 0) return;
    setIngredients((prev) => [...prev, { ...draft, _key: crypto.randomUUID() }]);
    setDraft(emptyDraft());
    setCalsPer("");
    setQuery("");
    setIsAutoCalc(false);
    setShowForm(false);
  };

  const handleRemoveIngredient = (key: string) => {
    setIngredients((prev) => prev.filter((i) => i._key !== key));
  };

  const totalCalories = ingredients.reduce((sum, i) => sum + i.calories, 0);
  const caloriesPerPortion = portions
    ? Math.round(totalCalories / Math.max(1, Number(portions)))
    : 0;

  const handleSubmit = async () => {
    if (!recipeName.trim() || ingredients.length === 0 || !portions) return;
    const payload = {
      name: recipeName.trim(),
      portions: Number(portions),
      ingredients: ingredients.map(({ _key, ...rest }) => rest),
    };
    if (isEdit && id) {
      await dispatch(updateRecipe({ id, recipe: payload }));
    } else {
      await dispatch(createRecipe(payload));
    }
    navigate("/calories?tab=recipes");
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl text-sm font-light bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary transition";

  const unitLabel = (u: "g" | "ml" | "buc") =>
    u === "buc" ? t("nutrition.per_piece") : `100${u}`;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/calories?tab=recipes")}
          className="p-1.5 rounded-full hover:bg-surface-cardLight dark:hover:bg-surface-cardDark transition text-text-muted dark:text-text-darkMuted"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-serif text-xl font-light text-primary">
          {isEdit ? t("recipes.edit_recipe") : t("recipes.new_recipe")}
        </h1>
      </div>

      <div className="border-t border-border-light dark:border-border-dark" />

      {/* Recipe name + portions */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("recipes.recipe_name")}
          </label>
          <input
            type="text"
            placeholder={t("recipes.recipe_name_placeholder")}
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("recipes.portions")}
          </label>
          <input
            type="number"
            min="1"
            value={portions}
            onChange={(e) => setPortions(e.target.value)}
            className={`${inputClass} w-28`}
          />
        </div>
      </div>

      <div className="border-t border-border-light dark:border-border-dark" />

      {/* Ingredients */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("recipes.ingredients")}
          </label>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Plus size={12} />
              {t("recipes.add_ingredient")}
            </button>
          )}
        </div>

        {/* Ingredient list */}
        {ingredients.length > 0 && (
          <div className="space-y-2">
            {ingredients.map((ing) => (
              <div
                key={ing._key}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark"
              >
                <div>
                  <p className="text-sm text-text-primary dark:text-text-darkPrimary">
                    {ing.name}
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-darkMuted">
                    {ing.quantity}{ing.unit} · {ing.calories} kcal
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveIngredient(ing._key)}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-muted dark:text-text-darkMuted transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Ingredient form */}
        {showForm && (
          <div className="rounded-2xl border border-primary/30 p-4 space-y-3 bg-soft-light dark:bg-soft-dark">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-darkMuted" />
                <input
                  type="text"
                  placeholder={t("nutrition.search_placeholder")}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className={`${inputClass} pl-8`}
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

            {/* Name */}
            <input
              type="text"
              placeholder={t("nutrition.food_name_placeholder")}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className={inputClass}
            />

            {/* Qty + Unit */}
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={draft.quantity}
                onChange={(e) => handleDraftQtyChange(e.target.value)}
                className={`${inputClass} w-24`}
              />
              <select
                value={draft.unit}
                onChange={(e) => handleDraftUnitChange(e.target.value as "g" | "ml" | "buc")}
                className={inputClass}
              >
                <option value="g">g</option>
                <option value="buc">buc</option>
                <option value="ml">ml</option>
              </select>
            </div>

            {/* kcal/base — manual only */}
            <div className="space-y-1">
              <label className="text-xs text-text-muted dark:text-text-darkMuted">
                {draft.unit === "buc" ? `kcal / ${t("nutrition.per_piece")}` : `kcal / 100${draft.unit}`}
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

            {/* Calories preview */}
            {draft.calories > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-primary dark:text-text-darkPrimary">
                  {draft.calories} kcal
                </span>
                {isAutoCalc && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                    <Zap size={10} />
                    {t("nutrition.calories_auto")}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setShowForm(false); setDraft(emptyDraft()); setCalsPer(""); setQuery(""); setIsAutoCalc(false); }}
                className="flex-1 py-2 rounded-xl text-xs border border-border-light dark:border-border-dark text-text-muted hover:text-text-primary transition"
              >
                {t("recipes.cancel")}
              </button>
              <button
                onClick={handleAddIngredient}
                disabled={!draft.name.trim() || draft.calories <= 0}
                className="flex-1 py-2 rounded-xl text-xs bg-primary text-white hover:opacity-90 disabled:opacity-40 transition"
              >
                {t("recipes.add_ingredient")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Totals summary */}
      {ingredients.length > 0 && (
        <>
          <div className="border-t border-border-light dark:border-border-dark" />
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
                {t("recipes.total_calories")}
              </p>
              <p className="text-text-primary dark:text-text-darkPrimary">
                {totalCalories} kcal
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
                {t("recipes.per_portion")}
              </p>
              <p className="text-primary font-light">
                {caloriesPerPortion} kcal
              </p>
            </div>
          </div>
        </>
      )}

      {/* Save */}
      <button
        onClick={handleSubmit}
        disabled={!recipeName.trim() || ingredients.length === 0 || !portions}
        className="w-full py-3 rounded-2xl bg-primary text-white text-sm font-light tracking-wider disabled:opacity-40 hover:opacity-90 transition"
      >
        {t("recipes.save_recipe")}
      </button>
    </div>
  );
}
