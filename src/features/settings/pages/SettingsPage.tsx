import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../auth/authSlice";
import { ThemeToggle } from "../../../components/ui/ThemeToggle";
import { LanguageSelect } from "../../../components/ui/LanguageSelect";
import { Button } from "../../../components/ui/Button";
import { LogOut } from "lucide-react";

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-pink-600 dark:text-pink-300">
          Settings
        </h1>

        {/* Settings list */}
        <div className="space-y-3">
          <ThemeToggle fullWidth />
          <LanguageSelect fullWidth />

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
      </div>
    </div>
  );
}
