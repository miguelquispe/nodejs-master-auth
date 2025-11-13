import { Router } from "express";
import { registerUser } from "../controllers/register.controller";

const registerRouter = Router();

// Define your registration route here
registerRouter.post("/", registerUser);

export default registerRouter;
