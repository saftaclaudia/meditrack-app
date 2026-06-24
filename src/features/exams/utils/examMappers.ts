import type { Exam } from "../../../types/exam";
import type { ExamFormData } from "../../../types/examForm";

export function examToFormData(exam: Exam): ExamFormData {
  return {
    name: exam.name ?? "",
    doctor: exam.doctor ?? "",
    speciality: exam.speciality ?? "",
    clinic: exam.clinic ?? "",
    lastDate: exam.lastDate ?? "",
    nextDate: exam.nextDate ?? "",
    result: exam.result ?? "",
    resultValue: exam.resultValue != null ? String(exam.resultValue) : "",
    resultUnit: exam.resultUnit ?? "",
    treatment: exam.treatment ?? "",
    notes: exam.notes ?? "",
    documents: exam.documents ?? [],
  };
}
