// src/hooks/useTransactions.ts

import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';

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

interface TransactionHookResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
}

export const useTransactions = (): TransactionHookResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTransactions = async () => {
      try {
        const response = await fetch(endpoints.transactions, {
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Handle abort error silently
          return;
        }
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      controller.abort();
    };
  }, []);

  return { transactions, isLoading, error };
};