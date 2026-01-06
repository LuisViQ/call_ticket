import pool from "../database/pool.js";

export type UserResponses = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
};

export async function findUserByEmail(email: string): Promise<UserResponses | null> {
  const sql = `
    SELECT id, name, email, password_hash, created_at
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [email]);
  const list = rows as UserResponses[];

  return list.length ? list[0] : null;
}
