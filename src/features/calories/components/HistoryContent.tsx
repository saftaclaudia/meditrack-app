import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchHistory } from "../caloriesThunks";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

interface ChartDay {
  label: string;
  date: string;
  calories: number;
  displayCalories: number;
  goal: number;
  pct: number;
}

const RANGES = [7, 30] as const;

type Range = (typeof RANGES)[number];

interface HistoryContentProps {
  dailyGoal: number;
}

export function HistoryContent({ dailyGoal }: HistoryContentProps) {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { history, loading } = useAppSelector((s) => s.calories);

  const [range, setRange] = useState<Range>(7);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const chartData: ChartDay[] = (() => {
    const days: ChartDay[] = [];

    for (let i = range - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const log = history.find((l) => l.date === dateStr);

      const calories = log
        ? log.meals.reduce(
            (total, meal) =>
              total + meal.entries.reduce((sum, e) => sum + e.calories, 0),
            0,
          )
        : 0;

      const goal = log?.dailyGoal ?? dailyGoal;
      const maxDomain = Math.max(
        dailyGoal * 1.2,
        ...history.map((log) =>
          log.meals.reduce(
            (t, m) => t + m.entries.reduce((s, e) => s + e.calories, 0),
            0,
          ),
        ),
      );

      days.push({
        label: date.toLocaleDateString(i18n.language, { weekday: "short" }),
        date: dateStr,
        calories,
        goal,
        pct: goal > 0 ? Math.round((calories / goal) * 100) : 0,
        displayCalories:
          calories === 0 ? Math.round(maxDomain * 0.04) : calories,
      });
    }
    if (range === 30) {
      return days.map((d) => ({
        ...d,
        label: new Date(d.date + "T12:00:00").getDate().toString(),
      }));
    }
    return days;
  })();

  const daysWithData = chartData.filter((d) => d.calories > 0);

  const avgCalories =
    daysWithData.length > 0
      ? Math.round(
          daysWithData.reduce((sum, d) => sum + d.calories, 0) /
            daysWithData.length,
        )
      : 0;

  const bestDay = daysWithData.reduce(
    (best, d) =>
      d.calories > 0 && d.pct <= 105 && d.pct > best.pct ? d : best,
    { pct: 0, calories: 0, label: "-", date: "", goal: 0 },
  );

  const streak = (() => {
    let count = 0;
    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].calories > 0) count++;
      else break;
    }
    return count;
  })();

  const daysOnTarget = daysWithData.filter((d) => d.pct >= 85 && d.pct <= 110).length;
  const totalConsumed = daysWithData.reduce((sum, d) => sum + d.calories, 0);

  const getBarColor = (pct: number) => {
    if (pct === 0) return "#888780";
    if (pct > 110) return "#e24b4a";
    if (pct >= 85) return "#1d9e75";
    return "#ba7517";
  };
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-sm text-text-muted dark:text-text-darkMuted">
          {t("nutrition.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 rounded-xl bg-surface-light dark:bg-surface-dark w-fit">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-1.5 rounded-lg text-xs font-light tracking-wider uppercase transition-all duration-200 ${
              range === r
                ? "bg-background-light dark:bg-background-dark text-text-primary dark:text-text-darkPrimary"
                : "text-text-muted dark:text-text-darkMuted hover:text-text-primary"
            }`}
          >
            {r}d
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
        {[
          {
            label: t("nutrition.hist_avg"),
            value: avgCalories ? `${avgCalories} kcal` : "-",
          },
          {
            label: t("nutrition.hist_on_target"),
            value: daysWithData.length > 0 ? `${daysOnTarget}/${daysWithData.length}d` : "-",
          },
          {
            label: t("nutrition.hist_streak"),
            value: streak > 0 ? `${streak}d` : "-",
          },
          {
            label: t("nutrition.hist_best_day"),
            value: bestDay.label !== "-" ? `${bestDay.label} · ${bestDay.pct}%` : "-",
          },
          {
            label: t("nutrition.hist_total"),
            value: totalConsumed > 0 ? `${totalConsumed} kcal` : "-",
          },
          {
            label: t("nutrition.hist_logged"),
            value: daysWithData.length > 0 ? `${daysWithData.length}/${range}d` : "-",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border-light dark:border-border-dark p-3"
          >
            <p className="text-[10px] font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted mb-1">
              {label}
            </p>
            <p className="text-sm font-light text-text-primary dark:text-text-darkPrimary">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={chartData}
            barSize={range === 7 ? 28 : 10}
            margin={{ top: 16, right: 0, left: -24, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fontWeight: 300, fill: "#888780" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#888780" }}
              axisLine={false}
              tickLine={false}
              tickCount={4}
              domain={[
                0,
                Math.max(dailyGoal * 1.2, ...chartData.map((d) => d.calories)),
              ]}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as ChartDay;

                return (
                  <div className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-3 py-3 text-xs shadow-sm">
                    <p className="text-text-muted dark:text-text-darkMuted mb-1">
                      {d.date}
                    </p>
                    <p className="text-text-primary dark:text-text-darkPrimary font-light">
                      {d.calories === 0 ? t("nutrition.hist_no_data") : `${d.calories} kcal`}
                    </p>
                    <p className="text-text-muted dark:text-text-darkMuted">
                      {t("nutrition.hist_pct_of_goal", { pct: d.pct })}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="displayCalories" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.pct)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex gap-4 mt-3 justify-center">
          {[
            { color: "#1d9e75", label: t("nutrition.hist_on_target") },
            { color: "#ba7517", label: t("nutrition.hist_under") },
            { color: "#e24b4a", label: t("nutrition.over") },
            { color: "#888780", label: t("nutrition.hist_no_data") },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-text-muted dark:text-text-darkMuted">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
