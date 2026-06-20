import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../auth/authSlice";
import { AccountSection } from "../components/AccountSection";
import { SecuritySection } from "../components/SecuritySection";
import { ThemeToggle } from "../../../components/ui/ThemeToggle";
import { LanguageSelect } from "../../../components/ui/LanguageSelect";
import { Button } from "../../../components/ui/Button";
import { LogOut } from "lucide-react";

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted">
      {label}
    </p>
  );
}

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="space-y-8">
      <h3 className="font-serif text-3xl font-light text-primary">
        Settings
      </h3>

      <div className="space-y-3">
        <SectionHeader label="Account" />
        <AccountSection />
      </div>

      <div className="space-y-3">
        <SectionHeader label="Security" />
        <SecuritySection />
      </div>

      <div className="space-y-3">
        <SectionHeader label="Preferences" />
        <ThemeToggle />
        <LanguageSelect />
      </div>

      <Button
        variant="danger"
        fullWidth
        className="flex items-center justify-center gap-2"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        Log out
      </Button>
    </div>
  );
}
