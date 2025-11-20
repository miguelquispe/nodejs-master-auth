import { dbPool } from "../../../db/mysql";
import { AppError } from "../../../errors/AppError";
import { LoginDTO, RegisterDTO } from "../../../schemas/auth.schemas";
import bcrypt from "bcrypt";
import { createAccessToken } from "../../../utils/jwt";
import { Role } from "../../../types/roles";

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: Role;
}

export class AuthService {
  // Authentication service methods will be implemented here

  // Register a new user
  async registerUser(dto: RegisterDTO) {
    const { email, password, fullName } = dto;

    // 1: Verify if email is already registered
    const [rows] = await dbPool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const existsingUsers = rows as any[];

    if (existsingUsers.length > 0) {
      // 409 Conflict: User already exists
      throw new AppError("User already exists.", 409);
    }

    // 2: Hash the password
    const saltRounds = 10; // salt means complexity of the hash
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3: Store user in the database
    const [result] = await dbPool.query(
      "INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)",
      [email, passwordHash, fullName || null]
    );

    // inserted id
    const insertedResult = result as { insertId: number };

    // 4: Return clean user data
    return {
      id: insertedResult.insertId,
      email,
      fullName: fullName || null,
    };
  }

  // Login an existing user
  async loginUser(dto: LoginDTO) {
    const { email, password } = dto;

    // 1:  Check if user exists
    const [rows] = await dbPool.query(
      "SELECT id, email, password_hash, full_name, role FROM users WHERE email = ?",
      [email]
    );

    const users = rows as UserRow[];

    // If no user found with that email, return 401 Unauthorized, never reveal email existence
    if (users.length === 0) {
      throw new AppError("Invalid credentials.", 401);
    }

    // User exists
    const user = users[0];

    // 2: Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // Password does not match
      throw new AppError("Invalid credentials.", 401);
    }

    // 3: Token creation
    // Crear el token de acceso con los claims necesarios
    // claims: son los datos que queremos incluir en el token
    // se llaman claims porque son "declaraciones" sobre el usuario
    const token = createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 4: Successful login, return user data and token
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      token,
    };
  }
}

// Singleton instance
// This ensures that throughout the application, we use the same instance of AuthService
export const authService = new AuthService();
