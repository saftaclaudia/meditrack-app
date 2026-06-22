import type { Recipe, NewRecipe } from "../types/recipe";
import api from "./axios";

export const recipesApi = {
  getAll: async (): Promise<Recipe[]> => {
    const { data } = await api.get("/recipes");
    return data;
  },

  create: async (recipe: NewRecipe): Promise<Recipe> => {
    const { data } = await api.post("/recipes", recipe);
    return data;
  },

  update: async (id: string, recipe: NewRecipe): Promise<Recipe> => {
    const { data } = await api.put(`/recipes/${id}`, recipe);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },
};
