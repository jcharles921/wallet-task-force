import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import apis from '../api';

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number | string;
    type: 'income' | 'expense';
    account_name: string;
    category: string;
    accountType: string;
  }
  
  const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: {
      data: [] as Transaction[],
      loading: false,
      error: false,
      message: '',
      success: false,
      addTransactionStatus: {
        loading: false,
        error: false,
        success: false,
        message: '',
      },
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch transactions
        .addCase(apis.transactions.pending, (state) => {
          state.loading = true;
          state.error = false;
          state.success = false;
        })
        .addCase(apis.transactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
          state.loading = false;
          state.success = true;
          state.error = false;
          state.data = action.payload;
        })
        .addCase(apis.transactions.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.success = false;
          state.error = true;
          state.message = action.payload?.error || 'Something went wrong';
        })
        // Add transaction
        .addCase(apis.addTransaction.pending, (state) => {
          state.addTransactionStatus.loading = true;
          state.addTransactionStatus.error = false;
          state.addTransactionStatus.success = false;
        })
        .addCase(apis.addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
          state.addTransactionStatus.loading = false;
          state.addTransactionStatus.success = true;
          state.addTransactionStatus.error = false;
          state.data.push(action.payload);
        })
        .addCase(apis.addTransaction.rejected, (state, action: PayloadAction<any>) => {
          state.addTransactionStatus.loading = false;
          state.addTransactionStatus.success = false;
          state.addTransactionStatus.error = true;
          state.addTransactionStatus.message = action.payload?.error || 'Failed to add transaction';
        })
        .addCase(apis.resetAll, (state) => {
          state.loading = false;
          state.error = false;
          state.success = false;
          state.data = [];
          state.addTransactionStatus = {
            loading: false,
            error: false,
            success: false,
            message: '',
          };
        });
    },
  });


  export const transactionsReducer = transactionsSlice.reducer;