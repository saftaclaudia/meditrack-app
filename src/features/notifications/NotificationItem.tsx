import clsx from "clsx";
import type { NotificationType } from "../../types/notification";

interface NotificationItemProps {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: NotificationType;
  onRead: (id: string) => void;
}

export default function NotificationItem({
  _id,
  title,
  message,
  createdAt,
  read,
  type,
  onRead,
}: NotificationItemProps) {
  return (
    <div
      onClick={() => onRead(_id)}
      className={clsx(
        "p-3 mb-1 cursor-pointer transition rounded-xl",

        !read && "bg-soft-light dark:bg-soft-dark",
        "hover:bg-soft-light dark:hover:bg-soft-hoverDark",
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
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        {!read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(_id);
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
