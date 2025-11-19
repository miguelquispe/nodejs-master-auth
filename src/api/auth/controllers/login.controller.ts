import { NextFunction, Request, Response } from "express";
import { LoginDTO } from "../../../schemas/auth.schemas";
import { authService } from "../services/auth.service";

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = req.body as LoginDTO;
    const result = await authService.loginUser(dto);
    // La ruta define los mensajes y el formato de la respuesta
    // esto es responsabilidad del controller
    return res.status(200).json({ message: "Login successful.", result });
  } catch (error) {
    console.error("Error during login: /auth/login", error);
    // return res.status(500).json({ message: "Error internal when logging in." });
    return next(error);
  }
}
