import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mealTemplatesApi } from "../../api/mealTemplatesApi";
import type { MealTemplate, TemplateEntry } from "../../types/mealTemplate";

export const fetchTemplates = createAsyncThunk("mealTemplates/fetch", async () =>
  mealTemplatesApi.getAll()
);

export const createTemplate = createAsyncThunk(
  "mealTemplates/create",
  async ({ name, entries }: { name: string; entries: TemplateEntry[] }) =>
    mealTemplatesApi.create(name, entries)
);

export const deleteTemplate = createAsyncThunk("mealTemplates/delete", async (id: string) => {
  await mealTemplatesApi.delete(id);
  return id;
});

interface TemplatesState {
  items: MealTemplate[];
  loading: boolean;
}

const initialState: TemplatesState = { items: [], loading: false };

const mealTemplatesSlice = createSlice({
  name: "mealTemplates",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTemplates.pending, (s) => { s.loading = true; });
    b.addCase(fetchTemplates.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; });
    b.addCase(createTemplate.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(deleteTemplate.fulfilled, (s, a) => { s.items = s.items.filter((t) => t._id !== a.payload); });
  },
});

export default mealTemplatesSlice.reducer;
