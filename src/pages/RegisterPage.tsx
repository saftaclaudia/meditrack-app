import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectAuthError,
  selectAuthLoading,
} from "../features/auth/authSelectors";
import { useEffect, useState } from "react";
import { clearError } from "../features/auth/authSlice";
import { registerMock } from "../features/auth/authThunks";
import { Button } from "../components/ui/Button";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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

    dispatch(registerMock(name, email, password, rememberMe));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
            Create your account
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            Start your personal health journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
                w-full rounded-2xl border px-4 py-3 text-sm
                bg-surface-light dark:bg-surface-dark
                border-border-light dark:border-border-dark
                focus:outline-none focus:ring-2 focus:ring-primary transition
                ${!isEmailValid && email.length > 0 ? "border-danger focus:ring-danger" : ""}
              `}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`
                w-full rounded-2xl border px-4 py-3 text-sm
                bg-surface-light dark:bg-surface-dark
                border-border-light dark:border-border-dark
                focus:outline-none focus:ring-2 focus:ring-primary transition
                ${!isPasswordValid && password.length > 0 ? "border-danger focus:ring-danger" : ""}
              `}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              Confirm Password
            </label>
            <input
              type="password"
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
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
              className="rounded border-border-light dark:border-border-dark text-primary focus:ring-primary"
            />
            <span className="text-text-secondary dark:text-text-darkSecondary">
              Remember me
            </span>
          </div>

          {/* Errors */}
          {error && (
            <p className="text-sm text-danger text-center font-medium">
              {error}
            </p>
          )}

          {!passwordMatch && confirmPassword.length > 0 && (
            <p className="text-sm text-danger text-center font-medium">
              Passwords do not match
            </p>
          )}

          {/* Submit */}
          <Button type="submit" fullWidth disabled={!isFormValid || loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-text-muted dark:text-text-darkMuted">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
