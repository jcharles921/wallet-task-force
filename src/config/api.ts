interface ApiConfig {
    baseURL: string;
    timeout: number;
  }
  
  export const apiConfig: ApiConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 5000
  };
  
  export const endpoints = {
    transactions: `${apiConfig.baseURL}/transactions`,
    accountTypes: `${apiConfig.baseURL}/accounts`,
    categories: `${apiConfig.baseURL}/categories`,
    notfications: `${apiConfig.baseURL}/notifications`
  };