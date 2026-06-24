import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { waterApi } from "../../api/waterApi";

export const fetchWater = createAsyncThunk("water/fetch", async (date: string) =>
  waterApi.get(date)
);

export const setWaterGlasses = createAsyncThunk(
  "water/set",
  async ({ date, glasses }: { date: string; glasses: number }) =>
    waterApi.set(date, glasses)
);

interface WaterState {
  glasses: number;
  loading: boolean;
}

const initialState: WaterState = { glasses: 0, loading: false };

const waterSlice = createSlice({
  name: "water",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchWater.fulfilled, (s, a) => { s.glasses = a.payload.glasses; s.loading = false; });
    b.addCase(fetchWater.pending, (s) => { s.loading = true; });
    b.addCase(setWaterGlasses.fulfilled, (s, a) => { s.glasses = a.payload.glasses; });
  },
});

export default waterSlice.reducer;
