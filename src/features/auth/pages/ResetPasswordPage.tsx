import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";
import { resetPasswordRequest } from "../../../api/authApi";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const isPasswordValid = password.length >= 6;
  const isMatch = password === confirm;
  const isFormValid = isPasswordValid && isMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !token) return;

    setLoading(true);
    setError("");
    try {
      await resetPasswordRequest(token, password);
      setDone(true);
    } catch {
      setError(t("auth.reset_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
            {t("auth.reset_title")}
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            {t("auth.reset_subtitle")}
          </p>
        </div>

        {done ? (
          <div className="space-y-4 text-center">
            <p className="text-primary font-medium">
              ✅ {t("auth.reset_success")}
            </p>
            <Button fullWidth onClick={() => navigate("/login")}>
              {t("auth.verify_sign_in")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
                {t("auth.reset_new_password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.password_placeholder")}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${
                    !isPasswordValid && password.length > 0 ? "border-danger focus:ring-danger" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-text-darkMuted"
                >
                  {showPassword ? t("auth.password_hide") : t("auth.password_show")}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
                {t("auth.reset_confirm_password")}
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={t("auth.reset_confirm_placeholder")}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${
                    confirm.length > 0 && !isMatch ? "border-danger focus:ring-danger" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-text-darkMuted"
                >
                  {showConfirm ? t("auth.password_hide") : t("auth.password_show")}
                </button>
              </div>
              {confirm.length > 0 && !isMatch && (
                <p className="text-xs text-danger">{t("auth.passwords_no_match")}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-danger text-center">{error}</p>
            )}

            <Button type="submit" fullWidth disabled={!isFormValid || loading}>
              {loading ? t("auth.reset_loading") : t("auth.reset_btn")}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-text-muted dark:text-text-darkMuted">
          <span
            onClick={() => navigate("/login")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            {t("auth.reset_back")}
          </span>
        </p>
      </div>
    </div>
  );
}
