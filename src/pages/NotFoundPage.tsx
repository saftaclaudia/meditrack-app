import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <p className="font-serif text-8xl font-light text-primary mb-4">404</p>
      <h1 className="text-xl font-medium text-text-primary dark:text-text-darkPrimary mb-2">
        {t("not_found.title")}
      </h1>
      <p className="text-sm text-text-muted dark:text-text-darkMuted mb-8">
        {t("not_found.desc")}
      </p>
      <button
        onClick={() => navigate("/", { replace: true })}
        className="text-sm text-primary font-medium hover:underline"
      >
        {t("not_found.back")}
      </button>
    </div>
  );
}
