import { useRef, useState, type ReactNode } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import clsx from "clsx";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  mobileFixed?: boolean;
}

export default function Dropdown({
  trigger,
  children,
  className,
  mobileFixed = false,
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
            "rounded-2xl shadow-md shadow-black/5 z-50 p-2",
            "bg-surface-cardLight dark:bg-surface-cardDark",
            "border border-border-light dark:border-border-dark",
            mobileFixed
              ? "fixed left-2 right-2 top-16 md:absolute md:left-auto md:top-auto md:mt-2"
              : "absolute mt-2",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
