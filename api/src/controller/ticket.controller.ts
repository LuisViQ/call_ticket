import { Request, Response } from "express";
import {
  insertTicket,
  listTickets,
  patchTicket,
  type AreaType,
  type TicketStatus,
  type TicketType
} from "../repository/ticket.repository.js";

// Função de controller dos tickets
export async function ticketController(req: Request, res: Response) {
  // Recebe o userId pelo middleware e verifica se é válido
  const userId = res.locals.userId as number | undefined;
  if (!userId) return res.status(401).json({ ok: false, error: "Missing token" });

  try {
    if (req.method === "GET") {
      // Faz a listagem dos tickets do usuario.
      const getUserIdParams = Number(req.params.id)
      const tickets = await listTickets(getUserIdParams);
      if (!tickets.length){
        return res.json({ ok: false, error: "Não encontrado para esse usuário" })
      }
      return res.json({ ok: true, data: tickets });
    }
    if (req.method === "PATCH") {
      // Faz a faz a transformação do id recebido pela url em numero ex: localhost:3000/api/tickets/5 to 5
      const ticketId = Number(req.params.id);
      if (!Number.isFinite(ticketId)) {
        return res.status(400).json({ ok: false, error: "Invalid ticket id" });
      }
      // aqui ele recebe os novos dados a ser atualizado
      const newStatus = req.body?.status as TicketStatus | undefined;
      const newDescription = req.body?.description as string | undefined;
      const ticketType = (req.body?.ticket_type ?? req.body?.ticketType) as TicketType | null | undefined;
      const areaType = (req.body?.area_type ?? req.body?.areaType) as AreaType | null | undefined;

      // aqui verifica se existem
      if (!newStatus) {
        return res.status(400).json({ ok: false, error: "Status is required" });
      }
      // aqui faz a atualização
      const updated = await patchTicket(ticketId, userId, newStatus, newDescription, ticketType, areaType);
      //  aqui caso não haja nada dentro de updated (deu erro) ele retornar uma mensagem de erro
      if (!updated) {
        return res.status(404).json({ ok: false, error: "Ticket not found" });
      }
      // aqui caso de tudo certo retornar que foi atualizado com sucesso
      return res.json({ ok: true, data: { updated: true } });
    }
    //recebe as informações para um novo chamado
    const description = req.body?.description as string | undefined;
    const status = req.body?.status as TicketStatus | undefined;
    const ticketType = (req.body?.ticket_type ?? req.body?.ticketType) as TicketType | null | undefined;
    const areaType = (req.body?.area_type ?? req.body?.areaType) as AreaType | null | undefined;
    const url = req.body?.url as string | undefined;
    //verifica se recebeu a descrição e o status corretamente
    if (!description || !status) {
      return res.status(400).json({ ok: false, error: "Description and status are required" });
    }
    // faz a inserção do chamado ao banco de dados
    const ticketId = await insertTicket(userId, description, status, ticketType, areaType, url);
    return res.status(201).json({ ok: true, data: { id: ticketId } });
  } catch (error) {
    console.error("Ticket failed", error);
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}
