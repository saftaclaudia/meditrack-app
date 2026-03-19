import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { removeExam } from "../examsSlice";
import type { Exam } from "../../../types/exam";

import { ExamCard } from "./ExamCard";
import { useEffect } from "react";
import { fetchExams } from "../examsThunks";
import { selectExamsWithStatus } from "../examsSelectors";

interface ExamListProps {
  onEdit: (exam: Exam) => void;
}

export function ExamsList({ onEdit }: ExamListProps) {
  const dispatch = useAppDispatch();
  const exams = useAppSelector(selectExamsWithStatus);

  useEffect(() => {
    if (exams.length === 0) {
      dispatch(fetchExams());
    }
  }, [dispatch, exams.length]);

  const handleDelete = (id: string) => {
    dispatch(removeExam(id));
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
          key={exam.id}
          exam={exam}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
