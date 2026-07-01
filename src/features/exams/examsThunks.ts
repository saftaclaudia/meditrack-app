import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Exam } from "../../types/exam";
import {
  createExamRequest,
  deleteExamRequest,
  fetchExamsRequest,
  updateExamRequest,
} from "../../api/examsApi";

// GET
export const fetchExams = createAsyncThunk<
  Exam[],
  void,
  { rejectValue: string }
>("exams/fetchExams", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchExamsRequest();
    return data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message ?? "Faild to fetch");
  }
});

// POST
export const createExam = createAsyncThunk<
  Exam,
  Omit<Exam, "id">,
  { rejectValue: string }
>("exams/createExam", async (examData, { rejectWithValue }) => {
  try {
    const data = await createExamRequest(examData);
    return data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message ?? "Faild to create exam",
    );
  }
});

// PUT
export const updateExam = createAsyncThunk<Exam, Exam, { rejectValue: string }>(
  "exams/updateExam",
  async (exam, { rejectWithValue }) => {
    try {
      const { id, ...rest } = exam;
      const data = await updateExamRequest(id, rest);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to update exam",
      );
    }
  },
);

// DELETE
export const deleteExam = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("exams/deleteExam", async (id, { rejectWithValue }) => {
  try {
    await deleteExamRequest(id);
    return id;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message ?? "Faild to delete");
  }
});
