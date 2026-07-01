import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FolderOpen, Search, ArrowUpDown, Download } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useToast } from "../../../context/ToastContext";
import { exportExamsToCSV } from "../utils/exportExams";

import { Button } from "../../../components/ui/Button";
import { FabButton } from "../../../components/ui/FabButton";
import { ExamFilterBar, type ExamFilter } from "../components/ExamFilterBar";
import {
  selectExamsItems,
  selectExamsSummary,
  selectExamsWithStatus,
} from "../examsSelectors";
import { useEffect, useMemo, useState } from "react";
import { getDueExams } from "../utils/getRecommendedStatus";
import { ExamSection } from "../components/ExamSection";
import { RecommendedExamCard } from "../components/RecommendedExamCard";
import { ExamCard } from "../components/ExamCard";
import { deleteExam, fetchExams } from "../examsThunks";
import type { ExamWithMongoId } from "../../../types/exam";

export function ExamsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState<ExamFilter>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "nextDate" | "lastDate">("nextDate");

  const exams = useAppSelector(selectExamsWithStatus);
  const rawExams = useAppSelector(selectExamsItems);
  const summary = useAppSelector(selectExamsSummary);
  const dueExams = useMemo(() => getDueExams(rawExams), [rawExams]);

  const loading = useAppSelector((state) => state.exams.loading);

  // counts for filter bar
  const counts: Record<ExamFilter, number> = {
    all: exams.length,
    upcoming: summary.upcoming,
    due: dueExams.length,
    done: summary.done,
    overdue: summary.overdue,
  };

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  // filtered + searched + sorted exams
  const filteredExams = useMemo(() => {
    let list = exams;
    if (activeFilter !== "all" && activeFilter !== "due") {
      if (activeFilter === "upcoming")
        list = list.filter((e) => e.status === "upcoming" || e.status === "soon");
      else
        list = list.filter((e) => e.status === activeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.doctor ?? "").toLowerCase().includes(q) ||
          (e.clinic ?? "").toLowerCase().includes(q) ||
          (e.speciality ?? "").toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      const da = a[sortBy] ?? "";
      const db = b[sortBy] ?? "";
      return da < db ? -1 : da > db ? 1 : 0;
    });
  }, [exams, activeFilter, search, sortBy]);

  const showDueSection = activeFilter === "all" || activeFilter === "due";
  const showExamsSection = activeFilter !== "due";

  const sectionTitle =
    activeFilter === "all"
      ? t("exams.filter_all")
      : activeFilter === "upcoming"
        ? t("exams.filter_upcoming")
        : activeFilter === "overdue"
          ? t("exams.filter_overdue")
          : t("exams.filter_done");

  if (loading)
    return (
      <p className="text-center mt-10 font-light tracking-wide text-text-muted dark:text-text-darkMuted">
        {t("exams.loading")}
      </p>
    );

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted mb-1">
            {t("exams.subtitle")}
          </p>
          <h1 className="font-serif font-light text-3xl text-primary">
            {t("exams.title")}
          </h1>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-2">
          {rawExams.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportExamsToCSV(rawExams)}
              title={t("exams.export_csv")}
            >
              <Download size={13} className="inline mr-1.5" />
              {t("exams.export_csv")}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/exams/dossier")}
          >
            <FolderOpen size={13} className="inline mr-1.5" />
            {t("dossier.open_btn")}
          </Button>
          <div className="hidden md:block">
            <Button onClick={() => navigate("/exams/new")}>{t("exams.add")}</Button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {exams.length > 0 && (() => {
        const nextUpcoming = [...exams]
          .filter((e) => e.nextDate && new Date(e.nextDate) > new Date())
          .sort((a, b) => a.nextDate.localeCompare(b.nextDate))[0];
        const daysUntilNext = nextUpcoming
          ? Math.ceil((new Date(nextUpcoming.nextDate).getTime() - Date.now()) / 86_400_000)
          : null;
        const lastDone = [...exams]
          .filter((e) => e.lastDate)
          .sort((a, b) => b.lastDate.localeCompare(a.lastDate))[0];
        return (
          <div className="grid grid-cols-3 gap-3">
            {nextUpcoming && daysUntilNext !== null && (
              <div className="rounded-xl border border-border-light dark:border-border-dark px-3 py-2.5 space-y-0.5">
                <p className="text-[10px] font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.stat_next")}
                </p>
                <p className="text-sm font-light text-text-primary dark:text-text-darkPrimary truncate">{nextUpcoming.name}</p>
                <p className="text-[10px] text-primary">{t("exams.stat_days", { n: daysUntilNext })}</p>
              </div>
            )}
            {summary.overdue > 0 && (
              <div className="rounded-xl border border-danger/30 bg-danger/5 px-3 py-2.5 space-y-0.5">
                <p className="text-[10px] font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.stat_overdue")}
                </p>
                <p className="text-2xl font-light text-danger">{summary.overdue}</p>
                <p className="text-[10px] text-danger">{t("exams.filter_overdue")}</p>
              </div>
            )}
            {lastDone && (
              <div className="rounded-xl border border-border-light dark:border-border-dark px-3 py-2.5 space-y-0.5">
                <p className="text-[10px] font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
                  {t("exams.stat_last")}
                </p>
                <p className="text-sm font-light text-text-primary dark:text-text-darkPrimary truncate">{lastDone.name}</p>
                <p className="text-[10px] text-text-muted dark:text-text-darkMuted">{lastDone.lastDate}</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Filter bar */}
      <ExamFilterBar
        active={activeFilter}
        onChange={setActiveFilter}
        counts={counts}
      />

      {/* Search + sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-darkMuted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("exams.search_placeholder")}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark text-sm text-text-primary dark:text-text-darkPrimary placeholder:text-text-muted dark:placeholder:text-text-darkMuted focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="relative">
          <ArrowUpDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-darkMuted pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="pl-8 pr-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark text-sm text-text-primary dark:text-text-darkPrimary focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
          >
            <option value="nextDate">{t("exams.sort_next")}</option>
            <option value="lastDate">{t("exams.sort_last")}</option>
            <option value="name">{t("exams.sort_name")}</option>
          </select>
        </div>
      </div>

      {/* Due section */}
      {showDueSection && dueExams.length > 0 && (
        <ExamSection
          title={t("exams.due_section_title")}
          subtitle={t("exams.due_section_subtitle")}
          count={dueExams.length}
          empty={t("exams.due_section_empty")}
        >
          {dueExams.map((exam) => (
            <RecommendedExamCard key={exam.id} exam={exam} />
          ))}
        </ExamSection>
      )}

      {/* Exams section */}
      {showExamsSection && (
        <ExamSection
          title={sectionTitle}
          count={filteredExams.length}
          empty={t("exams.section_empty")}
        >
          {filteredExams.map((exam) => (
            <ExamCard
              key={(exam as ExamWithMongoId)._id ?? exam.id}
              exam={exam}
              onView={(exam) =>
                navigate(`/exams/${(exam as ExamWithMongoId)._id ?? exam.id}`)
              }
              onEdit={(exam) =>
                navigate(
                  `/exams/${(exam as ExamWithMongoId)._id ?? exam.id}/edit`,
                )
              }
              onDelete={async (id) => {
                try {
                  await dispatch(deleteExam(id)).unwrap();
                  showToast(t("exams.delete_success"));
                } catch {
                  showToast(t("exams.delete_error"), "error");
                }
              }}
            />
          ))}
        </ExamSection>
      )}

      {/* Mobile FAB */}
      <FabButton
        icon="🤍"
        aria-label="Add exam"
        onClick={() => navigate("/exams/new")}
      />
    </div>
  );
}
