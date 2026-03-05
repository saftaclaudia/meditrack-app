import { useRef, useState, type ReactNode } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import clsx from "clsx";

interface DorpdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Dropdown({
  trigger,
  children,
  className,
}: DorpdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <div onClick={() => setIsOpen((v) => !v)}>{trigger}</div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            "absolute mt-2 rounded-xl shadow-sm z-50 ",
            "bg-surface-cardLight dark:bg-surface-cardDark",
            "border border-border-light dark:border-border-dark",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
