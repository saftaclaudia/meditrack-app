import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { updateUser } from "../../auth/authSlice";
import { updateProfile } from "../../profile/profileThunks";
import { Button } from "../../../components/ui/Button";

export function AccountSection() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const profileLoading = useAppSelector((s) => s.profile.loading);

  const [name, setName] = useState(authUser?.name ?? "");
  const [email, setEmail] = useState(authUser?.email ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    const payload: { name?: string; email?: string } = {};
    if (name !== authUser?.name) payload.name = name;
    if (email !== authUser?.email) payload.email = email;
    if (Object.keys(payload).length === 0) return;

    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(updateUser({ name: result.payload.name, email: result.payload.email }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError((result.payload as string) ?? "Failed to save account");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary";

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setSaved(false); }}
          placeholder="Your name"
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {saved && <p className="text-sm text-primary">Account updated successfully</p>}
      <Button fullWidth onClick={handleSave} disabled={profileLoading}>
        {profileLoading ? "Saving..." : "Save account"}
      </Button>
    </div>
  );
}
