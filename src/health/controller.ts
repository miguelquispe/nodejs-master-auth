import { Request, Response } from "express";
import { dbPool } from "../db/mysql";

export async function healthCheck(req: Request, res: Response) {
  console.log("healthCheck");
  try {
    await dbPool.query("SELECT 1");
    res.status(200).json({
      status: "OK",
      database: {
        status: "connected",
        // latency: "unknown",
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
}
