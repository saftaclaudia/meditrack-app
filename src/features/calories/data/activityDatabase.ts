import type { ActivityCategory } from "../../../types/activity";

export interface ActivityItem {
  id: string;
  name: string;
  kcalPerMin: number;
  category: ActivityCategory;
}

export const activityDatabase: ActivityItem[] = [
  // Cardio
  { id: "mers-pe-jos", name: "Mers pe jos", kcalPerMin: 4, category: "cardio" },
  { id: "alergare", name: "Alergare", kcalPerMin: 10, category: "cardio" },
  { id: "ciclism", name: "Ciclism", kcalPerMin: 8, category: "cardio" },
  { id: "inot", name: "Înot", kcalPerMin: 7, category: "cardio" },
  { id: "saritura-coarda", name: "Săritură cu coarda", kcalPerMin: 12, category: "cardio" },
  { id: "eliptica", name: "Eliptică", kcalPerMin: 8, category: "cardio" },
  { id: "rowing", name: "Canotaj / Rowing", kcalPerMin: 8, category: "cardio" },
  { id: "hiit", name: "HIIT", kcalPerMin: 12, category: "cardio" },
  { id: "dans", name: "Dans", kcalPerMin: 5, category: "cardio" },
  { id: "aerobic", name: "Aerobic", kcalPerMin: 7, category: "cardio" },
  { id: "schi", name: "Schi", kcalPerMin: 7, category: "cardio" },
  { id: "trekking", name: "Trekking / Drumeție", kcalPerMin: 6, category: "cardio" },

  // Strength
  { id: "sala-fitness", name: "Sală fitness", kcalPerMin: 5, category: "strength" },
  { id: "yoga", name: "Yoga", kcalPerMin: 3, category: "strength" },
  { id: "pilates", name: "Pilates", kcalPerMin: 4, category: "strength" },
  { id: "crossfit", name: "CrossFit", kcalPerMin: 11, category: "strength" },
  { id: "calistenie", name: "Calistenie", kcalPerMin: 6, category: "strength" },

  // Sport
  { id: "fotbal", name: "Fotbal", kcalPerMin: 9, category: "sport" },
  { id: "baschet", name: "Baschet", kcalPerMin: 8, category: "sport" },
  { id: "tenis", name: "Tenis", kcalPerMin: 7, category: "sport" },
  { id: "volei", name: "Volei", kcalPerMin: 5, category: "sport" },
  { id: "padel", name: "Padel", kcalPerMin: 7, category: "sport" },
  { id: "box", name: "Box", kcalPerMin: 11, category: "sport" },

  // Daily
  { id: "curatenie", name: "Curățenie", kcalPerMin: 3, category: "daily" },
  { id: "gradinarit", name: "Grădinărit", kcalPerMin: 4, category: "daily" },
  { id: "cumparaturi", name: "Cumpărături", kcalPerMin: 3, category: "daily" },
];
