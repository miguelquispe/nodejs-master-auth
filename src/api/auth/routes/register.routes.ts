import { Router } from "express";
import { registerUser } from "../controllers/register.controller";
import { validateBody } from "../../../middlewares/validate.middleware";
import { registerSchema } from "../../../schemas/auth.schemas";

const registerRouter = Router();

// Define your registration route here
registerRouter.post("/", validateBody(registerSchema), registerUser);

export default registerRouter;
