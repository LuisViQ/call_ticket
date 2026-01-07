import { Request, Response } from "express";

/** Basic health check. */
export function healthController(req: Request, res: Response) {
  return res.json({ ok: true, data: "ok" });
}
