import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ClipboardList, Flame, Settings } from "lucide-react";
import getPageTitle from "../../utils/getPageTitle";
import clsx from "clsx";

import { NotificationDropdown } from "../../features/notifications/NotificationDropdown";
import NavItem from "./NavItem";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../features/auth/authSelectors";

const navItems = [
  { to: "/", tKey: "nav.home", icon: Home, end: true },
  { to: "/exams", tKey: "nav.exams", icon: ClipboardList, end: true },
  { to: "/calories", tKey: "nav.nutrition", icon: Flame, end: true },
  { to: "/settings", tKey: "nav.settings", icon: Settings, end: true },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pageTitleKey = getPageTitle(pathname);
  const user = useAppSelector(selectAuthUser);

  const avatarColor = useAppSelector((s) => s.settings.avatarColor);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 backdrop-blur-md border-b pt-safe",
        "bg-background-light/90 dark:bg-background-dark/95",
        "border-border-light dark:border-border-dark transition-colors duration-300",
      )}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between py-4">
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-widest uppercase text-primary hover:text-primary-hover transition-colors duration-200"
          >
            Meditrack
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={t(item.tKey)}
                icon={item.icon}
                end={item.end}
              />
            ))}
          </div>

          <NotificationDropdown />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between py-4">
          {/* Avatar — click → Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            <span className="text-white text-xs font-bold">{initials}</span>
          </button>

          {/* Center: app name + current page */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-base font-bold tracking-widest uppercase leading-none text-primary">
              Meditrack
            </span>
            {pageTitleKey && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-[10px] font-semibold tracking-widest uppercase text-primary leading-tight">
                <span className="text-accent-rose">•</span>
                {t(pageTitleKey)}
                <span className="text-accent-rose">•</span>
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
