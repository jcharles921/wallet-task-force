import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';

interface AccountType {
  id: number;
  name: string;
}

interface AccountTypeHookResult {
  accountTypes: AccountType[];
  isLoading: boolean;
  error: Error | null;
}

export const useAccountTypes = (): AccountTypeHookResult => {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAccountTypes = async () => {
      try {
        const response = await fetch(endpoints.accountTypes, {
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAccountTypes(data);
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

    fetchAccountTypes();

    return () => {
      controller.abort();
    };
  }, []);

  return { accountTypes, isLoading, error };
};
