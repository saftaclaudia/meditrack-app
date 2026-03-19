import { Link, useLocation } from "react-router-dom";
import { Plus, Home, ClipboardList } from "lucide-react";
import getPageTitle from "../../utils/getPageTitle";
import clsx from "clsx";

import { NotificationDropdown } from "../../features/notifications/NotificationDropdown";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";

const navItems = [
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
        "sticky top-0 z-50 backdrop-blur-md border-b",
        "bg-background-light/90 dark:bg-background-dark/90",
        "border-border-light dark:border-border-dark transition-colors duration-300",
      )}
    >
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between py-4">
          <Link
            to="/"
            className="font-serif text-xl font-light tracking-widest text-text-primary dark:text-text-darkPrimary hover:text-primary transition-colors duration-200"
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

          <span className="font-serif text-base font-light tracking-widest text-text-primary dark:text-text-darkPrimary">
            {pageTitle || "Meditrack"}
          </span>

          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
