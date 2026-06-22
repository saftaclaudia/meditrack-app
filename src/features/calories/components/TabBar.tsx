import { useTranslation } from "react-i18next";

export type TabId = "log" | "profile" | "history" | "recipes";

const TAB_IDS: TabId[] = ["log", "history", "recipes", "profile"];

interface TabBarProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export function TabBar({ activeTab, onChange }: TabBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-1 p-1 rounded-xl bg-surface-light dark:bg-surface-dark w-fit">
      {TAB_IDS.map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-5 py-1.5 rouded-lg text-xs font-light tracking-wider uppercase transition-all duration-200 ${activeTab === id ? "bg-background-light dark:bg-background-dark text-text-primary dark:text-text-darkPrimary" : "text-text-muted dark:text-text-darkMuted hover:text-text-primary dark:hover:text-text-darkPrimary"}`}
        >
          {t(`nutrition.tab_${id}`)}
        </button>
      ))}
    </div>
  );
}
