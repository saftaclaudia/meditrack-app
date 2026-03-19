import { useState } from "react";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import type { Exam } from "../../../types/exam";
import { getExamStatus } from "../utils/getExamStatus";
import { downloadPdf, viewPdf } from "../../../utils/documentActions";
import {
  dateLabelMap,
  STATUS_CONFIG,
  type StatusKey,
} from "../constants/examStatusConfig";
import { ChevronIcon, DocIcon } from "./ExamIcons";
import { DownloadIcon, EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import { ExamStatusBadge } from "./ExamStatusBadge";

interface ExamCardProps {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (id: string) => void;
}

export function ExamCard({ exam, onEdit, onDelete }: ExamCardProps) {
  const status = getExamStatus(exam.nextDate, exam.lastDate) as StatusKey;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.soon;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const docCount = exam.documents?.length ?? 0;

  return (
    <>
      <article className="relative overflow-hidden rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark transition-all duration-200 active:scale-[0.985] w-full">
        {/* status bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.dot}`} />

        {/* main content */}
        <div className="pl-5 pr-4 pt-5 pb-4">
          {/* top row */}
          <div className="flex items-center justify-between mb-4">
            <ExamStatusBadge status={status} />

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setShowDetails((p) => !p)}
                className={`p-1.5 rounded-lg transition-colors duration-150 ${
                  showDetails
                    ? "bg-[#F5EFE8] text-primary"
                    : "text-text-muted dark:text-text-darkMuted hover:text-primary hover:bg-[#F5EFE8]"
                }`}
                aria-label="Toggle details"
              >
                <ChevronIcon open={showDetails} />
              </button>

              <button
                onClick={() => onEdit(exam)}
                className="p-1.5 rounded-lg text-text-muted dark:text-text-darkMuted hover:text-primary hover:bg-[#F5EFE8] transition-colors duration-150"
                aria-label="Edit exam"
              >
                <EditIcon />
              </button>

              <button
                onClick={() => setOpenConfirm(true)}
                className="p-1.5 rounded-lg text-text-muted dark:text-text-darkMuted hover:text-danger hover:bg-[#F5E8E8] transition-colors duration-150"
                aria-label="Delete exam"
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          {/* title */}
          <h3 className="font-serif text-xl font-light text-text-primary dark:text-text-darkPrimary leading-tight mb-3">
            {exam.name}
          </h3>

          {/* meta row */}
          <div className="flex items-center justify-between">
            {docCount > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5EFE8] text-primary text-xs font-light">
                <DocIcon />
                {docCount} {docCount === 1 ? "doc" : "docs"}
              </span>
            ) : (
              <span className="text-xs font-light text-text-muted dark:text-text-darkMuted">
                No documents
              </span>
            )}

            {exam.nextDate && (
              <span className="text-xs font-light text-text-muted dark:text-text-darkMuted">
                {dateLabelMap[status]}{" "}
                <span className="text-text-secondary dark:text-text-darkSecondary">
                  {exam.nextDate}
                </span>
              </span>
            )}
          </div>

          {/* doctor / clinic / speciality */}
          {[exam.doctor, exam.clinic, exam.speciality].filter(Boolean).length >
            0 && (
            <p className="text-xs font-light text-text-muted dark:text-text-darkMuted mt-3 truncate tracking-wide">
              {[exam.doctor, exam.clinic, exam.speciality]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        {/* expandable details */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showDetails ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-5 border-t border-border-light dark:border-border-dark opacity-60" />

          <div className="px-5 py-4 space-y-4">
            {exam.lastDate && (
              <div className="flex justify-between">
                <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  Last visit
                </span>
                <span className="text-xs text-text-secondary dark:text-text-darkSecondary">
                  {exam.lastDate}
                </span>
              </div>
            )}

            {exam.treatment && (
              <div>
                <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted mb-1.5">
                  Treatment
                </p>
                <p className="text-sm font-light text-text-body dark:text-text-bodyDark leading-relaxed">
                  {exam.treatment}
                </p>
              </div>
            )}

            {exam.notes && (
              <div>
                <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted mb-1.5">
                  Notes
                </p>
                <p className="text-sm font-light text-text-body dark:text-text-bodyDark leading-relaxed">
                  {exam.notes}
                </p>
              </div>
            )}

            {docCount > 0 && (
              <div>
                <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted mb-2">
                  Documents
                </p>
                <div className="flex flex-col gap-2">
                  {exam.documents!.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-surface-mutedLight dark:bg-surface-mutedDark px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <DocIcon />
                        <span className="text-xs font-light text-text-body dark:text-text-bodyDark truncate max-w-[140px]">
                          {doc.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => viewPdf(doc.file)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-background-light text-xs font-light hover:bg-[#B39470] transition-colors"
                        >
                          <EyeIcon />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => downloadPdf(doc.file, doc.name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border-light dark:border-border-dark text-primary text-xs font-light hover:bg-[#F5EFE8] transition-colors"
                        >
                          <DownloadIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      <ConfirmModal
        open={openConfirm}
        title="Delete exam"
        message="This action is permanent. The exam and all its data will be removed."
        confirmText="Yes, delete"
        cancelText="Cancel"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          onDelete(exam.id);
          setOpenConfirm(false);
        }}
      />
    </>
  );
}
