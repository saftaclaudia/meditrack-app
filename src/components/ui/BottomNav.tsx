import { NavLink } from "react-router-dom";
import { Home, ClipboardList, Plus, Settings } from "lucide-react";
import clsx from "clsx";

const itemBase =
  "flex flex-col items-center justify-center gap-1 text-xs transition";
const itemActive = "text-primary scale-110";
const itemInactive =
  "text-text-secondary dark:text-text-darkSecondary hover:text-primary dark:hover:text-primary";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-md bg-surface-cardLight/90 dark:bg-surface-cardDark/90 backdrop-blur border-t border-border-light dark:border-border-dark px-2 py-2">
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
            <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-hover active:scale-95 transition">
              <Plus size={24} />
            </div>
          </NavLink>

          {/* Spacer */}
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
