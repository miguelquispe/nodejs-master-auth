import { NextFunction, Request, Response } from "express";
import { RefreshTokenDTO } from "../../../schemas/auth.schemas";
import { authService } from "../services/auth.service";

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = req.body as RefreshTokenDTO;
    const result = await authService.refreshAccessToken(dto);
    return res
      .status(200)
      .json({ message: "Token refreshed successfully.", ...result });
  } catch (error) {
    next(error);
  }
}
