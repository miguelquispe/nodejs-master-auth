import { Router } from "express";
import { loginUser } from "../controllers/login.controller";
import { validateBody } from "../../../middlewares/validate.middleware";
import { loginSchema } from "../../../schemas/auth.schemas";

const loginRouter = Router();

// Define your registration route here
loginRouter.post("/", validateBody(loginSchema), loginUser);

export default loginRouter;
