import { Router } from "express";
import { loginUser } from "../controllers/login.controller";

const loginRouter = Router();

// Define your registration route here
loginRouter.post("/", loginUser);

export default loginRouter;
