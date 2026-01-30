import clsx from "clsx";
import type { ExamStatus } from "../utils/getExamStatus";

interface Props {
  status: ExamStatus;
}

export function ExamStatusBage({ status }: Props) {
  return (
    <span
      className={clsx("shrink-0 rounded-full px-3 py-1 text-xs font-medium", {
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300":
          status === "past",
        "bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-blue-300":
          status === "upcoming",
        "bg-pink-100 text-pink-600 dark:bg-pink-700 dark:text-pink-300":
          status === "soon",
      })}
    >
      {status === "past"
        ? "Completed"
        : status === "soon"
          ? "Soon"
          : "Upcoming"}
    </span>
  );
}
