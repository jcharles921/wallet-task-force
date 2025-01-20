// store/api.ts
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../config/api";

interface TransactionInput {
  amount: string | number;
  type: "income" | "expense";
  category_id: number;
  account_id: number | null;
  description?: string;
}
interface CategoryInput {
  name: string;
  parent_id: number | null;
}
interface BudgetInput {
  account_id: number;
  spending_limit: number;
}

class Api {
  resetAll = createAction("resetAll");
  accountTypes = createAsyncThunk(
    "fetchAccountTypes",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch(endpoints.accountTypes, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );
  setBudget = createAsyncThunk(
    "setBudget",
    async (data: BudgetInput, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${endpoints.accountTypes}/${data.account_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              spending_limit:
                typeof data.spending_limit === "string"
                  ? parseFloat(data.spending_limit)
                  : data.spending_limit,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );

  categories = createAsyncThunk(
    "fetchCategories",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch(endpoints.categories, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );
  addCategory = createAsyncThunk(
    "addCategory",
    async (data: CategoryInput, { rejectWithValue }) => {
      try {
        const response = await fetch(endpoints.categories, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );
  editCategory = createAsyncThunk(
    "editCategory",
    async (data: CategoryInput, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${endpoints.categories}/${data.parent_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );

  deleteCategory = createAsyncThunk(
    "deleteCategory",
    async (categoryId: number, { rejectWithValue }) => {
      try {
        const response = await fetch(`${endpoints.categories}/${categoryId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return categoryId; // Return the id of deleted category
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );

  transactions = createAsyncThunk(
    "fetchTransactions",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch(endpoints.transactions, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );

  addTransaction = createAsyncThunk(
    "addTransaction",
    async (data: TransactionInput, { rejectWithValue }) => {
      try {
        const response = await fetch(endpoints.transactions, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount:
              typeof data.amount === "string"
                ? parseFloat(data.amount)
                : data.amount,
            type: data.type,
            category_id: data.category_id,
            account_id: data.account_id,
            description: data.description || "",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );
  deleteTransaction = createAsyncThunk(
    "deleteTransaction",
    async (transactionId: number, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${endpoints.transactions}/${transactionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return transactionId; // Return the id of deleted transaction
      } catch (error: any) {
        return rejectWithValue({ error: error?.message });
      }
    }
  );
  fetchNotifications = createAsyncThunk(
    "notifications/fetch",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch(`${endpoints.notfications}`);
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data || { error: "Failed to fetch notifications" }
        );
      }
    }
  );
  markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (id: number, { rejectWithValue }) => {
      try {
        const response = await fetch(`${endpoints.notfications}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to mark notification as read");
        }
        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data || {
            error: "Failed to mark notification as read",
          }
        );
      }
    }
  );
}

const apis = new Api();
export default apis;
