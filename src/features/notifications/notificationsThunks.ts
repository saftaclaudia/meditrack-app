import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Notification } from "../../types/notification";
import { notificationsApi } from "../../api/notificationsApi";
import type { ApiError } from "../../types/api";

export const fetchNotifications = createAsyncThunk<Notification[], void>(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationsApi.fetchAll();
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  },
);

export const markNotificationAsRead = createAsyncThunk<Notification, string>(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      return await notificationsApi.markAsRead(id);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

export const markAllNotificationsAsRead = createAsyncThunk<void, void>(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

export const createNotification = createAsyncThunk<
  Notification,
  { title: string; message: string; type: string }
>("notifications/create", async (payload, { rejectWithValue }) => {
  try {
    return await notificationsApi.create(payload);
  } catch (err) {
    const error = err as ApiError;
    return rejectWithValue(error.response?.data?.message || "Create failed");
  }
});
