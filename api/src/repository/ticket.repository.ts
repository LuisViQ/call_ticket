import pool from "../database/pool.js";
import { ResultSetHeader } from "mysql2";
import path from "node:path";
export type TicketStatus = "AGUARDANDO" | "EM_ATENDIMENTO" | "CANCELADO" | "ENCERRADO";
export type TicketType = string;
export type AreaType = string;
type TicketRow = {
  id: number;
  description: string;
  status: TicketStatus;
  ticket_type: TicketType | null;
  area_type: AreaType | null;
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
    await insertTicketImage(result.insertId, url)
  }
  return result.insertId;
}

// faz a inserção de uma imagem caso venha com o url 
export async function insertTicketImage(
  ticketId: number,
  fileUrl: string,
) {
  // verifica o tipo de arquivo para salvar dentro do banco de dados
  const fileType = path.extname(fileUrl).replace(".", "");
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO ticket_attachments (ticket_id, file_url, file_type) VALUES (?, ?, ?)",
    [ticketId, fileUrl, fileType]
  );
  return result.insertId;
}

// responsavel por listar todos os chamados do usuário
export async function listTickets(userId: number): Promise<TicketRow[] | string> {
  const [rows] = await pool.execute(
    "SELECT id, description, status, ticket_type, area_type FROM tickets WHERE user_id = ?",
    [userId]
  );
  return rows as TicketRow[];
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
