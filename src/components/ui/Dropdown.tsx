import { useRef, useState, type ReactNode } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import clsx from "clsx";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Dropdown({
  trigger,
  children,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <div onClick={() => setIsOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            "absolute mt-2 rounded-xl shadow-md z-50 p-2 transition-all duration-200",
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
