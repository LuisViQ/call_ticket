import { Request, Response } from "express";

/// Teste de vida
export function healthController(req: Request, res: Response) {
  return res.json({ ok: true, data: "ok" });
}
