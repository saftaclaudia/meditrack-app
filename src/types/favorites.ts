export interface FavoriteFood {
  name: string;
  calories: number;
  quantity: number;
  unit: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface MacroGoals {
  protein?: number;
  carbs?: number;
  fat?: number;
}
