import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";
import { forgotPasswordRequest } from "../../../api/authApi";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) return;

    setLoading(true);
    setError("");
    try {
      await forgotPasswordRequest(email);
      setSubmitted(true);
    } catch {
      setError(t("auth.forgot_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
            {t("auth.forgot_title")}
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            {t("auth.forgot_subtitle")}
          </p>
        </div>

        {submitted ? (
          <p className="text-center text-primary font-medium">
            ✅ {t("auth.forgot_success")}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
                {t("auth.email_label")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.email_placeholder")}
                className={`w-full rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                  isEmailValid || email.length === 0
                    ? "focus:ring-primary"
                    : "border-danger focus:ring-danger"
                }`}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-danger text-center">{error}</p>
            )}

            <Button type="submit" fullWidth disabled={!isEmailValid || loading}>
              {loading ? t("auth.forgot_sending") : t("auth.forgot_btn")}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-text-muted dark:text-text-darkMuted">
          {t("auth.forgot_remember")}{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            {t("auth.login_btn")}
          </span>
        </p>
      </div>
    </div>
  );
}
