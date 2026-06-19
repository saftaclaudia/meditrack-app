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
    "font-sans font-light tracking-widest uppercase transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 rounded-full";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-5 py-2.5 text-xs",
    lg: "px-7 py-3 text-sm",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-primary text-background-light hover:bg-primary-hover focus:ring-primary/30 border border-primary hover:border-primary-hover",

    secondary:
      "bg-soft-light dark:bg-soft-dark text-text-primary dark:text-text-darkPrimary border border-border-light dark:border-border-dark hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark focus:ring-primary/20",

    edit: "bg-primary text-background-light hover:bg-primary-hover focus:ring-primary/30 border border-primary",

    danger:
      "bg-danger text-white hover:bg-danger-hover focus:ring-danger/30 border border-danger",

    outline:
      "border border-primary text-primary bg-transparent hover:bg-soft-light dark:hover:bg-soft-dark focus:ring-primary/20",
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
