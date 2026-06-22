import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Recipe, NewRecipe } from "../../types/recipe";
import { recipesApi } from "../../api/recipesApi";
import type { ApiError } from "../../types/api";

export const fetchRecipes = createAsyncThunk<Recipe[]>(
  "recipes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await recipesApi.getAll();
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message ?? "Fetch failed");
    }
  }
);

export const createRecipe = createAsyncThunk<Recipe, NewRecipe>(
  "recipes/create",
  async (recipe, { rejectWithValue }) => {
    try {
      return await recipesApi.create(recipe);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message ?? "Create failed");
    }
  }
);

export const updateRecipe = createAsyncThunk<Recipe, { id: string; recipe: NewRecipe }>(
  "recipes/update",
  async ({ id, recipe }, { rejectWithValue }) => {
    try {
      return await recipesApi.update(id, recipe);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message ?? "Update failed");
    }
  }
);

export const deleteRecipe = createAsyncThunk<string, string>(
  "recipes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await recipesApi.delete(id);
      return id;
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message ?? "Delete failed");
    }
  }
);
