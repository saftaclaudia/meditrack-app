import type { MedicalDocument } from "./medicalDocument";

export interface ExamFormData {
  name: string;
  doctor: string;
  speciality: string;
  clinic: string;
  lastDate: string;
  nextDate: string;
  recommendedFrequencyMonths: string;
  result: string;
  resultValue: string;
  resultUnit: string;
  treatment: string;
  notes: string;
  documents: MedicalDocument[];
}
