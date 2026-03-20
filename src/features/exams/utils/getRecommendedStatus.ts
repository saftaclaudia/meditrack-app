import type { Exam } from "../../../types/exam";
import {
  RECOMMENDED_EXAMS,
  type RecommendedExam,
} from "../constants/recommendedExams";

export type RecommendedStatus = "due" | "scheduled" | "ok";

export interface RecommendedExamWithStatus extends RecommendedExam {
  status: RecommendedStatus;
  matchedExam?: Exam;
  monthsOverdue?: number;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function matchesRecommended(exam: Exam, recommended: RecommendedExam): boolean {
  const examName = normalizeName(exam.name);
  const recName = normalizeName(recommended.name);

  return examName.includes(recName) || recName.includes(examName);
}

function monthsSince(dateStr: string): number {
  if (!dateStr) return Infinity;
  const date = new Date(dateStr);
  const now = new Date();
  return (
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth())
  );
}

function hasUpcomingDate(dateStr: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) > new Date();
}

export function getRecommendedExamsWithStatus(
  userExams: Exam[],
): RecommendedExamWithStatus[] {
  return RECOMMENDED_EXAMS.map((recommended) => {
    const matches = userExams.filter((exam) =>
      matchesRecommended(exam, recommended),
    );

    if (matches.length === 0) {
      return { ...recommended, status: "due" as RecommendedStatus };
    }

    const sorted = matches.sort((prev, curr) => {
      const prevDate = prev.lastDate || prev.nextDate || "";
      const currDate = curr.lastDate || curr.nextDate || "";
      return currDate.localeCompare(prevDate);
    });
    const latest = sorted[0];

    if (hasUpcomingDate(latest.nextDate)) {
      return {
        ...recommended,
        status: "scheduled" as RecommendedStatus,
        matchedExam: latest,
      };
    }

    const monthsPassed = monthsSince(latest.lastDate || latest.nextDate);
    const isOverdue = monthsPassed >= recommended.frequencyMonths;

    if (isOverdue) {
      return {
        ...recommended,
        status: "due" as RecommendedStatus,
        matchedExam: latest,
        monthsOverdue: Math.round(monthsPassed - recommended.frequencyMonths),
      };
    }

    return {
      ...recommended,
      status: "ok" as RecommendedStatus,
      matchedExam: latest,
    };
  });
}

export function getDueExams(userExams: Exam[]): RecommendedExamWithStatus[] {
  return getRecommendedExamsWithStatus(userExams).filter(
    (e) => e.status === "due",
  );
}

export function getScheduledRecommended(
  userExams: Exam[],
): RecommendedExamWithStatus[] {
  return getRecommendedExamsWithStatus(userExams).filter(
    (e) => e.status === "scheduled",
  );
}
