import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loginUser, loginWithGoogle } from "../authThunks";
import { clearError } from "../authSlice";
import { selectAuthError, selectAuthLoading } from "../authSelectors";
import { Button } from "../../../components/ui/Button";
import { GoogleLogin } from "@react-oauth/google";
import { resendVerificationRequest } from "../../../api/authApi";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

  const isVerificationError = error?.toLowerCase().includes("verify your email");

  const handleResend = async () => {
    if (!email || resendStatus !== "idle") return;
    setResendStatus("sending");
    try {
      await resendVerificationRequest(email);
      setResendStatus("sent");
    } catch {
      setResendStatus("idle");
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const result = await dispatch(loginUser({ email, password, rememberMe })).unwrap();
      const seen = localStorage.getItem(`onboarding_seen_${result.user.id}`);
      navigate(seen ? "/" : "/welcome", { replace: true });
    } catch {
      // error shown via redux state
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    setGoogleError(null);
    try {
      const result = await dispatch(loginWithGoogle({ credential: credentialResponse.credential })).unwrap();
      const seen = localStorage.getItem(`onboarding_seen_${result.user.id}`);
      navigate(seen ? "/" : "/welcome", { replace: true });
    } catch {
      setGoogleError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
            Welcome back
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            Access your personal health space.
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setGoogleError("Google sign-in failed. Please try again.")}
            useOneTap={false}
            width="368"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
          <span className="text-xs text-text-muted dark:text-text-darkMuted">or sign in with email</span>
          <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
        </div>

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
              className={`w-full rounded-2xl border px-4 py-3 text-sm bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${
                !isEmailValid && email.length > 0
                  ? "border-danger focus:ring-danger"
                  : ""
              }`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
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
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-text-darkMuted"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text-secondary dark:text-text-darkSecondary cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="rounded border-border-light dark:border-border-dark text-primary focus:ring-primary"
              />
              Remember me
            </label>
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Forgot password?
            </span>
          </div>

          {(error || googleError) && (
            <div className="space-y-2 text-center">
              <p className="text-sm text-danger font-medium">
                {error || googleError}
              </p>
              {isVerificationError && (
                resendStatus === "sent" ? (
                  <p className="text-sm text-primary font-medium">
                    Verification email sent! Check your inbox.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendStatus === "sending" || !email}
                    className="text-sm text-primary underline cursor-pointer disabled:opacity-50"
                  >
                    {resendStatus === "sending" ? "Sending..." : "Resend verification email"}
                  </button>
                )
              )}
            </div>
          )}

          <Button type="submit" fullWidth disabled={!isFormValid || loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted dark:text-text-darkMuted">
          New here?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            Create your account
          </span>
        </p>
      </div>
    </div>
  );
}
