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
      <p className="text-gray-500 dark:text-gray-400 text-center ">
        No exams added yet 🩷 Add your first one..
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4 md-gap-6">
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
