import { Router } from "express";
import registerRouter from "./register.routes";
import loginRouter from "./login.routes";
import logoutRouter from "./logout.routes";

const authRouter = Router();

// Define your registration route here
authRouter.use("/register", registerRouter);
authRouter.use("/login", loginRouter);
authRouter.use("/logout", logoutRouter);

export default authRouter;
