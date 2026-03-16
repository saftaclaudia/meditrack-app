import { useAppDispatch } from "../../app/hooks";
import { NavLink } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import clsx from "clsx";
import { Settings, User } from "lucide-react";
import Dropdown from "./Dropdown";

export default function UserMenu() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Dropdown
      trigger={
        <button className="p-2 rounded-full hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark focus:ring-2 focus:ring-primary-soft transition">
          <User size={20} className="text-text-icon dark:text-text-iconDark" />
        </button>
      }
      className="right-0 w-48"
    >
      <div className="p-2 flex flex-col gap-1">
        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
              isActive
                ? "bg-soft-light dark:bg-soft-dark text-primary font-medium"
                : "text-text-secondary dark:text-text-darkSecondary hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark",
            )
          }
        >
          <Settings size={16} />
          Settings
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-danger-soft hover:bg-danger-soft transition"
        >
          Logout
        </button>
      </div>
    </Dropdown>
  );
}
