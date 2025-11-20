import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  db: {
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    pass: process.env.DB_PASS ?? "",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    database: process.env.DB_NAME ?? "master_auth",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "key_default",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
  },
  refreshToken: {
    days: process.env.REFRESH_TOKEN_DAYS
      ? Number(process.env.REFRESH_TOKEN_DAYS)
      : 7,
  },
};
