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
    return <p className="text-center text-gray-500 mt-10">Exam not found 🥺</p>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-lg font-semibold text-pink-600 dark:text-pink-300">
        Edit Exam
      </h1>
      <ExamForm editingExam={exam} onFinish={() => navigate("/exams")} />
    </div>
  );
}
