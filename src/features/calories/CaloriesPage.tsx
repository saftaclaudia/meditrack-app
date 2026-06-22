import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProfile } from "../profile/profileThunks";
import { TabBar, type TabId } from "./components/TabBar";
import { LogContent } from "./components/LogContent";
import { ProfilePage } from "../profile/pages/ProfilePage";
import { HistoryContent } from "./components/HistoryContent";

const VALID_TABS: TabId[] = ["log", "history", "profile"];

export default function CaloriesPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { profile } = useAppSelector((s) => s.profile);

  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TabId | null;
  const initialTab: TabId = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "log";

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const recommendedCalories = profile?.recommendedCalories ?? null;
  const dailyGoal = recommendedCalories ?? 2000;
  const profileIncomplete = !recommendedCalories;

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div>
        <p className="text-xs font-light tracking-wider uppercase text-text-muted dark:text-text-darkMuted mb-1">
          {t("nutrition.today")}
        </p>
        <h1 className="font-serif text-xl font-light text-primary">
          {t("nutrition.title")}
        </h1>
      </div>
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "log" && (
        <LogContent
          dailyGoal={dailyGoal}
          profileIncomplete={profileIncomplete}
        />
      )}
      {activeTab === "history" && <HistoryContent dailyGoal={dailyGoal} />}
      {activeTab === "profile" && <ProfilePage />}
    </div>
  );
}
