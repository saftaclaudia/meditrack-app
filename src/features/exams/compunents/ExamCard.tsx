import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import type { Exam } from "../../../types/exam";
import { getExamStatus } from "../utils/getExamStatus";
import { ExamStatusBage } from "./ExamStatusBage";

interface ExamCardProps {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (id: string) => void;
}

export function ExamCard({ exam, onEdit, onDelete }: ExamCardProps) {
  const status = getExamStatus(exam.nextDate);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <article className="rounded-2xl border border-pink-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] w-full max-w-[100%] md:max-w-none">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {exam.name}
            </h3>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 truncate">
              {exam.clinic} · {exam.speciality} · {exam.doctor}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-0 shrink-0">
            <ExamStatusBage status={status} />
          </div>
        </div>

        {/* DATES */}
        {(exam.lastDate || exam.nextDate) && (
          <div className="flex flex-col md:flex-row justify-between text-xs md:text-sm gap-1 md:gap-4 mt-2 text-gray-600 dark:text-gray-300">
            {exam.lastDate && <span>Last: {exam.lastDate}</span>}
            {exam.nextDate && <span>Next: {exam.nextDate}</span>}
          </div>
        )}

        {/* DETAILS */}
        {showDetails && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4 space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-200">
            {exam.treatment && (
              <p>
                <span className="font-medium">Treatment:</span> {exam.treatment}
              </p>
            )}
            {exam.notes && (
              <p>
                <span className="font-medium">Notes:</span> {exam.notes}
              </p>
            )}
            {exam.documents && exam.documents.length > 0 && (
              <p>
                <span className="font-medium">Documents:</span>{" "}
                {exam.documents.map((doc, idx) => (
                  <span
                    key={idx}
                    className="inline-block mr-2 underline text-pink-600 dark:text-pink-400 cursor-pointer"
                  >
                    {doc}
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3">
          <Button
            variant="secondary"
            className="flex-1 min-w-0"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? "Hide" : "Details"}
          </Button>

          <Button
            variant="primary"
            className="flex-1 min-w-0"
            onClick={() => onEdit(exam)}
          >
            ✏️ Edit
          </Button>

          <Button
            variant="danger"
            className="flex-1 min-w-0"
            onClick={() => setOpenConfirm(true)}
          >
            Delete
          </Button>
        </div>
      </article>

      {/* CONFIRM MODAL */}
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
