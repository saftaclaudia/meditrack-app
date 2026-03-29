import clsx from "clsx";

export type ExamFilter = "all" | "upcoming" | "due" | "done" | "overdue";

interface ExamFilterBarProps {
  active: ExamFilter;
  onChange: (filter: ExamFilter) => void;
  counts: Record<ExamFilter, number>;
}

const FILTERS: { key: ExamFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "due", label: "Due" },
  { key: "done", label: "Done" },
  { key: "overdue", label: "Overdue" },
];

export function ExamFilterBar({
  active,
  onChange,
  counts,
}: ExamFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light tracking-widest uppercase transition-all duration-200 border",
            active === key
              ? "bg-primary text-background-light border-primary"
              : "bg-transparent text-text-muted dark:text-text-darkMuted border-border-light dark:border-border-dark hover:bg-[#F5EFE8] dark:hover:bg-soft-dark hover:text-primary hover:border-primary",
          )}
        >
          {label}
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
