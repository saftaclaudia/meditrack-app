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
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold tracking-wide text-stone-800 dark:text-stone-100">
            Create your account
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Start your personal health journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                isEmailValid || email.length === 0
                  ? "border-stone-300 dark:border-stone-700 focus:ring-amber-300"
                  : "border-red-400 focus:ring-red-300"
              } bg-white dark:bg-stone-800`}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-400"
            />
            <span className="text-stone-600 dark:text-stone-400">
              Remember me
            </span>
          </div>

          {/* Errors */}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {!passwordMatch && confirmPassword.length > 0 && (
            <p className="text-sm text-red-500 text-center">
              Passwords do not match
            </p>
          )}

          <Button type="submit" fullWidth disabled={!isFormValid || loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          Already have an account?{" "}
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
