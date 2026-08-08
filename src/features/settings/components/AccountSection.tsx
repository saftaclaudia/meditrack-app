import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { updateUser } from "../../auth/authSlice";
import { updateProfile } from "../../profile/profileThunks";
import { setAvatarColor } from "../settingsSlice";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../context/ToastContext";

const AVATAR_COLORS = [
  "#00AEBB",
  "#F5B800",
  "#6366F1",
  "#EC4899",
  "#10B981",
  "#F97316",
  "#8B5CF6",
  "#EF4444",
];

export function AccountSection() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const authUser = useAppSelector((s) => s.auth.user);
  const profileLoading = useAppSelector((s) => s.profile.loading);
  const avatarColor = useAppSelector((s) => s.settings.avatarColor);

  const { showToast } = useToast();
  const [name, setName] = useState(authUser?.name ?? "");
  const [email, setEmail] = useState(authUser?.email ?? "");

  const emailRef = useRef<HTMLInputElement>(null);

  const hasChanges =
    name !== (authUser?.name ?? "") || email !== (authUser?.email ?? "");

  const handleSave = async () => {
    const payload: { name?: string; email?: string } = {};
    if (name !== authUser?.name) payload.name = name;
    if (email !== authUser?.email) payload.email = email;
    if (Object.keys(payload).length === 0) return;

    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(
        updateUser({ name: result.payload.name, email: result.payload.email }),
      );
      showToast(t("settings.account_updated"));
    } else {
      showToast(
        (result.payload as string) ?? t("settings.error_save_account"),
        "error",
      );
    }
  };

  const initials = authUser?.name
    ? authUser.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary";

  return (
    <div className="space-y-4">
      {/* Avatar preview + color picker */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 transition-colors duration-200"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
        <div className="space-y-1">
          <p className="text-xs text-text-muted dark:text-text-darkMuted">
            {t("settings.avatar_color")}
          </p>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => dispatch(setAvatarColor(color))}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none"
                style={{ backgroundColor: color }}
                aria-label={color}
              >
                {avatarColor === color && (
                  <span className="flex items-center justify-center w-full h-full">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">
          {t("settings.name")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && emailRef.current?.focus()}
          placeholder={t("settings.name_placeholder")}
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs text-text-muted dark:text-text-darkMuted">
          {t("settings.email")}
        </label>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && hasChanges && handleSave()}
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>

      <Button
        fullWidth
        onClick={handleSave}
        disabled={profileLoading || !hasChanges}
      >
        {profileLoading ? t("settings.saving") : t("settings.save_account")}
      </Button>
    </div>
  );
}
