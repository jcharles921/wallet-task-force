import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';

interface Category {
  id: number;
  name: string;
}

interface CategoryHookResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}

export const useCategories = (): CategoryHookResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCategories = async () => {
      try {
        const response = await fetch(endpoints.categories, {
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
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

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  return { categories, isLoading, error };
};
