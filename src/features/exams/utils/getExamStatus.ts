export type ExamStatus = "past" | "soon" | "upcoming";

export function getExamStatus(nextDate: string): ExamStatus {
  const today = new Date();
  const examDate = new Date(nextDate);

  const diffDays =
    (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "past";
  if (diffDays <= 7) return "soon";
  return "upcoming";
}
