import { createSlice } from "@reduxjs/toolkit";
import type { Recipe } from "../../types/recipe";
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from "./recipesThunks";

interface RecipesState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipesState = {
  recipes: [],
  loading: false,
  error: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.recipes.unshift(action.payload);
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const idx = state.recipes.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.recipes[idx] = action.payload;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter((r) => r._id !== action.payload);
      });
  },
});

export default recipesSlice.reducer;
