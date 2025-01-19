import { useState } from "react";
import { endpoints } from "../config/api";

interface TransactionInput {
  amount: string | number;
  type: "income" | "expense";
  category_id: number;
  account_id: number | null;
  description?: string;
}

interface UseTransactionMutationsResult {
  addTransaction: (data: TransactionInput) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export const useTransactionMutations = (): UseTransactionMutationsResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTransaction = async (data: TransactionInput) => {
    setIsLoading(true);
    setError(null);

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
      console.log("Transaction added:", result);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to add transaction")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { addTransaction, isLoading, error };
};
