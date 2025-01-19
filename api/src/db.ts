import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const client = await pool.connect();
    
    console.log("Connected to the database successfully!");
    client.release();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection error:", error.message);
    } else {
      console.error("Database connection error:", error);
    }
  }
})();


export default pool;