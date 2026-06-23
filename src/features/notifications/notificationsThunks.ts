import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Notification } from "../../types/notification";
import { notificationsApi } from "../../api/notificationsApi";
import type { ApiError } from "../../types/api";

const rejectMsg = (err: unknown, fallback: string) => {
  const e = err as ApiError;
  return e.response?.data?.message || fallback;
};

export const fetchNotifications = createAsyncThunk<Notification[], void>(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationsApi.fetchAll();
    } catch (err) {
      return rejectWithValue(rejectMsg(err, "Fetch failed"));
    }
  }
);

export const markNotificationAsRead = createAsyncThunk<Notification, string>(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      return await notificationsApi.markAsRead(id);
    } catch (err) {
      return rejectWithValue(rejectMsg(err, "Update failed"));
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk<void, void>(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      return rejectWithValue(rejectMsg(err, "Update failed"));
    }
  }
);

export const deleteNotification = createAsyncThunk<string, string>(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await notificationsApi.deleteOne(id);
      return id;
    } catch (err) {
      return rejectWithValue(rejectMsg(err, "Delete failed"));
    }
  }
);

export const clearAllNotifications = createAsyncThunk<void, void>(
  "notifications/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      await notificationsApi.clearAll();
    } catch (err) {
      return rejectWithValue(rejectMsg(err, "Clear failed"));
    }
  }
);

export const createNotification = createAsyncThunk<
  Notification,
  { title: string; message: string; type: string }
>("notifications/create", async (payload, { rejectWithValue }) => {
  try {
    return await notificationsApi.create(payload);
  } catch (err) {
    return rejectWithValue(rejectMsg(err, "Create failed"));
  }
});
