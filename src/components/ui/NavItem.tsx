import clsx from "clsx";
import { type LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
}

// Styles
const navItemBase =
  "flex items-center gap-2 text-sm font-medium transition px-3 py-2 rounded-lg";

const navItemActive = "bg-soft-light dark:bg-soft-dark text-primary";

const navItemInactive =
  "text-text-secondary dark:text-text-darkSecondary hover:bg-soft-hoverLight dark:hover:bg--soft-hoverDark";

export default function NavItem({ to, label, icon: Icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(navItemBase, isActive ? navItemActive : navItemInactive)
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}
