import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Droplets } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchWater, setWaterGlasses } from "../waterSlice";

const TARGET = 8;
const ML_PER_GLASS = 250;

const todayDate = () => new Date().toISOString().split("T")[0];

export function WaterTracker() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const glasses = useAppSelector((s) => s.water.glasses);

  useEffect(() => {
    dispatch(fetchWater(todayDate()));
  }, [dispatch]);

  const update = (n: number) => {
    dispatch(setWaterGlasses({ date: todayDate(), glasses: Math.max(0, n) }));
  };

  const totalMl = glasses * ML_PER_GLASS;
  const goalMl = TARGET * ML_PER_GLASS;
  const pct = Math.min((glasses / TARGET) * 100, 100);
  const done = glasses >= TARGET;

  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={15} className={done ? "text-primary" : "text-text-muted dark:text-text-darkMuted"} />
          <div>
            <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
              {t("nutrition.water_title")}
            </span>
            <p className="text-[10px] text-text-muted dark:text-text-darkMuted">
              {t("nutrition.water_subtitle", { ml: ML_PER_GLASS, goal: goalMl })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => update(glasses - 1)}
            disabled={glasses === 0}
            className="w-6 h-6 rounded-full border border-border-light dark:border-border-dark text-text-muted hover:text-danger hover:border-danger disabled:opacity-30 transition text-sm leading-none"
          >
            −
          </button>
          <div className="text-center min-w-[60px]">
            <p className={`text-sm font-light ${done ? "text-primary" : "text-text-secondary dark:text-text-darkSecondary"}`}>
              {totalMl} ml
            </p>
            <p className="text-[10px] text-text-muted dark:text-text-darkMuted">
              {t("nutrition.water_of", { ml: goalMl })}
            </p>
          </div>
          <button
            onClick={() => update(glasses + 1)}
            className="w-6 h-6 rounded-full border border-border-light dark:border-border-dark text-text-muted hover:text-primary hover:border-primary transition text-sm leading-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: TARGET }, (_, i) => {
          const filled = i < glasses;
          return (
            <button
              key={i}
              onClick={() => update(filled ? i : i + 1)}
              title={`${(i + 1) * ML_PER_GLASS} ml`}
              className={`flex-1 flex flex-col items-center justify-end gap-0.5 h-10 rounded-lg transition-colors ${
                filled
                  ? "bg-primary/20 text-primary"
                  : "bg-surface-light dark:bg-surface-dark text-text-muted dark:text-text-darkMuted"
              }`}
            >
              <Droplets size={10} />
              <span className="text-[9px] font-light leading-none pb-1">{i + 1}</span>
            </button>
          );
        })}
      </div>

      {done && (
        <p className="text-[10px] text-primary text-center tracking-wide">
          {t("nutrition.water_goal_reached", { ml: totalMl })}
        </p>
      )}
    </div>
  );
}
