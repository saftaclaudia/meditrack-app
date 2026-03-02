import { useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { User, Plus, Home, ClipboardList, Settings } from "lucide-react";
import getPageTitle from "../../utils/getPageTitle";
import clsx from "clsx";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { NotificationDropdown } from "../../features/notifications/NotificationDropdown";
import { useClickOutside } from "../../hooks/useClickOutside";
import NavItem from "./NavItem";

// Navigation
const navItem = [
  { to: "/", label: "Home", icon: Home },
  { to: "/exams", label: "Exams", icon: ClipboardList },
  { to: "/exams/new", label: "Add", icon: Plus },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsUserMenuOpen(false));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 backdrop-blur border-b",
        "bg-surface-cardLight/80 dark:bg-surface-cardDark/80",
        "border-border-light dark:border-border-dark",
      )}
    >
      <div className="max-w-5xl mx-auto px-5 py-4">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-bold tracking-wide text-text-accentLight dark:text-text-accentDark"
          >
            MediTrack
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
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

            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className={clsx(
                "p-2 rounded-full transition",
                "hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark",
              )}
            >
              <User
                size={20}
                className="text-text-icon dark:text-text-iconDark"
              />
            </button>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between">
          {/* Left */}
          <NotificationDropdown />

          {/* Center  */}
          <span className="text-sm font-semibold text-text-primary dark:text-text-darkPrimary">
            {pageTitle}
          </span>

          {/* Right */}
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark transition"
          >
            <User
              size={20}
              className="text-text-icon dark:text-text-iconDark"
            />
          </button>
        </div>

        {/* User Dropdown */}
        {isUserMenuOpen && (
          <div
            ref={menuRef}
            className={clsx(
              "absolute right-5 top-16 w-48 rounded-xl shadow-lg p-2",
              "bg-surface-cardLight dark:bg-surface-cardDark",
              "border border-border-light dark:border-border-dark",
            )}
          >
            <NavLink
              to="/settings"
              onClick={() => setIsUserMenuOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                  isActive
                    ? "bg-soft-light dark:bg-soft-dark text-primary"
                    : "hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark",
                )
              }
            >
              <Settings size={16} />
              Settings
            </NavLink>

            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                handleLogout();
              }}
              className={clsx(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition",
                "text-danger hover:bg-danger-soft",
              )}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
