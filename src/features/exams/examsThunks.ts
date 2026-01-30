import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Exam } from "../../types/exam";

export const fetchExams = createAsyncThunk<Exam[], void>(
  "exams/fetchExams",
  async () => {
    await new Promise((res) => setTimeout(res, 1000));

    // Mock
    const mockExams: Exam[] = [
      {
        id: "1",
        name: "Blood Test",
        clinic: "City Medical Center",
        speciality: "Hematology",
        doctor: "Dr. Smith",
        lastDate: "2024-01-01",
        nextDate: "2024-07-01",
        result: "Normal",
        treatment: "None",
        notes: "Patient in good health",
        documents: ["blood-test-report.pdf"],
      },
      {
        id: "2",
        name: "MRI Scan",
        clinic: "Neuro Clinic",
        speciality: "Neurology",
        doctor: "Dr. Johnson",
        lastDate: "2023-12-15",
        nextDate: "2024-06-15",
        result: "Minor anomaly detected",
        treatment: "Follow-up recommended",
        notes: "Check progress in 6 months",
        documents: ["mri-scan-image.jpg", "mri-report.pdf"],
      },
      {
        id: "3",
        name: "X-Ray",
        clinic: "Central Hospital",
        speciality: "Radiology",
        doctor: "Dr. Adams",
        lastDate: "2024-01-20",
        nextDate: "2024-07-20",
        result: "No issues detected",
        treatment: "None",
        notes: "Routine check",
        documents: [],
      },
    ];

    return mockExams;
  },
);
