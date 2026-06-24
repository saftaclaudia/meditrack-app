import type { MedicalDocument } from "./medicalDocument";

export interface Exam {
  id: string;
  name: string;
  clinic?: string;
  speciality?: string;
  doctor?: string;
  lastDate: string;
  nextDate: string;
  result?: string;
  resultValue?: number;
  resultUnit?: string;
  treatment?: string;
  notes?: string;
  documents?: MedicalDocument[];
}

export type ExamWithMongoId = Exam & { _id?: string };
