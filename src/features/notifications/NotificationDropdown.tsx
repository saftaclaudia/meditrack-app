import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchNotifications } from "./notificationsThunks";
import { Bell } from "lucide-react";
import { markAllAsRead, markAsRead } from "./notificationsSlice";
import clsx from "clsx";

export function NotificationDropdown() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);
  const loading = useAppSelector((state) => state.notifications.loading);
  const error = useAppSelector((state) => state.notifications.error);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-pink-100 dark:hover:bg-gray-800 transition"
      >
        <Bell size={20} className="text-pink-500" />
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div
          className={clsx(
            "absolute mt-2 w-72 rounded-xl bg-white dark:bg-gray-900 border border-pink-100 dark:border-gray-700 shadow-lg z-50",
            "left-0 md:right-0 md:left-auto", // 🔹 asta face dropdown-ul să fie în stânga pe mobil, dreapta pe desktop
          )}
          style={{ minWidth: "16rem", maxWidth: "calc(100vw - 1rem)" }} // 🔹 nu depășește ecranul
        >
          <div className="flex justify-between items-center px-4 py-2 border-b border-pink-100 dark:border-gray-700">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Notifications
            </span>
            <button
              className="text-sm text-pink-500 hover:underline"
              onClick={() => dispatch(markAllAsRead())}
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <p className="text-center py-4 text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center py-4 text-red-500">{error}</p>
            ) : notifications.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => dispatch(markAsRead(n.id))}
                  className={clsx(
                    "px-4 py-3 border-b border-pink-100 dark:border-gray-700 cursor-pointer hover:bg-pink-50 dark:hover:bg-gray-800",
                    !n.read && "bg-pink-50 dark:bg-gray-800 font-medium",
                  )}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(n.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
