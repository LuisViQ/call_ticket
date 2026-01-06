import { Request, Response } from "express";

export function healthController(req: Request, res: Response) {
  return res.json({ data: "ok" });
}
