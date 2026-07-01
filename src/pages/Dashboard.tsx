import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSelectors";
import { fetchDayLog } from "../features/calories/caloriesThunks";
import { fetchActivities } from "../features/calories/activitiesThunks";
import { fetchWater } from "../features/calories/waterSlice";
import { fetchWeightHistory } from "../features/calories/weightSlice";
import { fetchExams } from "../features/exams/examsThunks";
import { selectExamsItems } from "../features/exams/examsSelectors";
import { ClipboardList, Flame, ArrowRight, Droplets, Scale, Zap } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const todayStr = () => new Date().toISOString().split("T")[0];

export default function DashBoard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const user = useAppSelector(selectAuthUser);
  const { todayLog } = useAppSelector((s) => s.calories);
  const activities = useAppSelector((s) => s.activities.items);
  const profile = useAppSelector((s) => s.profile.profile);
  const glasses = useAppSelector((s) => s.water.glasses);
  const exams = useAppSelector(selectExamsItems);
  const weightEntries = useAppSelector((s) => s.weight.entries);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("dashboard.greeting_morning")
      : hour < 18
        ? t("dashboard.greeting_afternoon")
        : t("dashboard.greeting_evening");

  useEffect(() => {
    const today = todayStr();
    dispatch(fetchDayLog(today));
    dispatch(fetchActivities(today));
    dispatch(fetchWater(today));
    dispatch(fetchExams());
    dispatch(fetchWeightHistory());
  }, [dispatch]);

  const todayMidnight = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const nextExam = [...exams]
    .filter((e) => e.nextDate && new Date(e.nextDate.slice(0, 10) + "T00:00:00") >= todayMidnight)
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))[0] ?? null;
  const daysUntilNext = nextExam
    ? Math.round((new Date(nextExam.nextDate.slice(0, 10) + "T00:00:00").getTime() - todayMidnight.getTime()) / 86_400_000)
    : null;
  const overdueCount = exams.filter((e) => {
    if (!e.nextDate) return false;
    return new Date(e.nextDate.slice(0, 10) + "T00:00:00") < todayMidnight && e.lastDate !== e.nextDate;
  }).length;

  const totalConsumed =
    todayLog?.meals.reduce(
      (t, m) => t + m.entries.reduce((s, e) => s + e.calories, 0), 0
    ) ?? 0;
  const totalBurned = activities.reduce((s, a) => s + a.caloriesBurned, 0);
  const dailyGoal = todayLog?.dailyGoal ?? profile?.recommendedCalories ?? 2000;
  const budget = dailyGoal + totalBurned;
  const pct = Math.min((totalConsumed / budget) * 100, 100);
  const remaining = budget - totalConsumed;
  const isOver = remaining < 0;

  const WATER_TARGET = 8;
  const waterPct = Math.min((glasses / WATER_TARGET) * 100, 100);

  // SVG mini ring
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;

  // Weight sparkline — last 7 entries sorted ascending
  const sparkData = useMemo(() => {
    return [...weightEntries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
      .map((e) => ({ weight: e.weight }));
  }, [weightEntries]);
  const latestWeight = sparkData[sparkData.length - 1]?.weight ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-sm text-text-muted dark:text-text-darkMuted">
          {greeting} 👋
        </p>
        <h1 className="font-sans text-3xl font-bold text-text-primary dark:text-text-darkPrimary leading-tight">
          Hey, <span className="text-primary">{firstName}!</span>
        </h1>
        <p className="text-sm text-text-muted dark:text-text-darkMuted">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Main cards */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Exams Card */}
        <button
          onClick={() => navigate("/exams")}
          className="group text-left rounded-3xl p-6 flex flex-col gap-4 transition-all duration-200 active:scale-[0.98] bg-primary hover:bg-primary-hover"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <ClipboardList size={22} className="text-white" strokeWidth={2} />
            </div>
            <ArrowRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/70 mb-1">
              {t("dashboard.exams_label")}
            </p>
            <h2 className="font-sans text-xl font-bold text-white leading-snug">
              {t("dashboard.exams_title")}
            </h2>
            {nextExam && daysUntilNext !== null ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-sm text-white/80 truncate">{nextExam.name}</p>
                <p className="text-xs text-white/60">
                  {t("dashboard.exams_in_days", { n: daysUntilNext })}
                </p>
                {overdueCount > 0 && (
                  <p className="text-xs text-yellow-200">
                    {t("dashboard.exams_overdue_count", { n: overdueCount })}
                  </p>
                )}
              </div>
            ) : overdueCount > 0 ? (
              <p className="text-sm text-yellow-200 mt-1">
                {t("dashboard.exams_overdue_count", { n: overdueCount })}
              </p>
            ) : (
              <p className="text-sm text-white/70 mt-1 leading-relaxed">
                {t("dashboard.exams_desc")}
              </p>
            )}
          </div>
        </button>

        {/* Nutrition Card with mini ring */}
        <button
          onClick={() => navigate("/calories")}
          className="group text-left rounded-3xl p-6 flex flex-col gap-3 transition-all duration-200 active:scale-[0.98] bg-accent-rose hover:bg-accent-sand"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-black/10 flex items-center justify-center">
              <Flame size={22} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-3">
              {/* mini ring */}
              <svg width={50} height={50} className="-rotate-90">
                <circle cx={25} cy={25} r={radius} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={4} />
                <circle
                  cx={25} cy={25} r={radius}
                  fill="none"
                  stroke={isOver ? "#ef4444" : "rgba(255,255,255,0.8)"}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={`${strokeDash} ${circumference}`}
                />
              </svg>
              <ArrowRight size={18} className="text-black/30 group-hover:text-black/50 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-black/50 mb-1">
              {t("dashboard.nutrition_label")}
            </p>
            <h2 className="font-sans text-xl font-bold text-black/80 leading-snug">
              {t("dashboard.nutrition_title")}
            </h2>
            {totalConsumed > 0 ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-sm text-black/60">
                  <span className="font-semibold text-black/80">{totalConsumed}</span>
                  {" / "}
                  {budget} kcal
                </p>
                <p className={`text-xs ${isOver ? "text-red-600" : "text-black/50"}`}>
                  {isOver
                    ? t("dashboard.calories_over", { n: Math.abs(remaining) })
                    : t("dashboard.calories_remaining", { n: remaining })}
                </p>
                {totalBurned > 0 && (
                  <p className="text-xs text-black/40">+{totalBurned} kcal {t("nutrition.ring_burned")}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-black/50 mt-1 leading-relaxed">
                {t("dashboard.nutrition_desc")}
              </p>
            )}
          </div>

          {/* Water mini bar */}
          {glasses > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Droplets size={11} className="text-black/40" />
              <div className="flex-1 h-1 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-black/30 transition-all"
                  style={{ width: `${waterPct}%` }}
                />
              </div>
              <span className="text-[10px] text-black/40">{glasses}/8</span>
            </div>
          )}
        </button>
      </div>

      {/* Secondary cards */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Weight Card */}
        <button
          onClick={() => navigate("/calories?tab=profile")}
          className="group text-left rounded-3xl p-5 flex flex-col gap-3 transition-all duration-200 active:scale-[0.98] bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-soft dark:bg-primary-softDark flex items-center justify-center">
                <Scale size={16} className="text-primary" />
              </div>
              <p className="text-xs font-medium uppercase tracking-widest text-text-muted dark:text-text-darkMuted">
                {t("dashboard.weight_label")}
              </p>
            </div>
            <ArrowRight size={15} className="text-text-muted dark:text-text-darkMuted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          {latestWeight !== null ? (
            <>
              <div>
                <p className="text-2xl font-light text-text-primary dark:text-text-darkPrimary">
                  {latestWeight} <span className="text-sm text-text-muted dark:text-text-darkMuted">kg</span>
                </p>
                <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                  {t("dashboard.weight_latest")}
                </p>
              </div>
              {sparkData.length > 1 && (
                <div className="h-10 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#00AEBB"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-text-muted dark:text-text-darkMuted">
              {t("dashboard.weight_desc")}
            </p>
          )}
        </button>

        {/* Activity Card */}
        <button
          onClick={() => navigate("/calories")}
          className="group text-left rounded-3xl p-5 flex flex-col gap-3 transition-all duration-200 active:scale-[0.98] bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-soft dark:bg-primary-softDark flex items-center justify-center">
                <Zap size={16} className="text-primary" />
              </div>
              <p className="text-xs font-medium uppercase tracking-widest text-text-muted dark:text-text-darkMuted">
                {t("dashboard.activity_label")}
              </p>
            </div>
            <ArrowRight size={15} className="text-text-muted dark:text-text-darkMuted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          {activities.length > 0 ? (
            <div className="space-y-1">
              <p className="text-2xl font-light text-text-primary dark:text-text-darkPrimary">
                {totalBurned} <span className="text-sm text-text-muted dark:text-text-darkMuted">kcal</span>
              </p>
              <p className="text-xs text-text-muted dark:text-text-darkMuted">
                {t("dashboard.activity_burned")}
              </p>
              <p className="text-xs text-primary mt-1">
                {t("dashboard.activity_count", { n: activities.length })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-muted dark:text-text-darkMuted">
              {t("dashboard.activity_desc")}
            </p>
          )}
        </button>
      </div>
    </div>
  );
}
