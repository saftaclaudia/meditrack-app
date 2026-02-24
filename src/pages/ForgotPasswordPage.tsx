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
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-xl p-8 space-y-6">
        <h1 className="font-semibold text-stone-800 dark:text-stone-100 text-center">
          Forgot Password
        </h1>
        <p className="text-sm text-stone-500 text-center">
          Enter your email address and we will sent you a reset link
        </p>

        {submitted ? (
          <p className="text-center text-amber-600">
            ✅ Check your email! If it exist, you will recive a reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${isEmailValid || email.length === 0 ? "border-stone-300 focus:ring-amber-300" : "border-red-400 ficus:ring-red-300"}`}
                required
              />
            </div>

            <Button type="submit" fullWidth disabled={!isEmailValid}>
              {" "}
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-stone-500">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-amber-600 font-medium cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
