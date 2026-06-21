import { useTranslation } from "react-i18next";
import clsx from "clsx";

export type ExamFilter = "all" | "upcoming" | "due" | "done" | "overdue";

interface ExamFilterBarProps {
  active: ExamFilter;
  onChange: (filter: ExamFilter) => void;
  counts: Record<ExamFilter, number>;
}

const FILTER_KEYS: { key: ExamFilter; tKey: string }[] = [
  { key: "all", tKey: "exams.filter_all" },
  { key: "upcoming", tKey: "exams.filter_upcoming" },
  { key: "due", tKey: "exams.filter_due" },
  { key: "done", tKey: "exams.filter_done" },
  { key: "overdue", tKey: "exams.filter_overdue" },
];

export function ExamFilterBar({
  active,
  onChange,
  counts,
}: ExamFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTER_KEYS.map(({ key, tKey }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light tracking-widest uppercase transition-all duration-200 border",
            active === key
              ? "bg-primary text-background-light border-primary"
              : "bg-transparent text-text-muted dark:text-text-darkMuted border-border-light dark:border-border-dark hover:bg-soft-light dark:hover:bg-soft-dark hover:text-primary hover:border-primary",
          )}
        >
          {t(tKey)}
          {counts[key] > 0 && (
            <span
              className={clsx(
                "text-[10px] px-1.5 py-0.5 rounded-full font-light",
                active === key
                  ? "bg-background-light/20 text-background-light"
                  : "bg-border-light dark:bg-border-dark text-text-muted dark:text-text-darkMuted",
              )}
            >
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
