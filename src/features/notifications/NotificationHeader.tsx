interface Props {
  onMarkAll: () => void;
}

export default function NotificationHeader({ onMarkAll }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border-accentLight dark:border-border-dark">
      <span className="font-semibold text-text-accentLight dark:text-text-accentDark">
        Notification
      </span>
      <button
        onClick={onMarkAll}
        className="text-xs text-primary hover:text-primary-soft transition-colors"
      >
        Mark all as read
      </button>
    </div>
  );
}
