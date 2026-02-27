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
      <span className="text-text-accentLight dark:text-text-accentDark">
        {label}
      </span>

      <input
        type={type}
        className={clsx(
          "rounded-lg border",
          "border-border-light dark:border-border-dark",
          "bg-surface-cardLight dark:bg-surface-cardDark",
          "py-2 px-3",
          "text-text-primary dark:text-text-darkPrimary",
          "focus:outline-none focus:ring-2 focus:ring-primary/40",
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
      <span className="text-text-accentLight dark:text-text-accentDark">
        {props.label}
      </span>

      <textarea
        className="
          min-h-[80px]
          rounded-lg
          border
          border-border-light
          dark:border-border-dark
          bg-surface-cardLight
          dark:bg-surface-cardDark
          px-3 py-2
          text-text-primary
          dark:text-text-darkPrimary
          focus:outline-none
          focus:ring-2
          focus:ring-primary/40
        "
        {...props}
      />
    </label>
  );
}
