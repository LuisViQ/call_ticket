import pool from "../database/pool.js";

export type TicketTypeRow = {
  id: number;
  name: string;
};

export type AreaTypeRow = {
  id: number;
  name: string;
};

export async function listTicketTypes(): Promise<TicketTypeRow[]> {
  const [rows] = await pool.execute(
    "SELECT id, name FROM ticket_types ORDER BY name"
  );
  return rows as TicketTypeRow[];
}

export async function listAreaTypes(): Promise<AreaTypeRow[]> {
  const [rows] = await pool.execute(
    "SELECT id, name FROM ticket_area_types ORDER BY name"
  );
  return rows as AreaTypeRow[];
}
