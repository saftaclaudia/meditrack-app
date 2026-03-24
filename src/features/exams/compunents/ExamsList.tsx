import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { Exam, ExamWithMongoId } from "../../../types/exam";

import { ExamCard } from "./ExamCard";
import { useEffect } from "react";
import { deleteExam, fetchExams } from "../examsThunks";
import { selectExamsWithStatus } from "../examsSelectors";

interface ExamListProps {
  onEdit: (exam: Exam) => void;
}

export function ExamsList({ onEdit }: ExamListProps) {
  const dispatch = useAppDispatch();
  const exams = useAppSelector(selectExamsWithStatus);

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteExam(id));
  };

  if (exams.length === 0) {
    return (
      <p className="text-sm font-light text-text-muted dark:text-text-darkMuted text-center tracking-wide py-12">
        No exams added yet 💚 Add your first one..
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:gap-4">
      {exams.map((exam) => (
        <ExamCard
          key={(exam as ExamWithMongoId)._id ?? exam.id}
          exam={exam}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
