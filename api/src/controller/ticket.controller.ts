import { Request, Response } from "express";
import {
  insertTicket,
  listTickets,
  patchTicket,
  type TicketStatus
} from "../repository/ticket.repository.js";

function parseOptionalId(value: unknown) {
  if (value === null) return { value: null, ok: true };
  if (value === undefined) return { value: undefined, ok: true };
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return { value: undefined, ok: false };
  return { value: parsed, ok: true };
}

// FunÇõÇœo de controller dos tickets
export async function ticketController(req: Request, res: Response) {
  // Recebe o userId pelo middleware e verifica se Ç¸ vÇ­lido
  const userId = res.locals.userId as number | undefined;
  if (!userId) return res.status(401).json({ ok: false, error: "Missing token" });

  try {
    if (req.method === "GET") {
      // Faz a listagem dos tickets do usuario.
      const getUserIdParams = Number(req.params.id);
      const tickets = await listTickets(getUserIdParams);
      if (!tickets.length) {
        return res.json({ ok: false, error: "NÇœo encontrado para esse usuÇ­rio" });
      }
      return res.json({ ok: true, data: tickets });
    }
    if (req.method === "PATCH") {
      // Faz a faz a transformaÇõÇœo do id recebido pela url em numero ex: localhost:3000/api/tickets/5 to 5
      const ticketId = Number(req.params.id);
      if (!Number.isFinite(ticketId)) {
        return res.status(400).json({ ok: false, error: "Invalid ticket id" });
      }
      // aqui ele recebe os novos dados a ser atualizado
      const newStatus = req.body?.status as TicketStatus | undefined;
      const newTitle = req.body?.title as string | undefined;
      const newDescription = req.body?.description as string | undefined;
      const ticketTypeIdInput = req.body?.ticket_type_id ?? req.body?.ticketTypeId;
      const areaTypeIdInput = req.body?.area_type_id ?? req.body?.areaTypeId;
      const { value: ticketTypeId, ok: ticketTypeOk } = parseOptionalId(ticketTypeIdInput);
      const { value: areaTypeId, ok: areaTypeOk } = parseOptionalId(areaTypeIdInput);

      if (!ticketTypeOk) {
        return res.status(400).json({ ok: false, error: "Invalid ticket type id" });
      }
      if (!areaTypeOk) {
        return res.status(400).json({ ok: false, error: "Invalid area type id" });
      }

      // aqui verifica se existem
      if (!newStatus) {
        return res.status(400).json({ ok: false, error: "Status is required" });
      }
      if (newTitle !== undefined && !newTitle) {
        return res.status(400).json({ ok: false, error: "Title is required" });
      }
      // aqui faz a atualizaÇõÇœo
      const updated = await patchTicket(
        ticketId,
        userId,
        newStatus,
        newTitle,
        newDescription,
        ticketTypeId,
        areaTypeId
      );
      //  aqui caso nÇœo haja nada dentro de updated (deu erro) ele retornar uma mensagem de erro
      if (!updated) {
        return res.status(404).json({ ok: false, error: "Ticket not found" });
      }
      // aqui caso de tudo certo retornar que foi atualizado com sucesso
      return res.json({ ok: true, data: { updated: true } });
    }
    //recebe as informaÇõÇæes para um novo chamado
    const title = req.body?.title as string | undefined;
    const description = req.body?.description as string | undefined;
    const status = req.body?.status as TicketStatus | undefined;
    const ticketTypeIdInput = req.body?.ticket_type_id ?? req.body?.ticketTypeId;
    const areaTypeIdInput = req.body?.area_type_id ?? req.body?.areaTypeId;
    const { value: ticketTypeId, ok: ticketTypeOk } = parseOptionalId(ticketTypeIdInput);
    const { value: areaTypeId, ok: areaTypeOk } = parseOptionalId(areaTypeIdInput);
    const url = req.body?.url as string | undefined;
    //verifica se recebeu a descriÇõÇœo e o status corretamente
    if (!title || !description || !status) {
      return res.status(400).json({ ok: false, error: "Title, description, and status are required" });
    }
    if (!ticketTypeOk) {
      return res.status(400).json({ ok: false, error: "Invalid ticket type id" });
    }
    if (!areaTypeOk) {
      return res.status(400).json({ ok: false, error: "Invalid area type id" });
    }
    // faz a inserÇõÇœo do chamado ao banco de dados
    const ticketId = await insertTicket(
      userId,
      title,
      description,
      status,
      ticketTypeId,
      areaTypeId,
      url
    );
    return res.status(201).json({ ok: true, data: { id: ticketId } });
  } catch (error) {
    console.error("Ticket failed", error);
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}
