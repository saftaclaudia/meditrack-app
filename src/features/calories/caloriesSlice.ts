import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CalorieEntry } from "../../types/calorie";

const initialState: { items: CalorieEntry[] } = { items: [] };
const caloriesSlice = createSlice({
  name: "calories",
  initialState,
  reducers: {
    addEntry(state, action: PayloadAction<CalorieEntry>) {
      state.items.push(action.payload);
    },
    removeEntry(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateEntry(state, action: PayloadAction<CalorieEntry>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) state.items[index] = action.payload;
    },
  },
});

export const { addEntry, removeEntry, updateEntry } = caloriesSlice.actions;
export default caloriesSlice.reducer;
