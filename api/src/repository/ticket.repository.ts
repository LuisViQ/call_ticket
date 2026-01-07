import pool from "../database/pool.js";
import { ResultSetHeader } from "mysql2";
import path from "node:path";
export type TicketStatus = "AGUARDANDO" | "EM_ATENDIMENTO" | "CANCELADO" | "ENCERRADO";
type TicketRow = {
  id: number;
  description: string;
  status: TicketStatus;
};
/** Create a ticket and return the new id. */
export async function insertTicket(
  userId: number,
  description: string,
  status: TicketStatus,
  url?: string
) {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO tickets (user_id, description, status) VALUES (?, ?, ?)",
    [userId, description, status]
  );
  if (url) {
    await insertTicketImage(result.insertId, url)
  }
  return result.insertId;
}

/** Attach a file to a ticket and return the new id. */
export async function insertTicketImage(
  ticketId: number,
  fileUrl: string,
) {
  const fileType = path.extname(fileUrl).replace(".", "");
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO ticket_attachments (ticket_id, file_url, file_type) VALUES (?, ?, ?)",
    [ticketId, fileUrl, fileType]
  );
  return result.insertId;
}


export async function listTickets(userId: number): Promise<TicketRow[]> {
  const [rows] = await pool.execute(
    "SELECT id, description, status FROM tickets WHERE user_id = ?",
    [userId]
  );
  return rows as TicketRow[];
}

export async function patchTicket(
  ticketId: number,
  userId: number,
  newStatus: TicketStatus,
  newDescription?: string
) {
  if (newDescription) {
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE tickets SET description = ?, status = ? WHERE id = ? AND user_id = ?",
      [newDescription, newStatus, ticketId, userId]
    );
    return result.affectedRows;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE tickets SET status = ? WHERE id = ? AND user_id = ?",
    [newStatus, ticketId, userId]
  );
  return result.affectedRows;
}
