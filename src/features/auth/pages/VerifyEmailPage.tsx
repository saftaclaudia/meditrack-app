import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { verifyEmailRequest } from "../../../api/authApi";
import { Button } from "../../../components/ui/Button";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(t("auth.verify_invalid_link"));
      return;
    }

    verifyEmailRequest(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message || t("auth.verify_invalid_link")
        );
      });
  }, [token, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-6 text-center">
        {status === "loading" && (
          <>
            <div className="text-5xl animate-pulse">🔍</div>
            <p className="text-text-secondary dark:text-text-darkSecondary text-sm">
              {t("auth.verify_loading")}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl">✅</div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
                {t("auth.verify_success_title")}
              </h1>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary">{message}</p>
            </div>
            <Button fullWidth onClick={() => navigate("/login")}>
              {t("auth.verify_sign_in")}
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl">❌</div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
                {t("auth.verify_error_title")}
              </h1>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary">{message}</p>
            </div>
            <Button variant="outline" fullWidth onClick={() => navigate("/register")}>
              {t("auth.verify_register_again")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
