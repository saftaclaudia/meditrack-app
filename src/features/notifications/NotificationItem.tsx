import clsx from "clsx";
import type { NotificationType } from "../../types/notification";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  onRead: (id: string) => void;
}

export default function NotificationItem({
  id,
  title,
  message,
  timestamp,
  read,
  type,
  onRead,
}: NotificationItemProps) {
  return (
    <div
      onClick={() => onRead(id)}
      className={clsx(
        "p-3 mb-1 cursor-pointer transition rounded-lg border",
        "border-border-accentLight dark:border-border-dark",
        !read && "bg-soft-light dark:bg-soft-dark font-medium",
        "hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark",
        type === "appointment" && "border-l-2 border-primary",
        type === "reminder" && "border-l-2 border-status-soon-dot",
        type === "result" && "border-l-2 border-status-done-dot",
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-text-accentLight dark:text-text-accentDark">
            {title}
          </p>
          <p className="text-xs text-text-secondary dark:text-text-darkSecondary">
            {message}
          </p>
          <p className="text-[10px] mt-1 text-text-muted dark:text-text-darkMuted">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
        {!read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(id);
            }}
            className="text-[10px] text-primary hover:underline"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}
