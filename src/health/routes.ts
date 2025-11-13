import { Router } from "express";
import { healthCheck } from "./controller";

const router = Router();

// Health check endpoint
router.get("/", healthCheck);

export default router;
