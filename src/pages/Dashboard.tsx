// import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSelectors";

export default function DashBoard() {
  // const { t } = useTranslation();

  const navigate = useNavigate();
  const user = useAppSelector(selectAuthUser);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted mb-1">
          {greeting}, {firstName}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-text-primary dark:text-text-darkPrimary leading-tight">
          Your wellness <br />
          <em className="italic">at a glance</em>
        </h1>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-light dark:bg-border-dark" />

      {/* Main cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Medical Exams Card */}
        <div className="group rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark p-6 flex flex-col gap-5 transition-shadow hover:shadow-md hover:shadow-black/5">
          <div>
            <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted mb-3">
              Medical
            </p>
            <h2 className="font-serif text-2xl font-light text-text-primary dark:text-text-darkPrimary mb-2">
              Examinations
            </h2>
            <p className="text-sm font-light text-text-secondary dark:text-text-darkSecondary leading-relaxed">
              Track and schedule your medical check-ups in one place.
            </p>
          </div>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate("/exams")}
          >
            View all exams
          </Button>
        </div>

        {/* Calorie Tracker Card */}
        <div className="group rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark p-6 flex flex-col gap-5 transition-shadow hover:shadow-md hover:shadow-black/5">
          <div>
            <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted mb-3">
              Nutrition
            </p>
            <h2 className="font-serif text-2xl font-light text-text-primary dark:text-text-darkPrimary mb-2">
              Calorie Log
            </h2>
            <p className="text-sm font-light text-text-secondary dark:text-text-darkSecondary leading-relaxed">
              Monitor your daily nutrition for a balanced, healthy lifestyle.
            </p>
          </div>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate("/calories")}
          >
            Track today
          </Button>
        </div>
      </div>

      {/* Subtle footer note */}
      <p className="text-center text-xs font-light tracking-wider text-text-muted dark:text-text-darkMuted uppercase">
        Meditrack · Your personal health companion
      </p>
    </div>
  );
}
