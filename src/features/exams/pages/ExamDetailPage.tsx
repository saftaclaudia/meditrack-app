import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../app/hooks";
import { ArrowLeft, Pencil, Printer } from "lucide-react";
import type { ExamWithMongoId } from "../../../types/exam";
import { ExamStatusBadge } from "../components/ExamStatusBadge";
import { getExamStatus } from "../utils/getExamStatus";
import { STATUS_CONFIG, type StatusKey } from "../constants/examStatusConfig";
import { DocIcon, DownloadIcon, EyeIcon } from "../components/ExamIcons";
import { downloadPdf, viewPdf } from "../../../utils/documentActions";

export function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const fmtDate = (d: string) => {
    if (!d) return "";
    const date = new Date(d.slice(0, 10) + "T00:00:00");
    if (isNaN(date.getTime())) return d.slice(0, 10);
    return date.toLocaleDateString(i18n.language, { day: "numeric", month: "short", year: "numeric" });
  };

  const exam = useAppSelector((state) =>
    state.exams.items.find((item) => {
      const mongoId = (item as ExamWithMongoId)._id;
      return mongoId === id || item.id === id;
    }),
  );

  if (!exam) {
    return (
      <p className="text-center text-sm font-light tracking-wide text-text-muted dark:text-text-darkMuted mt-10">
        {t("exams.not_found")}
      </p>
    );
  }

  const status = getExamStatus(exam.nextDate, exam.lastDate) as StatusKey;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.soon;
  const examId = (exam as ExamWithMongoId)._id ?? exam.id;

  return (
    <div className="space-y-6 max-w-xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/exams")}
          className="flex items-center gap-1.5 text-sm text-text-muted dark:text-text-darkMuted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          {t("exams.back")}
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-sm text-text-muted dark:text-text-darkMuted hover:text-primary transition-colors"
          >
            <Printer size={14} />
            {t("exams.print")}
          </button>
          <button
            onClick={() => navigate(`/exams/${examId}/edit`)}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Pencil size={14} />
            {t("exams.edit")}
          </button>
        </div>
      </div>

      {/* Detail card */}
      <div className="relative rounded-2xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.dot}`} />

        <div className="pl-5 pr-5 pt-5 pb-6 space-y-5">
          {/* Status + name */}
          <div className="space-y-2">
            <ExamStatusBadge status={status} />
            <h1 className="font-serif text-3xl font-light text-text-primary dark:text-text-darkPrimary leading-tight">
              {exam.name}
            </h1>
          </div>

          {/* Meta fields */}
          <div className="space-y-2.5">
            {exam.speciality && (
              <div className="flex justify-between">
                <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.speciality")}
                </span>
                <span className="text-xs text-text-secondary dark:text-text-darkSecondary">
                  {exam.speciality}
                </span>
              </div>
            )}
            {exam.doctor && (
              <div className="flex justify-between">
                <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.doctor")}
                </span>
                <span className="text-xs text-text-secondary dark:text-text-darkSecondary">
                  {exam.doctor}
                </span>
              </div>
            )}
            {exam.clinic && (
              <div className="flex justify-between">
                <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.clinic")}
                </span>
                <span className="text-xs text-text-secondary dark:text-text-darkSecondary">
                  {exam.clinic}
                </span>
              </div>
            )}
            {exam.lastDate && (
              <div className="flex justify-between">
                <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.last_visit")}
                </span>
                <span className="text-xs text-text-secondary dark:text-text-darkSecondary">
                  {fmtDate(exam.lastDate)}
                </span>
              </div>
            )}
            {exam.nextDate && (
              <div className="flex justify-between">
                <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t(`exams.date_label_${status}`)}
                </span>
                <span className="text-xs text-text-secondary dark:text-text-darkSecondary">
                  {fmtDate(exam.nextDate)}
                </span>
              </div>
            )}
          </div>

          {/* Numeric result */}
          {exam.resultValue != null && (
            <div className="flex justify-between">
              <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                {t("exams.result_value")}
              </span>
              <span className="text-xs text-text-secondary dark:text-text-darkSecondary font-medium">
                {exam.resultValue} {exam.resultUnit}
              </span>
            </div>
          )}

          {/* Treatment */}
          {exam.treatment && (
            <>
              <div className="border-t border-border-light dark:border-border-dark opacity-60" />
              <div className="space-y-1.5">
                <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.treatment")}
                </p>
                <p className="text-sm font-light text-text-body dark:text-text-bodyDark leading-relaxed">
                  {exam.treatment}
                </p>
              </div>
            </>
          )}

          {/* Notes */}
          {exam.notes && (
            <>
              <div className="border-t border-border-light dark:border-border-dark opacity-60" />
              <div className="space-y-1.5">
                <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.notes")}
                </p>
                <p className="text-sm font-light text-text-body dark:text-text-bodyDark leading-relaxed">
                  {exam.notes}
                </p>
              </div>
            </>
          )}

          {/* Documents */}
          {(exam.documents?.length ?? 0) > 0 && (
            <>
              <div className="border-t border-border-light dark:border-border-dark opacity-60" />
              <div className="space-y-2">
                <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.documents")}
                </p>
                <div className="flex flex-col gap-2">
                  {exam.documents!.map((doc, index) => (
                    <div
                      key={doc.id ?? doc._id ?? index}
                      className="flex items-center justify-between bg-surface-mutedLight dark:bg-surface-mutedDark px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <DocIcon />
                        <span className="text-xs font-light text-text-body dark:text-text-bodyDark truncate max-w-[160px]">
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => viewPdf(doc.file)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-background-light text-xs font-light hover:bg-primary-hover transition-colors"
                        >
                          <EyeIcon />
                          <span>{t("exams.view")}</span>
                        </button>
                        <button
                          onClick={() => downloadPdf(doc.file, doc.name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border-light dark:border-border-dark text-primary text-xs font-light hover:bg-soft-light transition-colors"
                        >
                          <DownloadIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
