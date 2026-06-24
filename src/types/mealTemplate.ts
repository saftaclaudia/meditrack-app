export interface TemplateEntry {
  name: string;
  calories: number;
  quantity: number;
  unit: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface MealTemplate {
  _id: string;
  name: string;
  entries: TemplateEntry[];
}
