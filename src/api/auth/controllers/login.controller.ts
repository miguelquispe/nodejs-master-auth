import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createAccessToken } from "../../../utils/jwt";
import { dbPool } from "../../../db/mysql";
import { LoginDTO } from "../../../schemas/auth.schemas";

type LoginBody = {
  email: string;
  password: string;
};

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body as LoginDTO;

  // 1: Basic validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // 2: Check if user exists
    const [rows] = await dbPool.query(
      "SELECT id, email, password_hash, full_name FROM users WHERE email = ?",
      [email]
    );

    const users = rows as UserRow[];

    // If no user found with that email, return 401 Unauthorized, never reveal email existence
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // User exists
    const user = users[0];

    // 3: Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // Password does not match
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Crear el token de acceso con los claims necesarios
    // claims: son los datos que queremos incluir en el token
    // se llaman claims porque son "declaraciones" sobre el usuario
    const accessToken = createAccessToken({
      userId: user.id,
      email: user.email,
    });

    // 4: Successful login
    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      },
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during login: /auth/login", error);
    return res.status(500).json({ message: "Error internal when logging in." });
  }
}
