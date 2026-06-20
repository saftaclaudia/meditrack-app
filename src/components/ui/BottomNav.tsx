import { NavLink } from "react-router-dom";
import { Home, ClipboardList, Plus, Settings } from "lucide-react";
import clsx from "clsx";

const itemBase =
  "flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200";

const itemActive = "text-primary";
const itemInactive =
  "text-text-muted dark:text-text-darkMuted hover:text-primary dark:hover:text-primary";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Fade edge top */}
      <div className="h-4 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent pointer-events-none" />

      <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-border-light dark:border-border-accentDark">
        <div className="max-w-md mx-auto px-4 pb-safe">
          <div className="grid grid-cols-5 items-center py-2">
            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                clsx(itemBase, isActive ? itemActive : itemInactive)
              }
            >
              <Home size={20} strokeWidth={1.5} />
              <span className="text-[10px] font-light tracking-widest uppercase">
                Home
              </span>
            </NavLink>

            {/* Exams */}
            <NavLink
              to="/exams"
              className={({ isActive }) =>
                clsx(itemBase, isActive ? itemActive : itemInactive)
              }
            >
              <ClipboardList size={20} strokeWidth={1.5} />
              <span className="text-[10px] font-light tracking-widest uppercase">
                Exams
              </span>
            </NavLink>

            {/* Add — FAB center */}
            <NavLink
              to="/exams/new"
              className="flex items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={clsx(
                    "h-12 w-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200 active:scale-95",
                    isActive
                      ? "bg-primary-hover"
                      : "bg-primary hover:bg-primary-hover",
                  )}
                >
                  <Plus
                    size={22}
                    strokeWidth={1.5}
                    className="text-background-light"
                  />
                </div>
              )}
            </NavLink>

            {/* Calories — placeholder */}
            <NavLink
              to="/calories"
              className={({ isActive }) =>
                clsx(itemBase, isActive ? itemActive : itemInactive)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a7 7 0 0 1 7 7c0 4-3 6-4 9H9c-1-3-4-5-4-9a7 7 0 0 1 7-7z" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
              <span className="text-[10px] font-light tracking-widest uppercase">
                Nutrition
              </span>
            </NavLink>

            {/* Settings*/}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                clsx(itemBase, isActive ? itemActive : itemInactive)
              }
            >
              <Settings size={20} strokeWidth={1.5} />
              <span className="text-[10px] font-light tracking-widest uppercase">
                Settings
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
