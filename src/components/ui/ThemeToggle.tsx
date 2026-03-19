import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ToggleButton from "./ToggleButton";
import { toggleTheme } from "../../features/settings/settingsSlice";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const isLight = theme === "light";

  return (
    <ToggleButton
      icon={
        isLight ? (
          <Moon className="w-4 h-4 text-text-muted dark:text-text-darkMuted" />
        ) : (
          <Sun className="w-4 h-4 text-primary" />
        )
      }
      label="Theme"
      active={theme === "dark"}
      onClick={() => dispatch(toggleTheme())}
      fullWidth
      variant="soft"
    />
  );
}
