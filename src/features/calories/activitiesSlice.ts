import { createSlice } from "@reduxjs/toolkit";
import type { Activity } from "../../types/activity";
import { fetchActivities, addActivity, updateActivity, deleteActivity } from "./activitiesThunks";

interface ActivitiesState {
  items: Activity[];
  loading: boolean;
}

const initialState: ActivitiesState = {
  items: [],
  loading: false,
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => { state.loading = true; })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchActivities.rejected, (state) => { state.loading = false; })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a._id !== action.payload);
      });
  },
});

export default activitiesSlice.reducer;
