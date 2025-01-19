import express from "express";
import cors from "cors";
// import pool from "./db";
import router from "./routes";
// import { seedDatabase } from "./db/seeder";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:3001'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);



app.use(express.json());

// Routes
app.use("/api", router);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});


// async function initializeDatabase() {
//   try {
//     console.log("Starting database initialization...");

    
//     await seedDatabase(pool);
//     console.log("Database initialization completed");
//   } catch (error) {
//     console.error("Failed to initialize database:", error);
//     // You might want to decide if the application should exit here
//     // process.exit(1);
//   }
// }

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

// initializeDatabase().then(() => {
//   app.listen(process.env.PORT || 3000, () => {
//     console.log(`Server running on port ${process.env.PORT || 3000}`);
//   });
// });

export default app;