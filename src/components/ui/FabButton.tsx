import type { ButtonHTMLAttributes, ReactNode } from "react";

interface FabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}
export function FabButton({
  icon = "+",
  className = "",
  ...rest
}: FabButtonProps) {
  return (
    <button
      className={`
        fixed bottom-20 right-6
        z-[60]
        h-12 w-12
        rounded-full
        bg-pink-500 text-white text-2xl
        shadow-xl
        hover:bg-pink-600
        active:scale-95
        transition
        focus:outline-none focus:ring-2 focus:ring-pink-300
        dark:bg-pink-600 dark:hover:bg-pink-700
        md:hidden
        ${className}
      `}
      {...rest}
    >
      {icon}
    </button>
  );
}
