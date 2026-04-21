import type { UpdateProfilePayload, UserProfile } from "../types/profile";
import api from "./axios";

export const profileApi = {
  // GET /api/profile
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get<UserProfile>("/profile");
    return res.data;
  },

  // PATCH /api/profile
  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<UserProfile> => {
    const res = await api.patch<UserProfile>("/profile", payload);
    return res.data;
  },
};
