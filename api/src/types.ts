export interface Account {
    id: number;
    name: string;
    type: 'bank' | 'mobile_money' | 'cash';
    spending_limit: number | null;
    current_balance: number;
  }
  
  export interface Transaction {
    id: number;
    account_id: number;
    category_id: number;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    date: Date;
  }
  
  export interface Category {
    id: number;
    name: string;
    parent_id?: number;
  }
  
  export interface Notification {
    id: number;
    account_id: number;
    message: string;
    type: 'limit_exceed' | 'system' | 'custom';
    read: boolean;
    created_at: Date;
  }