import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";

export default function CheckEmailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-6 text-center">
        <div className="text-5xl">📧</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
            {t("auth.check_email_title")}
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            {t("auth.check_email_desc")}{" "}
            {email ? (
              <span className="font-medium text-text-primary dark:text-text-darkPrimary">{email}</span>
            ) : (
              t("auth.check_email_desc_fallback")
            )}
            {"."}
          </p>
          <p className="text-xs text-text-muted dark:text-text-darkMuted mt-2">
            {t("auth.check_email_hint")}
          </p>
        </div>

        <Button variant="outline" fullWidth onClick={() => navigate("/login")}>
          {t("auth.check_email_back")}
        </Button>
      </div>
    </div>
  );
}
