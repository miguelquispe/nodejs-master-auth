import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { dbPool } from "../../../db/mysql";
import { RegisterDTO } from "../../../schemas/auth.schemas";

type RegisterBody = {
  email: string;
  password: string;
  fullName?: string;
};

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

  const { email, password, fullName } = req.body as RegisterDTO;
  // (req.body ??
  // {}) as Partial<RegisterBody>;

  console.log("email", email);

  // 1: Basic validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Password strength validation (example: minimum 6 characters)
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  // Insert user registration logic here
  try {
    // 2: verify if user already exists
    const [rows] = await dbPool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const existsingUsers = rows as any[];

    if (existsingUsers.length > 0) {
      // 409 Conflict: User already exists
      return res.status(409).json({ message: "User already exists." });
    }

    // 3: Hash the password
    const saltRounds = 10; // salt means complexity of the hash
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4: Store user in the database
    const [result] = await dbPool.query(
      "INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)",
      [email, passwordHash, fullName || null]
    );

    // inserted id
    const insertedResult = result as { insertId: number };

    // 5: Respond with success
    return res.status(201).json({
      message: "User registered successfully.",
      data: {
        id: insertedResult.insertId,
        email,
        fullName: fullName || null,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    // return res.status(500).json({ message: "Error registering user." });
    return next(error);
  }
}
