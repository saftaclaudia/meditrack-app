import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { updateUser } from "../../auth/authSlice";
import { updateProfile } from "../../profile/profileThunks";
import { Button } from "../../../components/ui/Button";

export function AccountSection() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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
      setError((result.payload as string) ?? t("settings.error_save_account"));
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary";

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">{t("settings.name")}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setSaved(false); }}
          placeholder={t("settings.name_placeholder")}
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">{t("settings.email")}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {saved && <p className="text-sm text-primary">{t("settings.account_updated")}</p>}
      <Button fullWidth onClick={handleSave} disabled={profileLoading}>
        {profileLoading ? t("settings.saving") : t("settings.save_account")}
      </Button>
    </div>
  );
}
