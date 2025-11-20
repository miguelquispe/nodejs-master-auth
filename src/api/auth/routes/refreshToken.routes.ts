import { Router } from "express";
import { refreshToken } from "../controllers/refreshToken.controller";
import { validateBody } from "../../../middlewares/validate.middleware";
import { refreshTokenSchema } from "../../../schemas/auth.schemas";

const refreshTokenRouter = Router();

refreshTokenRouter.post("/", validateBody(refreshTokenSchema), refreshToken);

export default refreshTokenRouter;
