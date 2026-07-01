import type { Exam } from "../../../types/exam";

export function exportExamsToCSV(exams: Exam[], filename = "meditrack-exams.csv") {
  const headers = [
    "Name", "Speciality", "Doctor", "Clinic",
    "Last Visit", "Next Visit", "Status",
    "Result", "Result Value", "Result Unit",
    "Treatment", "Notes",
  ];

  const rows = exams.map((e) => {
    const now = new Date();
    const next = e.nextDate ? new Date(e.nextDate) : null;
    const status = !next ? "" : next < now ? "Overdue" : "Upcoming";

    return [
      e.name,
      e.speciality ?? "",
      e.doctor ?? "",
      e.clinic ?? "",
      e.lastDate ?? "",
      e.nextDate ?? "",
      status,
      e.result ?? "",
      e.resultValue != null ? String(e.resultValue) : "",
      e.resultUnit ?? "",
      e.treatment ?? "",
      e.notes ?? "",
    ].map((v) => `"${v.replace(/"/g, '""')}"`);
  });

  const csv =
    "﻿" + // BOM — Excel reads diacritics correctly
    [headers.map((h) => `"${h}"`), ...rows]
      .map((r) => r.join(","))
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
