import { Request, Response } from "express";
import { insertTicket, listTickets, patchTicket, type TicketStatus } from "../repository/ticket.repository.js";

/** Example ticket endpoint; uses userId from auth middleware. */
export async function ticketController(req: Request, res: Response) {
  const userId = res.locals.userId as number | undefined;
  if (!userId) return res.status(401).json({ ok: false, error: "Missing token" });

  try {
    if (req.method === "GET") {
      const tickets = await listTickets(userId);
      return res.json({ ok: true, data: tickets });
    }
    if (req.method === "PATCH") {
      const ticketId = Number(req.params.id);
      if (!Number.isFinite(ticketId)) {
        return res.status(400).json({ ok: false, error: "Invalid ticket id" });
      }

      const newStatus = req.body?.status as TicketStatus | undefined;
      
      const newDescription = req.body?.description as string | undefined;

      if (!newStatus) {
        return res.status(400).json({ ok: false, error: "Status is required" });
      }

      const updated = await patchTicket(ticketId, userId, newStatus, newDescription);
      if (!updated) {
        return res.status(404).json({ ok: false, error: "Ticket not found" });
      }

      return res.json({ ok: true, data: { updated: true } });
    }

    const description = req.body?.description as string | undefined;
    const status = req.body?.status as TicketStatus | undefined;
    const url = req.body?.url as string | undefined;

    if (!description || !status) {
      return res.status(400).json({ ok: false, error: "Description and status are required" });
    }

    const ticketId = await insertTicket(userId, description, status, url);
    return res.status(201).json({ ok: true, data: { id: ticketId } });
  } catch (error) {
    console.error("Ticket failed", error);
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}
