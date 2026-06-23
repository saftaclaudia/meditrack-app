export interface CalorieEntry {
  _id: string;
  name: string;
  calories: number;
  quantity: number;
  unit: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  _id: string;
  type: MealType;
  entries: CalorieEntry[];
}
export interface CalorieLog {
  _id: string;
  user: string;
  date: string;
  dailyGoal: number;
  meals: Meal[];
}

export type NewEntry = Omit<CalorieEntry, "_id">;

export interface AddEntryPayload {
  date: string;
  mealType: MealType;
  entry: NewEntry;
  dailyGoal?: number;
}

export interface DaySummary {
  date: string;
  totalCalorie: number;
  dailyGoal: number;
}
