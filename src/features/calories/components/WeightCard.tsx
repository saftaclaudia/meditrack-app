import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Scale, Trash2, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchWeightHistory,
  logWeight,
  deleteWeightEntry,
} from "../weightSlice";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const todayDate = () => new Date().toISOString().split("T")[0];

export function WeightCard() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector((s) => s.weight);
  const [input, setInput] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchWeightHistory());
  }, [dispatch]);

  const handleLog = () => {
    const w = parseFloat(input);
    if (!w || w <= 0) return;
    dispatch(logWeight({ date: todayDate(), weight: w }));
    setInput("");
  };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-30);
  const displayed = showAll
    ? [...entries].sort((a, b) => b.date.localeCompare(a.date))
    : recent.slice(-7);

  const latest = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  const trend = latest && prev ? latest.weight - prev.weight : null;

  const chartData = recent.map((e) => ({
    date: new Date(e.date).toLocaleDateString(i18n.language, {
      month: "short",
      day: "numeric",
    }),
    weight: e.weight,
  }));

  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale
            size={15}
            className="text-text-muted dark:text-text-darkMuted"
          />
          <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.weight_title")}
          </span>
        </div>
        {latest && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-medium text-text-primary dark:text-text-darkPrimary">
              {latest.weight} kg
            </span>
            {trend !== null && (
              <span
                className={`flex items-center gap-0.5 text-xs ${trend < 0 ? "text-success" : trend > 0 ? "text-danger" : "text-text-muted dark:text-text-darkMuted"}`}
              >
                {trend < 0 ? (
                  <TrendingDown size={12} />
                ) : trend > 0 ? (
                  <TrendingUp size={12} />
                ) : (
                  <Minus size={12} />
                )}
                {trend !== 0
                  ? `${trend > 0 ? "+" : ""}${trend.toFixed(1)}`
                  : ""}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Log today's weight */}
      <div className="flex gap-2">
        <input
          type="number"
          step="0.1"
          min="0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("nutrition.weight_input_placeholder")}
          onKeyDown={(e) => e.key === "Enter" && handleLog()}
          className="flex-1 h-8 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 text-sm text-text-primary dark:text-text-darkPrimary placeholder:text-text-muted dark:placeholder:text-text-darkMuted focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleLog}
          disabled={!input}
          className="h-8 px-3 rounded-xl bg-primary text-white text-xs font-light disabled:opacity-40 transition"
        >
          {t("nutrition.weight_log_btn")}
        </button>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-light)"
              />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 9 }}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v) => [`${v} kg`, ""]}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--color-primary)"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent entries */}
      {loading && !entries.length ? (
        <p className="text-xs text-text-muted dark:text-text-darkMuted text-center">
          {t("nutrition.weight_loading")}
        </p>
      ) : entries.length === 0 ? (
        <p className="text-xs text-text-muted dark:text-text-darkMuted text-center">
          {t("nutrition.weight_empty")}
        </p>
      ) : (
        <div className="space-y-1">
          {(showAll ? displayed : displayed.slice(-5)).map((e) => (
            <div
              key={e._id}
              className="flex items-center justify-between group"
            >
              <span className="text-xs text-text-muted dark:text-text-darkMuted">
                {new Date(e.date).toLocaleDateString(i18n.language, {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-light text-text-secondary dark:text-text-darkSecondary">
                  {e.weight} kg
                </span>
                <button
                  onClick={() => dispatch(deleteWeightEntry(e._id))}
                  className="opacity-0 group-hover:opacity-100 transition text-text-muted hover:text-danger"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
          {entries.length > 5 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-[10px] text-primary hover:underline w-full text-center"
            >
              {showAll
                ? t("nutrition.weight_show_less")
                : t("nutrition.weight_show_all", { n: entries.length })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
