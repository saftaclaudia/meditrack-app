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
          <Moon className="w-5 h-5 text-accent-lavender" />
        ) : (
          <Sun className="w-5 h-5 text-accent-pink" />
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
