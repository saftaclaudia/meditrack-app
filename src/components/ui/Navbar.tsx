import { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { User, Plus, Home, ClipboardList, Settings } from "lucide-react";
import clsx from "clsx";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { NotificationDropdown } from "../../features/notifications/NotificationDropdown";

/* ---------- styles ---------- */

const navItemBase =
  "flex items-center gap-2 text-sm font-medium transition px-3 py-2 rounded-lg";

const navItemActive =
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";

const navItemInactive =
  "text-stone-600 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-800";

/* ---------- helper ---------- */

function getPageTitle(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/exams/new")) return "Add Exam";
  if (pathname.startsWith("/exams")) return "Medical Exams";
  if (pathname.startsWith("/settings")) return "Settings";
  return "";
}

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur border-b border-stone-200 dark:border-stone-700">
      <div className="max-w-5xl mx-auto px-5 py-4">
        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-semibold tracking-wide text-stone-800 dark:text-stone-100"
          >
            MediTrack
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
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
                clsx(navItemBase, isActive ? navItemActive : navItemInactive)
              }
            >
              <Plus size={18} />
              Add
            </NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 relative">
            <NotificationDropdown />

            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-amber-50 dark:hover:bg-stone-800 transition"
            >
              <User size={20} className="text-stone-600 dark:text-stone-300" />
            </button>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden flex items-center justify-between">
          {/* Left - Notifications */}
          <NotificationDropdown />

          {/* Center - Page Title */}
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
            {pageTitle}
          </span>

          {/* Right - User */}
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-amber-50 dark:hover:bg-stone-800 transition"
          >
            <User size={20} className="text-stone-600 dark:text-stone-300" />
          </button>
        </div>

        {/* ================= USER DROPDOWN (shared) ================= */}
        {isUserMenuOpen && (
          <div className="absolute right-5 top-16 w-48 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg p-2">
            <NavLink
              to="/settings"
              onClick={() => setIsUserMenuOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                  isActive
                    ? "bg-amber-50 text-amber-600"
                    : "hover:bg-stone-100 dark:hover:bg-stone-700",
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
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
