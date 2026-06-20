import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ClipboardList, Flame, Settings } from "lucide-react";
import getPageTitle from "../../utils/getPageTitle";
import clsx from "clsx";

import { NotificationDropdown } from "../../features/notifications/NotificationDropdown";
import NavItem from "./NavItem";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../features/auth/authSelectors";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/exams", label: "Exams", icon: ClipboardList, end: true },
  { to: "/calories", label: "Nutrition", icon: Flame, end: true },
  { to: "/settings", label: "Settings", icon: Settings, end: true },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(pathname);
  const user = useAppSelector(selectAuthUser);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 backdrop-blur-md border-b",
        "bg-background-light/90 dark:bg-background-dark/95",
        "border-border-light dark:border-border-dark transition-colors duration-300",
      )}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between py-4">
          <Link
            to="/"
            className="font-sans text-lg font-bold tracking-tight text-primary hover:text-primary-hover transition-colors duration-200"
          >
            Meditrack
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                end={item.end}
              />
            ))}
          </div>

          <NotificationDropdown />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between py-2">
          {/* Avatar — click → Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0"
          >
            <span className="text-white text-xs font-bold">{initials}</span>
          </button>

          {/* Center: app name + current page */}
          <div className="flex flex-col items-center">
            <span className="font-sans text-sm font-bold tracking-tight text-primary leading-tight">
              Meditrack
            </span>
            {pageTitle && (
              <span className="text-[10px] font-medium tracking-widest uppercase text-text-muted dark:text-text-darkMuted leading-tight">
                {pageTitle}
              </span>
            )}
          </div>

          {/* Notifications */}
          <NotificationDropdown />
        </div>
      </div>
    </nav>
  );
}
