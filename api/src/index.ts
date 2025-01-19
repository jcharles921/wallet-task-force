// src/index.ts
import express from "express";
import cors from "cors";
import pool from "./db";
import router from "./routes";
import { seedDatabase } from "./db/seeder";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

async function initializeDatabase() {
  try {
    await seedDatabase(pool);
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}
interface ApiError extends Error {
  statusCode?: number;
}

app.use(
  (
    err: ApiError,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(err.statusCode || 500).json({
      error: err.message || "Internal Server Error",
    });
    next();
  }
);
initializeDatabase().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

export default app;
