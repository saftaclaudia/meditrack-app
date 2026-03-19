import clsx from "clsx";
import type { ChangeEvent } from "react";

interface BaseFieldProps {
  label: string;
  name: string;
  value: string;
}
interface InputProps extends BaseFieldProps {
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
interface TextareaProps extends BaseFieldProps {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Input({ label, type = "text", ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
        {label}
      </span>

      <input
        type={type}
        className={clsx(
          "rounded-2xl border transition-colors duration-200",
          "border-border-light dark:border-border-dark",
          "bg-surface-cardLight dark:bg-surface-cardDark",
          "py-3 px-4",
          "text-text-primary dark:text-text-darkPrimary",
          "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
          "hover:border-primary/50",
          type === "date" && "cursor-pointer",
          "[color-scheme:light] dark:[color-scheme:dark]",
        )}
        {...props}
      />
    </label>
  );
}

export function Textarea(props: TextareaProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
        {props.label}
      </span>

      <textarea
        className="
          min-h-[100px]
          rounded-2xl
          border
          border-border-light dark:border-border-dark
          bg-surface-cardLight dark:bg-surface-cardDark
          px-4 py-3
          text-text-primary dark:text-text-darkPrimary
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
          hover:border-primary/50
          transition-colors duration-200
        "
        {...props}
      />
    </label>
  );
}
