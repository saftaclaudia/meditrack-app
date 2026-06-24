import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RecommendedExamWithStatus } from "../utils/getRecommendedStatus";
import { CalendarPlus } from "lucide-react";

interface RecommendedExamCardProps {
  exam: RecommendedExamWithStatus;
}

export function RecommendedExamCard({ exam }: RecommendedExamCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const frequencyLabel =
    exam.frequencyMonths === 6
      ? t("exams.rec_freq_twice_year")
      : exam.frequencyMonths === 12
        ? t("exams.rec_freq_once_year")
        : exam.frequencyMonths === 24
          ? t("exams.rec_freq_every_2_years")
          : t("exams.rec_freq_every_n_months", { n: exam.frequencyMonths });

  const displayName = t(exam.nameKey);
  const displaySpecialist = t(exam.specialistKey);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 active:scale-[0.985]">
      {/* left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-danger" />

      {/* info */}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-serif text-lg font-light text-text-primary dark:text-text-darkPrimary truncate">
          {displayName}
        </h3>
        <p className="text-xs font-light text-text-muted dark:text-text-darkMuted">
          {displaySpecialist}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            {frequencyLabel}
          </span>
          {exam.monthsOverdue !== undefined && exam.monthsOverdue > 0 && (
            <span className="text-[10px] font-light tracking-widest uppercase text-danger">
              {t("exams.rec_overdue_months", { n: exam.monthsOverdue })}
            </span>
          )}
        </div>
        {exam.descriptionKey && (
          <span className="text-xs font-light text-text-muted dark:text-text-darkMuted mt-1 leading-relaxed">
            {t(exam.descriptionKey)}
          </span>
        )}
      </div>

      {/* action */}
      <button
        onClick={() =>
          navigate("/exams/new", {
            state: {
              prefill: { name: displayName, speciality: displaySpecialist },
            },
          })
        }
        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border border-primary text-primary text-xs font-light tracking-widest uppercase hover:bg-soft-light transition-colors"
      >
        <CalendarPlus size={14} strokeWidth={1.5} />
        <span className="hidden sm:inline">{t("exams.rec_schedule")}</span>
      </button>
    </div>
  );
}
