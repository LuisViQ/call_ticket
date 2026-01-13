import pool from "../database/pool.js";
import { ResultSetHeader } from "mysql2";
import path from "node:path";
export type TicketStatus =
  | "AGUARDANDO"
  | "EM_ATENDIMENTO"
  | "CANCELADO"
  | "ENCERRADO";
export type TicketType = string;
export type AreaType = string;
type TicketAttachmentRow = {
  id: number;
  ticket_id: number;
  file_url: string;
  file_type: string;
};
type TicketRow = {
  id: number;
  description: string;
  status: TicketStatus;
  ticket_type: TicketType | null;
  area_type: AreaType | null;
};
type TicketWithAttachments = TicketRow & {
  attachments: TicketAttachmentRow[];
};
// responsavel por criar o chamado de fato
export async function insertTicket(
  userId: number,
  description: string,
  status: TicketStatus,
  ticketType?: TicketType | null,
  areaType?: AreaType | null,
  // aqui podendo ou não criar com uma imagem
  url?: string
) {
  const columns = ["user_id", "description", "status"];
  const values: Array<number | string | null> = [userId, description, status];
  if (ticketType !== undefined) {
    columns.push("ticket_type");
    values.push(ticketType);
  }
  if (areaType !== undefined) {
    columns.push("area_type");
    values.push(areaType);
  }
  const placeholders = columns.map(() => "?").join(", ");
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO tickets (${columns.join(", ")}) VALUES (${placeholders})`,
    values
  );
  if (url) {
    await insertTicketImage(result.insertId, url);
  }
  return result.insertId;
}

// faz a inserção de uma imagem caso venha com o url
export async function insertTicketImage(ticketId: number, fileUrl: string) {
  // verifica o tipo de arquivo para salvar dentro do banco de dados
  const fileType = path.extname(fileUrl).replace(".", "");
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO ticket_attachments (ticket_id, file_url, file_type) VALUES (${teste}, ?, ?)",
    [ticketId, fileUrl, fileType]
  );
  return result.insertId;
}

// responsavel por listar todos os chamados do usuário
export async function listTickets(
  userId: number
): Promise<TicketWithAttachments[]> {
  const [rows] = await pool.execute(
    "SELECT id, description, status, ticket_type, area_type FROM tickets WHERE user_id = ?",
    [userId]
  );
  const tickets = rows as TicketRow[];
  if (!tickets.length) return [];

  const ticketIds = tickets.map((ticket) => ticket.id);
  const placeholders = ticketIds.map(() => "?").join(", ");
  const [attachmentRows] = await pool.execute(
    `SELECT id, ticket_id, file_url, file_type FROM ticket_attachments WHERE ticket_id IN (${placeholders})`,
    ticketIds
  );
  const attachments = attachmentRows as TicketAttachmentRow[];
  const attachmentsByTicket = new Map<number, TicketAttachmentRow[]>();

  for (const attachment of attachments) {
    const list = attachmentsByTicket.get(attachment.ticket_id);
    if (list) {
      list.push(attachment);
    } else {
      attachmentsByTicket.set(attachment.ticket_id, [attachment]);
    }
  }

  return tickets.map((ticket) => ({
    ...ticket,
    attachments: attachmentsByTicket.get(ticket.id) ?? [],
  }));
}
// responsavel por editar um chamado já existente, podendo mudar a descrição ou o status
export async function patchTicket(
  ticketId: number,
  userId: number,
  newStatus: TicketStatus,
  newDescription?: string,
  ticketType?: TicketType | null,
  areaType?: AreaType | null
) {
  const updates = ["status = ?"];
  const values: Array<number | string | null> = [newStatus];
  if (newDescription !== undefined) {
    updates.push("description = ?");
    values.push(newDescription);
  }
  if (ticketType !== undefined) {
    updates.push("ticket_type = ?");
    values.push(ticketType);
  }
  if (areaType !== undefined) {
    updates.push("area_type = ?");
    values.push(areaType);
  }
  values.push(ticketId, userId);
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE tickets SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );
  return result.affectedRows;
}
