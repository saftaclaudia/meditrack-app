import { useNavigate } from "react-router-dom";
import type { RecommendedExamWithStatus } from "../utils/getRecommendedStatus";
import { CalendarPlus } from "lucide-react";

interface RecommendedExamCardProps {
  exam: RecommendedExamWithStatus;
}

export function RecommendedExamCard({ exam }: RecommendedExamCardProps) {
  const navigate = useNavigate();

  const frequencyLabel =
    exam.frequencyMonths === 6
      ? "Twice a year"
      : exam.frequencyMonths === 12
        ? "Once a year"
        : exam.frequencyMonths === 24
          ? "exery 2 years"
          : `Every ${exam.frequencyMonths} months`;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 active:scale-[0.985]">
      {/* left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-danger"></div>

      {/* info */}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-serif, text-lg font-light text-text-primary dark:text-text-darkPrimary truncate">
          {exam.name}
        </h3>
        <p className="text-xs font-light text-text-muted dark:text-text-darkMuted">
          {exam.specialist}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            {frequencyLabel}
          </span>

          {exam.monthsOverdue !== undefined && exam.monthsOverdue > 0 && (
            <span className="text-[10px] font-light tracking-widest uppercase text-danger">
              {exam.monthsOverdue}{" "}
              {exam.monthsOverdue === 1 ? "month" : "months"} overdue
            </span>
          )}
        </div>
        {exam.description && (
          <span className="text-xs font-light text-text-muted dark:text-text-darkMuted mt-1 leading-relaxed">
            {exam.description}
          </span>
        )}
      </div>
      {/* action */}
      <button
        onClick={() =>
          navigate("/exams/new", {
            state: {
              prefill: { name: exam.name, speciality: exam.specialist },
            },
          })
        }
        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border border-primary text-primary text-xs font-light tracking-widest uppercase hover:bg-[#f5efe8] transition-colors"
      >
        <CalendarPlus size={14} strokeWidth={1.5} />
        <span className="hidden sm:inline">Schedule</span>
      </button>
    </div>
  );
}
