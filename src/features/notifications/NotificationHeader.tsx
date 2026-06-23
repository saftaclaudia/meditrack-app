import { useTranslation } from "react-i18next";

interface Props {
  onMarkAll: () => void;
  onClearAll: () => void;
  hasNotifications: boolean;
}

export default function NotificationHeader({ onMarkAll, onClearAll, hasNotifications }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border-accentLight dark:border-border-dark">
      <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
        {t("notifications.title")}
      </span>
      {hasNotifications && (
        <div className="flex items-center gap-3">
          <button
            onClick={onMarkAll}
            className="text-xs font-light text-primary hover:text-primary-hover transition-colors"
          >
            {t("notifications.mark_all")}
          </button>
          <button
            onClick={onClearAll}
            className="text-xs font-light text-text-muted dark:text-text-darkMuted hover:text-danger transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
