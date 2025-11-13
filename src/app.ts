import express from "express";

// Import the health check handler
import healthRouter from "./health/routes";
import authRouter from "./api/auth/routes";

export function createApp() {
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json({ limit: "1mb" }));

  // Health check endpoint
  app.use("/health", healthRouter);

  // Auth endpoints
  app.use("/api/auth", authRouter);

  // Test endpoint
  app.get("/test", (req, res) => {
    res.status(200).json({ message: "Test endpoint is working!" });
  });

  return app;
}
