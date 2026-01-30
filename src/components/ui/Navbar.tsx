import { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { User, Plus, Home, ClipboardList, Settings } from "lucide-react";
import clsx from "clsx";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { NotificationDropdown } from "../../features/notifications/NotificationDropdown";

/* ---------- helpers ---------- */

const navItemBase = "flex items-center gap-2 text-sm transition relative px-1";

const navItemActive =
  "text-pink-600 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-pink-500 after:rounded-full";

const navItemInactive = "text-gray-700 dark:text-gray-200 hover:text-pink-600";

function getPageTitle(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/exams/new")) return "Add exam";
  if (pathname.startsWith("/exams")) return "Exams";
  if (pathname.startsWith("/settings")) return "Settings";
  return "";
}

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-pink-100 dark:border-gray-800">
      <div className="relative mx-auto max-w-5xl px-4 py-3">
        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-bold text-pink-600 dark:text-pink-300"
          >
            🩷 MediTrack
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                clsx(navItemBase, isActive ? navItemActive : navItemInactive)
              }
            >
              <Home size={18} />
              Home
            </NavLink>

            <NavLink
              to="/exams"
              className={({ isActive }) =>
                clsx(navItemBase, isActive ? navItemActive : navItemInactive)
              }
            >
              <ClipboardList size={18} />
              Exams
            </NavLink>

            <NavLink
              to="/exams/new"
              className={({ isActive }) =>
                clsx(
                  navItemBase,
                  isActive
                    ? navItemActive
                    : "text-pink-500 hover:text-pink-600",
                )
              }
            >
              <Plus size={18} />
              Add
            </NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <NotificationDropdown />

            <button
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-gray-800 transition"
            >
              <User size={20} className="text-pink-500" />
            </button>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-2">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <NotificationDropdown />

            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {pageTitle}
            </span>

            <button
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-gray-800 transition"
            >
              <User size={20} className="text-pink-500" />
            </button>
          </div>

          {/* Branding */}
          <div className="flex justify-center">
            <span className="text-base font-bold text-pink-600 dark:text-pink-300">
              🩷 MediTrack
            </span>
          </div>
        </div>

        {/* ================= USER DROPDOWN (shared) ================= */}
        {isUserMenuOpen && (
          <div className="absolute right-4 top-14 w-44 rounded-xl bg-white dark:bg-gray-900 border border-pink-100 dark:border-gray-700 shadow-lg p-1 z-50">
            <NavLink
              to="/settings"
              onClick={() => setIsUserMenuOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                  isActive
                    ? "bg-pink-50 dark:bg-gray-800 text-pink-600"
                    : "text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800",
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
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
