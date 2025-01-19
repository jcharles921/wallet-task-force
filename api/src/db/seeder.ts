import { Pool } from 'pg';

// Initial categories with parent-child relationships
const defaultCategories = [
  { name: 'Income', parent_id: null },
  { name: 'Salary', parent_id: 1 },
  { name: 'Freelance', parent_id: 1 },
  { name: 'Investments', parent_id: 1 },
  
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
  { name: 'Entertainment', parent_id: 14 },
];

// Initial accounts
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

// Initial transactions
const defaultTransactions = [
  {
    account_id: 1,
    category_id: 3, // Freelance
    amount: 1000.0,
    type: 'income',
    description: 'Freelance project payment',
  },
  {
    account_id: 2,
    category_id: 6, // Rent/Mortgage
    amount: 1200.0,
    type: 'expense',
    description: 'Monthly rent payment',
  },
  {
    account_id: 3,
    category_id: 9, // Fuel
    amount: 50.0,
    type: 'expense',
    description: 'Fuel for the week',
  },
];

// Initial notifications
const defaultNotifications = [
  {
    account_id: 2,
    message: 'Spending limit exceeded for Main Bank Account',
    type: 'limit_exceed',
  },
  {
    account_id: 3,
    message: 'Low balance on Mobile Money account',
    type: 'low_balance',
  },
];

export async function seedDatabase(pool: Pool): Promise<void> {
  console.log('Seeding database...');
  const client = await pool.connect();

  try {
    console.log('Starting database seeding...');
    await client.query('BEGIN');

    // Seed categories
    const categoryCountResult = await client.query('SELECT COUNT(*) FROM categories');
    const categoryCount = parseInt(categoryCountResult.rows[0].count, 10);
    if (categoryCount === 0) {
      console.log('Seeding categories...');
      for (const category of defaultCategories) {
        await client.query(
          'INSERT INTO categories (name, parent_id) VALUES ($1, $2)',
          [category.name, category.parent_id]
        );
      }
      console.log('Categories seeded successfully.');
    } else {
      console.log('Categories already seeded.');
    }

    // Seed accounts
    const accountCountResult = await client.query('SELECT COUNT(*) FROM accounts');
    const accountCount = parseInt(accountCountResult.rows[0].count, 10);
    if (accountCount === 0) {
      console.log('Seeding accounts...');
      for (const account of defaultAccounts) {
        await client.query(
          'INSERT INTO accounts (name, type, spending_limit) VALUES ($1, $2, $3)',
          [account.name, account.type, account.spending_limit]
        );
      }
      console.log('Accounts seeded successfully.');
    } else {
      console.log('Accounts already seeded.');
    }

    // Seed transactions
    const transactionCountResult = await client.query('SELECT COUNT(*) FROM transactions');
    const transactionCount = parseInt(transactionCountResult.rows[0].count, 10);
    if (transactionCount === 0) {
      console.log('Seeding transactions...');
      for (const transaction of defaultTransactions) {
        await client.query(
          `INSERT INTO transactions (account_id, category_id, amount, type, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            transaction.account_id,
            transaction.category_id,
            transaction.amount,
            transaction.type,
            transaction.description,
          ]
        );
      }
      console.log('Transactions seeded successfully.');
    } else {
      console.log('Transactions already seeded.');
    }

    // Seed notifications
    const notificationCountResult = await client.query('SELECT COUNT(*) FROM notifications');
    const notificationCount = parseInt(notificationCountResult.rows[0].count, 10);
    if (notificationCount === 0) {
      console.log('Seeding notifications...');
      for (const notification of defaultNotifications) {
        await client.query(
          `INSERT INTO notifications (account_id, message, type, is_read)
           VALUES ($1, $2, $3, $4)`,
          [
            notification.account_id,
            notification.message,
            notification.type,
            false, // Default unread status
          ]
        );
      }
      console.log('Notifications seeded successfully.');
    } else {
      console.log('Notifications already seeded.');
    }

    await client.query('COMMIT');
    console.log('Database seeding completed successfully.');
  } catch (error:any) {
    await client.query('ROLLBACK');
    console.error('Error during database seeding:', error.message);
    throw error;
  } finally {
    client.release();
  }
}
