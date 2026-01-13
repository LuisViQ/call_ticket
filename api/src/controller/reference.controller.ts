import { Request, Response } from "express";
import { listAreaTypes, listTicketTypes } from "../repository/reference.repository.js";

export async function ticketTypesController(_req: Request, res: Response) {
  try {
    const types = await listTicketTypes();
    return res.json({ ok: true, data: types });
  } catch (error) {
    console.error("Ticket types failed", error);
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}

export async function areaTypesController(_req: Request, res: Response) {
  try {
    const types = await listAreaTypes();
    return res.json({ ok: true, data: types });
  } catch (error) {
    console.error("Area types failed", error);
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}
