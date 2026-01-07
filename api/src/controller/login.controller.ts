import { Request, Response } from "express";
import { findUserById } from "../repository/user.repository.js";
import { authenticateUser, verifyToken } from "../services/auth.services.js";

// Responsavel por controlar o login e retorna o resultado do login.
export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "Email and password are required" });
  }

  try {
    // o resultado é as informações do usuario junto do token de verificação
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
// Faz a validação do usuario logado a partir do token recebido do Header
export async function meController(req: Request, res: Response) {
  const authHeader = req.headers.authorization || "";
  //Testa se é com o inicio correto e remove as 7 primeiras letras / caso não apenas poem ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) return res.status(401).json({ ok: false, error: "Missing token" });

  const userIdFromToken = verifyToken(token);
  if (!userIdFromToken) return res.status(401).json({ ok: false, error: "Invalid or expired token" });

  //Transforma a resposata em um numero e verifica se é algo alem de um numero.
  const userId = Number(userIdFromToken);
  if (!Number.isFinite(userId)) return res.status(401).json({ ok: false, error: "Invalid token" });

  try {
    //Faz a tentative de procurar o uruario pelo id e retorna as informações.
    const user = await findUserById(userId);
    if (!user) return res.status(401).json({ ok: false, error: "Invalid or expired token" });

    const { password_hash: passwordHash, ...safeUser } = user;
    return res.json({ ok: true, data: safeUser });
  } catch (error) {
    //Caso erro
    console.error("Me failed", error);
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}
