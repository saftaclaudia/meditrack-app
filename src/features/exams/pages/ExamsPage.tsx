import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { ExamsList } from "../compunents/ExamsList";
import { Button } from "../../../components/ui/Button";
import { FabButton } from "../../../components/ui/FabButton";

export function ExamsPage() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.exams.loading);

  if (loading)
    return (
      <p className="text-center mt-10 font-light tracking-wide">
        Loading exams...
      </p>
    );

  return (
    <div className="p-4 md:p-8 space-y-6 ">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-serif font-light dark:text-darkPrimary">
          My medical exams
        </h1>

        {/* Desktop button */}
        <div className="hidden md:block">
          <Button onClick={() => navigate("/exams/new")}>+ Add exam</Button>
        </div>
      </div>

      <ExamsList onEdit={(exam) => navigate(`/exams/${exam.id}/edit`)} />

      {/* Mobile FAB */}
      <FabButton
        icon="🤍"
        aria-label="Add exam"
        onClick={() => navigate("/exams/new")}
      />
    </div>
  );
}
