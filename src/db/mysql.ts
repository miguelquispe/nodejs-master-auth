import mysql from "mysql2/promise";
import { env } from "../config/env";

export const dbPool = mysql.createPool({
  host: env.db.host,
  user: env.db.user,
  password: env.db.pass,
  database: env.db.database,
  port: env.db.port,
  connectionLimit: 10,
  queueLimit: 0,
});
