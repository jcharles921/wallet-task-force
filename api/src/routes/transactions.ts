import express, { Request, Response, Router } from 'express';
import pool from '../db';
import { Transaction } from '../types';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { account_id, startDate, endDate } = req.query;
        let query = `SELECT t.*, a.name as account_name, c.name as category_name 
                    FROM transactions t 
                    LEFT JOIN accounts a ON t.account_id = a.id 
                    LEFT JOIN categories c ON t.category_id = c.id 
                    WHERE 1=1`;
        
        const params: any[] = [];
        if (account_id) {
            params.push(account_id);
            query += `AND t.account_id = $${params.length}`;
        }
        if (startDate) {
            params.push(startDate);
            query += `AND t.date >= $${params.length}`;
        }
        if (endDate) {
            params.push(endDate);
            query += `AND t.date <= $${params.length}`;
        }
        query += ' ORDER BY t.date DESC';
        
        const result = await pool.query<Transaction>(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { account_id, category_id, amount, type, description } = req.body;

        const accountResult = await client.query(`
            SELECT a.*, COALESCE(SUM(CASE 
                WHEN t.type = 'income' THEN t.amount 
                WHEN t.type = 'expense' THEN -t.amount 
                ELSE 0 END), 0) as current_balance
            FROM accounts a
            LEFT JOIN transactions t ON a.id = t.account_id
            WHERE a.id = $1
            GROUP BY a.id`,
            [account_id]
        );

        const account = accountResult.rows[0];
        if (type === 'expense') {
            const newBalance = Number(account.current_balance) - Number(amount);
            if (account.spending_limit && Math.abs(newBalance) > account.spending_limit) {
                await client.query(
                    `INSERT INTO notifications (account_id, message, type) 
                     VALUES ($1, $2, 'limit_exceed')`,
                    [account_id, `Spending limit exceeded for account ${account.name}`]
                );
            }
        }

        const result = await client.query<Transaction>(
            `INSERT INTO transactions (account_id, category_id, amount, type, description)
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [account_id || null, category_id || null, amount, type, description || null]
        );

        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: (error as Error).message });
    } finally {
        client.release();
    }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;

        const verifyResult = await client.query<Transaction>(
            'SELECT * FROM transactions WHERE id = $1',
            [id]
        );

        if (verifyResult.rows.length === 0) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }

        const result = await client.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [id]
        );

        await client.query('COMMIT');
        res.json({ message: 'Transaction deleted successfully', transaction: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: (error as Error).message });
    } finally {
        client.release();
    }
});

export default router;