import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import apis from '../api';

interface AccountType {
  id: number;
  name: string;
  account_id: number;
}

const accountTypesSlice = createSlice({
  name: 'accountTypes',
  initialState: {
    data: [] as AccountType[],
    loading: false,
    error: false,
    message: '',
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(apis.accountTypes.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(apis.accountTypes.fulfilled, (state, action: PayloadAction<AccountType[]>) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.data = action.payload;
      })
      .addCase(apis.accountTypes.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message = action.payload?.error || 'Something went wrong';
      })
      .addCase(apis.resetAll, (state) => {
        state.loading = false;
        state.error = false;
        state.success = false;
        state.data = [];
      });
  },
});

export const accountTypesReducer = accountTypesSlice.reducer;
