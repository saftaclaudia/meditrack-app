import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FolderOpen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

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
  const [activeFilter, setActiveFilter] = useState<ExamFilter>("all");

  const exams = useAppSelector(selectExamsWithStatus);
  const rawExams = useAppSelector(selectExamsItems);
  const sumary = useAppSelector(selectExamsSummary);
  const dueExams = useMemo(() => getDueExams(rawExams), [rawExams]);

  const loading = useAppSelector((state) => state.exams.loading);

  // counts for filter bar
  const counts: Record<ExamFilter, number> = {
    all: exams.length,
    upcoming: sumary.upcoming,
    due: dueExams.length,
    done: sumary.done,
    overdue: sumary.overdue,
  };

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  // filtered exams
  const filteredExams = useMemo(() => {
    if (activeFilter === "all") return exams;
    if (activeFilter === "due") return [];
    if (activeFilter === "upcoming")
      return exams.filter(
        (e) => e.status === "upcoming" || e.status === "soon",
      );
    return exams.filter((e) => e.status === activeFilter);
  }, [exams, activeFilter]);

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
          <p className="text-ex font-light tracking-widest upercase text-text-muted dark:text-text-darkMuted mb-1">
            {t("exams.subtitle")}
          </p>
          <h1 className="font-serif font-light text-3xl text-primary">
            {t("exams.title")}
          </h1>
          <button
            onClick={() => navigate("/exams/dossier")}
            className="flex items-center gap-1.5 text-xs font-light text-text-muted dark:text-text-darkMuted hover:text-primary transition-colors mt-1.5"
          >
            <FolderOpen size={13} />
            {t("dossier.open_btn")}
          </button>
        </div>

        {/* Desktop button */}
        <div className="hidden md:block">
          <Button onClick={() => navigate("/exams/new")}>{t("exams.add")}</Button>
        </div>
      </div>

      {/* Filter bar */}
      <ExamFilterBar
        active={activeFilter}
        onChange={setActiveFilter}
        counts={counts}
      />

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
              onDelete={(id) => dispatch(deleteExam(id))}
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
