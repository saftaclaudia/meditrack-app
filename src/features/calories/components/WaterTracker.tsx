import { useState } from "react";
import { Droplets } from "lucide-react";

const TARGET = 8;

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

  const pct = Math.min((glasses / TARGET) * 100, 100);
  const done = glasses >= TARGET;

  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={15} className={done ? "text-primary" : "text-text-muted dark:text-text-darkMuted"} />
          <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            Water intake
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update(glasses - 1)}
            disabled={glasses === 0}
            className="w-6 h-6 rounded-full border border-border-light dark:border-border-dark text-text-muted hover:text-danger hover:border-danger disabled:opacity-30 transition text-sm leading-none"
          >
            −
          </button>
          <span className={`text-sm font-light min-w-[48px] text-center ${done ? "text-primary" : "text-text-secondary dark:text-text-darkSecondary"}`}>
            {glasses} / {TARGET}
          </span>
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
        {Array.from({ length: TARGET }, (_, i) => (
          <button
            key={i}
            onClick={() => update(i < glasses ? i : i + 1)}
            className={`flex-1 h-6 rounded-md flex items-center justify-center transition-colors ${
              i < glasses
                ? "bg-primary/20 text-primary"
                : "bg-surface-light dark:bg-surface-dark text-text-muted dark:text-text-darkMuted"
            }`}
          >
            <Droplets size={11} />
          </button>
        ))}
      </div>

      {done && (
        <p className="text-[10px] text-primary text-center tracking-wide">
          Daily goal reached!
        </p>
      )}
    </div>
  );
}
