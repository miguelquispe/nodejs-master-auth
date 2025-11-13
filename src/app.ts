import express from "express";

// Import the health check handler
import healthRouter from "./health/routes";
import authRouter from "./api/auth/routes";

export function createApp() {
  const app = express();

  // Middleware to parse JSON bodies
  // porque los requests vienen en json desde el frontend
  // y express no lo entiende por defecto, lo interpreta como texto
  // por eso necesitamos este middleware para que lo convierta a json
  // el limit es para evitar ataques de denegacion de servicio DOS (Denial of Service)
  // limit de 1mb es suficiente para la mayoria de las aplicaciones
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
