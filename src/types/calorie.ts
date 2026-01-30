export interface CalorieEntry {
  id: string;
  date: string;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  food: string;
  calories: number;
}
