import { Pool } from 'pg';
import { Category, Account } from '../types';

// Initial categories with parent-child relationships
const defaultCategories = [
  // Income categories
  { name: 'Income', parent_id: null },
  { name: 'Salary', parent_id: 1 },
  { name: 'Freelance', parent_id: 1 },
  { name: 'Investments', parent_id: 1 },
  
  // Expense categories
  { name: 'Housing', parent_id: null },
  { name: 'Rent/Mortgage', parent_id: 5 },
  { name: 'Utilities', parent_id: 5 },
  
  { name: 'Transportation', parent_id: null },
  { name: 'Fuel', parent_id: 8 },
  { name: 'Public Transport', parent_id: 8 },
  
  { name: 'Food', parent_id: null },
  { name: 'Groceries', parent_id: 11 },
  { name: 'Dining Out', parent_id: 11 },
  
  { name: 'Personal', parent_id: null },
  { name: 'Healthcare', parent_id: 14 },
  { name: 'Entertainment', parent_id: 14 }
];

// Initial account types
const defaultAccounts = [
  {
    name: 'Cash Wallet',
    type: 'cash',
    spending_limit: null
  },
  {
    name: 'Main Bank Account',
    type: 'bank',
    spending_limit: 20000
  },
  {
    name: 'Mobile Money',
    type: 'mobile_money',
    spending_limit: 15000
  }
];

export async function seedDatabase(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if categories table is empty
    const categoryCount = await client.query('SELECT COUNT(*) FROM categories');
    if (categoryCount.rows[0].count === '0') {
      console.log('Seeding categories...');
      
      // Insert categories in order (parents first)
      for (const category of defaultCategories) {
        await client.query(
          'INSERT INTO categories (name, parent_id) VALUES ($1, $2)',
          [category.name, category.parent_id]
        );
      }
    }
    
    // Check if accounts table is empty
    const accountCount = await client.query('SELECT COUNT(*) FROM accounts');
    if (accountCount.rows[0].count === '0') {
      console.log('Seeding accounts...');
      
      for (const account of defaultAccounts) {
        await client.query(
          'INSERT INTO accounts (name, type, spending_limit) VALUES ($1, $2, $3)',
          [account.name, account.type, account.spending_limit]
        );
      }
    }
    
    await client.query('COMMIT');
    console.log('Database seeding completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
}
