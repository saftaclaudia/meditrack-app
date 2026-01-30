import type { Exam } from "../types/exam";

const EXAMS_KEY = "medictrack_exams";

export const saveExams = (exams: Exam[]) => {
  try {
    const serialized = JSON.stringify(exams);
    localStorage.setItem(EXAMS_KEY, serialized);
  } catch (e) {
    console.error("Failed to save exams to localStorage", e);
  }
};

export const loadExams = (): Exam[] => {
  try {
    const serialized = localStorage.getItem(EXAMS_KEY);
    if (!serialized) return [];
    return JSON.parse(serialized) as Exam[];
  } catch {
    console.error("Failed to load exam from localStorage");
    return [];
  }
};
