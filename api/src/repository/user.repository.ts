import pool from "../database/pool.js";

export async function findUserByEmail(email: string) {
  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return (rows as any[])[0] ?? null;
}

export async function findUserById(id: number) {
  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return (rows as any[])[0] ?? null;
}
