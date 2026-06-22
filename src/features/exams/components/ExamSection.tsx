import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ExamSectionProps {
  title: string;
  subtitle?: string;
  count?: number;
  children: ReactNode;
  empty?: string;
}

export function ExamSection({
  title,
  subtitle,
  count,
  children,
  empty,
}: ExamSectionProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-serif text-2xl font-light text-text-primary dark:text-text-darkPrimary">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs font-light tracking-wide text-text-muted dark:text-text-darkMuted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {count !== undefined && count > 0 && (
          <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            {count} {t(count === 1 ? "exams.exam_one" : "exams.exam_other")}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border-light dark:bg-border-dark" />

      {/* Content */}
      {count === 0 ? (
        <p className="text-sm font-light text-text-muted dark:text-text-darkMuted py-4 text-center tracking-wide ">
          {empty ?? "No exams in this category"}
        </p>
      ) : (
        <div className="space-y-3">{children} </div>
      )}
    </div>
  );
}
