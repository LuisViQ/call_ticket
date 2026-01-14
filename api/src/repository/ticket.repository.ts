import pool from "../database/pool.js";
import { ResultSetHeader } from "mysql2";
import path from "node:path";

export type TicketStatus =
  | "AGUARDANDO"
  | "EM_ATENDIMENTO"
  | "CANCELADO"
  | "ENCERRADO";
export type TicketType = {
  id: number;
  name: string;
};
export type AreaType = {
  id: number;
  name: string;
};

type TicketAttachmentRow = {
  id: number;
  ticket_id: number;
  file_url: string;
  file_type: string;
};
type TicketRow = {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  ticket_type_id: number | null;
  ticket_type_name: string | null;
  area_type_id: number | null;
  area_type_name: string | null;
};
type TicketWithAttachments = {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  ticket_type: TicketType | null;
  area_type: AreaType | null;
  attachments: TicketAttachmentRow[];
};

function buildReference(id: number | null, name: string | null) {
  if (id === null || name === null) return null;
  return { id, name };
}

// responsavel por criar o chamado de fato
export async function insertTicket(
  userId: number,
  title: string,
  description: string,
  status: TicketStatus,
  ticketTypeId?: number | null,
  areaTypeId?: number | null,
  // aqui podendo ou nÇœo criar com uma imagem
  url?: string
) {
  const columns = ["user_id", "title", "description", "status"];
  const values: Array<number | string | null> = [
    userId,
    title,
    description,
    status,
  ];
  if (ticketTypeId !== undefined) {
    columns.push("ticket_type_id");
    values.push(ticketTypeId);
  }
  if (areaTypeId !== undefined) {
    columns.push("area_type_id");
    values.push(areaTypeId);
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

// faz a inserÇõÇœo de uma imagem caso venha com o url
export async function insertTicketImage(ticketId: number, fileUrl: string) {
  // verifica o tipo de arquivo para salvar dentro do banco de dados
  const fileType = path.extname(fileUrl).replace(".", "");
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO ticket_attachments (ticket_id, file_url, file_type) VALUES (?, ?, ?)",
    [ticketId, fileUrl, fileType]
  );
  return result.insertId;
}

// responsavel por listar todos os chamados do usuÇ­rio
export async function listTickets(
  userId: number
): Promise<TicketWithAttachments[]> {
  const [rows] = await pool.execute(
    `SELECT
      t.id,
      t.title,
      t.description,
      t.status,
      tt.id AS ticket_type_id,
      tt.name AS ticket_type_name,
      at.id AS area_type_id,
      at.name AS area_type_name
    FROM tickets t
    LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.id
    LEFT JOIN ticket_area_types at ON t.area_type_id = at.id
    WHERE t.user_id = ?`,
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
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    ticket_type: buildReference(ticket.ticket_type_id, ticket.ticket_type_name),
    area_type: buildReference(ticket.area_type_id, ticket.area_type_name),
    attachments: attachmentsByTicket.get(ticket.id) ?? [],
  }));
}
// responsavel por editar um chamado jÇ­ existente, podendo mudar a descriÇõÇœo ou o status
export async function patchTicket(
  ticketId: number,
  userId: number,
  newStatus: TicketStatus,
  newTitle?: string,
  newDescription?: string,
  ticketTypeId?: number | null,
  areaTypeId?: number | null
) {
  const updates = ["status = ?"];
  const values: Array<number | string | null> = [newStatus];
  if (newTitle !== undefined) {
    updates.push("title = ?");
    values.push(newTitle);
  }
  if (newDescription !== undefined) {
    updates.push("description = ?");
    values.push(newDescription);
  }
  if (ticketTypeId !== undefined) {
    updates.push("ticket_type_id = ?");
    values.push(ticketTypeId);
  }
  if (areaTypeId !== undefined) {
    updates.push("area_type_id = ?");
    values.push(areaTypeId);
  }
  values.push(ticketId, userId);
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE tickets SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );
  return result.affectedRows;
}
