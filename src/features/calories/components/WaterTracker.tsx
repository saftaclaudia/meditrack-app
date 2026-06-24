import { useState } from "react";
import { Droplets } from "lucide-react";

const TARGET = 8;
const ML_PER_GLASS = 250;

const todayKey = () => `water_${new Date().toISOString().split("T")[0]}`;

export function WaterTracker() {
  const [glasses, setGlasses] = useState(() =>
    Number(localStorage.getItem(todayKey()) || 0)
  );

  const update = (n: number) => {
    const clamped = Math.max(0, n);
    setGlasses(clamped);
    localStorage.setItem(todayKey(), String(clamped));
  };

  const totalMl = glasses * ML_PER_GLASS;
  const goalMl = TARGET * ML_PER_GLASS;
  const pct = Math.min((glasses / TARGET) * 100, 100);
  const done = glasses >= TARGET;

  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={15} className={done ? "text-primary" : "text-text-muted dark:text-text-darkMuted"} />
          <div>
            <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
              Water intake
            </span>
            <p className="text-[10px] text-text-muted dark:text-text-darkMuted">
              1 glass = {ML_PER_GLASS} ml · goal {goalMl} ml/day
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
              of {goalMl} ml
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

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Glass grid */}
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
          Daily goal reached · {totalMl} ml
        </p>
      )}
    </div>
  );
}
