import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAuthError, selectAuthLoading } from "../authSelectors";
import { useEffect, useState } from "react";
import { clearError } from "../authSlice";

import { Button } from "../../../components/ui/Button";
import { registerUser } from "../authThunks";

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const passwordMatch = password === confirmPassword;
  const isFormValid =
    name.trim().length > 0 && isEmailValid && isPasswordValid && passwordMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => navigate("/check-email", { state: { email } }))
      .catch(() => {});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
            {t("auth.register_title")}
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            {t("auth.register_subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              {t("auth.full_name_label")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              {t("auth.email_label")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.email_placeholder")}
              className={`
                w-full rounded-2xl border px-4 py-3 text-sm
                bg-surface-light dark:bg-surface-dark
                border-border-light dark:border-border-dark
                focus:outline-none focus:ring-2 focus:ring-primary transition
                ${!isEmailValid && email.length > 0 ? "border-danger focus:ring-danger" : ""}
              `}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              {t("auth.password_label")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.password_placeholder")}
                className={`
                  w-full rounded-2xl border px-4 py-3 text-sm
                  bg-surface-light dark:bg-surface-dark
                  border-border-light dark:border-border-dark
                  focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${!isPasswordValid && password.length > 0 ? "border-danger focus:ring-danger" : ""}
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-text-darkMuted"
              >
                {showPassword ? t("auth.password_hide") : t("auth.password_show")}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              {t("auth.confirm_password_label")}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`
                  w-full rounded-2xl border px-4 py-3 text-sm
                  bg-surface-light dark:bg-surface-dark
                  border-border-light dark:border-border-dark
                  focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${!passwordMatch && confirmPassword.length > 0 ? "border-danger focus:ring-danger" : ""}
                `}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-text-darkMuted"
              >
                {showConfirmPassword ? t("auth.password_hide") : t("auth.password_show")}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-danger text-center font-medium">
              {error}
            </p>
          )}

          {!passwordMatch && confirmPassword.length > 0 && (
            <p className="text-sm text-danger text-center font-medium">
              {t("auth.passwords_no_match")}
            </p>
          )}

          <Button type="submit" fullWidth disabled={!isFormValid || loading}>
            {loading ? t("auth.register_loading") : t("auth.register_btn")}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted dark:text-text-darkMuted">
          {t("auth.register_have_account")}{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            {t("auth.register_sign_in")}
          </span>
        </p>
      </div>
    </div>
  );
}
