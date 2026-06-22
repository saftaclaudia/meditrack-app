import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, UtensilsCrossed } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchRecipes, deleteRecipe } from "../recipesThunks";
import { addCalorieEntry } from "../../calories/caloriesThunks";
import type { Recipe } from "../../../types/recipe";
import type { MealType } from "../../../types/calorie";

const todayStr = () => new Date().toISOString().split("T")[0];

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export function RecipesPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { recipes, loading } = useAppSelector((s) => s.recipes);
  const { todayLog } = useAppSelector((s) => s.calories);
  const { profile } = useAppSelector((s) => s.profile);

  const dailyGoal = todayLog?.dailyGoal ?? profile?.recommendedCalories ?? 2000;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("breakfast");
  const [portions, setPortions] = useState("1");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const handleAddToLog = (recipe: Recipe) => {
    const qty = Math.max(1, Number(portions));
    dispatch(
      addCalorieEntry({
        date: todayStr(),
        mealType: selectedMeal,
        entry: {
          name: recipe.name,
          calories: Math.round(recipe.caloriesPerPortion * qty),
          quantity: qty,
          unit: t("recipes.portion_unit"),
        },
        dailyGoal,
      })
    );
    setAddingId(null);
    setPortions("1");
  };

  const handleDelete = (id: string) => {
    dispatch(deleteRecipe(id));
    setDeleteConfirmId(null);
  };

  const inputClass =
    "px-3 py-2 rounded-xl text-sm font-light bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary transition";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
          {t("recipes.title")}
        </p>
        <button
          onClick={() => navigate("/recipes/new")}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline transition"
        >
          <Plus size={13} />
          {t("recipes.new")}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-center text-text-muted dark:text-text-darkMuted py-8">
          {t("recipes.loading")}
        </p>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-text-muted dark:text-text-darkMuted">
          <UtensilsCrossed size={32} strokeWidth={1} />
          <p className="text-sm">{t("recipes.empty")}</p>
          <button
            onClick={() => navigate("/recipes/new")}
            className="text-xs text-primary hover:underline"
          >
            {t("recipes.new")}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark overflow-hidden"
            >
              {/* Recipe header */}
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === recipe._id ? null : recipe._id)
                  }
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <div>
                    <p className="text-sm font-light text-text-primary dark:text-text-darkPrimary">
                      {recipe.name}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                      {recipe.ingredients.length} {t("recipes.ingredients_count")} ·{" "}
                      <span className="text-primary">
                        {recipe.caloriesPerPortion} kcal/{t("recipes.portion_unit")}
                      </span>
                    </p>
                  </div>
                  {expandedId === recipe._id ? (
                    <ChevronUp size={14} className="ml-auto text-text-muted dark:text-text-darkMuted" />
                  ) : (
                    <ChevronDown size={14} className="ml-auto text-text-muted dark:text-text-darkMuted" />
                  )}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => navigate(`/recipes/${recipe._id}/edit`)}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition text-text-muted dark:text-text-darkMuted"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(recipe._id)}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition text-text-muted dark:text-text-darkMuted"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Expanded: ingredients list */}
              {expandedId === recipe._id && (
                <div className="px-4 pb-3 space-y-1 border-t border-border-light dark:border-border-dark pt-3">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-text-primary dark:text-text-darkPrimary">
                        {ing.name} · {ing.quantity}{ing.unit}
                      </span>
                      <span className="text-text-muted dark:text-text-darkMuted">
                        {ing.calories} kcal
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs pt-2 border-t border-border-light dark:border-border-dark font-light">
                    <span className="text-text-muted dark:text-text-darkMuted">
                      {t("recipes.total")} ({recipe.portions} {t("recipes.portions_label")})
                    </span>
                    <span className="text-primary">{recipe.totalCalories} kcal</span>
                  </div>
                </div>
              )}

              {/* Delete confirm */}
              {deleteConfirmId === recipe._id && (
                <div className="px-4 pb-4 pt-2 border-t border-border-light dark:border-border-dark flex items-center justify-between gap-3">
                  <p className="text-xs text-text-muted dark:text-text-darkMuted">
                    {t("recipes.delete_confirm")}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-xs text-text-muted hover:underline"
                    >
                      {t("recipes.cancel")}
                    </button>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      {t("recipes.delete")}
                    </button>
                  </div>
                </div>
              )}

              {/* Add to log panel */}
              {addingId === recipe._id ? (
                <div className="px-4 pb-4 pt-3 border-t border-border-light dark:border-border-dark space-y-3">
                  <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
                    {t("recipes.add_to_log")}
                  </p>
                  <div className="flex gap-2">
                    <select
                      value={selectedMeal}
                      onChange={(e) => setSelectedMeal(e.target.value as MealType)}
                      className={`${inputClass} flex-1`}
                    >
                      {MEAL_TYPES.map((m) => (
                        <option key={m} value={m}>
                          {t(`nutrition.${m}`)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={portions}
                      onChange={(e) => setPortions(e.target.value)}
                      className={`${inputClass} w-20 text-center`}
                      placeholder="1"
                    />
                  </div>
                  <p className="text-xs text-text-muted dark:text-text-darkMuted">
                    {Math.round(recipe.caloriesPerPortion * Math.max(1, Number(portions)))} kcal
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setAddingId(null); setPortions("1"); }}
                      className="flex-1 py-2 rounded-xl text-xs border border-border-light dark:border-border-dark text-text-muted hover:text-text-primary transition"
                    >
                      {t("recipes.cancel")}
                    </button>
                    <button
                      onClick={() => handleAddToLog(recipe)}
                      className="flex-1 py-2 rounded-xl text-xs bg-primary text-white hover:opacity-90 transition"
                    >
                      {t("recipes.add_confirm")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => { setAddingId(recipe._id); setDeleteConfirmId(null); }}
                    className="text-xs text-primary hover:underline transition"
                  >
                    + {t("recipes.add_to_log")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
