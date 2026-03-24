import { createSlice } from "@reduxjs/toolkit";
import type { Exam } from "../../types/exam";
import { createExam, deleteExam, fetchExams, updateExam } from "./examsThunks";

type ExamWithMongoId = Exam & { _id?: string };

interface ExamsState {
  items: Exam[];
  loading: boolean;
  error: string | null;
}

const initialState: ExamsState = {
  items: [],
  loading: false,
  error: null,
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {},
  // extraReducers
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch exams";
      })

      // CREATE
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create exam";
      })
      // UPDATE
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (exam) =>
            exam.id === action.payload.id ||
            exam.id === (action.payload as ExamWithMongoId)._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update exam";
      })
      // DELETE
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (exam) =>
            exam.id !== action.payload &&
            (exam as ExamWithMongoId)._id !== action.payload,
        );
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete exam";
      });
  },
});

export default examsSlice.reducer;
