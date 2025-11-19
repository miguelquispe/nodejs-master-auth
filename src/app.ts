import express from "express";

// Agrega CORS para controlar orígenes web
import cors from "cors";

// Import the health check handler
import healthRouter from "./health/routes";
import authRouter from "./api/auth/routes";
import v1Routes from "./api/v1/routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();

  // Middleware to parse JSON bodies
  // porque los requests vienen en json desde el frontend
  // y express no lo entiende por defecto, lo interpreta como texto
  // por eso necesitamos este middleware para que lo convierta a json
  // el limit es para evitar ataques de denegacion de servicio DOS (Denial of Service)
  // limit de 1mb es suficiente para la mayoria de las aplicaciones
  app.use(express.json({ limit: "1mb" }));

  // cors middleware
  app.use(cors());

  // Health check endpoint
  app.use("/health", healthRouter);

  // Auth endpoints
  app.use("/api/auth", authRouter);

  // Other endpoints can be added here
  app.use("/api/v1", v1Routes);

  // Test endpoint
  app.get("/test", (req, res) => {
    res.status(200).json({ message: "Test endpoint is working!" });
  });

  // Middleware
  app.use(errorMiddleware);

  return app;
}
