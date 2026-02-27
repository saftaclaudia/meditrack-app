export type ExamStatus = "overdue" | "upcoming" | "soon" | "done";

export function getExamStatus(
  nextDate?: string,
  lastDate?: string,
): ExamStatus {
  if (!nextDate) {
    if (lastDate) return "done";
    return "upcoming"; //fallback
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDate = new Date(nextDate);
  examDate.setHours(0, 0, 0, 0);

  const diffDays =
    (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "overdue";
  if (diffDays <= 7) return "soon";
  return "upcoming";
}
