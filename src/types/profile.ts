export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type Sex = "male" | "female";

// GET /api/profile
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  sex?: string;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  activityLegel?: ActivityLevel;
  recommendedCalories: number | null;
}
// PATCH /api/profile
export type UpdateProfilePayload = Partial<{
  name: string;
  email: string;
  age: number;
  sex: string;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLegel: ActivityLevel;
}>;

// Redux state
export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}
