import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import apis from '../api';

interface DeleteTransactionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  transactionId: number | null;
}

const initialState: DeleteTransactionState = {
  loading: false,
  error: null,
  success: false,
  transactionId: null,
};

const deleteTransactionSlice = createSlice({
  name: 'deleteTransaction',
  initialState,
  reducers: {
    resetStatus: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apis.deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.transactionId = null;
      })
      .addCase(apis.deleteTransaction.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.transactionId = action.payload;
      })
      .addCase(apis.deleteTransaction.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.error || 'Failed to delete transaction';
        state.transactionId = null;
      })
      .addCase(apis.resetAll, () => {
        return initialState;
      });
  },
});

export const deleteTransaction= deleteTransactionSlice.reducer;