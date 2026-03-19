import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  fullWidth?: boolean;
  variant?: "primary" | "soft" | "danger";
  active?: boolean;
}

export default function ToggleButton({
  icon,
  label,
  fullWidth,
  variant = "primary",
  active = false,
  className = "",
  ...rest
}: ToggleButtonProps) {
  const base =
    "flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition focus:outline-none focus:ring-2 duration-150 active:scale-[0.97]";

  const colors = {
    primary:
      "bg-surface-cardLight dark:bg-surface-cardDark hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark focus:ring-primary-soft text-text-primary dark:text-text-darkPrimary",
    soft: "bg-soft-light dark:bg-soft-dark hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark focus:ring-primary-soft text-text-primary dark:text-text-darkPrimary",
    danger:
      "bg-danger-soft hover:bg-danger focus:ring-danger text-danger hover:text-white",
  };

  const activeStyles =
    "ring-2 ring-primary bg-soft-hoverLight dark:bg-soft-hoverDark";

  return (
    <button
      className={clsx(
        base,
        colors[variant],
        active && activeStyles,
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {icon}
      <span className="text-xs font-light tracking-wide">{label}</span>
    </button>
  );
}
