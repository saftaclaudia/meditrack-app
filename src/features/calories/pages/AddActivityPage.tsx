import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Search, Zap, Lock, Clock } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { addActivity } from "../activitiesThunks";
import { activityDatabase, type ActivityItem } from "../data/activityDatabase";
import type { ActivityCategory } from "../../../types/activity";

const todayStr = () => new Date().toISOString().split("T")[0];

const RECENT_KEY = "meditrack_recent_activities";

interface RecentActivity {
  name: string;
  duration: number;
  caloriesBurned: number;
  category: ActivityCategory;
  kcalPerMin: number | null;
}

const loadRecent = (): RecentActivity[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveRecent = (entry: RecentActivity) => {
  const existing = loadRecent().filter(
    (r) => r.name.toLowerCase() !== entry.name.toLowerCase()
  );
  localStorage.setItem(RECENT_KEY, JSON.stringify([entry, ...existing].slice(0, 8)));
};

const CATEGORIES: ActivityCategory[] = ["cardio", "strength", "sport", "daily"];

export function AddActivityPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const CATEGORY_LABELS: Record<ActivityCategory, string> = {
    cardio: t("nutrition.cat_cardio"),
    strength: t("nutrition.cat_strength"),
    sport: t("nutrition.cat_sport"),
    daily: t("nutrition.cat_daily"),
  };

  const [recent, setRecent] = useState<RecentActivity[]>(() => loadRecent());
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("cardio");
  const [kcalPerMin, setKcalPerMin] = useState<number | null>(null);
  const [isAutoCalc, setIsAutoCalc] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const filtered = query.trim()
    ? activityDatabase.filter((a) =>
        normalize(t(a.nameKey)).includes(normalize(query.trim()))
      )
    : activityDatabase;

  // Group by category for the empty-query dropdown
  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: filtered.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fillForm = (
    actName: string,
    actCategory: ActivityCategory,
    actKcalPerMin: number | null,
    actDuration: string,
    actCalories: string
  ) => {
    setName(actName);
    setCategory(actCategory);
    setKcalPerMin(actKcalPerMin);
    setQuery(actName);
    setShowDropdown(false);
    setDuration(actDuration);
    setCaloriesBurned(actCalories);
    setIsAutoCalc(actKcalPerMin !== null);
  };

  const handleSelectActivity = (item: ActivityItem) => {
    const dur = Number(duration) || 30;
    fillForm(
      t(item.nameKey),
      item.category,
      item.kcalPerMin,
      String(dur),
      String(Math.round(item.kcalPerMin * dur))
    );
  };

  const handleSelectRecent = (r: RecentActivity) => {
    fillForm(r.name, r.category, r.kcalPerMin, String(r.duration), String(r.caloriesBurned));
  };

  const handleDurationChange = (val: string) => {
    setDuration(val);
    if (kcalPerMin !== null && Number(val) > 0) {
      setCaloriesBurned(String(Math.round(kcalPerMin * Number(val))));
      setIsAutoCalc(true);
    }
  };

  const handleCaloriesChange = (val: string) => {
    setCaloriesBurned(val);
    setIsAutoCalc(false);
  };

  const handleSubmit = () => {
    if (!name.trim() || !duration || !caloriesBurned) return;

    const entry: RecentActivity = {
      name: name.trim(),
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      category,
      kcalPerMin,
    };
    saveRecent(entry);
    setRecent(loadRecent());

    dispatch(
      addActivity({
        name: name.trim(),
        duration: Number(duration),
        caloriesBurned: Number(caloriesBurned),
        category,
        date: todayStr(),
      })
    );
    navigate("/calories");
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
            {t("nutrition.activity_page_title")}
          </h1>
        </div>
      </div>

      <div className="border-t border-border-light dark:border-border-dark" />

      {/* Recent activities */}
      {recent.length > 0 && !name && (
        <div className="space-y-2">
          <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted flex items-center gap-1.5">
            <Clock size={11} />
            Recent
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r.name}
                onClick={() => handleSelectRecent(r)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-light dark:border-border-dark text-xs text-text-secondary dark:text-text-darkSecondary hover:border-primary hover:text-primary transition"
              >
                <span>{r.name}</span>
                <span className="text-text-muted dark:text-text-darkMuted">
                  {r.duration}min · {r.caloriesBurned} kcal
                </span>
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
            placeholder={t("nutrition.activity_search_placeholder")}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            className={`${inputClass} pl-9`}
          />
        </div>

        {showDropdown && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shadow-lg overflow-hidden max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-text-muted dark:text-text-darkMuted">
                {t("nutrition.activity_no_results")}
              </p>
            ) : query.trim() ? (
              // Flat filtered list when searching
              filtered.map((item) => (
                <ActivityRow
                  key={item.id}
                  item={item}
                  displayName={t(item.nameKey)}
                  categoryLabel={CATEGORY_LABELS[item.category]}
                  onSelect={() => handleSelectActivity(item)}
                />
              ))
            ) : (
              // Grouped by category when browsing
              grouped.map(({ cat, items }) => (
                <div key={cat}>
                  <p className="px-4 py-1.5 text-[10px] font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted bg-surface-cardLight dark:bg-surface-cardDark">
                    {CATEGORY_LABELS[cat]}
                  </p>
                  {items.map((item) => (
                    <ActivityRow
                      key={item.id}
                      item={item}
                      displayName={t(item.nameKey)}
                      categoryLabel={CATEGORY_LABELS[item.category]}
                      onSelect={() => handleSelectActivity(item)}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border-light dark:border-border-dark" />

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.activity_name_label")}
          </label>
          <input
            type="text"
            placeholder={t("nutrition.activity_name_placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.activity_category_label")}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 rounded-xl text-xs font-light border transition ${
                  category === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border-light dark:border-border-dark text-text-muted dark:text-text-darkMuted hover:border-primary hover:text-primary"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.activity_duration_label")}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => handleDurationChange(e.target.value)}
              className={inputClass}
            />
            <div className="flex gap-1">
              {[15, 30, 45, 60].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => handleDurationChange(String(min))}
                  className={`px-2.5 py-2 rounded-xl text-xs border transition whitespace-nowrap ${
                    duration === String(min)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border-light dark:border-border-dark text-text-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calories burned */}
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            {t("nutrition.activity_calories_burned_label")}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={caloriesBurned}
              onChange={(e) => handleCaloriesChange(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            {isAutoCalc ? (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs bg-danger/10 text-danger whitespace-nowrap">
                <Zap size={11} />
                {t("nutrition.activity_estimated")}
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs bg-surface-cardLight dark:bg-surface-cardDark text-text-muted whitespace-nowrap">
                <Lock size={11} />
                manual
              </span>
            )}
          </div>
          {kcalPerMin !== null && (
            <p className="text-[10px] text-text-muted dark:text-text-darkMuted">
              {t("nutrition.activity_estimate_note", { kcal: kcalPerMin })}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !duration || !caloriesBurned}
        className="w-full py-3 rounded-2xl bg-danger text-white text-sm font-light tracking-wider disabled:opacity-40 hover:opacity-90 transition"
      >
        {t("nutrition.activity_add_btn")}
      </button>
    </div>
  );
}

function ActivityRow({
  item,
  categoryLabel,
  displayName,
  onSelect,
}: {
  item: ActivityItem;
  categoryLabel: string;
  displayName: string;
  onSelect: () => void;
}) {
  return (
    <button
      onMouseDown={onSelect}
      className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-surface-cardLight dark:hover:bg-surface-cardDark transition"
    >
      <span className="text-sm text-text-primary dark:text-text-darkPrimary">
        {displayName}
      </span>
      <div className="text-right">
        <span className="text-xs text-text-muted dark:text-text-darkMuted block">
          ~{item.kcalPerMin} kcal/min
        </span>
        <span className="text-[10px] text-text-muted dark:text-text-darkMuted">
          {categoryLabel}
        </span>
      </div>
    </button>
  );
}
