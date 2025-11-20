import { Router } from "express";
import registerRouter from "./register.routes";
import loginRouter from "./login.routes";
import logoutRouter from "./logout.routes";
import refreshTokenRouter from "./refreshToken.routes";

const authRouter = Router();

// Define your registration route here
authRouter.use("/register", registerRouter);
authRouter.use("/login", loginRouter);
authRouter.use("/logout", logoutRouter);
authRouter.use("/refresh-token", refreshTokenRouter);

export default authRouter;
