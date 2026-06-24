import { createAsyncThunk } from "@reduxjs/toolkit";
import { activitiesApi } from "../../api/activitiesApi";
import type { NewActivity } from "../../types/activity";

export const fetchActivities = createAsyncThunk(
  "activities/fetchByDate",
  async (date: string, { rejectWithValue }) => {
    try {
      return await activitiesApi.getByDate(date);
    } catch {
      return rejectWithValue("Failed to fetch activities");
    }
  }
);

export const addActivity = createAsyncThunk(
  "activities/add",
  async (payload: NewActivity, { rejectWithValue }) => {
    try {
      return await activitiesApi.add(payload);
    } catch {
      return rejectWithValue("Failed to add activity");
    }
  }
);

export const deleteActivity = createAsyncThunk(
  "activities/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await activitiesApi.delete(id);
      return id;
    } catch {
      return rejectWithValue("Failed to delete activity");
    }
  }
);
