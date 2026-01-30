import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { loginMock } from "../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../features/auth/authSelectors";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginMock(email, password));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-300">
            Welcome back 💖
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Log in to manage your medical exams
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500"
              required
            />
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Submit */}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          Don't have an account yet?{" "}
          <span className="text-pink-500 font-medium cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
