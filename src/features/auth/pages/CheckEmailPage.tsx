import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

export default function CheckEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-8 space-y-6 text-center">
        <div className="text-5xl">📧</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
            Check your email
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            We sent a verification link to{" "}
            {email ? (
              <span className="font-medium text-text-primary dark:text-text-darkPrimary">{email}</span>
            ) : (
              "your email address"
            )}
            . Click the link to activate your account.
          </p>
          <p className="text-xs text-text-muted dark:text-text-darkMuted mt-2">
            The link expires in 24 hours. Check your spam folder if you don't see it.
          </p>
        </div>

        <Button variant="outline" fullWidth onClick={() => navigate("/login")}>
          Back to sign in
        </Button>
      </div>
    </div>
  );
}
