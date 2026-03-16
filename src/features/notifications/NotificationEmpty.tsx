import { Bell } from "lucide-react";

export default function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-text-secondary dark:text-text-darkSecondary">
      <Bell size={28} className="mb-2 opacity-50" />
      <p className="text-sm">You're all caught up</p>
    </div>
  );
}
