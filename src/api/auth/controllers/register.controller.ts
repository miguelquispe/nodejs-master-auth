import { NextFunction, Request, Response } from "express";
import { RegisterDTO } from "../../../schemas/auth.schemas";
import { authService } from "../services/auth.service";

/*
400 → errores de input (faltan campos, password corta).
409 → conflicto: el recurso ya existe (email duplicado).
201 → recurso creado correctamente.
Nunca devolvemos password_hash → buena práctica de seguridad.
*/

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.body);

  // Insert user registration logic here
  try {
    const dto = req.body as RegisterDTO;
    const user = await authService.registerUser(dto);
    return res
      .status(201)
      .json({ message: "User registered successfully.", user });
  } catch (error) {
    console.error("Error registering user:", error);
    // return res.status(500).json({ message: "Error registering user." });
    return next(error);
  }
}
