import { NextFunction, Request, Response } from "express";

export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // En JWT stateless, el servidor no "borra" nada
    // Aquí simplemente confirmamos que el token era válido.
    // Implement logout logic here, e.g., invalidate tokens, clear cookies, etc.
    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    return next(error);
  }
}
