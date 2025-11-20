import { NextFunction, Response } from "express";
import { Role } from "../types/roles";
import { AuthRequest } from "./auth.middleware";
import { AppError } from "../errors/AppError";

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(
        // 401: Unauthorized not authenticated
        new AppError("Not authenticated: No user information found.", 401)
      );
    }

    if (!allowedRoles.includes(user.role)) {
      // 403: Authorized but without sufficient permissions
      return next(new AppError("Not authorized to access this resource.", 403));
    }

    next();
  };
}
