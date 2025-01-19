import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import apis from "../api";

interface EditCategoryState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const editCategoryInitialState: EditCategoryState = {
  loading: false,
  error: null,
  success: false,
};

const editCategorySlice = createSlice({
  name: "editCategory",
  initialState: editCategoryInitialState,
  reducers: {
    resetEditCategoryStatus: () => editCategoryInitialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(apis.editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(apis.editCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(apis.editCategory.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.error || "Failed to edit category";
      })
      .addCase(apis.resetAll, () => editCategoryInitialState);
  },
});

export const { resetEditCategoryStatus } = editCategorySlice.actions;
export const editCategoryReducer = editCategorySlice.reducer;