import type { Exam } from "../../../types/exam";
import {
  RECOMMENDED_EXAMS,
  type RecommendedExam,
} from "../constants/recommendedExams";

export type RecommendedStatus = "due" | "approaching" | "scheduled" | "ok";

export interface RecommendedExamWithStatus extends RecommendedExam {
  status: RecommendedStatus;
  matchedExam?: Exam;
  monthsOverdue?: number;
  monthsUntilDue?: number;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function matchesRecommended(exam: Exam, recommended: RecommendedExam): boolean {
  const examName = normalizeName(exam.name);
  const allNames = [recommended.name, ...recommended.aliases].map(normalizeName);
  return allNames.some(
    (rec) => examName.includes(rec) || rec.includes(examName),
  );
}

function monthsSince(dateStr: string): number {
  if (!dateStr) return Infinity;
  const date = new Date(dateStr.slice(0, 10) + "T00:00:00");
  const now = new Date();
  return (
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth())
  );
}

function hasUpcomingDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr.slice(0, 10) + "T00:00:00") >= today;
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

    // Has a future scheduled appointment → not due
    if (hasUpcomingDate(latest.nextDate)) {
      return {
        ...recommended,
        status: "scheduled" as RecommendedStatus,
        matchedExam: latest,
      };
    }

    const refDate = latest.lastDate || latest.nextDate;
    const monthsPassed = monthsSince(refDate);
    // Respect the specialist's recorded frequency; fall back to default
    const effectiveFrequency =
      latest.recommendedFrequencyMonths ?? recommended.frequencyMonths;
    const monthsRemaining = effectiveFrequency - monthsPassed;

    // Past the effective frequency → overdue
    if (monthsPassed >= effectiveFrequency) {
      return {
        ...recommended,
        status: "due" as RecommendedStatus,
        matchedExam: latest,
        monthsOverdue: Math.round(monthsPassed - effectiveFrequency),
      };
    }

    // Within 2 months of the effective frequency → approaching
    if (monthsRemaining <= 2) {
      return {
        ...recommended,
        status: "approaching" as RecommendedStatus,
        matchedExam: latest,
        monthsUntilDue: Math.round(monthsRemaining),
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
    (e) => e.status === "due" || e.status === "approaching",
  );
}

export function getScheduledRecommended(
  userExams: Exam[],
): RecommendedExamWithStatus[] {
  return getRecommendedExamsWithStatus(userExams).filter(
    (e) => e.status === "scheduled",
  );
}
