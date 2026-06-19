import { useAppDispatch } from "../../app/hooks";
import { NavLink } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import clsx from "clsx";
import { LogOut, Settings, User } from "lucide-react";
import Dropdown from "./Dropdown";

export default function UserMenu() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Dropdown
      trigger={
        <button className="p-1.5 rounded-full hover:bg-soft-light dark:hover:bg-soft-hoverDark transition">
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
                ? "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-light tracking-wide text-primary bg-soft-light dark:bg-soft-dark"
                : "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-light tracking-wide text-text-secondary dark:text-text-darkSecondary hover:bg-soft-light dark:hover:bg-soft-hoverDark transition",
            )
          }
        >
          <Settings size={16} />
          Settings
        </NavLink>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-light tracking-wide text-danger hover:bg-danger-soft dark:hover:bg-danger-softDark transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </Dropdown>
  );
}
