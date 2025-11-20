import { NextFunction, Request, Response } from "express";
import { AccessTokenPayload, verifyAccessToken } from "../utils/jwt";

// Extend the Express Request interface to include user property
export interface AuthRequest extends Request {
  user?: AccessTokenPayload;
}

/**
 *
 * 1. read the header Authorization with Bearer token
 * 2. if no header or no Bearer token -> 401 Unauthorized
 * 3. verify the token or 401 Unauthorized
 * 4. if verified, attach the payload to req.user and call next()
 */

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");

  // Check if Authorization header is present and properly formatted with Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  // Verify the token and extract the payload
  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyAccessToken(token);
    (req as AuthRequest).user = payload;
    // Next: means continue to the next middleware or route handler
    return next();
  } catch (error) {
    console.log("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
}
