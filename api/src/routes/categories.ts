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
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, parent_id } = req.body;

    // Check if the category exists
    const verifyResult = await pool.query<Category>(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (verifyResult.rows.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // Update the category
    const result = await pool.query<Category>(
      `UPDATE categories
       SET name = $1, parent_id = $2
       WHERE id = $3
       RETURNING *`,
      [name, parent_id, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
router.delete('/:id', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;

    // First verify if the category exists
    const verifyResult = await client.query<Category>(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (verifyResult.rows.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // Delete all transactions associated with this category
    await client.query(
      'DELETE FROM transactions WHERE category_id = $1',
      [id]
    );

    // Then delete the category itself
    const result = await client.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');
    res.json({ 
      message: 'Category and associated transactions deleted successfully', 
      category: result.rows[0] 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
});

export default router;