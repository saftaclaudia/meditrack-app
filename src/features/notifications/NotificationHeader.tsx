interface Props {
  onMarkAll: () => void;
}

export default function NotificationHeader({ onMarkAll }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border-accentLight dark:border-border-dark">
      <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
        Notification
      </span>
      <button
        onClick={onMarkAll}
        className="text-xs font-light text-primary hover:text-primary-hover nsition-colors"
      >
        Mark all as read
      </button>
    </div>
  );
}
