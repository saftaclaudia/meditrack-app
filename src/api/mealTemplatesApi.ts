import api from "./axios";
import type { MealTemplate, TemplateEntry } from "../types/mealTemplate";

export const mealTemplatesApi = {
  getAll: () =>
    api.get<MealTemplate[]>("/meal-templates").then((r) => r.data),
  create: (name: string, entries: TemplateEntry[]) =>
    api.post<MealTemplate>("/meal-templates", { name, entries }).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/meal-templates/${id}`).then((r) => r.data),
};
