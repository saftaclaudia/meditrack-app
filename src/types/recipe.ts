export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: "g" | "ml" | "buc";
  caloriesPer: number;
  baseQty: number;
  calories: number;
}

export interface Recipe {
  _id: string;
  name: string;
  portions: number;
  ingredients: RecipeIngredient[];
  totalCalories: number;
  caloriesPerPortion: number;
}

export type NewRecipe = Omit<Recipe, "_id" | "totalCalories" | "caloriesPerPortion">;
