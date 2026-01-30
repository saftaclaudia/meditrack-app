export interface Exam {
  id: string;
  name: string;
  clinic?: string;
  speciality?: string;
  doctor?: string;
  lastDate: string;
  nextDate: string;
  result?: string;
  treatment?: string;
  notes?: string;
  documents?: string[];
}
