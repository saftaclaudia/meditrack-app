import clsx from "clsx";
import { type LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

// Styles
const navItemBase =
  "flex items-center gap-2 text-xs tracking-wide font-light transition-colors duration-200 px-3 py-2 rounded-lg";

const navItemActive = "bg-soft-light dark:bg-soft-dark text-primary";

const navItemInactive =
  "text-text-muted dark:text-text-darkMuted hover:bg-soft-light dark:hover:bg-soft-hoverDark";

export default function NavItem({ to, label, icon: Icon, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(navItemBase, isActive ? navItemActive : navItemInactive)
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}
