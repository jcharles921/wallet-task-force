import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import apis from '../api';


interface DeleteCategoryState {
    loading: boolean;
    error: string | null;
    success: boolean;
    categoryId: number | null;
  }
  
  const deleteCategoryInitialState: DeleteCategoryState = {
    loading: false,
    error: null,
    success: false,
    categoryId: null,
  };
  
  const deleteCategorySlice = createSlice({
    name: 'deleteCategory',
    initialState: deleteCategoryInitialState,
    reducers: {
      resetDeleteCategoryStatus: () => deleteCategoryInitialState,
    },
    extraReducers: (builder) => {
      builder
        .addCase(apis.deleteCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
          state.categoryId = null;
        })
        .addCase(apis.deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.categoryId = action.payload;
        })
        .addCase(apis.deleteCategory.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload?.error || 'Failed to delete category';
          state.categoryId = null;
        })
        .addCase(apis.resetAll, () => deleteCategoryInitialState);
    },
  });

  export const deleteCategoryReducer = deleteCategorySlice.reducer;