import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AddEntryPayload, CalorieLog } from "../../types/calorie";
import { caloriesApi } from "../../api/caloriesApi";
import type { ApiError } from "../../types/api";

export const fetchDayLog = createAsyncThunk<CalorieLog | null, string>(
  "calories/fetchDay",
  async (date, { rejectWithValue }) => {
    try {
      return await caloriesApi.getDay(date);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message ?? "Fetch failed");
    }
  },
);

export const fetchHistory = createAsyncThunk<CalorieLog[], void>(
  "calories/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await caloriesApi.getHistory();
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message ?? "Fetch failed");
    }
  },
);

export const addCalorieEntry = createAsyncThunk<CalorieLog, AddEntryPayload>(
  "calories/addEntry",
  async (payload, { rejectWithValue }) => {
    try {
      return await caloriesApi.addEntry(payload);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error?.response?.data?.message ?? "Add failed");
    }
  },
);

export const updateDailyGoal = createAsyncThunk<
  CalorieLog,
  { date: string; dailyGoal: number }
>("calories/updateGoal", async ({ date, dailyGoal }, { rejectWithValue }) => {
  try {
    return await caloriesApi.updateGoal(date, dailyGoal);
  } catch (err) {
    const error = err as ApiError;
    return rejectWithValue(error?.response?.data?.message ?? "Update failed");
  }
});

export const deleteCaloryEntry = createAsyncThunk<
  CalorieLog,
  { date: string; meal: string; entryId: string }
>(
  "calories/deleteEntry",
  async ({ date, meal, entryId }, { rejectWithValue }) => {
    try {
      return await caloriesApi.deleteEntry(date, meal, entryId);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error?.response?.data?.message ?? "Delete failed");
    }
  },
);
