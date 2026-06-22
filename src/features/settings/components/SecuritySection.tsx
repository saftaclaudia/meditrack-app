import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { changePasswordThunk } from "../../auth/authThunks";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../context/ToastContext";

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  if (password.length === 0) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  return score as 0 | 1 | 2 | 3;
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoComplete: string;
  show: boolean;
  onToggleShow: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

function PasswordInput({ label, value, onChange, onKeyDown, autoComplete, show, onToggleShow, inputRef }: PasswordInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-text-muted dark:text-text-darkMuted">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border-light dark:border-border-dark bg-transparent text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-darkMuted hover:text-text-primary dark:hover:text-text-darkPrimary transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export function SecuritySection() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const strength = getPasswordStrength(newPassword);
  const strengthLabel =
    strength === 1 ? t("settings.password_weak") :
    strength === 2 ? t("settings.password_medium") :
    strength === 3 ? t("settings.password_strong") : "";
  const strengthColor =
    strength === 1 ? "bg-danger" :
    strength === 2 ? "bg-accent-rose" :
    "bg-primary";

  const passwordsTyped = currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast(t("settings.error_fields_required"), "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(t("settings.error_passwords_mismatch"), "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast(t("settings.error_password_length"), "error");
      return;
    }

    setLoading(true);
    const result = await dispatch(changePasswordThunk({ currentPassword, newPassword }));
    setLoading(false);

    if (changePasswordThunk.fulfilled.match(result)) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast(t("settings.password_changed"));
    } else {
      showToast((result.payload as string) ?? t("settings.error_change_password"), "error");
    }
  };

  return (
    <div className="space-y-3">
      <PasswordInput
        label={t("settings.current_password")}
        value={currentPassword}
        onChange={(v) => { setCurrentPassword(v); }}
        onKeyDown={(e) => e.key === "Enter" && newPasswordRef.current?.focus()}
        autoComplete="current-password"
        show={showCurrent}
        onToggleShow={() => setShowCurrent((p) => !p)}
      />

      <div className="space-y-1">
        <PasswordInput
          label={t("settings.new_password")}
          value={newPassword}
          onChange={(v) => { setNewPassword(v); }}
          onKeyDown={(e) => e.key === "Enter" && confirmPasswordRef.current?.focus()}
          autoComplete="new-password"
          show={showNew}
          onToggleShow={() => setShowNew((p) => !p)}
          inputRef={newPasswordRef}
        />
        {/* Password strength bar */}
        {newPassword.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    strength >= level ? strengthColor : "bg-border-light dark:bg-border-dark"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-text-muted dark:text-text-darkMuted w-14 text-right">
              {strengthLabel}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <PasswordInput
          label={t("settings.confirm_password")}
          value={confirmPassword}
          onChange={(v) => { setConfirmPassword(v); }}
          onKeyDown={(e) => e.key === "Enter" && passwordsTyped && handleSave()}
          autoComplete="new-password"
          show={showConfirm}
          onToggleShow={() => setShowConfirm((p) => !p)}
          inputRef={confirmPasswordRef}
        />
        {/* Live mismatch feedback */}
        {passwordsMismatch && (
          <p className="text-xs text-danger">{t("settings.error_passwords_mismatch")}</p>
        )}
      </div>

      <Button fullWidth onClick={handleSave} disabled={loading || !passwordsTyped}>
        {loading ? t("settings.saving") : t("settings.change_password")}
      </Button>
    </div>
  );
}
