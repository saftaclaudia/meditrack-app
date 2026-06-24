import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { favoritesApi } from "../../api/favoritesApi";
import type { FavoriteFood, MacroGoals } from "../../types/favorites";

export const fetchFavorites = createAsyncThunk("favorites/fetch", async () =>
  favoritesApi.getAll()
);

export const addFavorite = createAsyncThunk("favorites/add", async (food: FavoriteFood) =>
  favoritesApi.add(food)
);

export const removeFavorite = createAsyncThunk("favorites/remove", async (name: string) =>
  favoritesApi.remove(name)
);

export const fetchMacroGoals = createAsyncThunk("favorites/macros/fetch", async () =>
  favoritesApi.getMacroGoals()
);

export const updateMacroGoals = createAsyncThunk(
  "favorites/macros/update",
  async (goals: MacroGoals) => favoritesApi.updateMacroGoals(goals)
);

interface FavoritesState {
  items: FavoriteFood[];
  macroGoals: MacroGoals;
  loading: boolean;
}

const initialState: FavoritesState = { items: [], macroGoals: {}, loading: false };

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFavorites.pending, (s) => { s.loading = true; });
    b.addCase(fetchFavorites.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; });
    b.addCase(addFavorite.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(removeFavorite.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(fetchMacroGoals.fulfilled, (s, a) => { s.macroGoals = a.payload; });
    b.addCase(updateMacroGoals.fulfilled, (s, a) => { s.macroGoals = a.payload; });
  },
});

export default favoritesSlice.reducer;
