import { Router } from "express";
import userRouter from "./user.routes";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

// Define your registration route here
router.use("/user", authMiddleware, userRouter);

export default router;
