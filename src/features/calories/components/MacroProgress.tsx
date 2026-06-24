import { useTranslation } from "react-i18next";
import type { MacroGoals } from "../../../types/favorites";

interface Props {
  protein: number;
  carbs: number;
  fat: number;
  goals: MacroGoals;
}

function Bar({ value, goal, color }: { value: number; goal?: number; color: string }) {
  if (!goal) return null;
  const pct = Math.min((value / goal) * 100, 100);
  const over = value > goal;
  return (
    <div className="h-1.5 rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${over ? "bg-danger" : color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function MacroProgress({ protein, carbs, fat, goals }: Props) {
  const { t } = useTranslation();

  if (!goals.protein && !goals.carbs && !goals.fat) return null;

  const macros = [
    { key: "protein", label: t("nutrition.macro_protein"), value: protein, goal: goals.protein, color: "bg-blue-400" },
    { key: "carbs",   label: t("nutrition.macro_carbs"),   value: carbs,   goal: goals.carbs,   color: "bg-amber-400" },
    { key: "fat",     label: t("nutrition.macro_fat"),     value: fat,     goal: goals.fat,     color: "bg-rose-400" },
  ];

  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark p-4 space-y-3">
      <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
        {t("nutrition.macro_title")}
      </span>
      <div className="space-y-2.5">
        {macros.map(({ key, label, value, goal, color }) =>
          goal ? (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs text-text-secondary dark:text-text-darkSecondary">
                <span>{label}</span>
                <span>
                  {Math.round(value)}g / {goal}g
                </span>
              </div>
              <Bar value={value} goal={goal} color={color} />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
