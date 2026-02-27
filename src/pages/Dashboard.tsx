import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function DashBoard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h2 className="text-2xl  md:text-3xl font-bold  text-primary dark:text-darkPrimary ">
        {t("dashboard.title")}
      </h2>
      <div className="grid gap-4">
        <div className="rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border-2 border-light dark:border-dark p-5 shadow-sm">
          <h3 className="font-semibold text-text-secondary dark:text-darkSecondary mb-4">
            Medical exams
          </h3>
          <Button onClick={() => navigate("/exams")} fullWidth>
            View all exams
          </Button>
        </div>
      </div>
    </div>
  );
}
