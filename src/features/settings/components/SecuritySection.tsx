import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { changePasswordThunk } from "../../auth/authThunks";
import { Button } from "../../../components/ui/Button";

export function SecuritySection() {
  const dispatch = useAppDispatch();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await dispatch(changePasswordThunk({ currentPassword, newPassword }));
    setLoading(false);

    if (changePasswordThunk.fulfilled.match(result)) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError((result.payload as string) ?? "Failed to change password");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary";

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">Current password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => { setCurrentPassword(e.target.value); setSaved(false); }}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => { setNewPassword(e.target.value); setSaved(false); }}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">Confirm new password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setSaved(false); }}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {saved && <p className="text-sm text-primary">Password changed successfully</p>}
      <Button fullWidth onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Change password"}
      </Button>
    </div>
  );
}
