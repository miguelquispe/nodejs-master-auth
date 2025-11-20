import { Request, Response, Router } from "express";
import { userController } from "../controllers/user.controller";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { authorize } from "../../../middlewares/authorize.middleware";

const userRouter = Router();
// Un user normal puede acceder a su información: /user
userRouter.get("/", userController);

// Ruta accesible solo para usuarios con rol "admin"
userRouter.get(
  "/admin-only",
  authorize("admin"),
  (req: AuthRequest, res: Response) => {
    return res.status(200).json({ message: "Welcome, admin user!" });
  }
);

export default userRouter;
