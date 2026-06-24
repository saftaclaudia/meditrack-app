import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Zap, Lock } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { addActivity } from "../activitiesThunks";
import { activityDatabase, type ActivityItem } from "../data/activityDatabase";
import type { ActivityCategory } from "../../../types/activity";

const todayStr = () => new Date().toISOString().split("T")[0];

const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  cardio: "Cardio",
  strength: "Forță",
  sport: "Sport",
  daily: "Activitate zilnică",
};

export function AddActivityPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const results = query.trim()
    ? activityDatabase
        .filter((a) => normalize(a.name).includes(normalize(query.trim())))
        .slice(0, 8)
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelectActivity = (item: ActivityItem) => {
    setName(item.name);
    setCategory(item.category);
    setKcalPerMin(item.kcalPerMin);
    setQuery(item.name);
    setShowDropdown(false);
    const dur = Number(duration) || 30;
    setCaloriesBurned(String(Math.round(item.kcalPerMin * dur)));
    setIsAutoCalc(true);
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
            Înapoi
          </p>
          <h1 className="font-serif text-xl font-light text-primary">
            Adaugă activitate
          </h1>
        </div>
      </div>

      <div className="border-t border-border-light dark:border-border-dark" />

      {/* Search */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-darkMuted" />
          <input
            type="text"
            placeholder="Caută activitate (ex. alergare, înot...)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            className={`${inputClass} pl-9`}
          />
        </div>

        {showDropdown && query.trim().length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shadow-lg overflow-hidden">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-text-muted dark:text-text-darkMuted">
                Niciun rezultat
              </p>
            ) : (
              results.map((item) => (
                <button
                  key={item.id}
                  onMouseDown={() => handleSelectActivity(item)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-surface-cardLight dark:hover:bg-surface-cardDark transition"
                >
                  <span className="text-sm text-text-primary dark:text-text-darkPrimary">
                    {item.name}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-text-muted dark:text-text-darkMuted block">
                      ~{item.kcalPerMin} kcal/min
                    </span>
                    <span className="text-[10px] text-text-muted dark:text-text-darkMuted">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </div>
                </button>
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
            Activitate
          </label>
          <input
            type="text"
            placeholder="ex. Alergare în parc"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
            Categorie
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(CATEGORY_LABELS) as ActivityCategory[]).map((cat) => (
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
            Durată (minute)
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
            Calorii arse (kcal)
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
                estimat
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
              Estimare bazată pe ~{kcalPerMin} kcal/min pentru 70 kg
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !duration || !caloriesBurned}
        className="w-full py-3 rounded-2xl bg-danger text-white text-sm font-light tracking-wider disabled:opacity-40 hover:opacity-90 transition"
      >
        Adaugă activitate
      </button>
    </div>
  );
}
