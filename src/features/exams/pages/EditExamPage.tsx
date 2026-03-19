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
      <p className="text-center text-sm font-light tracking-wide text-text-muted dark:text-text-darkMuted mt-10">
        Exam not found 🥺
      </p>
    );
  }

  return (
    <div className=" space-y-6">
      <h1 className="font-serif text-3xl font-light text-text-primary  dark:text-text-darkPrimary">
        Edit Exam
      </h1>
      <ExamForm editingExam={exam} onFinish={() => navigate("/exams")} />
    </div>
  );
}
