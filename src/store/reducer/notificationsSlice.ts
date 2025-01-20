import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import apis from "../api";

interface Notification {
  id: number;
  account_id: number;
  account_name?: string;
  message: string;
  type: "limit_exceed" | "low_balance";
  is_read: boolean;
  created_at: string;
}

interface NotificationsState {
  data: Notification[];
  unreadCount: number;
  loading: boolean;
  error: boolean;
  message: string;
  success: boolean;
}

const initialState: NotificationsState = {
  data: [],
  unreadCount: 0,
  loading: false,
  error: false,
  message: "",
  success: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(apis.fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(
        apis.fetchNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.loading = false;
          state.success = true;
          state.error = false;
          state.data = action.payload;
          state.unreadCount = action.payload.filter((n) => !n.is_read).length;
        }
      )
      .addCase(
        apis.fetchNotifications.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.success = false;
          state.error = true;
          state.message =
            action.payload?.error || "Failed to fetch notifications";
        }
      )
      // Mark as read
      .addCase(apis.markNotificationAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        apis.markNotificationAsRead.fulfilled,
        (state, action: PayloadAction<Notification>) => {
          state.loading = false;
          state.success = true;
          const index = state.data.findIndex((n) => n.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
            state.unreadCount = state.data.filter((n) => !n.is_read).length;
          }
        }
      )
      .addCase(
        apis.markNotificationAsRead.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = true;
          state.message =
            action.payload?.error || "Failed to mark notification as read";
        }
      )
      .addCase("api/resetAll", (state) => {
        Object.assign(state, initialState);
      });
  },
});

export const { resetNotifications } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
