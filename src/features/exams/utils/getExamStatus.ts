export type ExamStatus = "overdue" | "upcoming" | "soon" | "done";

export function getExamStatus(
  nextDate?: string,
  lastDate?: string,
): ExamStatus {
  // No next appointment scheduled
  if (!nextDate) {
    return lastDate ? "done" : "upcoming";
  }

  const nextStr = nextDate.slice(0, 10);
  const lastStr = lastDate ? lastDate.slice(0, 10) : "";

  // Exam done: last visit date is on or after the scheduled next date
  if (lastStr && lastStr >= nextStr) {
    return "done";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(nextStr + "T00:00:00");

  const diffDays = (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "overdue";
  if (diffDays <= 7) return "soon";
  return "upcoming";
}
