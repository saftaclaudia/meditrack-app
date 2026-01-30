import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function DashBoard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 ld:p-8 space-y-6">
      <h2 className="text-2xl  md:text-3xl font-bold text-pink-300 dark:text-pink-200">
        {t("dashboard.title")}
      </h2>
      <div className="grid gap-4">
        <div className="rounded-2xl bg-pink-100 border-2 border-pink-200 dark:border-gray-700 dark:bg-gray-800 p-4">
          <h3 className="font-semibold text-pink-400 mb-2">Medical exams</h3>
          <Button onClick={() => navigate("/exams")} fullWidth>
            View all exams
          </Button>
        </div>
      </div>
    </div>
  );
}
