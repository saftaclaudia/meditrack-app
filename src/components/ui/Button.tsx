import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "edit" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  fullWidth = false,
  ...rest
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform  ";

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-pink-400 text-white hover:bg-pink-500 dark:bg-pink-600 dark:hover:bg-pink-700 focus:ring-pink-300 dark:focus:ring-pink-500 ",
    secondary:
      "bg-grey-50 text-gray-900 border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-500 ",
    edit: "bg-indigo-400 text-white hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:ring-indigo-300 dark:focus:ring-indigo-500 ",
    danger:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-500 ",
  };
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
