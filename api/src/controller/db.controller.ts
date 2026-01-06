import { Request, Response } from "express";
import pool from "../database/pool.js";

export async function dbTestController(req: Request, res: Response) {
  try {
    const [rows] = await pool.query("SELECT 1 AS alive");
    const data = (rows as any[])[0] ?? { alive: 1 };
    return res.json({ data });
  } catch (error) {
    console.error("DB check failed", error);
    return res.status(500).json({ error: "Database unavailable" });
  }
}
