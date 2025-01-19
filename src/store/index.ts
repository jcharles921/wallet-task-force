import { configureStore } from "@reduxjs/toolkit";
import { accountTypesReducer } from "./reducer/accountTypesSlice";
import { categoriesReducer } from "./reducer/categoriesSlice";
import { transactionsReducer } from "./reducer/transactionsSlice";
import { deleteTransaction } from "./reducer/deleteTransactionSlice";
import { addCategoryReducer } from "./reducer/addCategorySlice";
import { deleteCategoryReducer } from "./reducer/deleteCategorySlice";
import { editCategoryReducer } from "./reducer/editCategorySlice";
import { budgetReducer } from "./reducer/budgetSlice";

export const store = configureStore({
  reducer: {
    accountTypes: accountTypesReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
    deleteTransaction: deleteTransaction,
    addCategory: addCategoryReducer,
    deleteCategory: deleteCategoryReducer,
    editCategory: editCategoryReducer,
    budget: budgetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;