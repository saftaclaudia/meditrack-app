import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { ExamForm } from "../compunents/ExamForm";

export function EditExamPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const exam = useAppSelector((state) =>
    state.exams.items.find((item) => item.id === id),
  );

  if (!exam) {
    return (
      <p className="text-center text-text-muted dark:text-text-darkMuted mt-10">
        Exam not found 🥺
      </p>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-lg font-semibold text-primary dark:text-darkPrimary">
        Edit Exam
      </h1>
      <ExamForm editingExam={exam} onFinish={() => navigate("/exams")} />
    </div>
  );
}
