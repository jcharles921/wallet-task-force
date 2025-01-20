import express, { Request, Response } from 'express';
import pool from '../db';
import { Notification } from '../types';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { account_id } = req.query;
    let query = `
      SELECT n.*, a.name as account_name
      FROM notifications n
      LEFT JOIN accounts a ON n.account_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (account_id) {
      params.push(account_id);
      query += ` AND n.account_id = $${params.length}`;
    }

    query += ' ORDER BY n.created_at DESC';

    const result = await pool.query<Notification>(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });  
  }
});

router.put('/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Notification>(
      'UPDATE notifications SET read = true WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;