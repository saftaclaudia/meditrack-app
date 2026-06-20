import { Link, useLocation } from "react-router-dom";
import { Plus, Home, ClipboardList, User } from "lucide-react";
import getPageTitle from "../../utils/getPageTitle";
import clsx from "clsx";

import { NotificationDropdown } from "../../features/notifications/NotificationDropdown";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/exams", label: "Exams", icon: ClipboardList, end: true },
  { to: "/calories", label: "Nutrition", icon: User, end: true },
  { to: "/exams/new", label: "Add", icon: Plus, end: true },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 backdrop-blur-md border-b",
        "bg-background-light/90 dark:bg-background-dark/95",
        "border-border-light dark:border-border-accentDark transition-colors duration-300",
      )}
    >
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between py-4">
          <Link
            to="/"
            className="font-serif text-xl font-light tracking-widest text-primary hover:text-primary-hover transition-colors duration-200"
          >
            Meditrack
          </Link>

          <div className="flex items-center gap-6">
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

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <UserMenu />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between py-3">
          <NotificationDropdown />

          <span className="font-serif text-base font-light tracking-widest text-primary">
            {pageTitle || "Meditrack"}
          </span>

          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
