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
      "bg-surface-cardLight dark:bg-surface-cardDark hover:bg-soft-light dark:hover:bg-soft-dark focus:ring-primary/30 text-text-primary dark:text-text-darkPrimary border border-border-light dark:border-border-dark",
    soft: "bg-soft-light dark:bg-soft-dark hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark focus:ring-primary/30 text-text-primary dark:text-text-darkPrimary border border-primary/20 dark:border-border-accentDark",
    danger:
      "bg-danger-soft hover:bg-danger focus:ring-danger text-danger hover:text-white border border-danger/20",
  };

  const activeStyles =
    "ring-2 ring-primary border-primary bg-soft-hoverLight dark:bg-soft-hoverDark";

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
