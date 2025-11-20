import { dbPool } from "../../../db/mysql";
import { AppError } from "../../../errors/AppError";
import {
  LoginDTO,
  RefreshTokenDTO,
  RegisterDTO,
} from "../../../schemas/auth.schemas";
import bcrypt from "bcrypt";
import { createAccessToken } from "../../../utils/jwt";
import { Role } from "../../../types/roles";
import {
  generateRefreshToken,
  getRefreshTokenExpiryDate,
} from "../../../utils/refreshToken";

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: Role;
}

interface RefreshTokenRow {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  revoked: number;
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

    // Generate refresh token
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiryDate();

    await dbPool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiresAt]
    );

    // 4: Successful login, return user data and token
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  async refreshAccessToken(dto: RefreshTokenDTO) {
    const { refreshToken } = dto;

    // 1: Validate refresh token
    const [rows] = await dbPool.query(
      `SELECT id, user_id, expires_at, revoked 
      FROM refresh_tokens 
      WHERE token = ? LIMIT 1`,
      [refreshToken]
    );

    const tokens = rows as RefreshTokenRow[];

    // 2: Check if token exists
    // No token found
    if (tokens.length === 0) {
      throw new AppError("Invalid refresh token.", 401);
    }

    // Token found
    const storedToken = tokens[0];

    // Check if token is revoked
    if (storedToken.revoked) {
      throw new AppError("Refresh token has been revoked.", 401);
    }

    // Check if token is expired
    const now = new Date();
    if (storedToken.expires_at <= now) {
      throw new AppError("Refresh token has expired.", 401);
    }

    // 3: Get user data
    const [userRows] = await dbPool.query(
      `SELECT id, email, full_name, role 
      FROM users 
      WHERE id = ? LIMIT 1`,
      [storedToken.user_id]
    );

    const users = userRows as Array<{
      id: number;
      email: string;
      full_name: string;
      role: Role;
    }>;

    // User should exist as token is valid
    if (users.length === 0) {
      throw new AppError("User not found for the provided refresh token.", 401);
    }

    // Create a new access token for the user
    const user = users[0];

    // Optional, you might want to revoke the used refresh token here
    await dbPool.query("UPDATE refresh_tokens SET revoked = 1 WHERE id = ?", [
      storedToken.id,
    ]);

    const newRefreshToken = generateRefreshToken();
    const newExpiresAt = getRefreshTokenExpiryDate();

    await dbPool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, newRefreshToken, newExpiresAt]
    );

    // 4: Generate new access token
    const newAccessToken = createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5: Return new tokens
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

// Singleton instance
// This ensures that throughout the application, we use the same instance of AuthService
export const authService = new AuthService();
