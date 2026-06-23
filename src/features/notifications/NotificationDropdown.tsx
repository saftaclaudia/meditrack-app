import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "./notificationsThunks";

import NotificationItem from "./NotificationItem";
import Dropdown from "../../components/ui/Dropdown";
import NotificationHeader from "./NotificationHeader";
import NotificationEmpty from "./NotificationEmpty";

const POLL_INTERVAL_MS = 60_000;

export function NotificationDropdown() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const notifications = useAppSelector((state) => state.notifications.items);
  const loading = useAppSelector((state) => state.notifications.loading);
  const error = useAppSelector((state) => state.notifications.error);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    dispatch(fetchNotifications());

    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [dispatch]);

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
      mobileFixed
      className="md:w-72 md:right-0"
    >
      <NotificationHeader
        onMarkAll={() => dispatch(markAllNotificationsAsRead())}
        onClearAll={() => dispatch(clearAllNotifications())}
        hasNotifications={notifications.length > 0}
      />

      <div className="max-h-64 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <p className="text-center py-4 text-text-secondary dark:text-text-darkSecondary">
            {t("notifications.loading")}
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
              onDelete={(id) => dispatch(deleteNotification(id))}
            />
          ))
        )}
      </div>
    </Dropdown>
  );
}
