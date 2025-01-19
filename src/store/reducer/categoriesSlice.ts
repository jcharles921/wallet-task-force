import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import apis from "../api";

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    data: [] as Category[],
    loading: false,
    error: false,
    message: "",
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(apis.categories.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(
        apis.categories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.success = true;
          state.error = false;
          state.data = action.payload;
        }
      )
      .addCase(
        apis.categories.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.success = false;
          state.error = true;
          state.message = action.payload?.error || "Something went wrong";
        }
      )
      .addCase(apis.resetAll, (state) => {
        state.loading = false;
        state.error = false;
        state.success = false;
        state.data = [];
      });
  },
});
export const categoriesReducer = categoriesSlice.reducer;
