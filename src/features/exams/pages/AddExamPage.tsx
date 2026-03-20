import { useLocation, useNavigate } from "react-router-dom";
import { ExamForm } from "../compunents/ExamForm";
import { useEffect } from "react";

export function AddExamPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.prefill ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="space-y-4">
      <ExamForm
        editingExam={null}
        prefill={prefill}
        onFinish={() => navigate("/exams")}
      />
    </div>
  );
}
