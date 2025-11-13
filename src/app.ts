import express from "express";

// Import the health check handler
import healthRouter from "./health/routes";

export function createApp() {
  const app = express();

  // Health check endpoint
  app.use("/health", healthRouter);

  // Test endpoint
  app.get("/test", (req, res) => {
    res.status(200).json({ message: "Test endpoint is working!" });
  });

  return app;
}
