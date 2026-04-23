export type TabId = "log" | "profile" | "history";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "log", label: "Log" },
  { id: "history", label: "History" },
  { id: "profile", label: "Profile" },
];

interface TabBarProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-surface-light dark:bg-surface-dark w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-1.5 rouded-lg text-xs font-light tracking-wider uppercase transition-all duration-200 ${activeTab === tab.id ? "bg-background-light dark:bg-background-dark text-text-primary dark:text-text-darkPrimary" : "text-text-muted dark:text-text-darkMuted hover:text-text-primary dark:hover:text-text-darkPrimary"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
