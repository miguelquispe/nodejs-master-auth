import { Router } from "express";
import { logoutUser } from "../controllers/logout.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const logoutRouter = Router();

logoutRouter.post("/", authMiddleware, logoutUser);

export default logoutRouter;
