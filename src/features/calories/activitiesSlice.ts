import { createSlice } from "@reduxjs/toolkit";
import type { Activity } from "../../types/activity";
import { fetchActivities, addActivity, deleteActivity } from "./activitiesThunks";

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
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a._id !== action.payload);
      });
  },
});

export default activitiesSlice.reducer;
