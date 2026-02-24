import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { loginMock } from "../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectAuthError,
  selectAuthLoading,
} from "../features/auth/authSelectors";
import { useNavigate } from "react-router-dom";
import { clearError } from "../features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const isEmailValid = useMemo(() => {
    return /\S+@\S+\.\S+/.test(email);
  }, [email]);

  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    dispatch(loginMock(email, password, rememberMe));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold tracking-wide text-stone-800 dark:text-stone-100">
            Welcome back
          </h1>
          <p className="text-sm text-stone-500">
            Access your personal health space.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                isEmailValid || email.length === 0
                  ? "border-stone-300 focus:ring-amber-300"
                  : "border-red-400 focus:ring-red-300"
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                  isPasswordValid || password.length === 0
                    ? "border-stone-300 focus:ring-amber-300"
                    : "border-red-400 focus:ring-red-300"
                }`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              Remember me
            </label>

            <span
              onClick={() => navigate("/forgot-password")}
              className="text-amber-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Submit */}
          <Button type="submit" fullWidth disabled={!isFormValid || loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-stone-500">
          New here?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-amber-600 font-medium cursor-pointer hover:underline"
          >
            Create your account
          </span>
        </p>
      </div>
    </div>
  );
}
