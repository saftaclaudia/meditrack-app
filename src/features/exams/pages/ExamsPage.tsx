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
      <p className=" text-center mt-10 text-gray-500 dark:text-gray-400">
        Loading exams...
      </p>
    );

  return (
    <div className="relative min-h-screen p-4 md:p-8 space-y-6 ">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-pink-500 dark:text-pink-300">
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
