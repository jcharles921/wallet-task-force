import express, { Request, Response } from 'express';
import pool from '../db';
import { Account } from '../types';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Account>(`
      SELECT 
        a.*,
        COALESCE(SUM(CASE 
          WHEN t.type = 'income' THEN t.amount 
          WHEN t.type = 'expense' THEN -t.amount 
          ELSE 0 
        END), 0) as current_balance
      FROM accounts a
      LEFT JOIN transactions t ON a.id = t.account_id
      GROUP BY a.id
      ORDER BY a.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, type, spending_limit } = req.body;
    const result = await pool.query<Account>(
      `INSERT INTO accounts (name, type, spending_limit)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, type, spending_limit]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, spending_limit } = req.body;
    const result = await pool.query<Account>(
      `UPDATE accounts 
       SET name = $1, type = $2, spending_limit = $3
       WHERE id = $4
       RETURNING *`,
      [name, type, spending_limit, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM accounts WHERE id = $1', [id]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
