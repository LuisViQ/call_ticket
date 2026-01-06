import { Request, Response } from "express";
import { findUserByEmail } from "../repository/user.repository.js";
import { comparePassword } from "../services/auth.services.js";

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password_hash, ...safeUser } = user;
    return res.status(200).json({ data: safeUser });
  } catch (error) {
    console.error("Login failed", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
