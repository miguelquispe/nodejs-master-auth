import crypto from "crypto";
import { env } from "../config/env.js";

// Generamos un token de refresco seguro
// se usa hex para que sea una cadena legible
export function generateRefreshToken(): string {
  // Implementation for generating a refresh token
  return crypto.randomBytes(32).toString("hex"); // 64-character hex string
}

// Calculamos la fecha de expiración del token de refresco
// el resultado es una fecha en el futuro basada en la configuración
// desde ahora + días configurados
export function getRefreshTokenExpiryDate(): Date {
  const now = new Date();
  now.setDate(now.getDate() + env.refreshToken.days);
  return now;
}
