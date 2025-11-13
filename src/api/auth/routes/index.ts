import { Router } from "express";
import registerRouter from "./register.routes";

const authRouter = Router();

// Define your registration route here
authRouter.use("/register", registerRouter);

export default authRouter;
