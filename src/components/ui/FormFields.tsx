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
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <input
        type={type}
        className={clsx(
          "rounded-lg border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-900 py-2 px-2",
          "text-gray-900 dark:text-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600",
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
      <span className="text-gray-600 dark:text-gray-300">{props.label}</span>
      <textarea
        className="min-h-[80px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600"
        {...props}
      />
    </label>
  );
}
