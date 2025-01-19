import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import apis from "../api";

interface BudgetState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const budgetInitialState: BudgetState = {
  loading: false,
  error: null,
  success: false,
};

const budgetSlice = createSlice({
  name: "budget",
  initialState: budgetInitialState,
  reducers: {
    resetBudgetStatus: () => budgetInitialState,
  },
  extraReducers: (builder) => {
    builder
      // Set Budget Cases
      .addCase(apis.setBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(apis.setBudget.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(apis.setBudget.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.error || "Failed to set budget";
      })
      .addCase(apis.resetAll, () => budgetInitialState);
  },
});

export const { resetBudgetStatus } = budgetSlice.actions;
export const budgetReducer = budgetSlice.reducer;
