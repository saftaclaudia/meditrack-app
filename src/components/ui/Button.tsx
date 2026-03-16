import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "edit" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  fullWidth = false,
  ...rest
}: ButtonProps) {
  const baseStyles =
    "rounded-lg font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-primary text-white hover:bg-primary-hover focus:ring-primary/40",

    secondary:
      "bg-soft-light dark:bg-soft-dark text-text-primary dark:text-text-darkPrimary border border-border-accentLight dark:border-border-accentDark hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark focus:ring-primary/30",

    edit: "bg-edit DEFAULT text-white hover:bg-edit-hover focus:ring-edit/40",

    danger: "bg-danger text-white hover:bg-danger-hover focus:ring-danger/40",

    outline:
      "border border-primary text-primary bg-transparent hover:bg-soft-light dark:hover:bg-soft-dark focus:ring-primary/30",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
