import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotificationEmpty() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-6 text-text-secondary dark:text-text-darkSecondary">
      <Bell size={22} className="mb-2 opacity-30" />
      <p className="text-xs font-light tracking-wide">{t("notifications.empty")}</p>
    </div>
  );
}
