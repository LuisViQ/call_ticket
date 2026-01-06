import { Request, Response } from "express";

export function ticketController(req: Request, res: Response) {
  return res.status(501).json({ error: "Not implemented" });
}
