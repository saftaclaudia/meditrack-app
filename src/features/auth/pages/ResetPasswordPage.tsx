import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { resetPasswordRequest } from "../../../api/authApi";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
      setError("Invalid or expired reset link. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
            Set new password
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            Choose a password with at least 6 characters.
          </p>
        </div>

        {done ? (
          <div className="space-y-4 text-center">
            <p className="text-primary font-medium">
              ✅ Password reset successfully!
            </p>
            <Button fullWidth onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className={`w-full rounded-2xl border px-4 py-3 text-sm bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  !isPasswordValid && password.length > 0
                    ? "border-danger focus:ring-danger"
                    : ""
                }`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className={`w-full rounded-2xl border px-4 py-3 text-sm bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  confirm.length > 0 && !isMatch
                    ? "border-danger focus:ring-danger"
                    : ""
                }`}
                required
              />
              {confirm.length > 0 && !isMatch && (
                <p className="text-xs text-danger">Passwords do not match</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-danger text-center">{error}</p>
            )}

            <Button type="submit" fullWidth disabled={!isFormValid || loading}>
              {loading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-text-muted dark:text-text-darkMuted">
          <span
            onClick={() => navigate("/login")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            Back to Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
