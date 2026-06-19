import { useEffect } from "react";
import { Bell } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notificationsThunks";

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
        <button className="relative p-1.5 rounded-full hover:bg-soft-light dark:hover:bg-soft-hoverDark transition">
          <Bell size={20} className="text-text-icon dark:text-text-iconDark" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-danger text-background-light">
              {unreadCount}
            </span>
          )}
        </button>
      }
      className="w-72 left-0 md:right-0 md:left-auto "
    >
      {/* HEADER */}
      <NotificationHeader
        onMarkAll={() => dispatch(markAllNotificationsAsRead())}
      />

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
              key={n._id}
              {...n}
              onRead={(id) => dispatch(markNotificationAsRead(id))}
            />
          ))
        )}
      </div>
    </Dropdown>
  );
}
