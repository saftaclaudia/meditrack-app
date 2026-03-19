import type { ButtonHTMLAttributes, ReactNode } from "react";

type FabVariant = "primary" | "danger";
type FabSize = "md" | "lg";

interface FabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: FabVariant;
  size?: FabSize;
}

export function FabButton({
  icon = "+",
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: FabButtonProps) {
  const variantStyles: Record<FabVariant, string> = {
    primary: "bg-primary hover:bg-[#b39470] focus:ring-primary",
    danger: "bg-danger hover:bg-[#a84848] focus:ring-danger",
  };

  const sizeStyles: Record<FabSize, string> = {
    md: "h-12 w-12 text-xl",
    lg: "h-14 w-14 text-2xl",
  };

  return (
    <button
      className={`
        fixed bottom-24 right-5
        z-[60]
        flex items-center justify-center rounded-full
        text-background-light shadow-md shadow-black/10
        transition transform
        active:scale-95 
        focus:outline-none
        focus:ring-2 focus:ring-offset-2
        focus:ring-offset-surface-light dark:focus:ring-offset-surface-dark
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        md:hidden
        ${className}
      `}
      {...rest}
    >
      {icon}
    </button>
  );
}
