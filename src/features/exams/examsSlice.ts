import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Exam } from "../../types/exam";
import { fetchExams } from "./examsThunks";
import { loadExams, saveExams } from "../../utils/examsStorage";

interface ExamsState {
  items: Exam[];
  loading: boolean;
  error: string | null;
}

const initialState: ExamsState = {
  items: loadExams(),
  loading: false,
  error: null,
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    addExam(state, action: PayloadAction<Exam>) {
      state.items.push(action.payload);
      saveExams(state.items);
    },
    removeExam(state, action: PayloadAction<string>) {
      state.items = state.items.filter((exam) => exam.id !== action.payload);
      saveExams(state.items);
    },
    updateExam(state, action: PayloadAction<Exam>) {
      const index = state.items.findIndex(
        (exam) => exam.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      saveExams(state.items);
    },
  },
  // extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        saveExams(state.items);
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error";
      });
  },
});

export const { addExam, removeExam, updateExam } = examsSlice.actions;

export default examsSlice.reducer;
