import { NavLink } from "react-router-dom";
import { Home, ClipboardList, Flame, Settings } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/exams", label: "Exams", icon: ClipboardList, end: false },
  { to: "/calories", label: "Nutrition", icon: Flame, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="h-4 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent pointer-events-none" />

      <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-border-light dark:border-border-dark">
        <div className="max-w-md mx-auto px-2 pb-safe">
          <div className="grid grid-cols-4 items-center py-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="flex items-center justify-center"
              >
                {({ isActive }) => (
                  <div className="flex flex-col items-center gap-1 py-1 px-3">
                    <div
                      className={clsx(
                        "flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200",
                        isActive
                          ? "bg-primary text-white"
                          : "text-text-muted dark:text-text-darkMuted",
                      )}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                    </div>
                    <span
                      className={clsx(
                        "text-[10px] font-medium tracking-wide transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-text-muted dark:text-text-darkMuted",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
