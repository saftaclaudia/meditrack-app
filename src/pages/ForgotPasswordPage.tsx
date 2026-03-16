import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) return;

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light  dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg p-8 space-y-6">
        <h1 className="font-semibold text-text-primary dark:text-text-darkPrimary text-center">
          Forgot Password
        </h1>
        <p className="text-sm text-text-secondary dark:text-text-darkSecondary text-center">
          Enter your email address and we will sent you a reset link
        </p>

        {submitted ? (
          <p className="text-center text-primary font-medium">
            ✅ Check your email! If it exist, you will recive a reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${isEmailValid || email.length === 0 ? "border-stone-300 focus:ring-primary" : "border-danger focus:ring-danger"}`}
                required
              />
            </div>

            <Button type="submit" fullWidth disabled={!isEmailValid}>
              {" "}
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted dark:text-text-darkMuted">
          Remember your password?{" "}
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
