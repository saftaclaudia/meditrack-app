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
        "p-3 mb-1 cursor-pointer transition rounded-xl",

        !read && "bg-[#f5efe8] dark:bg-soft-dark",
        "hover:bg-[#f5efe8] dark:hover:bg-soft-hoverDark",
        type === "appointment" && " border-primary",
        type === "reminder" && " border-status-soon-dot",
        type === "result" && " border-status-done-dot",
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-light  text-text-primary dark:text-text-darkPrimary">
            {title}
          </p>
          <p className="text-xs font-light text-text-muted dark:text-text-darkMuted mt-0.5">
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
