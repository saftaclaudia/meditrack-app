import { Bell } from "lucide-react";

export default function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-text-secondary dark:text-text-darkSecondary">
      <Bell size={22} className="mb-2 opacity-30" />
      <p className="text-xs font-light tracking-wide">You're all caught up</p>
    </div>
  );
}
