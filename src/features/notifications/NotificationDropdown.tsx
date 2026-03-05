import { useEffect } from "react";
import { Bell } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchNotifications } from "./notificationsThunks";
import { markAsRead, markAllAsRead } from "./notificationsSlice";

import NotificationItem from "./NotificationItem";

import Dropdown from "../../components/ui/Dropdown";

export function NotificationDropdown() {
  const dispatch = useAppDispatch();

  const notifications = useAppSelector((state) => state.notifications.items);
  const loading = useAppSelector((state) => state.notifications.loading);
  const error = useAppSelector((state) => state.notifications.error);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <Dropdown
      trigger={
        <button className="relative p-2 rounded-full hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark transition">
          <Bell size={20} className="text-text-icon dark:text-text-iconDark" />

          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-danger" />
          )}
        </button>
      }
      className="w-72 left-0 md:right-0 md:left-auto"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark">
        <span className="text-sm font-semibold text-text-primary dark:text-text-darkPrimary">
          Notifications
        </span>

        {notifications.length > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="text-xs text-primary hover:underline"
          >
            Mark all
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <p className="text-center py-4 text-text-secondary">Loading...</p>
        ) : error ? (
          <p className="text-center py-4 text-danger">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-center py-4 text-text-secondary">
            No notifications
          </p>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              {...n}
              onRead={(id) => dispatch(markAsRead(id))}
            />
          ))
        )}
      </div>
    </Dropdown>
  );
}
