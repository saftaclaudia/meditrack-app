import { Link, useLocation } from "react-router-dom";
import { Plus, Home, ClipboardList } from "lucide-react";
import getPageTitle from "../../utils/getPageTitle";
import clsx from "clsx";

import { NotificationDropdown } from "../../features/notifications/NotificationDropdown";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";

const navItem = [
  { to: "/", label: "Home", icon: Home },
  { to: "/exams", label: "Exams", icon: ClipboardList },
  { to: "/exams/new", label: "Add", icon: Plus },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 backdrop-blur border-b",
        "bg-surface-cardLight/80 dark:bg-surface-cardDark/80",
        "border-border-light dark:border-border-dark transition-colors duration-300",
      )}
    >
      <div className="max-w-5xl mx-auto px-5 py-4">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-bold tracking-wide text-accent-pink dark:text-accent-lavender transition-colors duration-200"
          >
            MediTrack
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-5">
            {navItem.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 relative">
            <NotificationDropdown />
            <UserMenu />
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between">
          <NotificationDropdown />
          <span className="text-sm font-semibold text-accent-pink dark:text-accent-lavender transition-colors duration-200">
            {pageTitle}
          </span>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
