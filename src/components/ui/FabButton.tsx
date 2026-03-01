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
  const variantStyles = {
    primary: `bg-primary hover:bg-primary-hover focus:ring-primary-soft`,
    danger: `bg-danger hover:bg-danger-hover focus:ring-danger-soft`,
  };

  const sizeStyle = {
    md: "h-12 w-12 text-xl",
    lg: "h-14 w-14 text-2xl",
  };

  return (
    <button
      className={`
        fixed bottom-20 right-6
        z-[60]
        flex items-center justify-center rounded-full
      text-white shadow-lg
        transition
        active:scale-95

        focus:outline-none 
        focus:ring-2
        focus:ring-offset-2
        focus:ring-offset-surface-light
        dark:focus:ring-offset-surface-dark

        ${variantStyles[variant]}
        ${sizeStyle[size]} 
      
        md:hidden
        ${className}
      `}
      {...rest}
    >
      {icon}
    </button>
  );
}
