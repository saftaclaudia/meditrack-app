import { useEffect } from "react";
import { Bell } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchNotifications } from "./notificationsThunks";
import { markAsRead, markAllAsRead } from "./notificationsSlice";

import NotificationItem from "./NotificationItem";
import Dropdown from "../../components/ui/Dropdown";
import NotificationHeader from "./NotificationHeader";
import NotificationEmpty from "./NotificationEmpty";

export function NotificationDropdown() {
  const dispatch = useAppDispatch();

  const notifications = useAppSelector((state) => state.notifications.items);
  const loading = useAppSelector((state) => state.notifications.loading);
  const error = useAppSelector((state) => state.notifications.error);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Dropdown
      trigger={
        <button className="relative p-2 rounded-full hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark focus:ring-2 focus:ring-primary-soft transition">
          <Bell size={20} className="text-text-icon dark:text-text-iconDark" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full bg-danger-soft text-white">
              {unreadCount}
            </span>
          )}
        </button>
      }
      className="w-72 left-0 md:right-0 md:left-auto rounded-xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark shadow-md"
    >
      {/* HEADER */}
      <NotificationHeader onMarkAll={() => dispatch(markAllAsRead())} />

      {/* CONTENT */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <p className="text-center py-4 text-text-secondary dark:text-text-darkSecondary">
            Loading...
          </p>
        ) : error ? (
          <p className="text-center py-4 text-danger-soft">{error}</p>
        ) : notifications.length === 0 ? (
          <NotificationEmpty />
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
