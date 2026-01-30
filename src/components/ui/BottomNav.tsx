import { NavLink } from "react-router-dom";
import { Home, ClipboardList, Plus, Settings } from "lucide-react";
import clsx from "clsx";

const itemBase =
  "flex flex-col items-center justify-center gap-1 text-xs transition";

const itemActive = "text-pink-600 dark:text-pink-400 scale-110";

const itemInactive =
  "text-gray-400 hover:text-pink-500 dark:hover:text-pink-400";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t border-pink-100 dark:border-gray-800 px-2 py-2">
        <div className="grid grid-cols-5 items-center">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(itemBase, isActive ? itemActive : itemInactive)
            }
          >
            <Home size={22} />
            <span>Home</span>
          </NavLink>

          {/* Exams */}
          <NavLink
            to="/exams"
            className={({ isActive }) =>
              clsx(itemBase, isActive ? itemActive : itemInactive)
            }
          >
            <ClipboardList size={22} />
            <span>Exams</span>
          </NavLink>

          {/* Add (FAB center) */}
          <NavLink
            to="/exams/new"
            className={({ isActive }) =>
              clsx("flex items-center justify-center", isActive && "scale-110")
            }
          >
            <div className="h-12 w-12 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg hover:bg-pink-600 active:scale-95 transition">
              <Plus size={24} />
            </div>
          </NavLink>

          {/* Spacer implicit – grid */}
          <div />

          {/* Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(itemBase, isActive ? itemActive : itemInactive)
            }
          >
            <Settings size={22} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
