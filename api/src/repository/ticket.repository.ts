import pool from "../database/pool.js";
import { ResultSetHeader } from "mysql2";
import path from "node:path";
export type TicketStatus = "AGUARDANDO" | "EM_ATENDIMENTO" | "CANCELADO" | "ENCERRADO";
type TicketRow = {
  id: number;
  description: string;
  status: TicketStatus;
};
// responsavel por criar o chamado de fato
export async function insertTicket(
  userId: number,
  description: string,
  status: TicketStatus,
  // aqui podendo ou não criar com uma imagem
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
    "SELECT id, description, status FROM tickets WHERE user_id = ?",
    [userId]
  );
  return rows as TicketRow[];
}
// responsavel por editar um chamado já existente, podendo mudar a descrição ou o status
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
