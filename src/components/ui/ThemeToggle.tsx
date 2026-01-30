import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleTheme } from "../../features/settings/settingsSlice";
import clsx from "clsx";

interface ThemeToggleProps {
  className?: string;
  onAction?: () => void;
  fullWidth?: boolean;
}

export function ThemeToggle({
  className,
  onAction,
  fullWidth,
}: ThemeToggleProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);

  const isLight = theme === "light";

  return (
    <button
      onClick={() => {
        dispatch(toggleTheme());
        onAction?.();
      }}
      className={clsx(
        "flex items-center justify-center gap-2",
        "px-4 py-3 rounded-xl transition",
        "bg-pink-50 dark:bg-gray-800",
        "hover:bg-pink-100 dark:hover:bg-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-pink-300",
        "trasition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97]",
        fullWidth && "w-full",
        className,
      )}
      aria-label="Toggle theme"
    >
      {/* Icon */}
      {isLight ? (
        <Moon className="w-5 h-5 text-pink-500" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
      {/* Label */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Theme
      </span>
    </button>
  );
}
