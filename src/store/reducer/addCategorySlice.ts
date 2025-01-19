import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import apis from '../api';


interface AddCategoryState {
    loading: boolean;
    error: string | null;
    success: boolean;
  }
  
  const addCategoryInitialState: AddCategoryState = {
    loading: false,
    error: null,
    success: false,
  };
  
  const addCategorySlice = createSlice({
    name: 'addCategory',
    initialState: addCategoryInitialState,
    reducers: {
      resetAddCategoryStatus: () => addCategoryInitialState,
    },
    extraReducers: (builder) => {
      builder
        .addCase(apis.addCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(apis.addCategory.fulfilled, (state) => {
          state.loading = false;
          state.success = true;
          state.error = null;
        })
        .addCase(apis.addCategory.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload?.error || 'Failed to add category';
        })
        .addCase(apis.resetAll, () => addCategoryInitialState);
    },
  });

  export const addCategoryReducer = addCategorySlice.reducer;