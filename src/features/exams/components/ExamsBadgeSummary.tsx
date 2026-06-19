import { useAppSelector } from "../../../app/hooks";
import { selectExamsItems, selectExamsSummary } from "../examsSelectors";
import { getDueExams } from "../utils/getRecommendedStatus";

export function ExamsBadgeSummary() {
  const { total, upcoming, overdue } = useAppSelector(selectExamsSummary);
  const exams = useAppSelector(selectExamsItems);
  const dueCount = getDueExams(exams).length;

  const metrics = [
    {
      label: "Total",
      value: total,
      color: "text-text-primary dark:text-text-darkPrimary",
      bg: "bg-surface-cardLight dark:bg-surface-cardDark",
    },
    {
      label: "Upcoming",
      value: upcoming,
      color: "text-primary",
      bg: "bg-soft-light dark:bg-soft-dark",
    },
    {
      label: "Due",
      value: dueCount,
      color: "text-danger",
      bg: "bg-danger-soft dark:bg-danger-softDark",
    },
    {
      label: "Overdue",
      value: overdue,
      color: "text-status-soon-text dark:text-status-soon-textDark",
      bg: "bg-status-soon-bg dark:bg-status-soon-bgDark",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`${metric.bg} rounded-2xl px-3 py-3 flex flex-col gap-1 border border-border-light drak:border-border-dark`}
        >
          <span className={`text-xl font-serif font-light ${metric.color}`}>
            {metric.value}
          </span>
          <span className="text-[10px] font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  );
}
