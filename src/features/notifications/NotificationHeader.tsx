import { useTranslation } from "react-i18next";

interface Props {
  onMarkAll: () => void;
}

export default function NotificationHeader({ onMarkAll }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border-accentLight dark:border-border-dark">
      <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
        {t("notifications.title")}
      </span>
      <button
        onClick={onMarkAll}
        className="text-xs font-light text-primary hover:text-primary-hover nsition-colors"
      >
        {t("notifications.mark_all")}
      </button>
    </div>
  );
}
