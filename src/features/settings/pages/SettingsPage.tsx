import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Shield, Sliders, Bell, LogOut, Trash2, AlertTriangle, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { logout } from "../../auth/authSlice";
import { selectAuthUser } from "../../auth/authSelectors";
import { deleteAccountThunk } from "../../auth/authThunks";
import { AccountSection } from "../components/AccountSection";
import { SecuritySection } from "../components/SecuritySection";
import { NotificationPreferences } from "../components/NotificationPreferences";
import { ThemeToggle } from "../../../components/ui/ThemeToggle";
import { LanguageSelect } from "../../../components/ui/LanguageSelect";
import { Button } from "../../../components/ui/Button";

interface SettingsCardProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function SettingsCard({ icon, label, children }: SettingsCardProps) {
  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-4 pb-3">
        <span className="text-primary">{icon}</span>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
          {label}
        </p>
      </div>
      <div className="px-5 pb-5">
        {children}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAppSelector(selectAuthUser);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [onboardingReset, setOnboardingReset] = useState(false);

  const handleResetOnboarding = () => {
    if (user) localStorage.removeItem(`onboarding_seen_${user.id}`);
    setOnboardingReset(true);
    setTimeout(() => setOnboardingReset(false), 2000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    const result = await dispatch(deleteAccountThunk());
    setDeleting(false);
    if (deleteAccountThunk.fulfilled.match(result)) {
      dispatch(logout());
      navigate("/login");
    } else {
      setDeleteError(result.payload as string ?? "Failed to delete account");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-3xl font-light text-primary">
        {t("settings.title")}
      </h3>

      <SettingsCard icon={<User size={14} />} label={t("settings.account")}>
        <AccountSection />
      </SettingsCard>

      <SettingsCard icon={<Shield size={14} />} label={t("settings.security")}>
        <SecuritySection />
      </SettingsCard>

      <SettingsCard icon={<Bell size={14} />} label={t("settings.notifications_prefs")}>
        <NotificationPreferences />
      </SettingsCard>

      <SettingsCard icon={<Sliders size={14} />} label={t("settings.preferences")}>
        <div className="space-y-2">
          <ThemeToggle />
          <LanguageSelect />
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-sm text-text-primary dark:text-text-darkPrimary">
                {t("settings.reset_onboarding")}
              </p>
              <p className="text-xs text-text-muted dark:text-text-darkMuted">
                {t("settings.reset_onboarding_hint")}
              </p>
            </div>
            <button
              onClick={handleResetOnboarding}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-primary border border-primary/40 hover:bg-soft-light dark:hover:bg-soft-dark transition-colors"
            >
              <RotateCcw size={13} />
              {onboardingReset ? t("settings.reset_onboarding_done") : t("settings.reset_onboarding")}
            </button>
          </div>
        </div>
      </SettingsCard>

      {/* Logout */}
      <div className="pt-2 space-y-1.5">
        <Button
          variant="danger"
          fullWidth
          className="flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {t("settings.logout")}
        </Button>
        <p className="text-center text-xs text-text-muted dark:text-text-darkMuted">
          {t("settings.logout_hint")}
        </p>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-danger/30 bg-danger/5 dark:bg-danger/10 overflow-hidden">
        <div className="flex items-center gap-2 px-5 pt-4 pb-3">
          <AlertTriangle size={14} className="text-danger" />
          <p className="text-[10px] font-semibold tracking-widest uppercase text-danger">
            {t("settings.danger_zone")}
          </p>
        </div>
        <div className="px-5 pb-5 space-y-3">
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-text-primary dark:text-text-darkPrimary">
                  {t("settings.delete_account")}
                </p>
                <p className="text-xs text-text-muted dark:text-text-darkMuted">
                  {t("settings.delete_account_hint")}
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-danger border border-danger/40 hover:bg-danger/10 transition-colors"
              >
                <Trash2 size={13} />
                {t("settings.delete_account")}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-text-primary dark:text-text-darkPrimary">
                {t("settings.delete_confirm_title")}
              </p>
              <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed">
                {t("settings.delete_confirm_desc")}
              </p>
              {deleteError && (
                <p className="text-xs text-danger">{deleteError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium border border-border-light dark:border-border-dark text-text-muted dark:text-text-darkMuted hover:bg-soft-light dark:hover:bg-soft-dark transition-colors"
                >
                  {t("settings.cancel")}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-danger text-white hover:bg-danger/90 disabled:opacity-60 transition-colors"
                >
                  {deleting ? t("settings.deleting") : t("settings.delete_confirm_btn")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* App version */}
      <p className="text-center text-xs text-text-muted dark:text-text-darkMuted pb-2">
        {t("settings.version")} 1.0.0
      </p>
    </div>
  );
}
