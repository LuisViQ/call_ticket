import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/auth.services.js";

/** Require a valid Bearer token and expose userId in res.locals. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) return res.status(401).json({ ok: false, error: "Missing token" });

  const sub = verifyToken(token);
  if (!sub) return res.status(401).json({ ok: false, error: "Invalid or expired token" });

  const userId = Number(sub);
  if (!Number.isFinite(userId)) return res.status(401).json({ ok: false, error: "Invalid token" });

  res.locals.userId = userId;
  return next();
}
