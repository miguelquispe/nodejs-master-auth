import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../types/roles";

export type AccessTokenPayload = {
  userId: number;
  email: string;
  role: Role;
};

const expiresIn = env.jwt.expiresIn as any;

export function createAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: expiresIn,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwt.secret);
  return decoded as AccessTokenPayload;
}
