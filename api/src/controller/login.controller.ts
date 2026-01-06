import { Request, Response } from "express";
import { findUserById } from "../repository/user.repository.js";
import { authenticateUser, verifyToken } from "../services/auth.services.js";

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await authenticateUser(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({ data: result });
  } catch (error) {
    console.error("Login failed", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

export async function meController(req: Request, res: Response) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) return res.status(401).json({ error: "Missing token" });

  const sub = verifyToken(token);
  if (!sub) return res.status(401).json({ error: "Invalid or expired token" });

  const userId = Number(sub);
  if (!Number.isFinite(userId)) return res.status(401).json({ error: "Invalid token" });

  try {
    const user = await findUserById(userId);
    if (!user) return res.status(401).json({ error: "Invalid or expired token" });

    const { password_hash, ...safeUser } = user;
    return res.json({ data: safeUser });
  } catch (error) {
    console.error("Me failed", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
