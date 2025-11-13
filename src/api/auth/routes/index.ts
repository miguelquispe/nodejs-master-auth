import { Router } from "express";
import registerRouter from "./register.routes";
import loginRouter from "./login.routes";

const authRouter = Router();

// Define your registration route here
authRouter.use("/register", registerRouter);
authRouter.use("/login", loginRouter);

export default authRouter;
