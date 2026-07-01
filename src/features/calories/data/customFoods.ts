import type { FoodItem } from "./foodDatabase";

const CUSTOM_FOODS_KEY = "meditrack_custom_foods";

export const loadCustomFoods = (): FoodItem[] => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY) ?? "[]");
  } catch {
    return [];
  }
};

export const saveCustomFood = (food: FoodItem) => {
  const existing = loadCustomFoods().filter(
    (f) => f.name.toLowerCase() !== food.name.toLowerCase()
  );
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify([food, ...existing]));
};
