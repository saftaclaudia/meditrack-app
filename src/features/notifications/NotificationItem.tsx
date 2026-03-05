import clsx from "clsx";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  onRead: (id: string) => void;
}

export default function NotificationItem({
  id,
  title,
  message,
  timestamp,
  read,
  onRead,
}: NotificationItemProps) {
  return (
    <div
      onClick={() => onRead(id)}
      className={clsx(
        "px-4 py-3 border-b cursor-pointer transition",
        "border-border-light dark:border-border-dark",
        "hover:bg-soft-hoverLight dark:hover:bg-soft-hoverDark",
        !read && "bg-soft-light dark:bg-soft-dark font-medium",
      )}
    >
      <p className="text-sm text-text-primary dark:text-text-darkPrimary">
        {title}
      </p>
      <p className="text-xs text-text-secondary dark:text-text-darkSecondary">
        {message}
      </p>
      <p className="text-[10px] mt-1 text-text-muted dark:text-text-darkMuted">
        {new Date(timestamp).toLocaleString()}
      </p>
    </div>
  );
}
