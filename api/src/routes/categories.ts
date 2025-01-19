import express, { Request, Response } from 'express';
import pool from '../db';
import { Category } from '../types';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Category>(`
      SELECT * FROM categories 
      ORDER BY COALESCE(parent_id, id), name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, parent_id } = req.body;
    const result = await pool.query<Category>(
      `INSERT INTO categories (name, parent_id)
       VALUES ($1, $2)
       RETURNING *`,
      [name, parent_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;