import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function DashBoard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <h2 className="text-2xl  md:text-3xl font-semibold  text-text-primary dark:text-text-darkPrimary ">
        {t("dashboard.title")}
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border-2 border-border-light dark:border-border-dark p-5 shadow-sm transition hover:shadow-md">
          <h3 className="text-sm font-semibold text-text-secondary dark:text-text-darkSecondary mb-4">
            Medical exams
          </h3>
          <Button onClick={() => navigate("/exams")} fullWidth>
            View all exams
          </Button>
        </div>
        <div className="rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border-2 border-border-light dark:border-border-dark p-5 shadow-sm transition hover:shadow-md">
          <h3 className="text-sm font-semibold text-text-secondary dark:text-text-darkSecondary mb-4">
            Calorie Tracker
          </h3>
          <Button onClick={() => navigate("/exams")} fullWidth>
            Calorie Counter
          </Button>
        </div>
      </div>
    </div>
  );
}
