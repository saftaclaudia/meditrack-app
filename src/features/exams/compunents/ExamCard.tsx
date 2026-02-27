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
      <article
        className="
          relative       
          overflow-hidden 
          rounded-2xl  
          bg-surface-light
          dark:bg-surface-dark
          border border-border-light
          dark:border-border-dark   
          shadow-sm       
          transition-all duration-200   
          active:scale-[0.985]          
          w-full         
        "
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.dot}`}
        />

        <div className="pl-4 pr-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <ExamStatusBadge status={status} />

            <div className="flex items-center gap-1">
              {/* VIEW */}
              <button
                onClick={() => setShowDetails((p) => !p)}
                className={`
                  p-2 rounded-xl transition-colors duration-150
                  ${
                    showDetails
                      ? "bg-primary text-white"
                      : "bg-soft-light dark:bg-soft-dark text-text-icon dark:text-text-iconDark hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark"
                  }
                `}
                aria-label="Toggle details"
              >
                <ChevronIcon open={showDetails} />
              </button>

              {/* EDIT*/}
              <button
                onClick={() => onEdit(exam)}
                className="p-2 rounded-xl bg-soft-light dark:bg-soft-dark text-icon dark:text-iconDark hover:bg-soft-hoverLight transition-colors duration-150"
                aria-label="Edit exam"
              >
                <EditIcon />
              </button>

              {/* DELETE */}
              <button
                onClick={() => setOpenConfirm(true)}
                className="p-2 rounded-xl bg-soft-light dark:bg-soft-dark text-danger hover:bg-danger-soft transition-colors duration-150"
                aria-label="Delete exam"
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          <h3 className="text-[15px] font-semibold text-text-primary dark:text-text-darkPrimary leading-tight mb-1">
            {exam.name}
          </h3>

          <div className="flex items-center justify-between mt-2">
            {docCount > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-soft-light dark:bg-soft-dark text-text-primary dark:text-text-secondary text-xs font-medium border border-border-accentLight dark:border-border-accentDark">
                <DocIcon />
                {docCount} {docCount === 1 ? "document" : "documents"}
              </span>
            ) : (
              <span className="text-xs text-text-softLight dark:text-text-darkMuted">
                No documents
              </span>
            )}

            {exam.nextDate && (
              <span className="text-xs text-text-secondary dark:text-text-darkSecondary font-medium">
                {dateLabelMap[status]}{" "}
                <span className="text-text-softLight dark:text-text-darkMuted font-semibold">
                  {exam.nextDate}
                </span>
              </span>
            )}
          </div>

          <p className="text-xs text-text-muted dark:text-text-secondary mt-2 truncate">
            {[exam.doctor, exam.clinic, exam.speciality]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>

        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${showDetails ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="border-t border-border-subtleLight dark:border-border-dark mx-4" />

          <div className="px-4 py-3 space-y-3">
            {exam.lastDate && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted dark:text-text-secondary">
                  Last visit
                </span>
                <span className="text-text-secondary dark:text-text-secondary font-medium">
                  {exam.lastDate}
                </span>
              </div>
            )}

            {exam.treatment && (
              <div>
                <p className="text-xs font-semibold text-text-secondary dark:text-text-darkMuted uppercase tracking-wider mb-1">
                  Treatment
                </p>
                <p className="text-sm text-text-body dark:text-text-bodyDark">
                  {exam.treatment}
                </p>
              </div>
            )}

            {exam.notes && (
              <div>
                <p className="text-xs font-semibold text-text-secondary] dark:text-text-darkMuted uppercase tracking-wider mb-1">
                  Notes
                </p>
                <p className="text-sm text-text-body dark:text-text-bodyDark">
                  {exam.notes}
                </p>
              </div>
            )}

            {docCount > 0 && (
              <div>
                <p className="text-xs font-semibold text-secondary dark:text-text-darkMuted uppercase tracking-wider mb-2">
                  Documents
                </p>
                <div className="flex flex-col gap-2">
                  {exam.documents!.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-surface-mutedLight dark:bg-surface-mutedDark px-3 py-2 rounded-xl border border-border-light dark:border-border-dark"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <DocIcon />
                        <span className="text-sm text-text-body dark:text-text-bodyDark truncate max-w-[140px]">
                          {doc.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => viewPdf(doc.file)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors"
                        >
                          <EyeIcon /> View
                        </button>

                        <button
                          onClick={() => downloadPdf(doc.file, doc.name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-soft-light dark:bg-soft-dark text-primary text-xs font-medium hover:bg-soft-hoverLight transition-colors"
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
