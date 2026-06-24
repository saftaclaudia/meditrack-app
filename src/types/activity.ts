export type ActivityCategory = "cardio" | "strength" | "sport" | "daily";

export interface Activity {
  _id: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  category: ActivityCategory;
  date: string;
}

export interface NewActivity {
  name: string;
  duration: number;
  caloriesBurned: number;
  category: ActivityCategory;
  date: string;
}
