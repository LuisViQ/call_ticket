import { Request, Response } from "express";
import { findUserById } from "../repository/user.repository.js";
import { authenticateUser, verifyToken } from "../services/auth.services.js";

/** Handle login and return user data + token. */
export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "Email and password are required" });
  }

  try {
    const result = await authenticateUser(email, password);
    if (!result) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    return res.json({ ok: true, data: result });
  } catch (error) {
    console.error("Login failed", error);
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}

/** Validate token and return the logged-in user. */
export async function meController(req: Request, res: Response) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) return res.status(401).json({ ok: false, error: "Missing token" });

  const userIdFromToken = verifyToken(token);
  if (!userIdFromToken) return res.status(401).json({ ok: false, error: "Invalid or expired token" });

  const userId = Number(userIdFromToken);
  if (!Number.isFinite(userId)) return res.status(401).json({ ok: false, error: "Invalid token" });

  try {
    const user = await findUserById(userId);
    if (!user) return res.status(401).json({ ok: false, error: "Invalid or expired token" });

    const { password_hash: passwordHash, ...safeUser } = user;
    return res.json({ ok: true, data: safeUser });
  } catch (error) {
    console.error("Me failed", error);
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}
