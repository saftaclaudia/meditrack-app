import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UpdateProfilePayload, UserProfile } from "../../types/profile";
import { profileApi } from "../../api/profileApi";
import type { ApiError } from "../../types/api";

export const fetchProfile = createAsyncThunk<UserProfile>(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await profileApi.getProfile();
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message ?? "Fetch failed");
    }
  },
);

export const updateProfile = createAsyncThunk<
  UserProfile,
  UpdateProfilePayload
>("profile/update", async (payload, { rejectWithValue }) => {
  try {
    return await profileApi.updateProfile(payload);
  } catch (err) {
    const error = err as ApiError;
    return rejectWithValue(error.response?.data?.message ?? "Update failed");
  }
});
