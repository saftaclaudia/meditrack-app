import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Exam } from "../../types/exam";
import { getExamStatus, type ExamStatus } from "./utils/getExamStatus";

export const selectExamsState = (state: RootState) => state.exams;

export const selectExamsItems = createSelector(
  [selectExamsState],
  (exams) => exams.items,
);

export const selectExamsWithStatus = createSelector(
  [selectExamsItems],
  (items: Exam[]) => {
    return items.map((exam) => ({
      ...exam,
      status: getExamStatus(exam.nextDate) as ExamStatus,
    }));
  },
);

export const selectExamsSummary = createSelector(
  [selectExamsWithStatus],
  (exams) => {
    const total = exams.length;
    const upcoming = exams.filter(
      (e) => e.status === "upcoming" || e.status === "soon",
    ).length;
    const overdue = exams.filter((e) => e.status === "overdue").length;
    const done = exams.filter((e) => e.status === "done").length;

    return { total, upcoming, overdue, done };
  },
);
