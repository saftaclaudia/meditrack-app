import type { ActivityCategory } from "../../../types/activity";

export interface ActivityItem {
  id: string;
  nameKey: string;
  kcalPerMin: number;
  category: ActivityCategory;
}

export const activityDatabase: ActivityItem[] = [
  // Cardio
  { id: "mers-pe-jos",      nameKey: "nutrition.act_walking",       kcalPerMin: 4,  category: "cardio" },
  { id: "alergare",         nameKey: "nutrition.act_running",       kcalPerMin: 10, category: "cardio" },
  { id: "ciclism",          nameKey: "nutrition.act_cycling",       kcalPerMin: 8,  category: "cardio" },
  { id: "inot",             nameKey: "nutrition.act_swimming",      kcalPerMin: 7,  category: "cardio" },
  { id: "saritura-coarda",  nameKey: "nutrition.act_jumprope",      kcalPerMin: 12, category: "cardio" },
  { id: "eliptica",         nameKey: "nutrition.act_elliptical",    kcalPerMin: 8,  category: "cardio" },
  { id: "rowing",           nameKey: "nutrition.act_rowing",        kcalPerMin: 8,  category: "cardio" },
  { id: "hiit",             nameKey: "nutrition.act_hiit",          kcalPerMin: 12, category: "cardio" },
  { id: "dans",             nameKey: "nutrition.act_dancing",       kcalPerMin: 5,  category: "cardio" },
  { id: "aerobic",          nameKey: "nutrition.act_aerobics",      kcalPerMin: 7,  category: "cardio" },
  { id: "schi",             nameKey: "nutrition.act_skiing",        kcalPerMin: 7,  category: "cardio" },
  { id: "trekking",         nameKey: "nutrition.act_hiking",        kcalPerMin: 6,  category: "cardio" },

  // Strength
  { id: "sala-fitness",     nameKey: "nutrition.act_gym",           kcalPerMin: 5,  category: "strength" },
  { id: "yoga",             nameKey: "nutrition.act_yoga",          kcalPerMin: 3,  category: "strength" },
  { id: "pilates",          nameKey: "nutrition.act_pilates",       kcalPerMin: 4,  category: "strength" },
  { id: "crossfit",         nameKey: "nutrition.act_crossfit",      kcalPerMin: 11, category: "strength" },
  { id: "calistenie",       nameKey: "nutrition.act_calisthenics",  kcalPerMin: 6,  category: "strength" },

  // Sport
  { id: "fotbal",           nameKey: "nutrition.act_football",      kcalPerMin: 9,  category: "sport" },
  { id: "baschet",          nameKey: "nutrition.act_basketball",    kcalPerMin: 8,  category: "sport" },
  { id: "tenis",            nameKey: "nutrition.act_tennis",        kcalPerMin: 7,  category: "sport" },
  { id: "volei",            nameKey: "nutrition.act_volleyball",    kcalPerMin: 5,  category: "sport" },
  { id: "padel",            nameKey: "nutrition.act_padel",         kcalPerMin: 7,  category: "sport" },
  { id: "box",              nameKey: "nutrition.act_boxing",        kcalPerMin: 11, category: "sport" },

  // Daily
  { id: "curatenie",        nameKey: "nutrition.act_cleaning",      kcalPerMin: 3,  category: "daily" },
  { id: "gradinarit",       nameKey: "nutrition.act_gardening",     kcalPerMin: 4,  category: "daily" },
  { id: "cumparaturi",      nameKey: "nutrition.act_shopping",      kcalPerMin: 3,  category: "daily" },
];
