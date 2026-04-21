import type { CalorieLog } from "../../types/calorie";
import { createSlice } from "@reduxjs/toolkit";
import {
  addCalorieEntry,
  deleteCaloryEntry,
  fetchDayLog,
  fetchHistory,
  updateDailyGoal,
} from "./caloriesThunks";

interface CaloriesState {
  todayLog: CalorieLog | null;
  history: CalorieLog[];
  loading: boolean;
  error: string | null;
}
const initialState: CaloriesState = {
  todayLog: null,
  history: [],
  loading: false,
  error: null,
};

const caloriesSlices = createSlice({
  name: "calories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ferchDayLog
      .addCase(fetchDayLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDayLog.fulfilled, (state, action) => {
        state.todayLog = action.payload;
        state.loading = false;
      })
      .addCase(fetchDayLog.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // fetch histoty
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      // addEntry, updateGoal, deleteEntry
      .addCase(addCalorieEntry.fulfilled, (state, action) => {
        state.todayLog = action.payload;
      })
      .addCase(updateDailyGoal.fulfilled, (state, action) => {
        state.todayLog = action.payload;
      })
      .addCase(deleteCaloryEntry.fulfilled, (state, action) => {
        state.todayLog = action.payload;
      });
  },
});
export default caloriesSlices.reducer;
