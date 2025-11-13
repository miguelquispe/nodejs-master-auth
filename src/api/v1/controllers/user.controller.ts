import { Request, Response } from "express";

export function userController(req: Request, res: Response) {
  const { user } = req as any;

  if (!user) {
    return res.status(500).json({ message: "User info not found in request." });
  }

  return res.status(200).json({
    message: "User info retrieved successfully.",
    user,
  });
}
