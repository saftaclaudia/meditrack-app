import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { weightApi } from "../../api/weightApi";
import type { WeightEntry } from "../../types/weight";

export const fetchWeightHistory = createAsyncThunk("weight/fetch", async () =>
  weightApi.getHistory()
);

export const logWeight = createAsyncThunk(
  "weight/log",
  async ({ date, weight }: { date: string; weight: number }) =>
    weightApi.log(date, weight)
);

export const deleteWeightEntry = createAsyncThunk("weight/delete", async (id: string) => {
  await weightApi.delete(id);
  return id;
});

interface WeightState {
  entries: WeightEntry[];
  loading: boolean;
}

const initialState: WeightState = { entries: [], loading: false };

const weightSlice = createSlice({
  name: "weight",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchWeightHistory.pending, (s) => { s.loading = true; });
    b.addCase(fetchWeightHistory.fulfilled, (s, a) => { s.entries = a.payload; s.loading = false; });
    b.addCase(logWeight.fulfilled, (s, a) => {
      const idx = s.entries.findIndex((e) => e._id === a.payload._id);
      if (idx >= 0) s.entries[idx] = a.payload;
      else s.entries.unshift(a.payload);
    });
    b.addCase(deleteWeightEntry.fulfilled, (s, a) => {
      s.entries = s.entries.filter((e) => e._id !== a.payload);
    });
  },
});

export default weightSlice.reducer;
